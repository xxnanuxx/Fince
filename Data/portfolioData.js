import connection from "./connection.js";
//import CustomError from "../Utils/customError.js";

const collectionUsers = "usuarios";
const collectionPortfolio = "portfolio";

async function buyAsset(userId, newAsset) {
  try {
    const db = await connection();
    const userRef = await db.collection(collectionUsers).doc(userId);
    const portfolioRef = await userRef.collection(collectionPortfolio);
    await portfolioRef.add(newAsset);
    return {
      success: true,
      status: 201,
      message: `Asset/s ${newAsset.nombre} has been buyed`,
    };
  } catch (error) {
    throw error;
  }
}

async function getPortfolio(userId) {
  try {
    const db = await connection();
    const usuarioRef = db.collection(collectionUsers).doc(userId);
    const portfolioRef = usuarioRef.collection(collectionPortfolio);
    const querySnapshot = await portfolioRef.get();
    const portfolio = [];
    querySnapshot.forEach((asset) => {
      portfolio.push({ ...asset.data(), activoId: asset.id });
    });

    return { success: true, status: 200, data: portfolio, totalInvestments: 0 };
  } catch (error) {
    throw error;
  }
}

async function getAssetById(userId, assetId) {
  try {
    const db = await connection();
    const usuarioRef = db.collection(collectionUsers).doc(userId);
    const portfolioRef = usuarioRef.collection(collectionPortfolio);
    const assetDoc = await portfolioRef.doc(assetId).get();
    if (assetDoc.exists) {
      const assetData = await assetDoc.data();
      return { success: true, status: 200, data: assetData };
    } else {
      return { success: false, status: 404, message: "Activo no encontrado" };
    }
  } catch (error) {
    throw error;
  }
}

async function updateAsset(
  userId,
  assetId,
  quantity,
  purcheasePrice,
  histCantidadesActualizado,
  histPreciosActualizado
) {
  try {
    const db = await connection();
    const usuarioRef = db.collection(collectionUsers).doc(userId);
    const portfolioRef = usuarioRef.collection(collectionPortfolio);
    const assetRef = portfolioRef.doc(assetId);
    const assetDoc = await assetRef.get();
    if (!assetDoc.exists) {
      throw new Error("The asset does not exist.");
    }
    await assetRef.update({
      cantidad: quantity,
      valorDeCompra: purcheasePrice,
      historialPrecios: histPreciosActualizado,
      historialCantidades: histCantidadesActualizado,
    });
    return {
      success: true,
      status: 200,
      message: "Quantity updated successfully.",
    };
  } catch (error) {
    throw error;
  }
}

async function deleteAssetById(userId, assetId) {
  try {
    const db = await connection();
    const userRef = db.collection(collectionUsers).doc(userId);
    const portfolioRef = userRef.collection(collectionPortfolio);
    const assetRef = portfolioRef.doc(assetId);
    const assetDoc = await assetRef.get();
    if (!assetDoc.exists) {
      throw new Error("The asset does not exist.");
    }
    await assetRef.delete();
    return {
      success: true,
      status: 200,
      message: `The asset with assetId ${assetId} / userId: ${userId} has been deleted`,
    };
  } catch (error) {
    throw error;
  }
}

export default {
  buyAsset,
  getPortfolio,
  getAssetById,
  updateAsset,
  deleteAssetById,
};
