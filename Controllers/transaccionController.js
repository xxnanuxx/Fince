import dataBase from '../ConectionDb/connectionDb.js'
import { FieldValue } from 'firebase-admin/firestore';
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
        const idUser = req.params.idUser;
        const usuarioRef = dataBase.collection('usuarios').doc(idUser);
      
        try {
          const userDoc = await usuarioRef.get();
          const userData = userDoc.data();
          
          const transacciones = userData.transacciones
      
          if (transacciones.length > 0) {
            res.status(200).send({ success: true, message: "Transacciones encontradas", transacciones });
          } else {
            res.status(404).send({ message: 'No existen transacciones realizadas' });
          }

        } catch (error) {
          res.status(500).json({ success: false, result: error.message });
        }
      };

    createTransaccion = async (req,res) =>{
        const  idUser = req.params.idUser;
        try{
            const {titulo, categoria, monto, fecha } = req.body;

            if (monto <= 0) {
                throw new Error("El monto debe ser mayor a 0");
            }
            
            const montoConv = parseFloat(monto)

            const newTransaccion = {
                titulo : titulo,
                categoria : categoria,
                monto : montoConv,
                fecha : fecha
            };

            const usuarioRef = dataBase.collection('usuarios').doc(idUser)
            
            await usuarioRef.update({transacciones: FieldValue.arrayUnion(newTransaccion)})
            
            usuarioRef
            .get()
            .then((doc) => {
                const data = doc.data();
                const egresoActual = data.egreso;
                const nuevoEgreso = egresoActual - monto;
                usuarioRef.update({egreso : nuevoEgreso})
            })

            res.status(200).send({success: true, message: "Transaccion creada con exito"})
        } catch (error){
            res.status(404).send({ success: false, result: error.message });
        }
    };
    deleteTransaccion = async (req,res,next) => {
        try {
            const {idUser, idTran} = req.params;

            const usuarioRef = dataBase.collection('usuarios').doc(idUser)

            const userSnapshot = await usuarioRef.get()

            const transacciones = userSnapshot.data().transacciones
            
            if (idTran >= 0 && idTran < transacciones.length) {
                const monto = transacciones[idTran].monto
                
                usuarioRef
                .get()
                .then((doc) => {
                    const data = doc.data();
                    const egresoActual = data.egreso;
                    const nuevoEgreso = egresoActual + monto;
                    usuarioRef.update({egreso : nuevoEgreso})
                })

                transacciones.splice(idTran, 1)

                await dataBase.collection('usuarios').doc(idUser).update({ transacciones });

                res.status(200).send({success: true, message : "Transaccion eliminada con exito"})
            } else {
                throw new Error("Indice invalido")
            }

        } catch (error) {
            res.status(404).send({ success: false, result: error.message });
        }
    }
}

export default TransaccionController