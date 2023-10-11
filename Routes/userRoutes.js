import { Router } from "express";
import UserController from "../Controllers/userController.js";

const userController = new UserController(); 

const userRoutes = Router()

userRoutes.get("/", userController.getAllUsers)
userRoutes.post("/new-user", userController.createUser)
userRoutes.post("/login", userController.login)
userRoutes.delete("/delete-user/:id", userController.deleteUser)

export default userRoutes