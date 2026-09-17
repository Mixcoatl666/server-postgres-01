import { beforeEach, describe, expect, jest, test } from "@jest/globals";

const notasApi = {
  getNotas: jest.fn(),
  createNotas: jest.fn(),
  updateNotas: jest.fn(),
  deleteNotas: jest.fn(),
};

jest.unstable_mockModule("../src/models/Notas.js", () => ({
  Notas: notasApi,
}));

const { createNotas, deleteNotas, getNotas, updateNotas } =
  await import("../src/controllers/notas.controller.js");

function createResponse() {
  const response = {};
  response.status = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);
  return response;
}

beforeEach(() => {
  Object.values(notasApi).forEach((method) => method.mockReset());
});

describe("notas.controller", () => {
  test("getNotas devuelve las notas", async () => {
    const response = createResponse();
    const notas = [{ idnota: 1, titulo: "Nota" }];
    notasApi.getNotas.mockResolvedValue(notas);

    await getNotas({}, response);

    expect(response.json).toHaveBeenCalledWith(notas);
  });

  test("getNotas responde 500 si falla el modelo", async () => {
    const response = createResponse();
    notasApi.getNotas.mockRejectedValue(new Error("database error"));

    await getNotas({}, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      error: "Error al obtener las notas",
    });
  });

  test("createNotas crea una nota", async () => {
    const response = createResponse();
    const nota = { idnota: 1, titulo: "Nota", descripcion: "Texto" };
    notasApi.createNotas.mockResolvedValue(nota);

    await createNotas(
      { body: { titulo: "Nota", descripcion: "Texto" } },
      response,
    );

    expect(notasApi.createNotas).toHaveBeenCalledWith("Nota", "Texto");
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(nota);
  });

  test("createNotas responde 500 si falla el modelo", async () => {
    const response = createResponse();
    notasApi.createNotas.mockRejectedValue(new Error("database error"));

    await createNotas({ body: {} }, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      error: "Error al crear la nota",
    });
  });

  test("updateNotas actualiza una nota", async () => {
    const response = createResponse();
    const nota = { idnota: 1, titulo: "Actualizada" };
    notasApi.updateNotas.mockResolvedValue(nota);

    await updateNotas(
      {
        params: { idnota: "1" },
        body: { titulo: "Actualizada", descripcion: "Texto" },
      },
      response,
    );

    expect(notasApi.updateNotas).toHaveBeenCalledWith(
      "1",
      "Actualizada",
      "Texto",
    );
    expect(response.json).toHaveBeenCalledWith(nota);
  });

  test("updateNotas responde 404 si no existe", async () => {
    const response = createResponse();
    notasApi.updateNotas.mockResolvedValue(undefined);

    await updateNotas({ params: { idnota: "1" }, body: {} }, response);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ error: "Nota no encontrada" });
  });

  test("updateNotas responde 500 si falla el modelo", async () => {
    const response = createResponse();
    notasApi.updateNotas.mockRejectedValue(new Error("database error"));

    await updateNotas({ params: { idnota: "1" }, body: {} }, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      error: "Error al actualizar la nota",
    });
  });

  test("deleteNotas elimina una nota", async () => {
    const response = createResponse();
    notasApi.deleteNotas.mockResolvedValue({ idnota: 1 });

    await deleteNotas({ params: { idnota: "1" } }, response);

    expect(notasApi.deleteNotas).toHaveBeenCalledWith("1");
    expect(response.json).toHaveBeenCalledWith({
      message: "Nota eliminada correctamente",
    });
  });

  test("deleteNotas responde 404 si no existe", async () => {
    const response = createResponse();
    notasApi.deleteNotas.mockResolvedValue(undefined);

    await deleteNotas({ params: { idnota: "1" } }, response);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ error: "Nota no encontrada" });
  });

  test("deleteNotas responde 500 si falla el modelo", async () => {
    const response = createResponse();
    notasApi.deleteNotas.mockRejectedValue(new Error("database error"));

    await deleteNotas({ params: { idnota: "1" } }, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      error: "Error al eliminar la nota",
    });
  });
});
