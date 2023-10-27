//import credencial from "../fince-ccc1c-firebase-adminsdk-oj0e5-c3a62b0cb0.json" assert { type: 'json' };
import dotenv from "dotenv";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config();

const credencial = {
  type: process.env.SA_TYPE,
  project_id: process.env.SA_PROYECT_ID,
  private_key_id: process.env.SA_PRIVATE_KEY_ID,
  private_key: process.env.SA_PRIVATE_KEY.replace(/\\n/g, "\n"), // Corrige los saltos de línea
  client_email: process.env.SA_CLIENT_EMAIL,
  client_id: process.env.SA_CLIENT_ID,
  auth_uri: process.env.SA_AUTH_URI,
  token_uri: process.env.SA_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.SA_AUTH_PROVIDER_X500_CERT_URL,
  client_x509_cert_url: process.env.SA_CLIENT_X509_CERT_URL,
  universe_domain: process.env.SA_UNIVERSE_DOMAIN,
};

initializeApp({
  credential: cert(credencial),
  databaseURL: "https://fince-ccc1c-default-rtdb.firebaseio.com"
});

const dataBase = getFirestore();

export default dataBase