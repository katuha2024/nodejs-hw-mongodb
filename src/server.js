import express from "express";
import cors from "cors";
import pino from "pino-http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";

import contactsRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";

export const setupServer = () => {
  const app = express();

  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const swaggerPath = path.join(__dirname, "../docs/swagger.json");

  let swaggerDocument;
  try {
    swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));
  } catch (err) {
    console.error(" Не вдалося завантажити swagger.json:", err.message);
    swaggerDocument = {};
  }

  app.use(cors());
  app.use(express.json());
  app.use(pino());

  
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  
  app.use("/contacts", contactsRouter);
  app.use("/auth", authRouter);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
    console.log(`Swagger docs available at http://127.0.0.1:${PORT}/api-docs`);
  });
};
