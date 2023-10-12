import dataBase from '../ConectionDb/connectionDb.js'

class userController {
    constructor(){}
    getAllUsers = async (req,res,next) => {
        try {
            const querySnapshot = await dataBase.collection("usuarios").get();
            const usuarios = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            res.status(200).send({success: true, usuarios})
        } catch (error) {
            res.status(404).send({ success: false, result: "Error al traer usuarios" });
        }
        
    }

    createUser = async (req,res,next) => {
        try{
            const { nombre, apellido, correo, contrasena, perfil } = req.body;
            const newUser = {
                nombre : nombre,
                apellido : apellido,
                correo : correo,
                contrasena : contrasena,
                perfil : perfil
            };

            await dataBase.collection('usuarios').add(newUser)

            res.status(200).send("Usuario creado con exito")
        } catch{
            res.status(404).send({ success: false, result: "Usuario no registrado" });
        }
        
    }

    login = async (req, res, next) => {
        try {
            const { correo, contrasena } = req.body;

            const usuariosCollection = dataBase.collection('usuarios');

            const query = usuariosCollection.where('correo', '==', correo);
            const querySnapshot = await query.get();
                
            if (querySnapshot.empty) {
              throw new Error("Correo no registrado");
            }
        
            let usuarioValido = false;
        
            querySnapshot.forEach((doc) => {
              const usuario = doc.data();
              if (usuario.contrasena === contrasena) {
                usuarioValido = true;
              }
            });
        
            if (!usuarioValido) {
              throw new Error("Contraseña incorrecta");
            }
            
            res.status(200).send({ success: true, message: "Inicio de sesión exitoso" });
        } catch (error) {
            res.status(404).send({ success: false, result: error.message });
        }
    }
      
    deleteUser = async (req, res, next) => {
        try {
            await dataBase.collection("usuarios").doc(req.params.id).delete();
            res.status(200).send({ success: true, message: "Usuario borrado" });
        } catch {
            res.status(400).send({ success: false, result: error.message });
        }
        
    }
}

export default userController