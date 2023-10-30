import connectionIOL from "./connectionIOL.js";
import dotenv from "dotenv";
dotenv.config();

const tokenType = process.env.IOL_TOKEN_TYPE;
const url = process.env.IOL_URL_API;
connectionIOL.checkToken();

//Devuelve todos los cedears disponibles
async function getCedears() {
  try {
    if (await connectionIOL.checkToken()) {
      const finalUrl =
        url +
        process.env.IOL_URL_ALL_INSTRUMENTS.replace(
          "{Instrumento}",
          "cedears"
        ).replace("{Pais}", "Argentina");
      const headers = {
        Authorization:
          process.env.IOL_TOKEN_TYPE + " " + process.env.IOL_ACCESS_TOKEN,
      };

      const response = await fetch(finalUrl, { headers });
      const data = filterData(await response.json());

      return data;
    }
  } catch {
    console.error("Error obtaining cedears");
  }
}

//Devuelve todos las acciones disponibles
async function getStocks() {
  try {
    if (await connectionIOL.checkToken()) {
      const finalUrl =
        url +
        process.env.IOL_URL_ALL_INSTRUMENTS.replace(
          "{Instrumento}",
          "acciones"
        ).replace("{Pais}", "Argentina");
      const headers = {
        Authorization:
          process.env.IOL_TOKEN_TYPE + " " + process.env.IOL_ACCESS_TOKEN,
      };

      const response = await fetch(finalUrl, { headers });
      const data = filterData(await response.json());

      return data;
    }
  } catch {
    console.error("Error obtaining stocks");
  }
}

//Devuelve todos los titulos publicos (bonos del estado) disponibles
async function getGovernmentBonds() {
  try {
    if (await connectionIOL.checkToken()) {
      const finalUrl =
        url +
        process.env.IOL_URL_ALL_INSTRUMENTS.replace(
          "{Instrumento}",
          "titulosPublicos"
        ).replace("{Pais}", "Argentina");
      const headers = {
        Authorization:
          process.env.IOL_TOKEN_TYPE + " " + process.env.IOL_ACCESS_TOKEN,
      };

      const response = await fetch(finalUrl, { headers });
      const data = filterData(await response.json());

      return data;
    }
  } catch {
    console.error("Error obtaining government bonds");
  }
}

//Devuelve todas las obligaciones negociables (bonos corporativos) disponibles
async function getCorporateBonds() {
  try {
    if (await connectionIOL.checkToken()) {
      const finalUrl =
        url +
        process.env.IOL_URL_ALL_INSTRUMENTS.replace(
          "{Instrumento}",
          "obligacionesNegociables"
        ).replace("{Pais}", "Argentina");
      const headers = {
        Authorization:
          process.env.IOL_TOKEN_TYPE + " " + process.env.IOL_ACCESS_TOKEN,
      };

      const response = await fetch(finalUrl, { headers });
      const data = filterData(await response.json());

      return data;
    }
  } catch {
    console.error("Error obtaining corporate bonds");
  }
}

//Devuelve todos los fondos comunes de inversion (FCI) disponibles
async function getInvestmentFund() {
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
        };
      });

      return filteredData;
    }
  } catch {
    console.error("Error obtaining investing funds");
  }
}

//filtra la info que tiene que pasar para cedears, bonos, fci, etc.
async function filterData(dataList) {
  let filteredData = dataList.titulos.map((titulo) => {
    return {
      simbolo: titulo.simbolo,
      ultimoPrecio: titulo.ultimoPrecio,
      variacionPorcentual: titulo.variacionPorcentual,
      descripcion: titulo.descripcion,
    };
  });
  return filteredData;
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
};
