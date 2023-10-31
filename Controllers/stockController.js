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

async function getInvestmentFundData(simbol) {
  return await stocksData.getInvestmentFundData(simbol);
}

async function getSimbolData(simbol) {
  return await stocksData.getSimbolData(simbol);
}

export default {
  getCedears,
  getStocks,
  getGovernmentBonds,
  getCorporateBonds,
  getInvestmentFund,
  getInvestmentFundData,
  getSimbolData,
};
