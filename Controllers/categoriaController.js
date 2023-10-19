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

        const usuarioRef = dataBase.collection('usuarios');

        console.log(idUser)

        usuarioRef
        .doc(idUser)
        .get()
        .then((userDoc) => {
              const userData = userDoc.data();
      
              const categorias = userData.categorias;
      
              if (categorias) {
                res.send({ success: true, message: "Categorias encontradas", categorias });;
              } else {
                res.status(404).send({success: false, message: 'No existen categorias creadas' });
              }
          })
    }
    createCategoria = async (req,res,next) => {
        const  idUser = req.params.id;
        try{
            const {nombre, descripcion, montoMax, tipo } = req.body;

            //ingreso = 1
            //egreso = 0

            if (montoMax <= 0 && !tipo) {
                throw new Error("El monto para una categoria Egreso debe ser mayor a 0");
            }
            
            const newCategorie = {
                nombre : nombre,
                descripcion : descripcion,
                montoMax : montoMax,
                tipo : tipo,
                montoConsumido : 0
            };

            const usuarioRef = dataBase.collection('usuarios').doc(idUser)
            
            await usuarioRef.update({categorias: FieldValue.arrayUnion(newCategorie)})

            res.status(200).send({success: true, message :"Categoria creada con exito"})
        } catch (error) {
            res.status(404).send({ success: false, result: error.message });
        }
    }

    editCategorie = async (req,res,next) => {
        try {
            const {idUser, idCat} = req.params;
            const {nombre, descripcion, montoMax } = req.body;

            const usuarioRef = dataBase.collection('usuarios').doc(idUser)

            const userSnapshot = await usuarioRef.get()

            const userData = userSnapshot.data()

            if (userData && userData.categorias && userData.categorias[idCat]) {
                userData.categorias[idCat].nombre = nombre;
                userData.categorias[idCat].descripcion = descripcion;
                userData.categorias[idCat].montoMax = montoMax;
        
                // Actualiza el documento del usuario
                await usuarioRef.update({ categorias: userData.categorias });
        
            } else {
                throw new Error("No se encontro la categoria")
            }
            res.status(200).send({success: true, message : "Categoria editada con exito"})
            
        } catch (error) {
            res.status(404).send({ success: false, result: error.message });
        }
    }

    deleteCategorie = async (req,res,next) => {
        try {
            const {idUser, idCat} = req.params;

            const usuarioRef = dataBase.collection('usuarios').doc(idUser)

            const userSnapshot = await usuarioRef.get()

            const categorias = userSnapshot.data().categorias

            if (idCat >= 0 && idCat < categorias.length) {
                categorias.splice(idCat, 1)

                await dataBase.collection('usuarios').doc(idUser).update({ categorias });

                res.status(200).send({success: true, message : "Categoria eliminada con exito"})
            } else {
                throw new Error("Indice invalido")
            }

        } catch (error) {
            res.status(404).send({ success: false, result: error.message });
        }
    }
}

export default categoriaController