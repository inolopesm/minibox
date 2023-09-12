import { useEffect, useState } from "react";
import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { Button } from "../../components/Button";
import { Link } from "../../components/Link";
import { TextField } from "../../components/TextField";
import { Alert } from "../../components/Alert";
import { useDebounce } from "../../hooks/useDebounce";
import { api } from "../../services/api";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useError } from "../../hooks/useError";

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
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const [people, setPeople] = useState<Person[]>([]);
  const debouncedName = useDebounce(name);

  useEffect(() => {
    if (typeof accessToken === "string") {
      setLoading(true);

      const searchParams = new URLSearchParams({ name: debouncedName });

      api
        .get(`/people?${searchParams.toString()}`, { accessToken })
        .then((response) => setPeople(response.data))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, [accessToken, debouncedName, setError]);

  return (
    <>
      <NextHead>
        <title>Pessoas | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow grid gap-4">
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

          <TextField
            type="search"
            label="Busca"
            placeholder="Fulano da Silva"
            value={name}
            onTextChange={setName}
          />

          {!loading ? (
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
                  {people.map((person) => (
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
