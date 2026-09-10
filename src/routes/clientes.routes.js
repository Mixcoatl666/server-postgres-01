import { Router } from "express"
import {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  obtenerCliente,
  obtenerClientes,
} from "../controllers/clientes.controller.js"

const router = Router()

router.get("/clientes", obtenerClientes)
router.get("/clientes/:clienteId", obtenerCliente)
router.post("/clientes", crearCliente)
router.put("/clientes/:clienteId", actualizarCliente)
router.delete("/clientes/:clienteId", eliminarCliente)

export default router
