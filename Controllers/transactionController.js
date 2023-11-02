import CustomError from "../Utils/customError.js";
import transactionData from "../Data/transactionData.js";
import categoryController from "./categoryController.js";

async function createTransaction(userId, transaction) {
  try {
    if (!transaction.financiera && validateTransaction(transaction)) {
      const maxAmount = await categoryController.getMaxAmount(
        userId,
        transaction.categoriaId
      );
      if (maxAmount) {
        const spentAmount = await categoryController.getSpentAmount(
          userId,
          transaction.categoriaId
        );
        const amount = transaction.montoConsumido;
        if (maxAmount - spentAmount >= amount || transaction.tipo) {
          if (!transaction.tipo) {
            await categoryController.applyAmount(
              userId,
              transaction.categoriaId,
              transaction.montoConsumido
            );
          }
          return await transactionData.createTransaction(userId, transaction);
        } else {
          throw new CustomError("Insufficient balance", 400);
        }
      }
    } else if (validateTransaction(transaction)) {
      const transactionResult = await transactionData.createTransaction(
        userId,
        transaction
      );
      return transactionResult;
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
      let categorySearch = categories.find(
        (cat) => cat.id === transaction.categoriaId
      );
      if (transaction.categoriaId == categorySearch.id) {
        tipo = categorySearch.tipo;
        if (tipo == 0) {
          expenseAmount += transaction.montoConsumido;
        } else {
          incomeAmount += transaction.montoConsumido;
        }
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

async function deleteTransaction(userId, transaction) {
  try {
    await categoryController.applyAmount(
      userId,
      transaction.categoriaId,
      parseFloat(-transaction.montoConsumido) //Mando saldo negativo para restar consumo a la categoria
    );
    return await transactionData.deleteTransaction(userId, transaction.id);
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

  if (transaction.tipo === null) {
    throw new CustomError("Invalid type", 400);
  }

  return true;
}

export default {
  createTransaction,
  getTransactions,
  deleteTransaction,
  validateTransaction,
};
