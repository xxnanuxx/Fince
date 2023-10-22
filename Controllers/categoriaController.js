import dataBase from '../ConectionDb/connectionDb.js'
import { FieldValue } from 'firebase-admin/firestore';

/**
 * @openapi
 * components:
 *   schemas:
 *     Categorias:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: Nombre de categoria
 *         descripcion:
 *           type: string
 *           example: Descripcion de la categoria
 *         montoMax:
 *           type: string
 *           example: 999999,99
 */

class categoriaController {
    constructor(){}

    getAllCategories = async (req,res,next) => {
        const  idUser = req.params.idUser;
        try {
            const usuarioRef = dataBase.collection('usuarios').doc(idUser);
            const categoriaRef = usuarioRef.collection('categorias')

            const querySnapshot = await categoriaRef.get()

            const categorias = []

            querySnapshot.forEach((doc) => {
                categorias.push({ id: doc.id, ...doc.data() });
              });

            res.status(200).send({ success: true, message: "Categorias encontradas", categorias});;
        } catch(error){
            res.status(404).send({ success: false, message: "No se encontraron categorias"});;
        }
        
    }
    createCategoria = async (req,res,next) => {
        const  idUser = req.params.id;
        try{
            const { nombre, descripcion, montoMax, tipo } = req.body;

            //ingreso = 1
            //egreso = 0

            const tipoConv = parseInt(tipo)
            const montoMaxConv = parseFloat(montoMax)

            if (montoMaxConv <= 0 && !tipoConv) {
                throw new Error("El monto para una categoria Egreso debe ser mayor a 0");
            }

            if (montoMaxConv > 0 && tipoConv) {
                throw new Error("El monto para una categoria Ingreso debe ser 0");
            }
            
            const newCategorie = {
                nombre : nombre,
                descripcion : descripcion,
                montoMax : montoMaxConv,
                tipo : tipoConv,
                montoConsumido : 0
            };

            const usuarioRef = dataBase.collection('usuarios').doc(idUser)

            const categoriaRef = usuarioRef.collection('categorias')

            let query = await categoriaRef.where('nombre', "==" , newCategorie.nombre).get()
            
            if (query.size === 1) {
                let doc = query.docs[0]
                
                if (!doc.data().isEmpty) {
                    throw new Error("Esta categoria ya existe")
                }
            }
            
            await categoriaRef.add(newCategorie)

            res.status(200).send({success: true, message : "Categoria creada con exito"})
        } catch (error) {
            res.status(404).send({ success: false, result: error.message });
        }
    }

    editCategorie = async (req,res,next) => {
        try {
            const {idUser, idCat} = req.params;
            const {descripcion, montoMax, tipo} = req.body;

            const usuarioRef = dataBase.collection('usuarios').doc(idUser)
            const categoriaRef = usuarioRef.collection('categorias').doc(idCat)

            const categoriaData = await categoriaRef.get()

            const tipoConv = parseInt(tipo)
            const montoMaxConv = parseFloat(montoMax)

            if (montoMaxConv <= 0 && !tipoConv) {
                throw new Error("El monto para una categoria Egreso debe ser mayor a 0");
            }

            if (montoMaxConv > 0 && tipoConv) {
                throw new Error("El monto para una categoria Ingreso debe ser 0");
            }

            if (!categoriaData.exists) {
                throw new Error("No existe la categoria")
            }

            await categoriaRef.update({
                descripcion : descripcion,
                montoMax : montoMaxConv,
                tipo : tipoConv
            })

            res.status(200).send({success: true, message: "Categoria editada con exito"})
            
        } catch (error) {
            res.status(404).send({ success: false, result: error.message });
        }
    }

    deleteCategorie = async (req,res,next) => {
        try {
            const {idUser, idCat} = req.params;

            const usuarioRef = dataBase.collection('usuarios').doc(idUser)

            const categoriaRef = usuarioRef.collection('categorias').doc(idCat)

            categoriaRef.delete()

            res.status(200).send({success: true, message : "Categoria eliminada con exito"})

        } catch (error) {
            res.status(404).send({ success: false, result: error.message });
        }
    }

     async aplicarConsumo(idUser, nomCat, montoConsumido) {
        try {
            
            const usuarioRef = dataBase.collection('usuarios').doc(idUser)
            const query = await usuarioRef.collection('categorias').where("nombre", "==", nomCat).get()
            
            if (query.size === 1) {
                const doc = query.docs[0]
                const idCat = doc.id
                const categoriaRef = usuarioRef.collection('categorias').doc(idCat)
                const categoriaData = (await categoriaRef.get()).data()

                const montoAnt = categoriaData.montoConsumido
                const tipo = categoriaData.tipo

                if (!tipo){
                    await categoriaRef.update({
                        montoConsumido : montoConsumido + montoAnt
                    })
                }
            }

            return true
            
        } catch (error) {
            return false
        }
    }
}

export default categoriaController