import CustomError from "../Utils/customError.js";
import transactionData from "../Data/transactionData.js";
import categoryController from "./categoryController.js";
import * as tf from "@tensorflow/tfjs-node";

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

      if (transaction.tipo == 0) {
        expenseAmount += transaction.montoConsumido;
      } else {
        incomeAmount += parseInt(transaction.montoConsumido);
      }
      //}
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

async function getPrediction(userId) {
  try {
    const meses = [
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

    // Obtener datos históricos
    const response = await getDataGraph(userId);
    const datos = response.data;

    // Extraer ingresos y egresos de los datos históricos
    const ingresos = datos.map((item) => parseFloat(item.ingresos));
    const egresos = datos.map((item) => parseFloat(item.egresos));

    // Calcula rango
    const rangeIngresos = tf
      .tensor1d(ingresos)
      .max()
      .sub(tf.tensor1d(ingresos).min());
    const rangeEgresos = tf
      .tensor1d(egresos)
      .max()
      .sub(tf.tensor1d(egresos).min());

    //calculo las medias
    const meanIngresos = tf.tensor1d(ingresos).mean();
    const meanEgresos = tf.tensor1d(egresos).mean();

    const ingresosNormalizados = tf
      .tensor1d(ingresos)
      .sub(meanIngresos)
      .div(rangeIngresos);
    const egresosNormalizados = tf
      .tensor1d(egresos)
      .sub(meanEgresos)
      .div(rangeEgresos);

    // Crear y compilar modelos
    const modelIngresos = tf.sequential();
    modelIngresos.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    modelIngresos.compile({ optimizer: "sgd", loss: "meanSquaredError" });

    const modelEgresos = tf.sequential();
    modelEgresos.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    modelEgresos.compile({ optimizer: "sgd", loss: "meanSquaredError" });

    // Entrenar modelos
    await entrenarModelo(
      modelIngresos,
      ingresosNormalizados,
      ingresosNormalizados
    );
    await entrenarModelo(
      modelEgresos,
      egresosNormalizados,
      egresosNormalizados
    );

    // Hacer predicciones para el mes siguiente
    const ultimaFecha = datos[datos.length - 1];
    const nuevosIngresosNormalizados = tf.tensor2d([[0]]); // Ingresos no proporcionados, asumimos 0
    const nuevosEgresosNormalizados = tf.tensor2d([[0]]); // Egresos no proporcionados, asumimos 0

    const predicDesnormIngresos = hacerPrediccion(
      modelIngresos,
      nuevosIngresosNormalizados,
      rangeIngresos,
      meanIngresos
    );
    const predicDesnormEgresos = hacerPrediccion(
      modelEgresos,
      nuevosEgresosNormalizados,
      rangeEgresos,
      meanEgresos
    );

    const indiceActual = meses.indexOf(ultimaFecha.month);
    const mesSiguiente = obtenerMesSiguiente(meses[indiceActual]);
    const mesPosterior = obtenerMesSiguiente(mesSiguiente);

    const data = [...datos];

    let anio =
      mesSiguiente === "Enero"
        ? (parseInt(ultimaFecha.year) + 1).toString()
        : ultimaFecha.year;

    data.push({
      year: anio,
      month: mesSiguiente,
      ingresos: predicDesnormIngresos[0][0],
      egresos: predicDesnormEgresos[0][0],
    });

    const nuevosIngresos = data.map((item) => parseFloat(item.ingresos));
    const nuevosEgresos = data.map((item) => parseFloat(item.egresos));

    const nuevosRangeIngresos = tf
      .tensor1d(nuevosIngresos)
      .max()
      .sub(tf.tensor1d(nuevosIngresos).min());
    const nuevoRangeEgresos = tf
      .tensor1d(nuevosEgresos)
      .max()
      .sub(tf.tensor1d(nuevosEgresos).min());
    const nuevoMeanIngresos = tf.tensor1d(nuevosIngresos).mean();
    const nuevoMeanEgresos = tf.tensor1d(nuevosEgresos).mean();

    const nuevosIngresosNormalizadosMesPosterior = tf
      .tensor1d(nuevosIngresos)
      .sub(nuevoMeanIngresos)
      .div(nuevosRangeIngresos);
    const nuevosEgresosNormalizadosMesPosterior = tf
      .tensor1d(nuevosEgresos)
      .sub(nuevoMeanEgresos)
      .div(nuevoRangeEgresos);

    const modelNuevosIngresos = tf.sequential();
    modelNuevosIngresos.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    modelNuevosIngresos.compile({ optimizer: "sgd", loss: "meanSquaredError" });

    const modelNuevosEgresos = tf.sequential();
    modelNuevosEgresos.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    modelNuevosEgresos.compile({ optimizer: "sgd", loss: "meanSquaredError" });

    await entrenarModelo(
      modelNuevosIngresos,
      nuevosIngresosNormalizadosMesPosterior,
      nuevosIngresosNormalizadosMesPosterior
    );

    await entrenarModelo(
      modelNuevosEgresos,
      nuevosEgresosNormalizadosMesPosterior,
      nuevosEgresosNormalizadosMesPosterior
    );

    const prediccionesDesnormalizadasNuevosIngresosMesPosterior =
      hacerPrediccion(
        modelNuevosIngresos,
        nuevosIngresosNormalizadosMesPosterior,
        nuevosRangeIngresos,
        nuevoMeanIngresos
      );

    const prediccionesDesnormalizadasNuevosEgresosMesPosterior =
      hacerPrediccion(
        modelNuevosEgresos,
        nuevosEgresosNormalizadosMesPosterior,
        nuevoRangeEgresos,
        nuevoMeanEgresos
      );

    anio =
      mesPosterior == "Enero" || mesPosterior == "Febrero"
        ? (parseInt(ultimaFecha.year) + 1).toString()
        : ultimaFecha.year;

    data.push({
      year: anio,
      month: mesPosterior,
      ingresos: prediccionesDesnormalizadasNuevosIngresosMesPosterior[0][0],
      egresos: prediccionesDesnormalizadasNuevosEgresosMesPosterior[0][0],
    });

    return { status: 200, data: data };
  } catch (error) {
    throw error;
  }
}

// Función para entrenar un modelo
async function entrenarModelo(model, X, y) {
  await model.fit(X, y, { epochs: 100 });
}

// Función para hacer predicciones y desnormalizar
function hacerPrediccion(model, nuevosDatosNormalizados, range, mean) {
  const prediccionesNormalizadas = model.predict(nuevosDatosNormalizados);
  return prediccionesNormalizadas.mul(range).add(mean).arraySync();
}

// Función para obtener el mes siguiente
function obtenerMesSiguiente(mesActual) {
  const meses = [
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

  const indiceActual = meses.indexOf(mesActual);

  // Verificar si el mes actual está en el rango válido
  if (indiceActual !== -1) {
    // Manejar el caso especial de diciembre
    if (indiceActual === 11) {
      return meses[0]; // El siguiente mes después de diciembre es enero
    } else {
      return meses[indiceActual + 1];
    }
  } else {
    throw new Error("Mes no válido");
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
  getPrediction,
};
