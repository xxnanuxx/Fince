import express from "express";
import routes from "./Routes/routes.js";
import cors from "cors";

const app = express()

app.set('port', 8080)

//middleware de aplicacion
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middlewares de rutas
app.use(routes);

async function main() {
    app.listen(8080);
    console.log("Server on port", 8080);
  }
  
main();
