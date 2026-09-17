import pg from "pg";
import { databaseConfig } from "../configs/config.js";

export const pool = new pg.Pool(databaseConfig);

try {
  await pool.query("SELECT 1");
  console.log("Conexión a la base de datos exitosa");
} catch (error) {
  console.error("Error al conectar a la base de datos:", error);
}
