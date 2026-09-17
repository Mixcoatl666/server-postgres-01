import { beforeEach, describe, expect, jest, test } from "@jest/globals";

const query = jest.fn();
const Pool = jest.fn(() => ({ query }));

jest.unstable_mockModule("pg", () => ({
  default: { Pool },
}));

const databaseModule = () => import("../src/database/db.js");

beforeEach(() => {
  query.mockReset();
  Pool.mockClear();
});

describe("database", () => {
  test("crea el pool y confirma una conexión correcta", async () => {
    query.mockResolvedValue({ rows: [{ result: 1 }] });
    const consoleLog = jest.spyOn(console, "log").mockImplementation(() => {});

    const { pool } = await databaseModule();

    expect(Pool).toHaveBeenCalledTimes(1);
    expect(pool.query).toHaveBeenCalledWith("SELECT 1");
    expect(consoleLog).toHaveBeenCalledWith(
      "Conexión a la base de datos exitosa",
    );
    consoleLog.mockRestore();
  });

  test("informa cuando falla la conexión", async () => {
    jest.resetModules();
    const error = new Error("connection error");
    query.mockRejectedValue(error);
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await databaseModule();

    expect(consoleError).toHaveBeenCalledWith(
      "Error al conectar a la base de datos:",
      error,
    );
    consoleError.mockRestore();
  });
});
