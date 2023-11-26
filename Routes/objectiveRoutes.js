import express from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import CustomError from "../Utils/customError.js";
import ObjectiveController from "../Controllers/objectiveController.js";

const router = express.Router();

router.get("/:idUser", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.params.idUser;
    const result = await ObjectiveController.getObjectives(userId);
    res.status(result.status).json({ objetivos: result.objetivos });
  } catch (error) {
    console.error("Error in getObjectives {GET}: " + error.message);
    if (error instanceof CustomError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

router.post("/newObjective/:userId", AuthMiddleware, async (req, res) => {
  try {
    const newObjetive = {
      nombre: req.body.nombre,
      fecha: req.body.fecha,
      monto: req.body.monto,
      descripcion: req.body.descripcion,
    };

    const result = await ObjectiveController.createObjective(
      req.params.userId,
      newObjetive
    );
    res.status(result.status).json(result.message);
  } catch (error) {
    console.error("Error in createObjective {POST}: " + error.message);
    if (error instanceof CustomError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

router.put("/updateObjective/:userId", AuthMiddleware, async (req, res) => {
  try {
    const objectiveUpdated = {
      nombre: req.body.nombre,
      fecha: req.body.fecha,
      monto: req.body.monto,
      descripcion: req.body.descripcion,
    };

    const result = await ObjectiveController.updateObjective(
      req.params.userId,
      req.body.objetivoId,
      objectiveUpdated
    );

    res.status(result.status).json(result.message);
  } catch (error) {
    console.error("Error in updateObjective {GET}: " + error.message);
    if (error instanceof CustomError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

router.delete(
  "/deleteObjective/:userId/:objectiveId",
  AuthMiddleware,
  async (req, res) => {
    try {
      const result = await ObjectiveController.deleteObjectiveById(
        req.params.userId,
        req.params.objectiveId
      );

      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.log("Error in deleteObjectiveById {DELETE}: " + error.message);
      if (error instanceof CustomError) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  }
);

export default router;
