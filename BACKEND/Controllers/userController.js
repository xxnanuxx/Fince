import dataBase from '../ConectionDb/connectionDb.js'

class userController {
    constructor(){}
    getAllUsers = (req,res,next) => {
        dataBase.ref('usuarios').once("value", (snapshot) => {
            const data = snapshot.val()
            res.send({ success: true, message: "Usuarios encontrados", data });
        })
    }
}

export default userController