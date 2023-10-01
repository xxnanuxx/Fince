import { Router } from "express";
import userRouter from "./userRoutes.js"

const routes = Router()

routes.use("/users",userRouter)

export default routes