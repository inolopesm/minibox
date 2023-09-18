import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { useCallback, useEffect, useReducer } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { Select } from "../../components/Select";
import { useAuthentication } from "../../hooks/useAuthentication";
import { api } from "../../services/api";
import { Money } from "../../utils/Money";
import type { Invoice, InvoiceProduct, Person, Team } from "../../entities";

type PersonDTO = Person & { team: Team };
type InvoiceDTO = Invoice & { products: InvoiceProduct[]; person: PersonDTO };

interface State {
  error: Error | null;

  team: {
    items: Team[];
    loading: boolean;
    selected: string;
  };

  person: {
    items: PersonDTO[];
    loading: boolean;
    selected: string;
  };

  invoice: {
    items: InvoiceDTO[];
    loading: boolean;
    paid: string;
  };
}

const initialState: State = {
  error: null,
  team: { items: [], loading: false, selected: "" },
  person: { items: [], loading: false, selected: "" },
  invoice: { items: [], loading: false, paid: "" },
};

type Action =
  | { type: "TEAMS/PENDING" }
  | { type: "TEAMS/FULFILLED"; payload: Team[] }
  | { type: "TEAMS/REJECTED"; payload: Error }
  | { type: "TEAMS/SELECT"; payload: string }
  | { type: "PEOPLE/PENDING" }
  | { type: "PEOPLE/FULFILLED"; payload: PersonDTO[] }
  | { type: "PEOPLE/REJECTED"; payload: Error }
  | { type: "PEOPLE/SELECT"; payload: string }
  | { type: "INVOICES/PENDING" }
  | { type: "INVOICES/FULFILLED"; payload: InvoiceDTO[] }
  | { type: "INVOICES/REJECTED"; payload: Error }
  | { type: "INVOICES/PAID"; payload: string }
  | { type: "CLEAR_ERROR" };

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

  if (action.type === "TEAMS/SELECT") {
    const { payload: selected } = action;
    return { ...state, team: { ...state.team, selected } };
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

  if (action.type === "PEOPLE/SELECT") {
    const { payload: selected } = action;
    return { ...state, person: { ...state.person, selected } };
  }

  if (action.type === "INVOICES/PENDING") {
    return { ...state, invoice: { ...state.invoice, loading: true } };
  }

  if (action.type === "INVOICES/FULFILLED") {
    const { payload: items } = action;
    return { ...state, invoice: { ...state.invoice, loading: false, items } };
  }

  if (action.type === "INVOICES/REJECTED") {
    const { payload: error } = action;
    return { ...state, error, invoice: { ...state.invoice, loading: false } };
  }

  if (action.type === "INVOICES/PAID") {
    const { payload: paid } = action;
    return { ...state, invoice: { ...state.invoice, paid } };
  }

  if (action.type === "CLEAR_ERROR") {
    return { ...state, error: null };
  }

  return state;
}

export function InvoicesPage() {
  const { accessToken } = useAuthentication();
  const [state, dispatch] = useReducer(reducer, initialState);

  const calculateSubTotal = useCallback(
    (products: InvoiceProduct[]) =>
      products.reduce((value, product) => value + product.value, 0),
    [],
  );

  const calculateTotal = useCallback(
    (invoices: InvoiceDTO[]) =>
      invoices.reduce(
        (value, invoice) => value + calculateSubTotal(invoice.products),
        0,
      ),
    [calculateSubTotal],
  );

  useEffect(() => {
    if (typeof accessToken !== "string") return;
    dispatch({ type: "INVOICES/PENDING" });

    const searchParams = new URLSearchParams();

    if (state.team.selected !== "")
      searchParams.set("teamId", state.team.selected);

    if (state.person.selected !== "")
      searchParams.set("personId", state.person.selected);

    if (state.invoice.paid !== "") searchParams.set("paid", state.invoice.paid);

    api
      .get(`/invoices?${searchParams.toString()}`, { accessToken })
      .then(({ data }) =>
        dispatch({ type: "INVOICES/FULFILLED", payload: data }),
      )
      .catch((err) => dispatch({ type: "INVOICES/REJECTED", payload: err }));
  }, [
    accessToken,
    state.team.selected,
    state.person.selected,
    state.invoice.paid,
  ]);

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

    const searchParams = new URLSearchParams();

    if (state.team.selected !== "")
      searchParams.set("teamId", state.team.selected);

    api
      .get(`/people?${searchParams.toString()}`, { accessToken })
      .then(({ data }) => dispatch({ type: "PEOPLE/FULFILLED", payload: data }))
      .catch((err) => dispatch({ type: "PEOPLE/REJECTED", payload: err }));
  }, [accessToken, state.team.selected]);

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
            <div className="font-bold text-gray-900 text-xl">Faturas</div>
            <div>
              <Button variant="secondary" asChild>
                <RouterLink to="/invoices/create">
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

          <div className="grid gap-2 sm:grid-cols-3">
            <Select
              value={state.team.selected}
              disabled={state.team.loading || state.invoice.loading}
              onValueChange={(value) =>
                dispatch({ type: "TEAMS/SELECT", payload: value })
              }
            >
              <option value="">Todas as equipes</option>
              {state.team.items.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
            <Select
              value={state.person.selected}
              disabled={
                state.team.loading ||
                state.person.loading ||
                state.invoice.loading
              }
              onValueChange={(value) =>
                dispatch({ type: "PEOPLE/SELECT", payload: value })
              }
            >
              <option value="">Todas as pessoas</option>
              {state.person.items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
            <Select
              value={state.invoice.paid}
              disabled={state.invoice.loading}
              onValueChange={(value) =>
                dispatch({ type: "INVOICES/PAID", payload: value })
              }
            >
              <option value="">Pagos e Não Pagos</option>
              <option value="true">Pagos</option>
              <option value="false">Não Pagos</option>
            </Select>
          </div>

          {state.invoice.loading ? (
            <div className="text-center text-gray-500">Carregando...</div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
                  <tr>
                    <th className="px-3 py-1.5">#</th>
                    <th className="px-3 py-1.5">Equipe</th>
                    <th className="px-3 py-1.5">Pessoa</th>
                    <th className="px-3 py-1.5">Total</th>
                    <th className="px-3 py-1.5 text-center">Pago</th>
                    <th className="px-3 py-1.5 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="text-gray-900">
                  {state.invoice.items.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-3 py-2 font-medium">{invoice.id}</td>
                      <td className="px-3 py-2">{invoice.person.team.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {invoice.person.name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {Money.format(
                          Money.centavosToReal(
                            calculateSubTotal(invoice.products),
                          ),
                        )}
                      </td>
                      <td className="px-3 py-2 text-green-600 text-center">
                        {invoice.paidAt !== null && (
                          <CheckIcon className="inline-block h-4" />
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <Button variant="secondary" asChild>
                          <RouterLink to={`/invoices/${invoice.id}`}>
                            <EyeIcon className="h-4" />
                          </RouterLink>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 text-gray-700 uppercase">
                  <tr>
                    <td
                      className="px-3 py-1.5 font-bold text-right"
                      colSpan={3}
                    >
                      Total
                    </td>
                    <td className="px-3 py-1.5 font-bold" colSpan={3}>
                      {Money.format(
                        Money.centavosToReal(
                          calculateTotal(state.invoice.items),
                        ),
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
