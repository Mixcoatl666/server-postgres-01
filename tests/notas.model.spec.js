import { beforeEach, describe, expect, jest, test } from "@jest/globals";

const query = jest.fn();

jest.unstable_mockModule("../src/database/db.js", () => ({
  pool: { query },
}));

const { Notas } = await import("../src/models/Notas.js");

beforeEach(() => {
  query.mockReset();
});

describe("Notas", () => {
  test("getNotas devuelve las filas", async () => {
    const rows = [{ idnota: 1, titulo: "Nota" }];
    query.mockResolvedValue({ rows });

    await expect(Notas.getNotas()).resolves.toEqual(rows);
    expect(query).toHaveBeenCalledWith("SELECT * FROM notas");
  });

  test("createNotas inserta y devuelve la nota", async () => {
    const nota = { idnota: 1, titulo: "Nota", descripcion: "Texto" };
    query.mockResolvedValue({ rows: [nota] });

    await expect(Notas.createNotas("Nota", "Texto")).resolves.toEqual(nota);
    expect(query).toHaveBeenCalledWith(
      "INSERT INTO notas (titulo, descripcion) VALUES ($1, $2) RETURNING *",
      ["Nota", "Texto"],
    );
  });

  test("updateNotas actualiza y devuelve la nota", async () => {
    const nota = { idnota: 1, titulo: "Actualizada" };
    query.mockResolvedValue({ rows: [nota] });

    await expect(
      Notas.updateNotas("1", "Actualizada", "Texto"),
    ).resolves.toEqual(nota);
    expect(query).toHaveBeenCalledWith(
      "UPDATE notas SET titulo = $1, descripcion = $2 WHERE idnota = $3 RETURNING *",
      ["Actualizada", "Texto", "1"],
    );
  });

  test("deleteNotas elimina y devuelve la nota", async () => {
    const nota = { idnota: 1 };
    query.mockResolvedValue({ rows: [nota] });

    await expect(Notas.deleteNotas("1")).resolves.toEqual(nota);
    expect(query).toHaveBeenCalledWith(
      "DELETE FROM notas WHERE idnota = $1 RETURNING *",
      ["1"],
    );
  });

  test("propaga los errores de la base de datos", async () => {
    const error = new Error("database error");
    query.mockRejectedValue(error);

    await expect(Notas.getNotas()).rejects.toBe(error);
  });
});
