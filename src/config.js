export const PORT = Number(process.env.PORT) || 3000;

export const databaseConfig = {
  user: process.env.DB_USER || "pruebadb_user",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "PRUEBABD",
  password: process.env.DB_PASSWORD || "linux",
  port: Number(process.env.DB_PORT) || 5432,
};
