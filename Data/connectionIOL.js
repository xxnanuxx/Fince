import { response } from "express";
import dotenv from "dotenv";
dotenv.config();

let instance = null;

async function connectionIol() {
  const iolUrl = process.env.IOL_URL_TOKEN;
  let response;
  const headers = {
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({
    username: process.env.IOL_USERNAME,
    password: process.env.IOL_PASSWORD,
    grant_type: process.env.IOL_GRANT_TYPE_PASSWORD,
  });
  try {
    if (!instance) {
      response = await fetch(iolUrl, {
        method: "POST",
        headers,
        body,
      });
      instance = response.json();
    }

    console.log(process.env.IOL_ACCESS_TOKEN);

    return instance;
  } catch {
    console.error("Error obtaining token from IOL API: " + error.status);
  }
}

async function obtainTokenIol() {
  try {
    const res = await connectionIol();
    //console.log(res.access_token);
    process.env.IOL_ACCESS_TOKEN = res.access_token;
    process.env.IOL_REFRESH_TOKEN = res.refresh_token;
    process.env.IOL_EXPIRES_IN = res.expires_in;
    setInterval(
      () => refreshTokenIol(),
      parseInt(process.env.IOL_EXPIRES_IN) * 750
    );
    console.log(process.env.IOL_ACCESS_TOKEN);
    return res;
  } catch {
    console.error(error.status);
  }
}

async function obtainRefreshTokenIol() {
  const iolUrl = process.env.IOL_URL_TOKEN;
  let response;
  const headers = {
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({
    refresh_token: process.env.IOL_REFRESH_TOKEN,
    grant_type: process.env.IOL_GRANT_TYPE_REFRESH_TOKEN,
  });
  try {
    if (instance) {
      response = await fetch(iolUrl, {
        method: "POST",
        headers,
        body,
      });
      instance = response.json();
    }
    return instance;
  } catch {
    console.error("Error refreshing token from IOL API: " + error.status);
  }
}

async function refreshTokenIol() {
  try {
    console.log("se ejecuta el refresh");
    const res = await obtainRefreshTokenIol();
    process.env.IOL_ACCESS_TOKEN = res.access_token;
    process.env.IOL_REFRESH_TOKEN = res.refresh_token;
    process.env.IOL_EXPIRES_IN = res.expires_in;
    console.log(process.env.IOL_ACCESS_TOKEN);
  } catch {
    console.error("Error refreshing token from IOL API: " + error.message);
  }
}

async function checkToken() {
  if (!instance) {
    instance = obtainTokenIol();
  }
  return instance;
}

export default { checkToken };
