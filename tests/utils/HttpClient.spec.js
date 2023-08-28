import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { HttpClient } from "../../utils/HttpClient";

describe("HttpClient", () => {
  // https://github.com/jestjs/jest/issues/13834
  beforeAll(() => { window.fetch = () => Promise.reject(new Error("Please mock fetch")); });
  afterAll(() => { Reflect.deleteProperty(window, "fetch"); });

  describe("request", () => {
    it("should make a GET request and return the response data", async () => {
      jest.spyOn(window, "fetch").mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ message: "success" }),
      });

      const controller = new AbortController();

      jest.spyOn(window, "AbortController").mockImplementation(() => controller);

      const response = await HttpClient.request("https://example.com");

      expect(fetch).toHaveBeenCalledWith("https://example.com", {
        headers: new Headers(),
        signal: controller.signal,
      });

      expect(response).toEqual({ data: { message: "success" } });

      fetch.mockRestore();
      AbortController.mockRestore();
    });

    it("should make a request with custom method", async () => {
      jest.spyOn(window, "fetch").mockResolvedValue({
        ok: true,
        headers: new Headers(),
      });

      const controller = new AbortController();

      jest.spyOn(window, "AbortController").mockImplementation(() => controller);

      await HttpClient.request("https://example.com", { method: "POST" });

      expect(fetch).toHaveBeenCalledWith("https://example.com", {
        method: "POST",
        headers: new Headers(),
        signal: controller.signal,
      });

      fetch.mockRestore();
      AbortController.mockRestore();
    });

    it("should make a request with json data", async () => {
      jest.spyOn(window, "fetch").mockResolvedValue({
        ok: true,
        headers: new Headers(),
      });

      const controller = new AbortController();

      jest.spyOn(window, "AbortController").mockImplementation(() => controller);

      await HttpClient.request("https://example.com", {
        method: "POST",
        data: { username: "John Doe" },
      });

      expect(fetch).toHaveBeenCalledWith("https://example.com", {
        method: "POST",
        headers: new Headers({ "content-type": "application/json" }),
        signal: controller.signal,
        body: JSON.stringify({ username: "John Doe" }),
      });

      fetch.mockRestore();
      AbortController.mockRestore();
    });

    it("should make a request with access token", async () => {
      jest.spyOn(window, "fetch").mockResolvedValue({
        ok: true,
        headers: new Headers(),
      });

      const controller = new AbortController();

      jest.spyOn(window, "AbortController").mockImplementation(() => controller);

      await HttpClient.request("https://example.com", {
        accessToken: "0630ff9b756c1061",
      });

      expect(fetch).toHaveBeenCalledWith("https://example.com", {
        headers: new Headers({ "x-access-token": "0630ff9b756c1061" }),
        signal: controller.signal,
      });

      fetch.mockRestore();
      AbortController.mockRestore();
    });

    it("should return data as null if content type is not json", async () => {
      jest.spyOn(window, "fetch").mockResolvedValue({
        ok: true,
        headers: new Headers(),
      });

      const response = await HttpClient.request("https://example.com");

      expect(response).toEqual({ data: null });

      fetch.mockRestore();
    });

    it("should throw error if request lasts longer than five seconds", async () => {
      jest
        .spyOn(window, "fetch")
        .mockImplementation((_, { signal }) => new Promise((resolve, reject) => {
          let id;

          signal.onabort = () => {
            const error = new Error();
            error.name = "AbortError";
            clearTimeout(id);
            reject(error);
          };

          id = setTimeout(() => resolve({}), 10000);
        }));

      const promise = HttpClient.request("https://example.com");
      await expect(promise).rejects.toThrow(new Error("Timeout error"));

      fetch.mockRestore();
    }, 7500);

    it("should throw error with custom message if exists", async () => {
      jest.spyOn(window, "fetch").mockResolvedValue({
        ok: false,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ message: "custom error" }),
      });

      const promise = HttpClient.request("https://example.com");
      await expect(promise).rejects.toThrow(new Error("custom error"));

      fetch.mockRestore();
    });

    it("should throw error with generic message if message not exists", async () => {
      jest.spyOn(window, "fetch").mockResolvedValue({
        ok: false,
        status: 500,
        headers: new Headers(),
      });

      const promise = HttpClient.request("https://example.com");
      const error = new Error("Request failed with status code 500");
      await expect(promise).rejects.toThrow(error);

      fetch.mockRestore();
    });
  });

  describe("post", () => {
    it("should make a POST request and return the response data", async () => {
      const requestSpy = jest
        .spyOn(HttpClient, "request")
        .mockResolvedValue({ data: { message: "posted" } });

      const response = await HttpClient.post("https://example.com");

      expect(requestSpy).toHaveBeenCalledWith("https://example.com", {
        method: "POST",
      });

      expect(response).toEqual({ data: { message: "posted" } });

      requestSpy.mockRestore();
    });

    it("should send data and accessToken to request when exists", async () => {
      const requestSpy = jest
        .spyOn(HttpClient, "request")
        .mockResolvedValue({ data: null });

      await HttpClient.post("https://example.com", {
        data: { key: "value" },
        accessToken: "token",
      });

      expect(requestSpy).toHaveBeenCalledWith("https://example.com", {
        method: "POST",
        data: { key: "value" },
        accessToken: "token",
      });

      requestSpy.mockRestore();
    });
  });
});
