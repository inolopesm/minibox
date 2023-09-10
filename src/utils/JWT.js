import { Buffer } from "buffer";

export class JWT {
  static decode(token) {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const buffer = Buffer.from(base64, "base64");
    const text = buffer.toString("utf-8");
    return JSON.parse(text);
  }
}
