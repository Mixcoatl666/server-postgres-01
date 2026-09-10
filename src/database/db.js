import pg from "pg"
import { databaseConfig } from "../configs/config.js"

try {
  const pool = new pg.Pool(databaseConfig)
  await pool.connect();
  console.log("Conexión a la base de datos exitosa")
} catch (error) {
  console.error("Error al conectar a la base de datos:", error)
}

export const pool = new pg.Pool(databaseConfig)