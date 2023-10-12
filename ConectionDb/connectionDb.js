import admin from "firebase-admin"
import credencial from "../fince-ccc1c-firebase-adminsdk-oj0e5-c3a62b0cb0.json" assert { type: 'json' };

//admin.initializeApp({
//    credential: admin.credential.cert(credencial),
//    databaseURL: 'https://fince-ccc1c-default-rtdb.firebaseio.com/'
//})

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({
  credential: cert(credencial),
  databaseURL: "https://fince-ccc1c-default-rtdb.firebaseio.com"
});

const dataBase = getFirestore();

//const dataBase = admin.database()

export default dataBase