import stocksData from "../Data/stockData.js";

async function getCedears() {
  return await stocksData.getCedears();
}

async function getStocks() {
  return await stocksData.getStocks();
}

async function getGovernmentBonds() {
  return await stocksData.getGovernmentBonds();
}

async function getCorporateBonds() {
  return await stocksData.getCorporateBonds();
}

async function getInvestmentFund() {
  return await stocksData.getInvestmentFund();
}

export default {
  getCedears,
  getStocks,
  getGovernmentBonds,
  getCorporateBonds,
  getInvestmentFund,
};
