import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { Label } from "../../components/Label";
import { Select } from "../../components/Select";
import { SelectField } from "../../components/SelectField";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useError } from "../../hooks/useError";
import { useSuccess } from "../../hooks/useSuccess";
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

interface Product {
  id: number;
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

type CreateInvoiceProductDTOWithIds = CreateInvoiceProductDTO & {
  _id: string;
  id: number;
};

const uuid = () => window.crypto.randomUUID();

const createInvoiceProduct = (): CreateInvoiceProductDTOWithIds => ({
  _id: uuid(),
  id: -1,
  name: "",
  value: 0,
});

export default function CreateInvoicePage() {
  const router = useRouter();
  const { accessToken } = useAuthentication(router);

  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();

  const [teams, setTeams] = useState<Team[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [people, setPeople] = useState<Person[]>([]);

  const [team, setTeam] = useState<Team | null>(null);
  const [person, setPerson] = useState<Person | null>(null);

  const [invoiceProducts, setInvoiceProducts] = useState<
    CreateInvoiceProductDTOWithIds[]
  >([]);

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
    setInvoiceProducts([createInvoiceProduct()]);
  }, []);

  const handleTeamChange = (value: string) => {
    if (value === "") {
      setTeam(null);
      if (people.length > 0) setPeople([]);
      if (person !== null) setPerson(null);
      return;
    }

    const teamId = Number(value);
    const team = teams.find((t) => t.id === teamId);
    if (!team) throw new Error(`Team (${teamId}) not found`);
    setTeam(team);

    if (typeof accessToken !== "string") return;

    setLoading(true);
    const searchParams = new URLSearchParams({ teamId: value });

    api
      .get(`/people?${searchParams.toString()}`, { accessToken })
      .then((response) => setPeople(response.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  const handlePersonChange = (value: string) => {
    const personId = Number(value);
    const person = people.find((p) => p.id === personId);
    if (!person) throw new Error(`Person (${personId}) not found`);
    setPerson(person);
  };

  const handleInvoiceProductChange = (i: number) => (value: string) => {
    const invoiceProduct = invoiceProducts.at(i);

    if (invoiceProduct === undefined)
      throw new Error(`Invoice Product (${i}) not found`);

    const productId = Number(value);
    const product = products.find((p) => p.id === productId);

    if (product === undefined)
      throw new Error(`Product (${productId}) not found`);

    invoiceProduct.id = product.id;
    invoiceProduct.name = product.name;
    invoiceProduct.value = product.value;

    setInvoiceProducts(structuredClone(invoiceProducts));
  };

  const handleRemoveInvoiceProduct = (i: number) => () => {
    invoiceProducts.splice(i, 1);
    setInvoiceProducts(structuredClone(invoiceProducts));
  };

  const handleCreateInvoiceProduct = () => {
    invoiceProducts.push(createInvoiceProduct());
    setInvoiceProducts(structuredClone(invoiceProducts));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (typeof accessToken !== "string") return;

    if (team === null) {
      setError(new Error("Por favor escolha uma equipe"));
      return;
    }

    if (person === null) {
      setError(new Error("Por favor escolha uma pessoa"));
      return;
    }

    const invoiceProductDTOs = invoiceProducts
      .filter((ip) => ip.name !== "")
      .map<CreateInvoiceProductDTO>(({ name, value }) => ({ name, value }));

    const data: CreateInvoiceDTO = {
      personId: person.id,
      products: invoiceProductDTOs,
    };

    const handleSuccess = () => {
      setSuccess(true);
      void router.push("/invoices");
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
              value={team?.id ?? ""}
              onValueChange={handleTeamChange}
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
              value={person?.id ?? ""}
              onValueChange={handlePersonChange}
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
                {invoiceProducts.map((invoiceProduct, i, { length }) => (
                  <div key={invoiceProduct.id} className="flex gap-2">
                    <div className="flex-grow">
                      <Select
                        value={invoiceProduct.id}
                        onValueChange={handleInvoiceProductChange(i)}
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
                      onClick={handleRemoveInvoiceProduct(i)}
                      disabled={loading || success || (i === 0 && length === 1)}
                    >
                      <TrashIcon className="h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCreateInvoiceProduct}
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
