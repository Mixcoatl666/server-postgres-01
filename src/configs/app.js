import express from "express"
import morgan from "morgan"

import clientesRoutes from "../routes/clientes.routes.js"
import notasRoutes from "../routes/notas.routes.js"

const app = express()

app.disable("x-powered-by")

app.use(morgan("dev"))
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ mensaje: "API REST Funcionando!!" })
});

app.use(clientesRoutes)
app.use(notasRoutes)

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" })
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Error interno del servidor" })
});

export default app