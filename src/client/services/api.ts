import { getBody } from "../../common/http";

interface PostOptions {
  headers: { authorization: string };
  data: Record<string, unknown>;
}

export const api = Object.freeze({
  async post<T>(path: string, options: PostOptions) {
    try {
      const { headers: { authorization } } = options;
      const abortController = new AbortController();

      const id = setTimeout(() => abortController.abort(), 5000);

      const response = await fetch(path, {
        method: "POST",
        headers: { "content-type": "application/json", authorization },
        body: JSON.stringify(options.data),
        signal: abortController.signal,
      });

      clearTimeout(id);

      const data = await getBody(response);

      if (!response.ok) {
        if (typeof data?.message === "string") {
          throw new Error(data.message);
        }

        throw new Error(`Request failed with status code ${response.status}`);
      }

      return { data: data as T };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("A requisição demorou mais do que deveria");
      }

      throw error;
    }
  },
});
