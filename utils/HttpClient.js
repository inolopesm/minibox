export const HttpClient = {
  async request(url, { method, data, accessToken } = {}) {
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

      const controller = new AbortController();
      init.signal = controller.signal;

      const id = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(url, init);
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
  },

  post(url, { data, accessToken } = {}) {
    const options = { data, accessToken };
    return HttpClient.request(url, { method: "POST", ...options });
  },
};
