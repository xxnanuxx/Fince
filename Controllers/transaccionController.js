import dataBase from '../ConectionDb/connectionDb.js'
import { FieldValue } from 'firebase-admin/firestore';
import CategoriaController from './categoriaController.js';
/**
 * @openapi
 * components:
 *   schemas:
 *     Transacciones:
 *       type: object
 *       properties:
 *         titulo:
 *           type: string
 *           example: Titulo de la transaccion
 *         categoria:
 *           type: string
 *           example: Categoria a la que hace referencia
 *         monto:
 *           type: string
 *           example: 999999,99
 *         fecha :
 *           type: string
 *           example: 01/01/1900
 */
class TransaccionController {
    constructor(){}

    getAllTransaccion = async (req, res) => {
        
        try {
            const idUser = req.params.idUser;
            const usuarioRef = dataBase.collection('usuarios').doc(idUser);

            const transaccionRef = usuarioRef.collection('transacciones')
            const categoriaRef = usuarioRef.collection('categorias')
            const querySnapshot = await transaccionRef.get()

            const transacciones = []

            querySnapshot.forEach((doc) => {
                transacciones.push({ id: doc.id, ...doc.data() });
            });

            if (transacciones.length > 0) {
                let montoEgresado = 0
                let montoIngresado = 0
                for (let index = 0; index < transacciones.length; index++) {
                    let categoriaTran = transacciones[index].categoria

                    let query = await categoriaRef.where('nombre', "==" , categoriaTran).get()

                    if (query.size === 1) {
                        let doc = query.docs[0]
                        let dato = {...doc.data()}

                        if (!dato.tipo) {
                            montoEgresado += transacciones[index].monto;
                        } else {
                            montoIngresado += transacciones[index].monto;
                        }
                    }
                    
                }

                const retorno = {transacciones : transacciones, saldoIngresado : montoIngresado, saldoEgresado : montoEgresado}

                res.status(200).send({ success: true, message: "Transacciones encontradas", retorno });
            } else {
              res.status(404).send({ message: "No existen transacciones realizadas" });
            }

        } catch (error) {
          res.status(404).send({ success: false, result: error.message });
        }
      };

    createTransaccion = async (req,res) =>{
        const  idUser = req.params.idUser;
        try{
            const {titulo, categoria, monto, fecha } = req.body;

            const montoConv = parseFloat(monto)

            const newTransaccion = {
                titulo : titulo,
                categoria : categoria,
                monto : montoConv,
                fecha : fecha
            };

            const usuarioRef = dataBase.collection('usuarios').doc(idUser)

            const transaccionRef = usuarioRef.collection('transacciones')
            
            const categoriaController = new CategoriaController(); 

            if (!categoriaController.aplicarConsumo(idUser, categoria, montoConv)) {
                throw new Error("No pudo aplicar monto a Categoria")
            }

            await transaccionRef.add(newTransaccion)

            res.status(200).send({success: true, message: "Transaccion creada con exito"})
        } catch (error){
            res.status(404).send({ success: false, result: error.message });
        }
    };
    deleteTransaccion = async (req,res,next) => {
        try {
            const {idUser, idTran} = req.params;

            const usuarioRef = dataBase.collection('usuarios').doc(idUser)

            const transaccionRef = usuarioRef.collection('transacciones').doc(idTran)
            const querySnapshot = await transaccionRef.get()
            const transaccionData = querySnapshot.data()

            const monto = -transaccionData.monto
            const categoria = transaccionData.categoria

            const categoriaController = new CategoriaController(); 

            if (!categoriaController.aplicarConsumo(idUser, categoria, monto)) {
                throw new Error("No pudo aplicar monto a Categoria")
            }
            
            await transaccionRef.delete()

            res.status(200).send({success: true, message: "Transaccion eliminada con exito"})

        } catch (error) {
            res.status(404).send({ success: false, result: error.message });
        }
    }
    //get transaccion ingreso mayor a 0
    //get transaccion egreso menor a 0
}

export default TransaccionController