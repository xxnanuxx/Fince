import { parse } from "path";
import objectiveData from "../Data/objectiveData.js";
import transactionController from "./transactionController.js";
import CustomError from "../Utils/customError.js";

async function getObjectives(userId) {
  try {
    const resultObjectives = await objectiveData.getObjectives(userId);
    const resultTransactions = await transactionController.getTransactions(
      userId
    );

    if (
      resultObjectives.data.length > 0 &&
      resultTransactions.transactions.length > 0
    ) {
      const income = parseFloat(resultTransactions.incomeAmount);
      const expense = parseFloat(resultTransactions.expenseAmount);
      const resultObjectivesWithProgress = calculateProgress(
        income,
        expense,
        resultObjectives.data
      );

      const result = {
        status: 200,
        objetivos: resultObjectivesWithProgress,
      };

      console.log(result);

      return result;
    } else {
      throw new CustomError("User has not information", 400);
    }
  } catch (error) {
    throw error;
  }
}

async function createObjective(userId, objective) {
  try {
    return await objectiveData.createObjective(userId, objective);
  } catch (error) {
    throw error;
  }
}

async function updateObjective(userId, objectiveId, objectiveUpdated) {
  try {
    return await objectiveData.updateObjective(
      userId,
      objectiveId,
      objectiveUpdated
    );
  } catch (error) {
    throw error;
  }
}

async function deleteObjectiveById(userId, objectiveId) {
  try {
    return await objectiveData.deleteObjectiveById(userId, objectiveId);
  } catch (error) {
    throw error;
  }
}

function calculateProgress(income, expense, objectivesRef) {
  let amountObjectives = 0;
  let objectives = objectivesRef;
  const total = parseFloat(income - expense);

  objectives.forEach((obj) => {
    amountObjectives += parseFloat(obj.monto);
  });

  if (total > 0 && total >= amountObjectives) {
    objectives.forEach((obj) => {
      obj.progreso = 100;
    });
  } else if (total > 0) {
    objectives.forEach((obj) => {
      const monto = parseFloat(obj.monto);
      const valor = monto / amountObjectives;
      const resta = valor * (amountObjectives - total);
      const progreso = (monto - resta) / monto;
      obj.progreso = progreso;
    });
  } else {
    objectives.forEach((obj) => {
      obj.progreso = 0;
    });
  }
  return objectives;
}

export default {
  getObjectives,
  createObjective,
  updateObjective,
  deleteObjectiveById,
};
