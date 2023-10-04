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
        const { nombre, apellido, correo, contrasena, perfil } = req.body;
        const newUser = {
            nombre : nombre,
            apellido : apellido,
            correo : correo,
            contrasena : contrasena,
            perfil : perfil
        };
        dataBase.ref('usuarios').push(newUser);
        res.send("Usuario creado con exito")
    }

    login = async (req, res, next) => {
        const { correo, contrasena } = req.body;
        console.log(correo)
        try {
            const snapshot = await dataBase.ref('usuarios')
                                      .orderByChild('correo')
                                      .equalTo(correo)
                                      .once('value')
        
            //if (!snapshot.exists()) {
            //    res.status(404).send({ success: false, result: "Correo no registrado" });
            //}

            //const usuarios = [];
//
            //snapshot.forEach((childSnapshot) => {
            //  usuarios.push({
            //    id: childSnapshot.key,
            //    ...childSnapshot.val()
            //  });
            //});

            console.log(usuarios)
        
          } catch (error) {
            res.status(400).send({ success: false, result: error.message });
          }
    }
      
    deleteUser = (req, res, next) => {
        console.log(req.params.id)
        dataBase.ref('usuarios/' + req.params.id).remove()
    }
}

export default userController