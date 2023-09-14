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

interface Team {
  id: number;
  name: string;
}

interface UpdateTeamDTO {
  name: string;
}

export default function EditTeamPage() {
  const router = useRouter();
  const { accessToken } = useAuthentication(router);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();

  useEffect(() => {
    if (typeof accessToken === "string" && router.isReady) {
      setLoading(true);

      api
        .get(`/teams/${String(router.query.teamId)}`, { accessToken })
        .then((response) => setTeam(response.data))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, [accessToken, router.isReady, router.query.teamId, setError]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    if (typeof accessToken === "string" && team !== null) {
      const handleSuccess = () => {
        setSuccess(true);
        void router.push("/teams");
      };

      event.preventDefault();
      setLoading(true);
      setError(null);

      const formData = new FormData(event.target as HTMLFormElement);
      const data = Object.fromEntries(formData) as unknown as UpdateTeamDTO;

      api
        .put(`/teams/${team.id}`, { data, accessToken })
        .then(() => handleSuccess())
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      <NextHead>
        <title>Editar Equipe | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border shadow rounded border-gray-200 p-6 max-w-xs mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" asChild>
              <NextLink href="/teams">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </NextLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">Editar Equipe</div>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="error" onClose={() => setError(null)}>
                {error.message}
              </Alert>
            )}
            {success && (
              <Alert variant="success">
                Equipe editada com sucesso. Redirecionando para a listagem.
              </Alert>
            )}
            {team !== null && (
              <TextField
                label="Nome"
                type="text"
                name="name"
                disabled={loading || success}
                maxLength={24}
                pattern="[A-zÀ-ú0-9][A-zÀ-ú0-9 ]{1,22}[A-zÀ-ú0-9]"
                placeholder="Minibox"
                title="O nome é obrigatório e deve ser composto por até 24 caracteres sem espaço nas laterais"
                defaultValue={team.name}
                required
              />
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
