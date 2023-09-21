import express from "express";
import routes from "./Routes/routes.js";
import cors from "cors";

const app = expres()

//middleware de aplicacion
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middlewares de rutas
app.use(routes);