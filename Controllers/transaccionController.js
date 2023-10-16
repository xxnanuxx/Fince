import dataBase from '../ConectionDb/connectionDb.js'

class TransaccionController {
    constructor(){}

    getAllTransaccion = (req,res) => {
        const  idUser = req.params.idUser;

        const usuarioRef = dataBase.collection('usuarios');

        usuarioRef
        .doc(idUser)
        .get()
        .then((userDoc) => {
              const userData = userDoc.data();
      
              const transacciones = userData.transacciones;
      
              if (transacciones) {
                res.send({ success: true, message: "Transacciones encontradas", transacciones });;
              } else {
                res.send({ message: 'No existen transacciones realizadas' });
              }
          })
    }
    createTransaccion = (req,res) =>{
        const  idUser = req.params.id;
        try{
            const {titulo, categoria, monto, fecha } = req.body;

            if (monto <= 0) {
                throw new Error("El monto debe ser mayor a 0");
            }
            
            const newTransaccion = {
                titulo : titulo,
                categoria : categoria,
                monto : monto,
                fecha : fecha
            };

            dataBase.collection('usuarios').doc(idUser).update({transacciones: newTransaccion})

            const usuarioRef = dataBase.collection('usuarios').doc(idUser)

            usuarioRef
            .get()
            .then((doc) => {
                const data = doc.data();
                const egresoActual = data.egreso;
                const nuevoEgreso = egresoActual - monto;
                usuarioRef.update({egreso : nuevoEgreso})
            })
            

            res.status(200).send("Transaccion creada con exito")
        } catch (error){
            res.status(404).send({ success: false, result: error.message });
        }
    }
}

export default TransaccionController