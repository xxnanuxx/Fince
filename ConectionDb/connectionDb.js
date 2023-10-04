import admin from "firebase-admin"
import credencial from "../fince-ccc1c-firebase-adminsdk-oj0e5-86d9067c99.json" assert { type: 'json' };

admin.initializeApp({
    credential: admin.credential.cert(credencial),
    databaseURL: 'https://fince-ccc1c-default-rtdb.firebaseio.com/'
})

const dataBase = admin.database()

export default dataBase