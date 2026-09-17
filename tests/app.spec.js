import request from "supertest";
import { describe, expect, jest, test } from "@jest/globals";

const query = jest.fn().mockResolvedValue({ rows: [] });
const notasApi = {
  getNotas: jest.fn().mockResolvedValue([]),
  createNotas: jest.fn(),
  updateNotas: jest.fn(),
  deleteNotas: jest.fn(),
};

jest.unstable_mockModule("../src/database/db.js", () => ({
  pool: { query },
}));
jest.unstable_mockModule("../src/models/Notas.js", () => ({
  Notas: notasApi,
}));

const { default: app } = await import("../src/configs/app.js");

describe("app", () => {
  test("GET / devuelve el mensaje de funcionamiento", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mensaje: "API REST Funcionando!!" });
  });

  test("GET /ruta-inexistente devuelve 404", async () => {
    const response = await request(app).get("/ruta-inexistente");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Ruta no encontrada" });
  });

  test("GET /clientes usa el controlador de clientes", async () => {
    const clientes = [{ idCliente: 1, nombre: "Ana" }];
    query.mockResolvedValueOnce({ rows: clientes });

    const response = await request(app).get("/clientes");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(clientes);
  });

  test("GET /notas usa el controlador de notas", async () => {
    const notas = [{ idnota: 1, titulo: "Nota" }];
    notasApi.getNotas.mockResolvedValueOnce(notas);

    const response = await request(app).get("/notas");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(notas);
  });

  test("responde 500 cuando falla una consulta de clientes", async () => {
    const error = new Error("database error");
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    query.mockRejectedValueOnce(error);

    const response = await request(app).get("/clientes");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Error interno del servidor" });
    expect(consoleError).toHaveBeenCalledWith(error);
    consoleError.mockRestore();
  });
});
