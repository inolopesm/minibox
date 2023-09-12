export const Cookie = {
  get(key: string) {
    const list = document.cookie.split("; ");
    const rawMap = list.map((c) => c.split("=", 2) as [string, string]);
    const map = new Map(rawMap);
    const value = map.get(key);
    return value ?? null;
  },

  set(key: string, value: string) {
    document.cookie = `${key}=${value}`;
  },
};
