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
        const { nombre, apellido, correo, contrasena } = req.body;
        const newUser = {
            nombre : nombre,
            apellido : apellido,
            correo : correo,
            contrasena : contrasena
        };
        dataBase.ref('usuarios').push(newUser);
        res.send("Usuario creado con exito")
    }
    deleteUser = (req, res, next) => {
        console.log(req.params.id)
        dataBase.ref('usuarios/' + req.params.id).remove()
    }
}

export default userController