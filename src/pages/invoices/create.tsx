import { useEffect, useState } from "react";
import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import qs from "qs";
import { Button } from "../../components/Button";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useError } from "../../hooks/useError";
import { useSuccess } from "../../hooks/useSuccess";
import { Alert } from "../../components/Alert";
import { SelectField } from "../../components/SelectField";
import { api } from "../../services/api";
import { Label } from "../../components/Label";
import { Select } from "../../components/Select";

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

interface Product {
  id: number;
  name: string;
  value: number;
}

interface CreateInvoiceQSData {
  personId: string;
  products: string[];
}

interface CreateProductDTO {
  name: string;
  value: number;
}

interface CreateInvoiceDTO {
  personId: number;
  products: CreateProductDTO[];
}

const uuid = () => window.crypto.randomUUID();

export default function CreateInvoicePage() {
  const router = useRouter();
  const { accessToken } = useAuthentication(router);
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();
  const [teams, setTeams] = useState<Team[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [teamId, setTeamId] = useState("");
  const [amount, setAmount] = useState<string[]>([]);

  useEffect(() => {
    if (typeof accessToken !== "string") return;
    setLoading(true);

    const handleSuccess = (
      { data: tData }: { data: Team[] },
      { data: pData }: { data: Product[] },
    ) => {
      setTeams(tData);
      setProducts(pData);
    };

    Promise.all([
      api.get("/teams", { accessToken }),
      api.get("/products", { accessToken }),
    ])
      .then(([tResponse, pResponse]) => handleSuccess(tResponse, pResponse))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [accessToken, setError]);

  useEffect(() => {
    setAmount([uuid()]);
  }, []);

  const onTeamIdChange = (value: string) => {
    if (teamId === value) return;
    setTeamId(value);
    if (people.length > 0) setPeople([]);
    if (typeof accessToken !== "string") return;
    if (value === "") return;

    setLoading(true);
    const searchParams = new URLSearchParams({ teamId: value });

    api
      .get(`/people?${searchParams.toString()}`, { accessToken })
      .then((response) => setPeople(response.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (typeof accessToken !== "string") return;

    const handleSuccess = () => {
      setSuccess(true);
      void router.push("/invoices");
    };

    // 1. Create FormData instance to get form data
    // 2. Convert FormData to Array<[string, FormDataEntryValue]> to iterate
    // 3. Keep only entries with string value (not File) for typescript checker
    // 4. Create URLSearchParams instance to get querystring
    // 5. Parse querystring to complex object

    const qsData = qs.parse(
      new URLSearchParams(
        Array.from(new FormData(event.target as HTMLFormElement)).reduce<
          Array<[string, string]>
        >((a, [k, v]) => (typeof v === "string" ? [...a, [k, v]] : a), []),
      ).toString(),
    ) as unknown as CreateInvoiceQSData;

    const data: CreateInvoiceDTO = {
      personId: +qsData.personId,
      products: qsData.products.map<CreateProductDTO>((productId) => {
        const prod = products.find((p) => p.id + "" === productId) as Product;
        return { name: prod.name, value: prod.value };
      }),
    };

    setLoading(true);
    setError(null);

    api
      .post("/invoices", { data, accessToken })
      .then(() => handleSuccess())
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <NextHead>
        <title>Criar Fatura | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" asChild>
              <NextLink href="/invoices">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </NextLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">Criar Fatura</div>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="error" onClose={() => setError(null)}>
                {error.message}
              </Alert>
            )}
            {success && (
              <Alert variant="success">
                Produto criado com sucesso. Redirecionando para a listagem.
              </Alert>
            )}
            <SelectField
              label="Equipe"
              value={teamId}
              onValueChange={onTeamIdChange}
              disabled={loading || success}
              required
            >
              <option value="">Escolha uma equipe</option>
              {teams.map((team) => (
                <option value={team.id} key={team.id}>
                  {team.name} #{team.id}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Pessoa"
              name="personId"
              disabled={loading || success}
              required
            >
              <option value="">Escolha uma pessoa</option>
              {people.map((person) => (
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
                {amount.map((key, i, { length }) => (
                  <div key={key} className="flex gap-2">
                    <div className="flex-grow">
                      <Select
                        name="products[]"
                        disabled={loading || success}
                        required
                      >
                        <option value="">Escolha um produto</option>
                        {products.map((product) => (
                          <option value={product.id} key={product.id}>
                            {product.name} -{" "}
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(product.value / 100)}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setAmount(amount.filter((k) => k !== key))}
                      disabled={loading || success || (i === 0 && length === 1)}
                    >
                      <TrashIcon className="h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setAmount([...amount, uuid()])}
                  disabled={loading || success}
                >
                  <PlusIcon className="h-4" />
                </Button>
              </div>
            </div>
            <div className="grid gap-4"></div>
            <Button type="submit" disabled={loading || success}>
              Cadastrar
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
