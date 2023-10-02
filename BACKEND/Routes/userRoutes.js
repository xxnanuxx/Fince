import { Router } from "express";
import dataBase from '../ConectionDb/connectionDb.js'
import UserController from "../Controllers/userController.js";

const userController = new UserController(); 

const userRoutes = Router()

userRoutes.get("/", userController.getAllUsers)

userRoutes.post("/new-user", (req,res) => {
    const { nombre, apellido, correo, contrasena } = req.body;
    const newUser = {
        nombre : nombre,
        apellido : apellido,
        correo : correo,
        contrasena : contrasena
    };
    dataBase.ref('usuarios').push(newUser);
    res.send("Usuario creado con exito")
})

userRoutes.get("/delete-user", (req, res) => {
    dataBase.ref('usuarios/' + req.params.id).remove
})

export default userRoutes