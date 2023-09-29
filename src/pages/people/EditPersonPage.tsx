import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { SelectField } from "../../components/SelectField";
import { TextField } from "../../components/TextField";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useError } from "../../hooks/useError";
import { useSuccess } from "../../hooks/useSuccess";
import { api } from "../../services/api";
import type { Person, Team } from "../../entities";

interface UpdatePersonFormData {
  name: string;
  teamId: string;
}

interface UpdatePersonDTO {
  name: string;
  teamId: number;
}

export function EditPersonPage() {
  const navigate = useNavigate();
  const { personId } = useParams() as { personId: string };
  const { accessToken } = useAuthentication();
  const [person, setPerson] = useState<Person | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();

  useEffect(() => {
    if (typeof accessToken !== "string") return;
    setLoading(true);

    const handleSuccess = (
      { data: pData }: { data: Person },
      { data: tData }: { data: Team[] },
    ) => {
      setPerson(pData);
      setTeams(tData);
    };

    Promise.all([
      api.get(`/people/${personId}`, { accessToken }),
      api.get("/teams", { accessToken }),
    ])
      .then(([pResponse, tResponse]) => handleSuccess(pResponse, tResponse))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [accessToken, personId, setError]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    if (typeof accessToken !== "string") return;
    if (person === null) return;

    const handleSuccess = () => {
      setSuccess(true);
      navigate("/people");
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
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border shadow rounded border-gray-200 p-6 max-w-xs mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" asChild>
              <RouterLink to="/people">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </RouterLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">Editar Pessoa</div>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="error" onClose={() => setError(null)}>
                {error.message}
              </Alert>
            )}
            {success && (
              <Alert variant="success">
                Pessoa editada com sucesso. Redirecionando para a listagem.
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
                  autoCapitalize="words"
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
