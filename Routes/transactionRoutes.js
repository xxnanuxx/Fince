import express from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import transactionController from "../Controllers/transactionController.js";
import CustomError from "../Utils/customError.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
/**
 * @openapi
 * /api/transactions/createTransaction/{userId}:
 *   post:
 *     summary: Create a transaction
 *     description: Create a new transaction for a user.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Transaction data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post("/createTransaction/:userId", AuthMiddleware, async (req, res) => {
  try {
    const transaction = {
      titulo: req.body.titulo,
      categoriaId: req.body.categoriaId,
      categoriaNombre: req.body.categoriaNombre,
      montoConsumido: req.body.montoConsumido,
      fecha: req.body.fecha,
      tipo: req.body.tipo,
    };

    const result = await transactionController.createTransaction(
      req.params.userId,
      transaction
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log("Error in createTransaction {POST}: " + error.message);
    if (error instanceof CustomError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});
/**
 * @openapi
 * /api/transactions/getTransactions/{userId}:
 *   get:
 *     summary: Get user transactions
 *     description: Retrieve a list of transactions for a specific user.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 incomeAmount:
 *                   type: number
 *                 expenseAmount:
 *                   type: number
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get("/getTransactions/:userId", AuthMiddleware, async (req, res) => {
  try {
    const result = await transactionController.getTransactions(
      req.params.userId
    );
    res.status(result.status).json({
      transactions: result.transactions,
      incomeAmount: result.incomeAmount,
      expenseAmount: result.expenseAmount,
    });
  } catch (error) {
    console.log("Error in getTransactions {GET}: " + error.message);
    if (error instanceof CustomError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});
/**
 * @openapi
 * /api/transactions/deleteTransaction/{userId}/{transactionId}:
 *   delete:
 *     summary: Delete a transaction
 *     description: Delete a transaction for a user.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: transactionId
 *         required: true
 *         description: Transaction ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Transaction deleted
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete(
  "/deleteTransaction/:userId/:transactionId",
  AuthMiddleware,
  async (req, res) => {
    try {
      const transaction = {
        titulo: req.body.titulo,
        categoriaId: req.body.categoriaId,
        categoriaNombre: req.body.categoriaNombre,
        montoConsumido: req.body.montoConsumido,
        fecha: req.body.fecha,
        tipo: req.body.tipo,
        id: req.body.id,
      };
      const result = await transactionController.deleteTransaction(
        req.params.userId,
        transaction
      );
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.log("Error in deleteTransaction {DELETE}: " + error.message);
      if (error instanceof CustomError) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  }
);
/**
 * @openapi
 * /api/transactions/singleTransaction/{userId}/{transactionId}:
 *   get:
 *     summary: Get a single transaction
 *     description: Retrieve a single transaction by ID for a specific user.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: transactionId
 *         required: true
 *         description: Transaction ID
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
 *               $ref: '#/components/schemas/Transaction'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get(
  "/singleTransaction/:userId/:idTrasaction",
  AuthMiddleware,
  async (req, res) => {
    try {
      //coding
    } catch (error) {
      console.log("Error in getTransactionById {GET}: " + error.message);
      if (error instanceof CustomError) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  }
);
/**
 * @openapi
 * /api/transactions/updateTransaction/{userId}/{transactionId}:
 *   put:
 *     summary: Update a transaction
 *     description: Update a transaction for a user by ID.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: transactionId
 *         required: true
 *         description: Transaction ID
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Transaction data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Successful update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put(
  "/updateTransaction/:userId/:idTransaction",
  AuthMiddleware,
  async (req, res) => {
    try {
      //coding
    } catch (error) {
      console.log("Error in updateTransaction {PUT}: " + error.message);
      if (error instanceof CustomError) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  }
);

router.get("/getDataGraph/:userId", authMiddleware, async (req, res) => {
  try {
    const result = await transactionController.getDataGraph(req.params.userId);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.log("Error in getDataGraph {GET}: " + error.message);
    if (error instanceof CustomError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

export default router;
