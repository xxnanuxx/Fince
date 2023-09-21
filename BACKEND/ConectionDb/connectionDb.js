import admin from "firebase-admin"
import { applicationDefault } from "firebase-admin/app"

admin.initializeApp({
    credential:applicationDefault(),
    databaseURL: 'https://fince-ccc1c-default-rtdb.firebaseio.com/'
})

const dataBase = admin.database()

export default dataBase