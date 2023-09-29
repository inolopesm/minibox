import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { SelectField } from "../../components/SelectField";
import { TextField } from "../../components/TextField";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useError } from "../../hooks/useError";
import { useSuccess } from "../../hooks/useSuccess";
import { api } from "../../services/api";
import type { Team } from "../../entities";

interface CreatePersonFormData {
  name: string;
  teamId: string;
}

interface CreatePersonDTO {
  name: string;
  teamId: number;
}

export function CreatePersonPage() {
  const navigate = useNavigate();
  const { accessToken } = useAuthentication();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();

  useEffect(() => {
    if (typeof accessToken !== "string") return;
    setLoading(true);

    api
      .get("/teams", { accessToken })
      .then((response) => setTeams(response.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [accessToken, setError]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    if (typeof accessToken !== "string") return;

    const handleSuccess = () => {
      setSuccess(true);
      navigate("/people");
    };

    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.target as HTMLFormElement);
    const o = Object.fromEntries(formData) as unknown as CreatePersonFormData;
    const data: CreatePersonDTO = { name: o.name, teamId: Number(o.teamId) };

    api
      .post("/people", { data, accessToken })
      .then(() => handleSuccess())
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" asChild>
              <RouterLink to="/people">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </RouterLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">Criar Pessoa</div>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
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
              autoCapitalize="words"
              required
            />
            <SelectField label="Equipe" name="teamId" required>
              <option value="">Escolha uma equipe</option>
              {teams.map((team) => (
                <option value={team.id} key={team.id}>
                  {team.name} #{team.id}
                </option>
              ))}
            </SelectField>
            <Button type="submit" disabled={loading || success}>
              Cadastrar
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
