import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();

let firebaseApp = null;
let firestore = null;

async function connection() {
  try {
    if (!firebaseApp) {
      const credencial = {
        type: process.env.SA_TYPE,
        project_id: process.env.SA_PROYECT_ID,
        private_key_id: process.env.SA_PRIVATE_KEY_ID,
        private_key: process.env.SA_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.SA_CLIENT_EMAIL,
        client_id: process.env.SA_CLIENT_ID,
        auth_uri: process.env.SA_AUTH_URI,
        token_uri: process.env.SA_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.SA_AUTH_PROVIDER_X500_CERT_URL,
        client_x509_cert_url: process.env.SA_CLIENT_X509_CERT_URL,
        universe_domain: process.env.SA_UNIVERSE_DOMAIN,
      };
      if (!firebaseApp) {
        firebaseApp = initializeApp({
          credential: cert(credencial),
          databaseURL: process.env.FB_DATABASEURL,
        });
      }
    }
    if (!firestore) {
      firestore = getFirestore(firebaseApp);
      firestore.settings({ ignoreUndefinedProperties: true });
    }
    return firestore;
  } catch (error) {
    console.error("Error connecting to Firebase: " + error.message);
    throw error;
  }
}
export default connection;
