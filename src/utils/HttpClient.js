export class HttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(url, { method, data, accessToken, apiKey } = {}) {
    try {
      const init = { headers: new Headers() };

      if (method) {
        init.method = method;
      }

      if (data) {
        init.headers.set("content-type", "application/json");
        init.body = JSON.stringify(data);
      }

      if (accessToken) {
        init.headers.set("x-access-token", accessToken);
      }

      if (apiKey) {
        init.headers.set("x-api-key", apiKey);
      }

      const controller = new AbortController();
      init.signal = controller.signal;

      const id = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(new URL(url, this.baseUrl), init);
      clearTimeout(id);

      const contentType = response.headers.get("content-type");
      const json = !!contentType && contentType.includes("json");
      const body = json ? await response.json() : null;

      if (!response.ok) {
        if (body?.message) {
          throw new Error(body.message);
        }

        throw new Error(`Request failed with status code ${response.status}`);
      }

      return { data: body };
    } catch (error) {
      if (error?.name === "AbortError") {
        throw new Error("Timeout error");
      }

      throw error;
    }
  }

  get(url, { accessToken, apiKey }) {
    return this.request(url, { accessToken, apiKey });
  }

  post(url, { data, accessToken, apiKey } = {}) {
    return this.request(url, { method: "POST", data, accessToken, apiKey });
  }

  put(url, { data, accessToken, apiKey } = {}) {
    return this.request(url, { method: "PUT", data, accessToken, apiKey });
  }
}
