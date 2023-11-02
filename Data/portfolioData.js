import connection from "./connection.js";
//import CustomError from "../Utils/customError.js";

const collectionUsers = "usuarios";
const collectionPortfolio = "portfolio";

async function buyAsset(userId, newAsset) {
  try {
    const db = await connection();
    const userRef = await db.collection(collectionUsers).doc(userId);
    const categoryRef = await userRef.collection(collectionPortfolio);
    await categoryRef.add(newAsset);
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
      portfolio.push({ activoId: asset.id, ...asset.data() });
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
      const assetData = assetDoc.data();
      return { success: true, status: 200, data: assetData };
    } else {
      return { success: false, status: 404, message: "Activo no encontrado" };
    }
  } catch (error) {
    throw error;
  }
}

export default {
  buyAsset,
  getPortfolio,
  getAssetById,
};
