import CustomError from "../Utils/customError.js";
import transactionData from "../Data/transactionData.js";
import categoryController from "./categoryController.js";

async function createTransaction(userId, transaction) {
  try {
    if (!transaction.financiera && validateTransaction(transaction)) {
      //entra si no es financiera y si es valida la transaccion

      if (transaction.tipo == 0) {
        // caso de transaccion de egreso

        const maxAmount = await categoryController.getMaxAmount(
          userId,
          transaction.categoriaId
        );

        const spentAmount = await categoryController.getSpentAmount(
          userId,
          transaction.categoriaId
        );
        //consumo que ingresa

        const amount = transaction.montoConsumido;

        //si el monto maximo de la Cat - el monto consumido > que el consumo que ingresa, actualizo el monto consumido
        if (
          maxAmount > 0 &&
          spentAmount >= 0 &&
          amount >= 0 &&
          maxAmount - spentAmount >= amount
        ) {
          await categoryController.applyAmount(
            userId,
            transaction.categoriaId,
            transaction.montoConsumido
          );
          return await transactionData.createTransaction(userId, transaction);
        } else {
          throw new CustomError(
            "Insufficient balance at common transaction",
            400
          );
        }
      } else if (validateTransaction(transaction)) {
        // caso ingreso: solo valido la transaccion

        await categoryController.applyAmount(
          userId,
          transaction.categoriaId,
          transaction.montoConsumido
        );
        return await transactionData.createTransaction(userId, transaction);
      } else {
        throw new CustomError("Invalid common transaction", 400);
      }

      //si es financiera validamos la trx y la creamos. VER
    } else if (validateTransaction(transaction)) {
      const transactionResult = await transactionData.createTransaction(
        userId,
        transaction
      );
      return transactionResult;
    } else {
      throw new CustomError("Invalid financial transacction", 400);
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

async function getDataGraph(userId) {
  try {
    const transactions = (await transactionData.getTransactions(userId))
      .transactions;

    const getYearMonth = (dateString) => {
      const [day, month, year] = dateString.split("/");
      return { year, month };
    };

    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const groupedTransactions = {};

    transactions.forEach((transaction) => {
      const { year, month } = getYearMonth(transaction.fecha);

      if (!groupedTransactions[year]) {
        groupedTransactions[year] = {};
      }

      if (!groupedTransactions[year][month]) {
        groupedTransactions[year][month] = { ingresos: 0, egresos: 0 };
      }

      if (transaction.tipo == 1) {
        groupedTransactions[year][month].ingresos += transaction.montoConsumido;
      } else {
        groupedTransactions[year][month].egresos += transaction.montoConsumido;
      }
    });

    const dataBarChart = [];

    Object.keys(groupedTransactions).forEach((year) => {
      Object.keys(groupedTransactions[year]).forEach((month) => {
        const { ingresos, egresos } = groupedTransactions[year][month];
        dataBarChart.push({
          year,
          month: monthNames[parseInt(month, 10) - 1],
          ingresos,
          egresos,
        });
      });
    });

    dataBarChart.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
    });

    const result = { success: true, status: 200, data: dataBarChart };

    return result;
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
  getDataGraph,
};
