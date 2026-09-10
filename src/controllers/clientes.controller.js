import { pool } from "../database/db.js";

const clienteColumns = `
  idcliente AS "idCliente",
  nombre,
  edad,
  telefono,
  create_at AS "createAt"
`;

function getClienteId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function validarCliente(body) {
  const { nombre, edad, telefono } = body;
  const errores = [];

  if (typeof nombre !== "string" || nombre.trim().length < 2 || nombre.trim().length > 100) {
    errores.push("nombre debe tener entre 2 y 100 caracteres");
  }

  if (!Number.isInteger(edad) || edad < 0 || edad > 130) {
    errores.push("edad debe ser un número entero entre 0 y 130");
  }

  if (typeof telefono !== "string" || !/^[0-9+() -]{7,15}$/.test(telefono.trim())) {
    errores.push("telefono debe tener entre 7 y 15 caracteres válidos");
  }

  return errores;
}

export async function obtenerClientes(req, res, next) {
  try {
    const { rows } = await pool.query(`SELECT ${clienteColumns} FROM clientes ORDER BY idcliente`);
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function obtenerCliente(req, res, next) {
  const id = getClienteId(req.params.clienteId);
  if (!id) return res.status(400).json({ error: "clienteId inválido" });

  try {
    const { rows } = await pool.query(
      `SELECT ${clienteColumns} FROM clientes WHERE idcliente = $1`,
      [id],
    );
    if (!rows[0]) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function crearCliente(req, res, next) {
  const errores = validarCliente(req.body);
  if (errores.length) return res.status(400).json({ errores });

  const { nombre, edad, telefono } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO clientes (nombre, edad, telefono)
       VALUES ($1, $2, $3)
       RETURNING ${clienteColumns}`,
      [nombre.trim(), edad, telefono.trim()],
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function actualizarCliente(req, res, next) {
  const id = getClienteId(req.params.clienteId);
  if (!id) return res.status(400).json({ error: "clienteId inválido" });

  const errores = validarCliente(req.body);
  if (errores.length) return res.status(400).json({ errores });

  const { nombre, edad, telefono } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE clientes
       SET nombre = $1, edad = $2, telefono = $3
       WHERE idcliente = $4
       RETURNING ${clienteColumns}`,
      [nombre.trim(), edad, telefono.trim(), id],
    );
    if (!rows[0]) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function eliminarCliente(req, res, next) {
  const id = getClienteId(req.params.clienteId);
  if (!id) return res.status(400).json({ error: "clienteId inválido" });

  try {
    const { rows } = await pool.query(
      `DELETE FROM clientes WHERE idcliente = $1 RETURNING ${clienteColumns}`,
      [id],
    );
    if (!rows[0]) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json({ mensaje: "Cliente eliminado", cliente: rows[0] });
  } catch (error) {
    next(error);
  }
}
