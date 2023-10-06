import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { TextField } from "../components/TextField";
import { useError } from "../hooks/useError";
import { useSuccess } from "../hooks/useSuccess";
import { api } from "../services/api";
import { Cookie } from "../utils/Cookie";
import { Typography } from "../components/Typography";
import { Layout } from "../components/Layout";

interface CreateSessionDTO {
  username: string;
  password: string;
}

export function SignInPage() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();

  useEffect(() => {
    setAccessToken(Cookie.get("accessToken"));
  }, []);

  useEffect(() => {
    if (typeof accessToken === "string") {
      navigate("/");
    }
  }, [accessToken, navigate]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    const handleSuccess = (response: { data: { accessToken: string } }) => {
      const cookie = [`accessToken=${response.data.accessToken}`];
      cookie.push("samesite=strict");
      cookie.push("path=/");
      if (import.meta.env.PROD) cookie.push("Secure");
      document.cookie = cookie.join("; ");
      setSuccess(true);
      navigate("/");
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
    <Layout>
      <Typography variant="heading" className="mb-4">
        Acesse a plataforma
      </Typography>
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
          required
          autoFocus
        />
        <TextField
          label="Senha"
          type="password"
          name="password"
          disabled={loading || success}
          required
        />
        <Button type="submit" disabled={loading || success}>
          Entrar
        </Button>
        <Typography variant="body2" className="text-center">
          Ainda não possui uma conta?{" "}
          <Link asChild>
            <RouterLink to="/signup">Registre-se</RouterLink>
          </Link>
        </Typography>
      </form>
    </Layout>
  );
}
