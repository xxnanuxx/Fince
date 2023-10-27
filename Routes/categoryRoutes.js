import express from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import CategoryController from "../Controllers/categoryController.js";

const router = express.Router();
/**
 * @openapi
 * /api/categories/{idUser}:
 *   get:
 *     summary: Get categories for a user
 *     description: Retrieve a list of categories for a specific user.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get("/:idUser", AuthMiddleware, async (req, res) => {
  try {
    const idUser = req.params.idUser;
    const result = await CategoryController.getCategories(idUser);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error in getCategories {GET}: " + error.message);
    res.status(error.status).json({ error: error.message });
  }
});
/**
 * @openapi
 * /api/categories/{userId}:
 *   post:
 *     summary: Create a category
 *     description: Create a new category for a user.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Category data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post("/:userId", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const category = req.body;
    const result = await CategoryController.createCategory(userId, category);
    res.status(result.status).json(result.status);
  } catch (error) {
    console.error("Error in createCategory {POST}: " + error.message);
    res.status(error.status).json({ error: error.message });
  }
});
/**
 * @openapi
 * /api/categories/update/{userId}/{categoryId}:
 *   put:
 *     summary: Update a category
 *     description: Update a category for a user.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Category data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Successful update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put("/update/:userId/:categoryId", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const categoryId = req.params.categoryId;
    const newValues = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      montoConsumido: req.body.montoConsumido,
      montoMax: req.body.montoMax,
      tipo: req.body.tipo,
    };
    const result = await CategoryController.updateCategory(
      userId,
      categoryId,
      newValues
    );

    res
      .status(result.status)
      .json({ message: result.message, category: result.category });
  } catch (error) {
    console.error("Error in UpdateCategory {PUT}: " + error.message);
    res.status(error.status).json({ error: error.message });
  }
});
/**
 * @openapi
 * /api/categories/delete/{userId}/{categoryId}:
 *   delete:
 *     summary: Delete a category
 *     description: Delete a category for a user.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Category deleted
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete(
  "/delete/:userId/:categoryId",
  AuthMiddleware,
  async (req, res) => {
    try {
      const result = await CategoryController.deleteCategory(
        req.params.userId,
        req.params.categoryId
      );
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Error in DeleteCategory {DELETE}: " + error.message);
      res.status(error.status).json({ error: error.message });
    }
  }
);

export default router;
