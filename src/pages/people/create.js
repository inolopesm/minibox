import { useEffect, useState } from "react";
import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { TextField } from "../../components/TextField";
import { api } from "../../services/api";
import { Cookie } from "../../utils/Cookie";

export default function CreatePersonPage() {
  const [accessToken, setAccessToken] = useState();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAccessToken(Cookie.get("accessToken"));
  }, []);

  useEffect(() => {
    if (accessToken === null) {
      router.push("/signin");
    }
  }, [accessToken, router]);

  useEffect(() => {
    if (error) {
      window.scroll({ left: 0, top: 0 });
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      window.scroll({ left: 0, top: 0 });
    }
  }, [success]);

  useEffect(() => {
    if (typeof accessToken === "string") {
      setLoading(true);

      api
        .get("/teams", { accessToken })
        .then((response) => setTeams(response.data))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, [accessToken]);

  const handleSubmit = (event) => {
    const handleSuccess = () => {
      setSuccess(true);
      router.push("/people");
    };

    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = Object.fromEntries(new FormData(event.target));
    data.teamId = Number.parseInt(data.teamId, 10);

    api
      .post("/people", { data, accessToken })
      .then(() => handleSuccess())
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <NextHead>
        <title>Criar Pessoa | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" asChild>
              <NextLink href="/people">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </NextLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">
              Criar Pessoa
            </div>
          </div>
          <form
            className="grid gap-4"
            onSubmit={handleSubmit}
          >
            {error && (
              <Alert variant="error" onClose={() => setError(null)}>
                {error.message}
              </Alert>
            )}
            {success && (
              <Alert variant="success">
                Pessoa criada com sucesso. Redirecionando para a listagem.
              </Alert>
            )}
            <TextField
              label="Nome"
              type="text"
              name="name"
              disabled={loading || success}
              maxLength={24}
              pattern="[A-zÀ-ú0-9][A-zÀ-ú0-9 ]{1,22}[A-zÀ-ú0-9]"
              placeholder="Fulano da Silva"
              title="O nome é obrigatório e deve ser composto por até 24 caracteres sem espaço nas laterais"
              required
            />
            <div>
              <select name="teamId" required>
                {teams.map((team) => (
                  <option value={team.id} key={team.id}>
                    {team.name} #{team.id}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={loading || success}>
              Cadastrar
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
