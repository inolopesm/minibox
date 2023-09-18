import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { useEffect, useReducer } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { Label } from "../../components/Label";
import { Select } from "../../components/Select";
import { SelectField } from "../../components/SelectField";
import { useAuthentication } from "../../hooks/useAuthentication";
import { api } from "../../services/api";
import { Money } from "../../utils/Money";
import type { Person, Product, Team } from "../../entities";

type PersonDTO = Person & { team: Team };

interface CreateInvoiceProductFormData {
  id: string;
  productId: string;
  name: string;
  value: number;
}

interface CreateInvoiceProductDTO {
  name: string;
  value: number;
}

interface CreateInvoiceDTO {
  personId: number;
  products: CreateInvoiceProductDTO[];
}

interface State {
  error: Error | null;
  loading: boolean;
  success: boolean;

  teams: Team[];
  people: PersonDTO[];
  products: Product[];

  teamId: string;
  personId: string;
  invoice: { products: CreateInvoiceProductFormData[] };
}

const uuid = () => window.crypto.randomUUID();

const createInvoiceProduct = (): CreateInvoiceProductFormData => ({
  id: uuid(),
  productId: "",
  name: "",
  value: 0,
});

const initialState: State = {
  error: null,
  loading: false,
  success: false,

  teams: [],
  people: [],
  products: [],

  teamId: "",
  personId: "",
  invoice: { products: [createInvoiceProduct()] },
};

type Action =
  | { type: "FETCH/PENDING" }
  | { type: "FETCH/FULFILLED"; payload: { teams: Team[]; products: Product[] } }
  | { type: "FETCH/REJECTED"; payload: { error: Error } }
  | { type: "TEAM/UNSELECT" }
  | { type: "TEAM/SELECT"; payload: { teamId: string } }
  | { type: "PEOPLE/FULFILLED"; payload: { people: PersonDTO[] } }
  | { type: "PEOPLE/REJECTED"; payload: { error: Error } }
  | { type: "PEOPLE/SELECT"; payload: { personId: string } }
  | { type: "PRODUCTS/CREATE" }
  | { type: "PRODUCTS/UPDATE"; payload: { index: number; productId: string } }
  | { type: "PRODUCTS/REMOVE"; payload: { index: number } }
  | { type: "FORM/PENDING" }
  | { type: "FORM/FULFILLED" }
  | { type: "FORM/REJECTED"; payload: { error: Error } }
  | { type: "CLEAR_ERROR" };

function reducer(state: State, action: Action): State {
  if (action.type === "FETCH/PENDING") {
    return { ...state, loading: true };
  }

  if (action.type === "FETCH/FULFILLED") {
    return { ...state, ...action.payload, loading: false };
  }

  if (action.type === "FETCH/REJECTED") {
    return { ...state, error: action.payload.error, loading: false };
  }

  if (action.type === "TEAM/UNSELECT") {
    return { ...state, teamId: "", people: [], personId: "" };
  }

  if (action.type === "TEAM/SELECT") {
    return { ...state, teamId: action.payload.teamId, loading: true };
  }

  if (action.type === "PEOPLE/FULFILLED") {
    return { ...state, people: action.payload.people, loading: false };
  }

  if (action.type === "PEOPLE/REJECTED") {
    return { ...state, error: action.payload.error, loading: false };
  }

  if (action.type === "PEOPLE/SELECT") {
    return { ...state, personId: action.payload.personId };
  }

  if (action.type === "PRODUCTS/CREATE") {
    return {
      ...state,
      invoice: {
        ...state.invoice,
        products: [...state.invoice.products, createInvoiceProduct()],
      },
    };
  }

  if (action.type === "PRODUCTS/UPDATE") {
    const productId = Number(action.payload.productId);
    const product = state.products.find((p) => p.id === productId);
    if (!product) return { ...state, error: new Error("Product not found") };

    state.invoice.products[action.payload.index] = {
      id: uuid(),
      name: product.name,
      value: product.value,
      productId: action.payload.productId,
    };

    return {
      ...state,
      invoice: { ...state.invoice, products: [...state.invoice.products] },
    };
  }

  if (action.type === "PRODUCTS/REMOVE") {
    state.invoice.products.splice(action.payload.index, 1);

    return {
      ...state,
      invoice: { ...state.invoice, products: [...state.invoice.products] },
    };
  }

  if (action.type === "FORM/PENDING") {
    return { ...state, loading: true, error: null };
  }

  if (action.type === "FORM/FULFILLED") {
    return { ...state, loading: false, success: true };
  }

  if (action.type === "FORM/REJECTED") {
    return { ...state, loading: false, error: action.payload.error };
  }

  if (action.type === "CLEAR_ERROR") {
    return { ...state, error: null };
  }

  return state;
}

export function CreateInvoicePage() {
  const navigate = useNavigate();
  const { accessToken } = useAuthentication();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (typeof accessToken !== "string") return;
    dispatch({ type: "FETCH/PENDING" });

    Promise.all([
      api.get("/teams", { accessToken }),
      api.get("/products", { accessToken }),
    ])
      .then(([{ data: teams }, { data: products }]) =>
        dispatch({ type: "FETCH/FULFILLED", payload: { teams, products } }),
      )
      .catch((error) =>
        dispatch({ type: "FETCH/REJECTED", payload: { error } }),
      );
  }, [accessToken]);

  useEffect(() => {
    if (state.error) {
      window.scroll({ left: 0, top: 0, behavior: "smooth" });
    }
  }, [state.error]);

  useEffect(() => {
    if (state.loading) {
      window.scroll({ left: 0, top: 0, behavior: "smooth" });
    }
  }, [state.loading]);

  const handleTeamChange = (value: string) => {
    if (typeof accessToken !== "string") return;

    if (value === "") {
      dispatch({ type: "TEAM/UNSELECT" });
      return;
    }

    dispatch({ type: "TEAM/SELECT", payload: { teamId: value } });

    const searchParams = new URLSearchParams({ teamId: value });

    api
      .get(`/people?${searchParams.toString()}`, { accessToken })
      .then(({ data: people }) =>
        dispatch({ type: "PEOPLE/FULFILLED", payload: { people } }),
      )
      .catch((error) =>
        dispatch({ type: "PEOPLE/REJECTED", payload: { error } }),
      );
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (typeof accessToken !== "string") return;
    const { products } = state.invoice;

    const data: CreateInvoiceDTO = {
      personId: Number(state.personId),
      products: products.map(({ name, value }) => ({ name, value })),
    };

    dispatch({ type: "FORM/PENDING" });

    api
      .post("/invoices", { data, accessToken })
      .then(() => {
        dispatch({ type: "FORM/FULFILLED" });
        navigate("/invoices");
      })
      .catch((error) => {
        dispatch({ type: "FORM/REJECTED", payload: { error } });
      });
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" asChild>
              <RouterLink to="/invoices">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </RouterLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">Criar Fatura</div>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {state.error && (
              <Alert
                variant="error"
                onClose={() => dispatch({ type: "CLEAR_ERROR" })}
              >
                {state.error.message}
              </Alert>
            )}
            {state.success && (
              <Alert variant="success">
                Produto criado com sucesso. Redirecionando para a listagem.
              </Alert>
            )}
            <SelectField
              label="Equipe"
              value={state.teamId}
              onValueChange={handleTeamChange}
              disabled={state.loading || state.success}
              required
            >
              <option value="">Escolha uma equipe</option>
              {state.teams.map((team) => (
                <option value={team.id} key={team.id}>
                  {team.name} #{team.id}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Pessoa"
              value={state.personId}
              disabled={state.loading || state.success}
              onValueChange={(value) =>
                dispatch({
                  type: "PEOPLE/SELECT",
                  payload: { personId: value },
                })
              }
              required
            >
              <option value="">Escolha uma pessoa</option>
              {state.people.map((person) => (
                <option value={person.id} key={person.id}>
                  {person.name} #{person.id}
                </option>
              ))}
            </SelectField>
            <div>
              <Label asChild>
                <div>Produtos</div>
              </Label>
              <div className="grid gap-2">
                {state.invoice.products.map((invoiceProduct, i, { length }) => (
                  <div key={invoiceProduct.id} className="flex gap-2">
                    <div className="flex-grow">
                      <Select
                        value={invoiceProduct.productId}
                        onValueChange={(value) =>
                          dispatch({
                            type: "PRODUCTS/UPDATE",
                            payload: { index: i, productId: value },
                          })
                        }
                        disabled={state.loading || state.success}
                        required
                      >
                        <option value="">Escolha um produto</option>
                        {state.products.map((product) => (
                          <option value={product.id} key={product.id}>
                            {product.name} -{" "}
                            {Money.format(Money.centavosToReal(product.value))}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        dispatch({
                          type: "PRODUCTS/REMOVE",
                          payload: {
                            index: i,
                          },
                        })
                      }
                      disabled={
                        state.loading ||
                        state.success ||
                        (i === 0 && length === 1)
                      }
                    >
                      <TrashIcon className="h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => dispatch({ type: "PRODUCTS/CREATE" })}
                  disabled={state.loading || state.success}
                >
                  <PlusIcon className="h-4" />
                </Button>
              </div>
            </div>
            <div className="grid gap-4"></div>
            <Button type="submit" disabled={state.loading || state.success}>
              Cadastrar
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
