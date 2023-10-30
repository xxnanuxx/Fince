import connectionIOL from "./connectionIOL.js";
import dotenv from "dotenv";
dotenv.config();

const tokenType = process.env.IOL_TOKEN_TYPE;
const url = process.env.IOL_URL_API;
connectionIOL.checkToken();

async function getAllCedears() {
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
      const data = await response.json();
      return data;
    }
  } catch {
    console.error("error al buscar cedears");
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

export default { getAllCedears };
