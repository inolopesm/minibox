import { useEffect, useState } from "react";

export function useCookie(key: string) {
  const [cookie, setCookie] = useState<string | null>(null);

  useEffect(() => {
    const list = document.cookie.split("; ");
    const rawMap = list.map((c) => c.split("=", 2) as [string, string]);
    const map = new Map(rawMap);
    const value = map.get(key);
    if (value) setCookie(value);
  }, [key]);

  const set = (value: string) => {
    const map = [`${key}=${value}`, "path=/", "SameSite=Strict"];
    const production = process.env.NODE_ENV === "production";
    if (production) map.push("Secure");
    document.cookie = map.join("; ");
  };

  return [cookie, set] as const;
}
