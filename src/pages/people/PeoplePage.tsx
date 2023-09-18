import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { useEffect, useReducer } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { Link } from "../../components/Link";
import { SelectField } from "../../components/SelectField";
import { TextField } from "../../components/TextField";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useDebounce } from "../../hooks/useDebounce";
import { api } from "../../services/api";
import type { Person, Team } from "../../entities";

interface State {
  name: string;
  error: Error | null;

  team: {
    items: Team[];
    loading: boolean;
    selected: string;
  };

  person: {
    items: Array<Person & { team: Team }>;
    loading: boolean;
  };
}

const initialState: State = {
  name: "",
  error: null,
  team: { items: [], loading: false, selected: "" },
  person: { items: [], loading: false },
};

type Action =
  | { type: "TEAMS/PENDING" }
  | { type: "TEAMS/FULFILLED"; payload: Team[] }
  | { type: "TEAMS/REJECTED"; payload: Error }
  | { type: "PEOPLE/PENDING" }
  | { type: "PEOPLE/FULFILLED"; payload: Array<Person & { team: Team }> }
  | { type: "PEOPLE/REJECTED"; payload: Error }
  | { type: "CLEAR_ERROR" }
  | { type: "SELECT"; payload: string }
  | { type: "SEARCH"; payload: string };

function reducer(state: State, action: Action): State {
  if (action.type === "TEAMS/PENDING") {
    return { ...state, team: { ...state.team, loading: true } };
  }

  if (action.type === "TEAMS/FULFILLED") {
    const { payload: items } = action;
    return { ...state, team: { ...state.team, loading: false, items } };
  }

  if (action.type === "TEAMS/REJECTED") {
    const { payload: error } = action;
    return { ...state, error, team: { ...state.team, loading: false } };
  }

  if (action.type === "PEOPLE/PENDING") {
    return { ...state, person: { ...state.person, loading: true } };
  }

  if (action.type === "PEOPLE/FULFILLED") {
    const { payload: items } = action;
    return { ...state, person: { ...state.person, loading: false, items } };
  }

  if (action.type === "PEOPLE/REJECTED") {
    const { payload: error } = action;
    return { ...state, error, person: { ...state.person, loading: false } };
  }

  if (action.type === "CLEAR_ERROR") {
    return { ...state, error: null };
  }

  if (action.type === "SELECT") {
    const { payload: selected } = action;
    return { ...state, team: { ...state.team, selected } };
  }

  return state;
}

export function PeoplePage() {
  const { accessToken } = useAuthentication();
  const [state, dispatch] = useReducer(reducer, initialState);
  const debouncedName = useDebounce(state.name);

  useEffect(() => {
    if (typeof accessToken !== "string") return;
    dispatch({ type: "TEAMS/PENDING" });

    api
      .get("/teams", { accessToken })
      .then(({ data }) => dispatch({ type: "TEAMS/FULFILLED", payload: data }))
      .catch((err) => dispatch({ type: "TEAMS/REJECTED", payload: err }));
  }, [accessToken]);

  useEffect(() => {
    if (typeof accessToken !== "string") return;
    dispatch({ type: "PEOPLE/PENDING" });

    const searchParams = new URLSearchParams({ name: debouncedName });

    if (state.team.selected !== "")
      searchParams.set("teamId", state.team.selected);

    api
      .get(`/people?${searchParams.toString()}`, { accessToken })
      .then(({ data }) => dispatch({ type: "PEOPLE/FULFILLED", payload: data }))
      .catch((err) => dispatch({ type: "PEOPLE/REJECTED", payload: err }));
  }, [accessToken, debouncedName, state.team.selected]);

  useEffect(() => {
    if (state.error) {
      window.scroll({ left: 0, top: 0, behavior: "smooth" });
    }
  }, [state.error]);

  return (
    <>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border border-gray-200 max-w-2xl mx-auto p-6 rounded shadow grid gap-4">
          <div className="flex justify-between items-center gap-2">
            <Button variant="secondary" asChild>
              <RouterLink to="/">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </RouterLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">Pessoas</div>
            <div>
              <Button variant="secondary" asChild>
                <RouterLink to="/people/create">
                  <PlusIcon className="h-4 inline-block align-[-0.1875rem]" />
                </RouterLink>
              </Button>
            </div>
          </div>

          {state.error && (
            <Alert
              variant="error"
              onClose={() => dispatch({ type: "CLEAR_ERROR" })}
            >
              {state.error.message}
            </Alert>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            <SelectField
              label="Equipe"
              value={state.team.selected}
              onValueChange={(payload) => dispatch({ type: "SELECT", payload })}
              disabled={state.team.loading}
            >
              <option value="">Todas as equipes</option>
              {state.team.items.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </SelectField>
            <TextField
              label="Nome"
              type="search"
              placeholder="Fulano da Silva"
              value={state.name}
              onTextChange={(payload) => dispatch({ type: "SEARCH", payload })}
            />
          </div>

          {state.person.loading ? (
            <div className="text-center text-gray-500">Carregando...</div>
          ) : (
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
                  {state.person.items.map((person) => (
                    <tr key={person.id}>
                      <td className="px-3 py-2 font-medium text-gray-900">
                        {person.id}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                        <Link asChild>
                          <RouterLink to={`/people/${person.id}`}>
                            {person.name}
                          </RouterLink>
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
          )}
        </div>
      </div>
    </>
  );
}
