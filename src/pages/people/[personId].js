import { useEffect, useState } from "react";
import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { TextField } from "../../components/TextField";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { api } from "../../services/api";
import { Cookie } from "../../utils/Cookie";

export default function EditPersonPage() {
  const [accessToken, setAccessToken] = useState();
  const [person, setPerson] = useState(null);
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
    if (typeof accessToken === "string" && router.isReady) {
      setLoading(true);

      const handleSuccess = ({ data: pData }, { data: tData }) => {
        setPerson(pData);
        setTeams(tData);
      };

      Promise.all([
        api.get(`/people/${router.query.personId}`, { accessToken }),
        api.get("/teams", { accessToken }),
      ])
        .then(([pResponse, tResponse]) => handleSuccess(pResponse, tResponse))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, [accessToken, router.isReady, router.query.personId]);

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

  const handleSubmit = (event) => {
    const handleSuccess = () => {
      setSuccess(true);
      router.push("/people");
    };

    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = Object.fromEntries(new FormData(event.target));
    data.value = Number.parseInt(data.value, 10);

    api
      .put(`/people/${router.query.personId}`, { data, accessToken })
      .then(() => handleSuccess())
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <NextHead>
        <title>Editar Produto | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="bg-white border shadow rounded border-gray-200 p-6 max-w-xs mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" asChild>
              <NextLink href="/people">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </NextLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">
              Editar Produto
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
                Produto editado com sucesso. Redirecionando para a listagem.
              </Alert>
            )}
            {person !== null && teams.length > 0 && (
              <>
                <TextField
                  label="Nome"
                  type="text"
                  name="name"
                  disabled={loading || success}
                  maxLength={24}
                  pattern="[A-zÀ-ú0-9][A-zÀ-ú0-9 ]{1,22}[A-zÀ-ú0-9]"
                  placeholder="Cuscuz com Ovo"
                  title="O nome é obrigatório e deve ser composto por até 24 caracteres sem espaço nas laterais"
                  defaultValue={person.name}
                  required
                />
                <div>
                  <select name="teamId" defaultValue={person.teamId} required>
                    {teams.map((team) => (
                      <option value={team.id} key={team.id}>
                        {team.name} #{team.id}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <Button type="submit" disabled={loading || success}>
              Salvar
            </Button>
          </form>
        </div>
      </div>
    </>
  );

}

