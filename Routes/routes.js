import { Router } from "express";
import userRouter from "./userRoutes.js"
import categoriaRouter from "./categoriaRoutes.js"

const routes = Router()

routes.use("/users",userRouter)
routes.use("/categorias", categoriaRouter)

export default routes