import { useEffect, useState } from "react";
import { Cookie } from "../utils/Cookie";
import type { useRouter } from "next/router";

export function useAuthentication(router: ReturnType<typeof useRouter>) {
  const [accessToken, setAccessToken] = useState<string | null>();

  useEffect(() => {
    setAccessToken(Cookie.get("accessToken"));
  }, []);

  useEffect(() => {
    if (accessToken === null) {
      void router.push("/signin");
    }
  }, [accessToken, router]);

  return { accessToken };
}
