import { Router } from "express";
import CategoriaController from "../Controllers/categoriaController.js";

const categoriaController = new CategoriaController(); 

const categoriaRouter = Router()

/**
 * @openapi
 * /categorias/{id}:
 *   get:
 *     tags:
 *       - Categorias
 *     description: Obtener categorias por Id de Usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: TRUE
 *                 message:
 *                   type: string
 *                   example: "Categorias encontradas"
 *                 categorias:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Categorias"
 *       404:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: FALSE
 *                 result:
 *                   type: string
 *                   example: "Error message example"
 */
categoriaRouter.get("/:idUser", categoriaController.getAllCategories)

/**
 * @openapi
 * /categorias/new-categorie/{id}:
 *   post:
 *     tags:
 *       - Categorias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la Categoria
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la Categoria
 *               montoMax:
 *                 type: string
 *                 description: Tope maximo a gastar en Categoria
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: TRUE
 *                 message:
 *                   type: string
 *                   example: "Categoria creada con exito"
 *       404:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: FALSE
 *                 result:
 *                   type: string
 *                   example: "Error message example"
 */
categoriaRouter.post("/new-categorie/:id", categoriaController.createCategoria)

/**
 * @openapi
 * /categorias/edit-categorie/{idUser}/{idCat}:
 *   put:
 *     tags:
 *       - Categorias
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *       - in: path
 *         name: idCat
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la Categoria
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la Categoria
 *               montoMax:
 *                 type: string
 *                 description: Tope maximo a gastar en Categoria
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: TRUE
 *                 message:
 *                   type: string
 *                   example: "Categoria editada con exito"
 *       404:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: FALSE
 *                 result:
 *                   type: string
 *                   example: "Error message example"
 */
categoriaRouter.put("/edit-categorie/:idUser/:idCat", categoriaController.editCategorie)

/**
 * @openapi
 * /categorias/edit-categorie/{idUser}/{idCat}:
 *   delete:
 *     tags:
 *       - Categorias
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *       - in: path
 *         name: idCat
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: TRUE
 *                 message:
 *                   type: string
 *                   example: "Categoria eliminada con exito"
 *       404:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: FALSE
 *                 result:
 *                   type: string
 *                   example: "Error message example"
 */
categoriaRouter.delete("/delete-categorie/:idUser/:idCat", categoriaController.deleteCategorie)

export default categoriaRouter