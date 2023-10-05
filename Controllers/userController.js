import dataBase from '../ConectionDb/connectionDb.js'

class userController {
    constructor(){}
    getAllUsers = (req,res,next) => {
        dataBase.ref('usuarios').once("value", (snapshot) => {
            const data = snapshot.val()
            res.send({ success: true, message: "Usuarios encontrados", data });
        })
    }

    createUser = (req,res,next) => {
        try{
            const { nombre, apellido, correo, contrasena, perfil } = req.body;
            const newUser = {
                nombre : nombre,
                apellido : apellido,
                correo : correo,
                contrasena : contrasena,
                perfil : perfil
            };
            dataBase.ref('usuarios').push(newUser);
            res.status(200).send("Usuario creado con exito")
        } catch{
            res.status(404).send({ success: false, result: "Usuario no registrado" });
        }
        
    }

    login = async (req, res, next) => {

        try {
            const { correo, contrasena } = req.body;
            
            const snapshot = await dataBase.ref('usuarios')
                                      .orderByChild('correo')
                                      .equalTo(correo)
                                      .once("value")
            
            if (!snapshot.exists()) {
                throw new Error("Correo no registrado");
            }

            let usuarioValido = false;

            snapshot.forEach((childSnapshot) => {
              const usuario = childSnapshot.val();
              if (usuario.contrasena === contrasena) {
                usuarioValido = true;
              }
            });

            if (!usuarioValido) {
                throw new Error("Contraseña incorrecta");
            }
            
            res.status(200).send({ success: true, message: "Inicio de sesión exitoso" });
            
        } catch{
            console.error("Error al validar usuario:", message.error);
            res.status(404).send({ success: false, result: error.message });
        }
    }
      
    deleteUser = (req, res, next) => {
        try {
            dataBase.ref('usuarios/' + req.params.id).remove()
            res.status(200).send({ success: true, message: "Usuario borrado" });
        } catch {
            res.status(400).send({ success: false, result: error.message });
        }
        
    }
}

export default userController