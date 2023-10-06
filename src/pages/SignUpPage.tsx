import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { TextField } from "../components/TextField";
import { useError } from "../hooks/useError";
import { useSuccess } from "../hooks/useSuccess";
import { api } from "../services/api";
import { Typography } from "../components/Typography";
import { Layout } from "../components/Layout";

interface SignUpFormData {
  apiKey: string;
  username: string;
  password: string;
  passwordConfirmation: string;
}

interface CreateUserDTO {
  username: string;
  password: string;
}

export function SignUpPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    const handleSuccess = () => {
      setSuccess(true);
      navigate("/signin");
    };

    event.preventDefault();

    const fd = new FormData(event.target as HTMLFormElement);
    const o = Object.fromEntries(fd) as unknown as SignUpFormData;
    const { passwordConfirmation, apiKey } = o;
    const data: CreateUserDTO = { username: o.username, password: o.password };

    if (data.password !== passwordConfirmation) {
      const errorMessage = "A senha e a confirmação da senha devem ser iguais";
      setError(new Error(errorMessage));
      return;
    }

    setLoading(true);
    setError(null);

    api
      .post("/users", { data, apiKey })
      .then(() => handleSuccess())
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Layout>
      <Typography variant="heading" className="mb-4">
        Registre-se na plataforma
      </Typography>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error.message}
          </Alert>
        )}
        {success && (
          <Alert variant="success">
            Usuário cadastrado com sucesso. Redirecionando para acessar a
            plataforma.
          </Alert>
        )}
        <TextField
          label="Chave secreta"
          type="password"
          name="apiKey"
          disabled={loading || success}
          title="A chave secreta é obrigatória"
          helperText="Não possui? Contate o administrador"
          autoCapitalize="off"
          required
        />
        <TextField
          label="Usuário"
          type="text"
          name="username"
          disabled={loading || success}
          placeholder="fulano"
          autoCapitalize="off"
          required
        />
        <TextField
          label="Senha"
          type="password"
          name="password"
          disabled={loading || success}
          autoCapitalize="off"
          required
          autoFocus
        />
        <TextField
          label="Confirmação da senha"
          type="password"
          name="passwordConfirmation"
          disabled={loading || success}
          autoCapitalize="off"
          required
        />
        <Button type="submit" disabled={loading || success}>
          Cadastrar
        </Button>
        <Typography variant="body2" className="text-center">
          Já possui uma conta?{" "}
          <Link asChild>
            <RouterLink to="/signin">Entrar</RouterLink>
          </Link>
        </Typography>
      </form>
    </Layout>
  );
}
