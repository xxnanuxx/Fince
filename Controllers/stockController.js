import stocksData from "../Data/stockData.js";

async function getAllCedears() {
  return await stocksData.getAllCedears();
}

export default { getAllCedears };
