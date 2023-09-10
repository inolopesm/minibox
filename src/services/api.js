import { HttpClient } from "../utils/HttpClient";

export const api = new HttpClient(process.env.NEXT_PUBLIC_API_BASE_URL);
