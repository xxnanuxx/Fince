import { Router } from "express";
import userRouter from "./userRoutes.js"
import categoriaRouter from "./categoriaRoutes.js"
import transaccionRouter from "./transaccionRoutes.js"

const routes = Router()

routes.use("/users",userRouter)
routes.use("/categorias", categoriaRouter)
routes.use("/transacciones", transaccionRouter)

export default routes