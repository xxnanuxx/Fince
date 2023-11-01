import portfolioData from "../Data/portfolioData.js";
import CustomError from "../Utils/customError.js";
import transactionController from "./transactionController.js";
import categoryController from "./categoryController.js";

async function buyAsset(userId, newAsset) {
  try {
    // ingreso 1 / egreso 0

    let resultCategory = null;
    let categoryId = null;

    try {
      if (newAsset.categoriaId !== "") {
        resultCategory = await categoryController.getCategoryById(
          userId,
          newAsset.categoriaId
        );
        categoryId = resultCategory.data;
      } else {
        const newCategory = {
          nombre: newAsset.simbolo,
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
        } else {
          throw new CustomError("Cannot create category to asset", 400);
        }
      }
    } catch {
      throw error;
    }

    if (validateAsset(newAsset)) {
      const transaction = {
        titulo: newAsset.nombre,
        categoriaId: newAsset.categoriaId,
        categoriaNombre: newAsset.tipo,
        montoConsumido: newAsset.valorDeCompra,
        fecha: newAsset.fechaDeCompra,
        tipo: 0,
        financiera: true,
      };

      const resultTransacction = await transactionController.createTransaction(
        userId,
        transaction
      );

      if (resultTransacction.success) {
        return await portfolioData.buyAsset(userId, newAsset);
      } else {
        await transactionController.deleteTransaction(
          userId,
          resultTransacction.data.transactionId
        );
        throw new CustomError(
          "The purchase of the asset cannot be carried out",
          400
        );
      }
    }
  } catch (error) {
    throw error;
  }
}

async function getPortfolio(userId) {
  try {
    const result = await portfolioData.getPortfolio(userId);
    if (result.data) {
      result.totalInvestments = calculateTotalInvestments(result.data);
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

function validateAsset(asset) {
  if (!asset.simbolo) {
    throw new CustomError(
      400,
      "El campo 'simbolo' es requerido y no puede estar vacío."
    );
  }

  if (!asset.nombre) {
    throw new CustomError(
      400,
      "El campo 'nombre' es requerido y no puede estar vacío."
    );
  }

  if (asset.tipo === "") {
    throw new CustomError(
      400,
      "El campo 'tipo' es requerido y no puede estar vacío."
    );
  }

  if (!asset.valorDeCompra) {
    throw new CustomError(
      400,
      "El campo 'valorDeCompra' es requerido y no puede estar nulo."
    );
  }

  if (!asset.fechaDeCompra) {
    throw new CustomError(
      400,
      "El campo 'fechaDeCompra' es requerido y no puede estar vacío."
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

export default {
  buyAsset,
  getPortfolio,
  getAssetById,
};
