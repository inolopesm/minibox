export const HttpClient = {
  async request(url, options = {}) {
    try {
      const init = { headers: new Headers() };

      if (options.method) {
        init.method = options.method;
      }

      if (options.data) {
        init.headers.set("content-type", "application/json");
        init.body = JSON.stringify(options.data);
      }

      if (options.accessToken) {
        init.headers.set("x-access-token", options.accessToken);
      }

      const controller = new AbortController();
      init.signal = controller.signal;

      const id = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(url, init);
      clearTimeout(id);

      const contentType = response.headers.get("content-type");
      const json = !!contentType && contentType.includes("json");
      const data = json ? await response.json() : null;

      if (!response.ok) {
        if (data?.message) {
          throw new Error(data.message);
        }

        throw new Error(`Request failed with status code ${response.status}`);
      }

      return { data };
    } catch (error) {
      if (error?.name === "AbortError") {
        throw new Error("Timeout error");
      }

      throw error;
    }
  },

  post(url, options = {}) {
    return HttpClient.request(url, { method: "POST", ...options });
  },
};
