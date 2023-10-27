import express from "express";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
import routes from "./Routes/routes.js";
import dotenv from "dotenv";
dotenv.config();

//Metadata info about our API
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Fince API",
			version: "1.0.0",
			description: "API para aplicacion FINCE",
		},
		servers: [
			{
				url: "http://localhost:8080",
			},
		],
	},
	apis: ["./Routes/*.js", "./Controllers/*.js"]
};

//Docs en JSON Format
const swaggerSpect = swaggerJSDoc(options)

const app = express()

app.set('port', process.env.PORT)

// Function to setup our docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpect))

console.log("Version 1 Docs are available at http://localhost:8080/api-docs")

//middleware de aplicacion
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middlewares de rutas
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log("Server on port", process.env.PORT);
});
  
