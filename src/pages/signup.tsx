import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { TextField } from "../components/TextField";
import { useError } from "../hooks/useError";
import { useSuccess } from "../hooks/useSuccess";
import { api } from "../services/api";

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

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();
  const router = useRouter();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    const handleSuccess = () => {
      setSuccess(true);
      void router.push("/signin");
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
    <>
      <NextHead>
        <title>Registre-se na plataforma | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow">
          <div className="font-bold mb-4 text-gray-900 text-xl">
            Registre-se na plataforma
          </div>
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
              maxLength={24}
              pattern="[a-z]{1,24}"
              placeholder="fulano"
              title="O usuário é obrigatório e deve ser composto por até 24 letras minúsculas"
              autoCapitalize="off"
              required
            />
            <TextField
              label="Senha"
              type="password"
              name="password"
              disabled={loading || success}
              minLength={6}
              maxLength={24}
              pattern="[A-Za-z0-9]{8,24}"
              title="A senha é obrigatória e deve ser composta de 8 até 24 letras maiúsculas, minúsculas ou números"
              autoCapitalize="off"
              required
            />
            <TextField
              label="Confirmação da senha"
              type="password"
              name="passwordConfirmation"
              disabled={loading || success}
              minLength={6}
              maxLength={24}
              pattern="[A-Za-z0-9]{8,24}"
              title="A confirmação da senha é obrigatória e deve ser igual a senha informada acima"
              autoCapitalize="off"
              required
            />
            <Button type="submit" disabled={loading || success}>
              Cadastrar
            </Button>
            <p className="text-center text-sm text-gray-900">
              Já possui uma conta?{" "}
              <Link asChild>
                <NextLink href="/signin">Entrar</NextLink>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
