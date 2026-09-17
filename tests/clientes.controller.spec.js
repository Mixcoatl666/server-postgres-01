import { beforeEach, describe, expect, jest, test } from "@jest/globals";

const query = jest.fn();

jest.unstable_mockModule("../src/database/db.js", () => ({
  pool: { query },
}));

const {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  obtenerCliente,
  obtenerClientes,
} = await import("../src/controllers/clientes.controller.js");

function createResponse() {
  const response = {};
  response.status = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);
  return response;
}

function createNext() {
  return jest.fn();
}

const validBody = { nombre: "Ana López", edad: 30, telefono: "1234567890" };

beforeEach(() => {
  query.mockReset();
});

describe("clientes.controller", () => {
  describe("obtenerClientes", () => {
    test("devuelve la lista de clientes", async () => {
      const response = createResponse();
      const next = createNext();
      const rows = [{ idCliente: 1, nombre: "Ana" }];
      query.mockResolvedValue({ rows });

      await obtenerClientes({}, response, next);

      expect(query).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(rows);
      expect(next).not.toHaveBeenCalled();
    });

    test("delega el error en next", async () => {
      const response = createResponse();
      const next = createNext();
      const error = new Error("database error");
      query.mockRejectedValue(error);

      await obtenerClientes({}, response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("obtenerCliente", () => {
    test("rechaza un identificador inválido", async () => {
      const response = createResponse();

      await obtenerCliente(
        { params: { clienteId: "abc" } },
        response,
        createNext(),
      );

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        error: "clienteId inválido",
      });
      expect(query).not.toHaveBeenCalled();
    });

    test("devuelve 404 si no existe", async () => {
      const response = createResponse();
      query.mockResolvedValue({ rows: [] });

      await obtenerCliente(
        { params: { clienteId: "1" } },
        response,
        createNext(),
      );

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({
        error: "Cliente no encontrado",
      });
    });

    test("devuelve el cliente encontrado", async () => {
      const response = createResponse();
      const cliente = { idCliente: 1, nombre: "Ana" };
      query.mockResolvedValue({ rows: [cliente] });

      await obtenerCliente(
        { params: { clienteId: "1" } },
        response,
        createNext(),
      );

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE idcliente = $1"),
        [1],
      );
      expect(response.json).toHaveBeenCalledWith(cliente);
    });

    test("delega el error en next", async () => {
      const response = createResponse();
      const next = createNext();
      const error = new Error("database error");
      query.mockRejectedValue(error);

      await obtenerCliente({ params: { clienteId: "1" } }, response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("crearCliente", () => {
    test("rechaza datos inválidos", async () => {
      const response = createResponse();

      await crearCliente(
        { body: { nombre: "A", edad: -1, telefono: "1" } },
        response,
        createNext(),
      );

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        errores: expect.any(Array),
      });
      expect(query).not.toHaveBeenCalled();
    });

    test("crea y devuelve el cliente", async () => {
      const response = createResponse();
      const cliente = { idCliente: 1, ...validBody };
      query.mockResolvedValue({ rows: [cliente] });

      await crearCliente(
        {
          body: {
            ...validBody,
            nombre: " Ana López ",
            telefono: " 1234567890 ",
          },
        },
        response,
        createNext(),
      );

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO clientes"),
        ["Ana López", 30, "1234567890"],
      );
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith(cliente);
    });

    test("delega el error en next", async () => {
      const response = createResponse();
      const next = createNext();
      const error = new Error("database error");
      query.mockRejectedValue(error);

      await crearCliente({ body: validBody }, response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("actualizarCliente", () => {
    test("rechaza un identificador inválido", async () => {
      const response = createResponse();

      await actualizarCliente(
        { params: { clienteId: "0" }, body: validBody },
        response,
        createNext(),
      );

      expect(response.status).toHaveBeenCalledWith(400);
      expect(query).not.toHaveBeenCalled();
    });

    test("rechaza datos inválidos", async () => {
      const response = createResponse();

      await actualizarCliente(
        { params: { clienteId: "1" }, body: {} },
        response,
        createNext(),
      );

      expect(response.status).toHaveBeenCalledWith(400);
      expect(query).not.toHaveBeenCalled();
    });

    test("devuelve 404 si no existe", async () => {
      const response = createResponse();
      query.mockResolvedValue({ rows: [] });

      await actualizarCliente(
        { params: { clienteId: "1" }, body: validBody },
        response,
        createNext(),
      );

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({
        error: "Cliente no encontrado",
      });
    });

    test("actualiza y devuelve el cliente", async () => {
      const response = createResponse();
      const cliente = { idCliente: 1, ...validBody };
      query.mockResolvedValue({ rows: [cliente] });

      await actualizarCliente(
        { params: { clienteId: "1" }, body: validBody },
        response,
        createNext(),
      );

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE clientes"),
        ["Ana López", 30, "1234567890", 1],
      );
      expect(response.json).toHaveBeenCalledWith(cliente);
    });

    test("delega el error en next", async () => {
      const response = createResponse();
      const next = createNext();
      const error = new Error("database error");
      query.mockRejectedValue(error);

      await actualizarCliente(
        { params: { clienteId: "1" }, body: validBody },
        response,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("eliminarCliente", () => {
    test("rechaza un identificador inválido", async () => {
      const response = createResponse();

      await eliminarCliente(
        { params: { clienteId: "no-id" } },
        response,
        createNext(),
      );

      expect(response.status).toHaveBeenCalledWith(400);
      expect(query).not.toHaveBeenCalled();
    });

    test("devuelve 404 si no existe", async () => {
      const response = createResponse();
      query.mockResolvedValue({ rows: [] });

      await eliminarCliente(
        { params: { clienteId: "1" } },
        response,
        createNext(),
      );

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({
        error: "Cliente no encontrado",
      });
    });

    test("elimina y devuelve el cliente eliminado", async () => {
      const response = createResponse();
      const cliente = { idCliente: 1, ...validBody };
      query.mockResolvedValue({ rows: [cliente] });

      await eliminarCliente(
        { params: { clienteId: "1" } },
        response,
        createNext(),
      );

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM clientes"),
        [1],
      );
      expect(response.json).toHaveBeenCalledWith({
        mensaje: "Cliente eliminado",
        cliente,
      });
    });

    test("delega el error en next", async () => {
      const response = createResponse();
      const next = createNext();
      const error = new Error("database error");
      query.mockRejectedValue(error);

      await eliminarCliente({ params: { clienteId: "1" } }, response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
