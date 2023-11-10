import portfolioData from "../Data/portfolioData.js";
import CustomError from "../Utils/customError.js";
import transactionController from "./transactionController.js";
import categoryController from "./categoryController.js";
import stockController from "./stockController.js";

async function buyAsset(userId, newAsset) {
  try {
    // ingreso 1 / egreso 0
    let resultCategory = null;
    let categoryId = null;

    if (newAsset.categoriaId !== "") {
      resultCategory = await categoryController.getCategoryById(
        userId,
        newAsset.categoriaId
      );
      if (resultCategory.success) {
        categoryId = resultCategory.data.id;
      }
    }
    if (resultCategory === null && newAsset.tipo !== "") {
      resultCategory = await categoryController.getCategoryByName(
        userId,
        newAsset.tipo
      );
      if (resultCategory.success) {
        categoryId = resultCategory.data.id;
      }
    }
    if (resultCategory === null || !resultCategory.success) {
      const newCategory = {
        nombre: newAsset.tipo,
        descripcion: newAsset.nombre,
        montoMax: 0,
        tipo: 0,
        montoConsumido: newAsset.valorDeCompra,
        financiera: true,
      };
      resultCategory = await categoryController.createCategory(
        userId,
        newCategory
      );

      if (resultCategory.status == 201) {
        newAsset.categoriaId = resultCategory.data;
        categoryId = resultCategory.data;
      }
    }
    if (resultCategory === null || !resultCategory.success) {
      throw new CustomError("Cannot create category to asset", 400);
    }

    const transaction = {
      //new transaction
      titulo: newAsset.nombre,
      categoriaId: categoryId,
      categoriaNombre: newAsset.tipo,
      montoConsumido:
        parseFloat(newAsset.valorDeCompra) * parseFloat(newAsset.cantidad),
      fecha: newAsset.fechaDeCompra,
      tipo: 0,
      financiera: true,
    };

    const validateTransaction =
      transactionController.validateTransaction(transaction);

    let resultTransacction = null;

    //Existe el activo?
    let resultAsset = null;
    if (newAsset.activoId != "") {
      resultAsset = await portfolioData.getAssetById(userId, newAsset.activoId);
    }

    //Si existe actualizo el activo del portfolio y (categoria?) luego genero transaccion
    if (
      resultAsset != null &&
      resultAsset.success &&
      validateAsset(newAsset) &&
      validateTransaction
    ) {
      resultTransacction = await transactionController.createTransaction(
        userId,
        transaction
      );

      resultAsset.data.historialPrecios.push(newAsset.valorDeCompra);
      resultAsset.data.historialCantidades.push(newAsset.cantidad);
      let histPreciosActualizado = [];
      let histCantidadesActualizado = [];
      histPreciosActualizado = resultAsset.data.historialPrecios;
      histCantidadesActualizado = resultAsset.data.historialCantidades;

      //el valor de comrpra del activo es el precio ponderado

      const weightedPrice = calculateWeightedPrice(
        histPreciosActualizado,
        histCantidadesActualizado
      );
      const currentQuantity = calculateQuantity(histCantidadesActualizado);

      //actualizacion de categorias?????????????

      return await portfolioData.updateAsset(
        userId,
        newAsset.activoId,
        currentQuantity,
        weightedPrice,
        histCantidadesActualizado,
        histPreciosActualizado
      );

      //Si no existe genero el activo en portfolio y genero transanccion
    } else if (
      resultAsset == null &&
      validateAsset(newAsset) &&
      validateTransaction
    ) {
      //Al activo nuevo le agrego el historico de cantidades y precios para el precio ponderado
      newAsset = {
        ...newAsset,
        historialPrecios: [],
        historialCantidades: [],
      };

      newAsset.historialPrecios.push(newAsset.valorDeCompra);
      newAsset.historialCantidades.push(newAsset.cantidad);

      resultTransacction = await transactionController.createTransaction(
        userId,
        transaction
      );
      return await portfolioData.buyAsset(userId, newAsset);
    } else {
      throw new CustomError(
        "The purchase of the asset cannot be carried out",
        400
      );
    }
  } catch (error) {
    throw error;
  }
}

async function getPortfolio(userId) {
  try {
    let result = await portfolioData.getPortfolio(userId);
    if (result.data) {
      result.totalInvestments = calculateTotalInvestments(result.data);

      result = await addActualPriceAndVariation(result);
    } else {
      throw new CustomError("User has not made investments yet");
    }
    return result;
  } catch (error) {
    throw error;
  }
}

async function getAssetById(userId, assetId) {
  try {
    return await portfolioData.getAssetById(userId, assetId);
  } catch (error) {
    throw error;
  }
}

async function sellAsset(userId, assetId, quantity, salePrice) {
  try {
    let result = null;
    let resultAsset = await getAssetById(userId, assetId);

    if (
      resultAsset.status == 200 &&
      parseInt(quantity) < parseInt(resultAsset.data.cantidad)
    ) {
      resultAsset = updateHistoricalData(quantity, resultAsset);
      let histPreciosActualizado = [];
      let histCantidadesActualizado = [];
      histPreciosActualizado = resultAsset.data.historialPrecios;
      histCantidadesActualizado = resultAsset.data.historialCantidades;
      const weightedPrice = calculateWeightedPrice(
        histPreciosActualizado,
        histCantidadesActualizado
      );
      const currentQuantity = calculateQuantity(histCantidadesActualizado);

      result = await portfolioData.updateAsset(
        userId,
        assetId,
        currentQuantity,
        weightedPrice,
        histCantidadesActualizado,
        histPreciosActualizado
      );
    } else if (parseInt(quantity) == parseInt(resultAsset.data.cantidad)) {
      result = await portfolioData.deleteAssetById(userId, assetId);
    } else {
      throw new CustomError("The operation cannot be performed", 400);
    }

    if (result && result.status == 200) {
      const monto = parseFloat(salePrice) * parseFloat(quantity);
      const transaction = {
        titulo: resultAsset.data.nombre,
        categoriaId: resultAsset.data.categoriaId,
        categoriaNombre: resultAsset.data.tipo,
        montoConsumido: monto,
        fecha: getDate(),
        tipo: 1, // ingreso 1 / egreso 0
        financiera: true,
      };

      return await transactionController.createTransaction(userId, transaction);
    }
    throw new CustomError(
      "The transaction related to the sale of the assets could not be generated",
      400
    );
  } catch (error) {
    throw error;
  }
}

//Validate

function validateAsset(asset) {
  if (!asset.simbolo) {
    throw new CustomError(
      400,
      "The 'symbol' field is required and cannot be empty."
    );
  }

  if (!asset.nombre) {
    throw new CustomError(
      400,
      "The 'name' field is required and cannot be empty."
    );
  }

  if (asset.tipo === "") {
    throw new CustomError(
      400,
      "The 'type' field is required and cannot be empty."
    );
  }

  if (!asset.valorDeCompra) {
    throw new CustomError(
      400,
      "The 'purchase value' field is required and cannot be null."
    );
  }

  if (!asset.fechaDeCompra) {
    throw new CustomError(
      400,
      "The 'purchase date' field is required and cannot be empty."
    );
  }

  let quantity = parseInt(asset.cantidad);
  if (quantity <= 0 || asset.cantidad === "") {
    throw new CustomError(
      400,
      "The 'quantity' field cannot be less than zero or null."
    );
  }

  return true;
}

function calculateTotalInvestments(portfolio) {
  let total = 0;
  if (portfolio) {
    portfolio.forEach((asset) => {
      total += parseFloat(asset.valorDeCompra);
    });
  }
  return total;
}

async function addActualPriceAndVariation(result) {
  let actualStock;

  let stocks = result.data.map((asset) => ({
    simbolo: asset.simbolo,
    nombre: asset.nombre,
    cantidad: asset.cantidad,
    valorDeCompra: asset.valorDeCompra,
    fechaDeCompra: asset.fechaDeCompra,
    tipo: asset.tipo,
    categoriaId: asset.categoriaId,
    activoId: asset.activoId,
    valorActual: 0,
    variacion: 0,
  }));

  for (let i = 0; i < stocks.length; i++) {
    try {
      actualStock = await stockController.getSimbolData(stocks[i].simbolo);
      if (actualStock) {
        stocks[i].valorActual = parseFloat(actualStock.ultimoPrecio);
        stocks[i].variacion =
          ((parseFloat(actualStock.ultimoPrecio) -
            parseFloat(stocks[i].valorDeCompra)) *
            100) /
          parseFloat(stocks[i].valorDeCompra);
      }
    } catch (error) {}
  }

  result.data = stocks;

  return result;
}

function getDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  return `${day}/${month}/${year}`;
}

function calculateWeightedPrice(historialPrecios, historialCantidades) {
  let weightedPrice = 0;
  if (historialPrecios.length > 0 && historialCantidades.length > 0) {
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < historialPrecios.length; i++) {
      numerator +=
        parseFloat(historialPrecios[i]) * parseFloat(historialCantidades[i]);
      denominator += parseFloat(historialCantidades[i]);
    }
    weightedPrice = numerator / denominator;
  }
  return weightedPrice;
}

function calculateQuantity(historialCantidades) {
  let quantity = 0;

  for (let i = 0; i < historialCantidades.length; i++) {
    quantity += parseInt(historialCantidades[i]);
  }

  return quantity;
}

function updateHistoricalData(quantity, assetResult) {
  let hQ = assetResult.data.historialCantidades;
  let hP = assetResult.data.historialPrecios;
  let q = parseInt(quantity);
  let i = 0;

  while (i < hQ.length && q > 0) {
    if (parseInt(hQ[i]) > q && q > 0) {
      hQ[i] = hQ[i] - q;
      q = 0;
    } else if (parseInt(hQ[i]) === q && q > 0) {
      hQ[i] = 0;
      q = 0;
      hP[i] = 0;
    } else if (parseInt(hQ[i]) < q && q > 0) {
      q = q - hQ[i];
      hQ[i] = 0;
      hP[i] = 0;
    }
    i++;
  }

  // saco los nulos del array

  let newHP = [];
  let newHQ = [];
  for (let i = 0; i < hQ.length; i++) {
    if (hQ[i] > 0) {
      newHQ.push(hQ[i]);
      newHP.push(hP[i]);
    }
  }
  assetResult.data.historialCantidades = newHQ;
  assetResult.data.historialPrecios = newHP;

  return assetResult;
}

export default {
  buyAsset,
  getPortfolio,
  getAssetById,
  sellAsset,
};
