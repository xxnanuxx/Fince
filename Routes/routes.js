import express from "express";
import userRouter from "./userRoutes.js";
import categoryRouter from "./categoryRoutes.js";
import transactionRouter from "./transactionRoutes.js";
import portfolioRouter from "./portfolioRoutes.js";
import stockRouter from "./stockRoutes.js";
import objectiveRouter from "./objectiveRoutes.js";

const router = express.Router();

router.use("/api/users", userRouter);
router.use("/api/categories", categoryRouter);
router.use("/api/transactions", transactionRouter);
router.use("/api/instruments", stockRouter);
router.use("/api/portfolio", portfolioRouter);
router.use("/api/objectives", objectiveRouter);

export default router;
