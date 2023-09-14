import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { Link } from "../../components/Link";
import { SelectField } from "../../components/SelectField";
import { TextField } from "../../components/TextField";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useDebounce } from "../../hooks/useDebounce";
import { useError } from "../../hooks/useError";
import { api } from "../../services/api";

interface Team {
  id: number;
  name: string;
}

interface Person {
  id: number;
  name: string;
  teamId: number;
  team: Team;
}

export default function PeoplePage() {
  const router = useRouter();
  const { accessToken } = useAuthentication(router);

  const [name, setName] = useState("");
  const debouncedName = useDebounce(name);

  const { error, setError } = useError();

  const [team, setTeam] = useState<{
    items: Team[];
    loading: boolean;
    id: string;
  }>({
    items: [],
    loading: false,
    id: "",
  });

  const [person, setPerson] = useState<{
    items: Person[];
    loading: boolean;
    id: string;
  }>({
    items: [],
    loading: false,
    id: "",
  });

  useEffect(() => {
    if (typeof accessToken !== "string") return;
    setTeam((t) => ({ ...t, loading: true }));
    setPerson((p) => ({ ...p, id: "" }));

    api
      .get("/teams", { accessToken })
      .then(({ data }) => setTeam((t) => ({ ...t, items: data })))
      .catch((err) => setError(err))
      .finally(() => setTeam((t) => ({ ...t, loading: false })));
  }, [accessToken, setError]);

  useEffect(() => {
    if (typeof accessToken !== "string") return;
    setPerson((p) => ({ ...p, loading: true }));
    const searchParams = new URLSearchParams({ name: debouncedName });
    if (team.id !== "") searchParams.set("teamId", team.id);

    api
      .get(`/people?${searchParams.toString()}`, { accessToken })
      .then(({ data }) => setPerson((p) => ({ ...p, items: data })))
      .catch((err) => setError(err))
      .finally(() => setPerson((p) => ({ ...p, loading: false })));
  }, [accessToken, debouncedName, team.id, setError]);

  return (
    <>
      <NextHead>
        <title>Pessoas | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border border-gray-200 max-w-2xl mx-auto p-6 rounded shadow grid gap-4">
          <div className="flex justify-between items-center gap-2">
            <Button variant="secondary" asChild>
              <NextLink href="/">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </NextLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">Pessoas</div>
            <div>
              <Button variant="secondary" asChild>
                <NextLink href="/people/create">
                  <PlusIcon className="h-4 inline-block align-[-0.1875rem]" />
                </NextLink>
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="error" onClose={() => setError(null)}>
              {error.message}
            </Alert>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            <SelectField
              label="Equipe"
              value={team.id}
              onValueChange={(id) => setTeam((t) => ({ ...t, id }))}
            >
              <option value="">Todas as equipes</option>
              {team.items.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </SelectField>
            <TextField
              label="Nome"
              type="search"
              placeholder="Fulano da Silva"
              value={name}
              onTextChange={setName}
            />
          </div>

          {!person.loading ? (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
                  <tr>
                    <th className="px-3 py-1.5">#</th>
                    <th className="px-3 py-1.5">Nome</th>
                    <th className="px-3 py-1.5">Equipe</th>
                  </tr>
                </thead>
                <tbody>
                  {person.items.map((person) => (
                    <tr key={person.id}>
                      <td className="px-3 py-2 font-medium text-gray-900">
                        {person.id}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                        <Link asChild>
                          <NextLink href={`/people/${person.id}`}>
                            {person.name}
                          </NextLink>
                        </Link>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {person.team.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500">Carregando...</div>
          )}
        </div>
      </div>
    </>
  );
}
