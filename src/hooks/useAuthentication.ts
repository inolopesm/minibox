import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cookie } from "../utils/Cookie";

export function useAuthentication() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>();

  useEffect(() => {
    setAccessToken(Cookie.get("accessToken"));
  }, []);

  useEffect(() => {
    if (accessToken === null) {
      navigate("/signin");
    }
  }, [accessToken, navigate]);

  return { accessToken };
}
