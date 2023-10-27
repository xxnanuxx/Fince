import CustomError from "../Utils/customError.js";
import transactionData from "../Data/transactionData.js";
import categoryController from "./categoryController.js";

async function createTransaction(userId, transaction) {
  try {
    if (validateTransaction(transaction)) {
      const maxAmount = await categoryController.getMaxAmount(
        userId,
        transaction.categoriaId
      );
      const spentAmount = await categoryController.getSpentAmount(
        userId,
        transaction.categoriaId
      );
      const amount = transaction.montoConsumido;
      if (maxAmount - spentAmount > amount) {
        await categoryController.applyAmount(
          userId,
          transaction.categoriaId,
          transaction.montoConsumido
        );

        return await transactionData.createTransaction(userId, transaction);
      } else {
        throw new CustomError("Insufficient balance", 400);
      }
    }
  } catch (error) {
    throw error;
  }
}

async function getTransactions(userId) {
  try {
    const resultTransactions = await transactionData.getTransactions(userId);
    const transactions = resultTransactions.transactions;
    const resultCategories = await categoryController.getCategories(userId);
    const categories = resultCategories.data;

    let incomeAmount = 0;
    let expenseAmount = 0;

    transactions.forEach((transaction) => {
      let tipo = null;
      let i = 0;
      while (i < categories.length && !tipo) {
        if (transaction.categoriaId == categories[i].id) {
          tipo = categories[i].tipo;
          if (tipo == 0) {
            console.log("expense");
            expenseAmount += transactions[i].montoConsumido;
          } else {
            console.log("income");
            incomeAmount += transactions[i].montoConsumido;
          }
        }
        i++;
      }
    });
    return {
      ...resultTransactions,
      incomeAmount: incomeAmount,
      expenseAmount: expenseAmount,
    };
  } catch (error) {
    throw error;
  }
}

async function deleteTransaction(userId, transactionId) {
  try {
    return await transactionData.deleteTransaction(userId, transactionId);
  } catch (error) {
    throw error;
  }
}

//Validations

function validateTransaction(transaction) {
  if (!transaction.titulo || transaction.titulo.trim() === "") {
    throw new CustomError("Invalid new transaction title", 400);
  }
  if (!transaction.categoriaId || transaction.categoriaId.trim() === "") {
    throw new CustomError("Invalid category Id in new transaction", 400);
  }
  if (!transaction.categoriaNombre) {
    throw new CustomError("Invalid category name in new transaction", 400);
  }
  if (!transaction.montoConsumido) {
    throw new CustomError("Invalid amount in new transaction", 400);
  }
  transaction.montoConsumido = parseFloat(transaction.montoConsumido);

  if (!transaction.fecha) {
    throw new CustomError("Invalid date in new transaction", 400);
  }
  if (!transaction.fecha) {
    throw new CustomError("Invalid date", 400);
  }

  return true;
}

export default {
  createTransaction,
  getTransactions,
  deleteTransaction,
};
