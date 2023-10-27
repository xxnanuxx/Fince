import express from "express";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import routes from "./Routes/routes.js";
import dotenv from "dotenv";
//import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

// Metadata info about our API
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fince API",
      version: "1.0.0",
      description: "API for the FINCE application",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
    components: {
      responses: {
        Unauthorized: {
          description: "Unauthorized access",
          content: {
            "application/json": {
              example: {
                error: "Unauthorized",
              },
            },
          },
        },
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              example: {
                error: "Resource not found",
              },
            },
          },
        },
        InternalError: {
          description: "Internal server error",
          content: {
            "application/json": {
              example: {
                error: "Internal server error",
              },
            },
          },
        },
        BadRequest: {
          description: "Bad request",
          content: {
            "application/json": {
              example: {
                error: "Bad request",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./Routes/*.js", "./Controllers/*.js", "./Data/*.js"],
};

// Docs in JSON Format
const swaggerSpec = swaggerJSDoc(options);

const app = express();

app.set("port", process.env.PORT || 8080);

// Function to set up our docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

console.log("Version 1 Docs are available at http://localhost:8080/api-docs");

// Application Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Middlewares
app.use(routes);

// Protected Routes
//app.use("/auth", authMiddleware); // Cambio de nombre

// Public Routes
app.use("/user", routes); // Asegúrate de haber importado userRoutes si es necesario

app.listen(app.get("port"), () => {
  console.log("Server is running on port", app.get("port"));
});
