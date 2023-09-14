import { useEffect, useState } from "react";
import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { TextField } from "../../components/TextField";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { api } from "../../services/api";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useError } from "../../hooks/useError";
import { useSuccess } from "../../hooks/useSuccess";
import { SelectField } from "../../components/SelectField";

interface Team {
  id: number;
  name: string;
}

interface Person {
  id: number;
  name: string;
  teamId: number;
}

interface UpdatePersonFormData {
  name: string;
  teamId: string;
}

interface UpdatePersonDTO {
  name: string;
  teamId: number;
}

export default function EditPersonPage() {
  const router = useRouter();
  const { accessToken } = useAuthentication(router);
  const [person, setPerson] = useState<Person | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();

  useEffect(() => {
    if (typeof accessToken === "string" && router.isReady) {
      setLoading(true);

      const handleSuccess = (
        { data: pData }: { data: Person },
        { data: tData }: { data: Team[] },
      ) => {
        setPerson(pData);
        setTeams(tData);
      };

      Promise.all([
        api.get(`/people/${String(router.query.personId)}`, { accessToken }),
        api.get("/teams", { accessToken }),
      ])
        .then(([pResponse, tResponse]) => handleSuccess(pResponse, tResponse))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, [accessToken, router.isReady, router.query.personId, setError]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    if (typeof accessToken === "string" && person !== null) {
      const handleSuccess = () => {
        setSuccess(true);
        void router.push("/people");
      };

      event.preventDefault();
      setLoading(true);
      setError(null);

      const formData = new FormData(event.target as HTMLFormElement);
      const o = Object.fromEntries(formData) as unknown as UpdatePersonFormData;
      const data: UpdatePersonDTO = { name: o.name, teamId: Number(o.teamId) };

      api
        .put(`/people/${person.id}`, { data, accessToken })
        .then(() => handleSuccess())
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      <NextHead>
        <title>Editar Produto | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
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
          <form className="grid gap-4" onSubmit={handleSubmit}>
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
            {person !== null && (
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
                <SelectField label="Equipe" name="teamId" required>
                  <option value="">Escolha uma equipe</option>
                  {teams.map((team) => (
                    <option
                      value={team.id}
                      key={team.id}
                      selected={team.id === person.teamId}
                    >
                      {team.name} #{team.id}
                    </option>
                  ))}
                </SelectField>
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
