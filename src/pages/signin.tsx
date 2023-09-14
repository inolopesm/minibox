import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { TextField } from "../components/TextField";
import { useError } from "../hooks/useError";
import { useSuccess } from "../hooks/useSuccess";
import { api } from "../services/api";
import { Cookie } from "../utils/Cookie";

interface CreateSessionDTO {
  username: string;
  password: string;
}

export default function SignInPage() {
  const [accessToken, setAccessToken] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();
  const router = useRouter();

  useEffect(() => {
    setAccessToken(Cookie.get("accessToken"));
  }, []);

  useEffect(() => {
    if (typeof accessToken === "string") {
      void router.push("/");
    }
  }, [accessToken, router]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    const handleSuccess = (response: { data: { accessToken: string } }) => {
      const cookie = [`accessToken=${response.data.accessToken}`];
      cookie.push("samesite=strict");
      cookie.push("path=/");
      if (process.env.NODE_ENV === "production") cookie.push("Secure");
      document.cookie = cookie.join("; ");
      setSuccess(true);
      void router.push("/");
    };

    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData) as unknown as CreateSessionDTO;

    api
      .post("/sessions", { data })
      .then((response) => handleSuccess(response))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <NextHead>
        <title>Acesse a plataforma | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow">
          <div className="font-bold mb-4 text-gray-900 text-xl">
            Acesse a plataforma
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="error" onClose={() => setError(null)}>
                {error.message}
              </Alert>
            )}
            {success && (
              <Alert variant="success">
                Login realizado com sucesso. Redirecionando para a plataforma.
              </Alert>
            )}
            <TextField
              label="Usuário"
              type="text"
              name="username"
              disabled={loading || success}
              autoCapitalize="off"
            />
            <TextField
              label="Senha"
              type="password"
              name="password"
              disabled={loading || success}
            />
            <Button type="submit" disabled={loading || success}>
              Entrar
            </Button>
            <p className="text-center text-sm text-gray-900">
              Ainda não possui uma conta?{" "}
              <Link asChild>
                <NextLink href="/signup">Registre-se</NextLink>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
