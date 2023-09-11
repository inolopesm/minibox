import { HttpClient } from "../utils/HttpClient";

interface RequestOptions {
  method?: string;
  data?: unknown;
  accessToken?: string;
  apiKey?: string;
}

export class API {
  private readonly httpClient: HttpClient;

  constructor() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (baseUrl === undefined) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is undefined");
    }

    this.httpClient = new HttpClient(baseUrl);
  }

  async request(
    path: string,
    { method, data, accessToken, apiKey }: RequestOptions = {}
  ) {
    const init: {
      method?: string;
      headers: Headers;
      data?: unknown;
    } = { headers: new Headers() };

    if (method) init.method = method;
    if (data) init.data = data;
    if (accessToken) init.headers.set("x-access-token", accessToken);
    if (apiKey) init.headers.set("x-api-key", apiKey);

    return this.httpClient.request(path, init);
  }

  get(path: string, options: Omit<RequestOptions, "method"> = {}) {
    return this.request(path, { method: "GET", ...options });
  }

  post(path: string, options: Omit<RequestOptions, "method"> = {}) {
    return this.request(path, { method: "POST", ...options });
  }

  put(path: string, options: Omit<RequestOptions, "method"> = {}) {
    return this.request(path, { method: "PUT", ...options });
  }
}

export const api = new API();
