import { describe, expect, jest, test } from "@jest/globals";

const listen = jest.fn();

jest.unstable_mockModule("../src/configs/app.js", () => ({
  default: { listen },
}));
jest.unstable_mockModule("../src/configs/config.js", () => ({
  PORT: 4567,
}));

describe("server bootstrap", () => {
  test("inicia la aplicación en el puerto configurado", async () => {
    jest.resetModules();
    await import("../src/index.js");

    expect(listen).toHaveBeenCalledWith(4567);
  });
});
