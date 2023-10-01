import { Router } from "express";
import dataBase from '../ConectionDb/connectionDb.js'

const userRoutes = Router()

userRoutes.get("/", (req,res) => {
    dataBase.ref('usuarios').once("value", (snapshot) => {
        const data = snapshot.val()
        res.send({ success: true, message: "Usuarios encontrados", data });
    })
})

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

userRoutes.delete("/delete-user", (req, res) => {
    
})

export default userRoutes