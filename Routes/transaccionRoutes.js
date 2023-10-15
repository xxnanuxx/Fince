import { Router } from "express";

import TransaccionController from "../Controllers/transaccionController.js";

const transaccionController = new TransaccionController(); 

const transaccionRouter = Router()

transaccionRouter.get("/:idUser", transaccionController.getAllTransaccion)
transaccionRouter.post("/new-transaccion/:id", transaccionController.createTransaccion)

export default transaccionRouter