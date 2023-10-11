import { Router } from "express";
import CategoriaController from "../Controllers/categoriaController.js";

const categoriaController = new CategoriaController(); 

const categoriaRouter = Router()

categoriaRouter.get("/:idUser", categoriaController.getAllCategories)
categoriaRouter.post("/new-categorie/:id", categoriaController.createCategoria)

export default categoriaRouter