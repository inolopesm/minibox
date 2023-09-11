interface RequestOptions {
  method?: string;
  headers?: Headers;
  data?: unknown;
}

export class HttpClient {
  private readonly baseUrl: string | URL;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request(path: string, options: RequestOptions = {}) {
    try {
      const init: {
        headers: Headers;
        method?: string;
        body?: string;
        signal?: AbortSignal;
      } = { headers: options.headers ?? new Headers() };

      if (options.method) {
        init.method = options.method;
      }

      if (options.data) {
        init.headers.set("content-type", "application/json");
        init.body = JSON.stringify(options.data);
      }

      const controller = new AbortController();
      init.signal = controller.signal;

      const id = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(new URL(path, this.baseUrl), init);
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
}
