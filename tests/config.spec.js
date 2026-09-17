import { describe, expect, jest, test } from "@jest/globals";

const { PORT, databaseConfig } = await import("../src/configs/config.js");

describe("config", () => {
  test("expone el puerto como número", () => {
    expect(PORT).toBe(Number(process.env.PORT) || 3000);
  });

  test("usa 3000 cuando PORT no está definido", async () => {
    const originalPort = process.env.PORT;
    process.env.PORT = "";
    jest.resetModules();

    const config = await import("../src/configs/config.js");

    expect(config.PORT).toBe(3000);
    process.env.PORT = originalPort;
  });

  test("construye la configuración de PostgreSQL desde el entorno", () => {
    expect(databaseConfig).toEqual({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    });
  });
});
