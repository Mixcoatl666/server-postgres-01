import express from "express";
import morgan from "morgan";
import { PORT } from "./config.js";
import clientesRoutes from "./routes/clientes.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API de clientes activa" });
});
app.use(clientesRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT);
console.log(`Servidor corriendo en el puerto ${PORT}`);
