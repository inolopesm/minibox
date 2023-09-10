export class Cookie {
  static get(key) {
    const list = document.cookie.split("; ");
    const rawMap = list.map((c) => c.split("=", 2));
    const map = new Map(rawMap);
    const value = map.get(key);
    return value ?? null;
  }

  static set(key, value) {
    document.cookie = `${key}=${value}`;
  }
}
