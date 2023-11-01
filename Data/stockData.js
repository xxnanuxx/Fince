import connectionIOL from "./connectionIOL.js";
import dotenv from "dotenv";
dotenv.config();

const tokenType = process.env.IOL_TOKEN_TYPE;
const url = process.env.IOL_URL_API;
connectionIOL.checkToken();

async function getAllInstruments() {
  try {
    let allInstruments = await getCedears();
    allInstruments = allInstruments.concat(await getStocks());
    allInstruments = allInstruments.concat(await getCorporateBonds());
    allInstruments = allInstruments.concat(await getGovernmentBonds());
    allInstruments = allInstruments.concat(await getInvestmentFund());
    return allInstruments;
  } catch {
    console.error("Error obtaining everything");
  }
}

//Devuelve todos los cedears disponibles
async function getCedears() {
  const instrumentType = "cedears";
  try {
    if (await connectionIOL.checkToken()) {
      const finalUrl =
        url +
        process.env.IOL_URL_ALL_INSTRUMENTS.replace(
          "{Instrumento}",
          instrumentType
        ).replace("{Pais}", "Argentina");
      const headers = {
        Authorization:
          process.env.IOL_TOKEN_TYPE + " " + process.env.IOL_ACCESS_TOKEN,
      };

      const response = await fetch(finalUrl, { headers });
      const data = filterData(await response.json(), instrumentType);

      return data;
    }
  } catch {
    console.error("Error obtaining cedears");
  }
}

//Devuelve todos las acciones disponibles
async function getStocks() {
  const instrumentType = "acciones";
  try {
    if (await connectionIOL.checkToken()) {
      const finalUrl =
        url +
        process.env.IOL_URL_ALL_INSTRUMENTS.replace(
          "{Instrumento}",
          instrumentType
        ).replace("{Pais}", "Argentina");
      const headers = {
        Authorization:
          process.env.IOL_TOKEN_TYPE + " " + process.env.IOL_ACCESS_TOKEN,
      };

      const response = await fetch(finalUrl, { headers });
      const data = filterData(await response.json(), instrumentType);

      return data;
    }
  } catch {
    console.error("Error obtaining stocks");
  }
}

//Devuelve todos los titulos publicos (bonos del estado) disponibles
async function getGovernmentBonds() {
  const instrumentType = "titulosPublicos";
  try {
    if (await connectionIOL.checkToken()) {
      const finalUrl =
        url +
        process.env.IOL_URL_ALL_INSTRUMENTS.replace(
          "{Instrumento}",
          instrumentType
        ).replace("{Pais}", "Argentina");
      const headers = {
        Authorization:
          process.env.IOL_TOKEN_TYPE + " " + process.env.IOL_ACCESS_TOKEN,
      };

      const response = await fetch(finalUrl, { headers });
      const data = filterData(await response.json(), instrumentType);

      return data;
    }
  } catch {
    console.error("Error obtaining government bonds");
  }
}

//Devuelve todas las obligaciones negociables (bonos corporativos) disponibles
async function getCorporateBonds() {
  const instrumentType = "obligacionesNegociables";
  try {
    if (await connectionIOL.checkToken()) {
      const finalUrl =
        url +
        process.env.IOL_URL_ALL_INSTRUMENTS.replace(
          "{Instrumento}",
          instrumentType
        ).replace("{Pais}", "Argentina");
      const headers = {
        Authorization:
          process.env.IOL_TOKEN_TYPE + " " + process.env.IOL_ACCESS_TOKEN,
      };

      const response = await fetch(finalUrl, { headers });
      const data = filterData(await response.json(), instrumentType);

      return data;
    }
  } catch {
    console.error("Error obtaining corporate bonds");
  }
}

//Devuelve todos los fondos comunes de inversion (FCI) disponibles
async function getInvestmentFund() {
  const instrumentType = "FCI";
  try {
    if (await connectionIOL.checkToken()) {
      const finalUrl = url + process.env.IOL_URL_IF;
      const headers = {
        Authorization:
          process.env.IOL_TOKEN_TYPE + " " + process.env.IOL_ACCESS_TOKEN,
      };

      const response = await fetch(finalUrl, { headers });
      const data = await response.json();

      //filtra los datos
      const filteredData = data.map((fci) => {
        return {
          simbolo: fci.simbolo,
          ultimoPrecio: fci.ultimoOperado,
          variacionPorcentual: fci.variacion,
          descripcion: fci.descripcion,
          tipo_instrumento: instrumentType,
        };
      });

      return filteredData;
    }
  } catch {
    console.error("Error obtaining investing funds");
  }
}

//filtra la info que tiene que pasar para cedears, bonos, fci, etc.
async function filterData(dataList, instrumentType) {
  let filteredData = dataList.titulos.map((titulo) => {
    return {
      simbolo: titulo.simbolo,
      ultimoPrecio: titulo.ultimoPrecio,
      variacionPorcentual: titulo.variacionPorcentual,
      descripcion: titulo.descripcion,
      tipo_instrumento: instrumentType,
    };
  });
  return filteredData;
}

//Se le pasa el simbolo identificatorio del FCI y devuelve toda la info del simbolo
async function getInvestmentFundData(simbol) {
  try {
    const finalUrl =
      url +
      process.env.IOL_URL_IF_SIMBOL.replace("{simbolo}", simbol.toString());
    const headers = {
      Authorization:
        process.env.IOL_TOKEN_TYPE + " " + process.env.IOL_ACCESS_TOKEN,
    };

    const response = await fetch(finalUrl, { headers });
    const data = await response.json();

    return data;
  } catch {
    console.error("Error obtaining investing funds " + simbol + " information");
  }
}

async function getSimbolData(simbol) {
  try {
    const finalUrl =
      url + process.env.IOL_URL_SIMBOL.replace("{simbolo}", simbol.toString());
    const headers = {
      Authorization:
        process.env.IOL_TOKEN_TYPE + " " + process.env.IOL_ACCESS_TOKEN,
    };

    const response = await fetch(finalUrl, { headers });
    const data = await response.json();

    return data;
  } catch {
    console.error("Error obtaining investing funds " + simbol + " information");
  }
}

//funcion de prueba para refrescar el token de iol
/* async function refreshTokenTest() {
  try {
    const res = await connectionIOL.refreshTokenIol();
    return res;
  } catch {
    console.error("error refresh el token");
  }
} */

//funcion de prueba para obtener el access token de la api de iol
/* async function getStocks() {
  try {
    const res = await connectionIOL.obtainTokenIol();
    return res;
  } catch {
    console.error("error al obtener el token");
  }
} */

export default {
  getCedears,
  getStocks,
  getGovernmentBonds,
  getCorporateBonds,
  getInvestmentFund,
  getInvestmentFundData,
  getSimbolData,
  getAllInstruments,
};
