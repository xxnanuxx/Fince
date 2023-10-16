import { Router } from "express";

import TransaccionController from "../Controllers/transaccionController.js";

const transaccionController = new TransaccionController(); 

const transaccionRouter = Router()

/**
 * @openapi
 * /transacciones/{idUser}:
 *   get:
 *     tags:
 *       - Transacciones
 *     description: Obtener transacciones por Id de Usuario
 *     parameters:
 *       - in: path
 *         name: idUser
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
 *                   example: "Transacciones encontradas"
 *                 transacciones:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Transacciones"
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
transaccionRouter.get("/:idUser", transaccionController.getAllTransaccion)

/**
 * @openapi
 * /transacciones/new-transaccion/{idUser}:
 *   post:
 *     tags:
 *       - Transacciones
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Titulo de la transaccion
 *               categoria:
 *                 type: string
 *                 description: Categoria a la que hace referencia
 *               monto:
 *                 type: string
 *                 description: Monto de la transaccion
 *               fecha:
 *                 type: string
 *                 description: Fecha de transaccion
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
 *                   example: "Transaccion creada con exito"
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
transaccionRouter.post("/new-transaccion/:idUser", transaccionController.createTransaccion)

/**
 * @openapi
 * /delete-transaccion/{idUser}/{idTran}:
 *   delete:
 *     tags:
 *       - Transacciones
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *       - in: path
 *         name: idTran
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
 *                   example: "Transaccion eliminada con exito"
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
transaccionRouter.delete("/delete-transaccion/:idUser/:idTran", transaccionController.deleteTransaccion)

export default transaccionRouter