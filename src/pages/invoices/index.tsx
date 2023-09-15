import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { Select } from "../../components/Select";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useError } from "../../hooks/useError";
import { api } from "../../services/api";
import type { Invoice, InvoiceProduct, Person, Team } from "../../entities";

export type PersonDTO = Person & { team: Team };

export type InvoiceDTO = Invoice & {
  products: InvoiceProduct[];
  person: PersonDTO;
};

export default function InvoicesPage() {
  const router = useRouter();
  const { accessToken } = useAuthentication(router);
  const { error, setError } = useError();
  const [paid, setPaid] = useState("");

  const [invoice, setInvoice] = useState<{
    items: InvoiceDTO[];
    loading: boolean;
  }>({
    items: [],
    loading: false,
  });

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
    items: PersonDTO[];
    loading: boolean;
    id: string;
  }>({
    items: [],
    loading: false,
    id: "",
  });

  useEffect(() => {
    if (typeof accessToken !== "string") return;
    setInvoice((i) => ({ ...i, loading: true }));

    const searchParams = new URLSearchParams();
    if (team.id !== "") searchParams.set("teamId", team.id);
    if (person.id !== "") searchParams.set("personId", person.id);
    if (paid !== "") searchParams.set("paid", paid);

    api
      .get(`/invoices?${searchParams.toString()}`, { accessToken })
      .then(({ data }) => setInvoice((i) => ({ ...i, items: data })))
      .catch((err) => setError(err))
      .finally(() => setInvoice((i) => ({ ...i, loading: false })));
  }, [accessToken, team.id, person.id, paid, setError]);

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

    const searchParams = new URLSearchParams();
    if (team.id !== "") searchParams.set("teamId", team.id);

    api
      .get(`/people?${searchParams.toString()}`, { accessToken })
      .then(({ data }) => setPerson((p) => ({ ...p, items: data })))
      .catch((err) => setError(err))
      .finally(() => setPerson((p) => ({ ...p, loading: false })));
  }, [accessToken, team.id, setError]);

  return (
    <>
      <NextHead>
        <title>Faturas | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border border-gray-200 max-w-2xl mx-auto p-6 rounded shadow grid gap-4">
          <div className="flex justify-between items-center gap-2">
            <Button variant="secondary" asChild>
              <NextLink href="/">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </NextLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">Faturas</div>
            <div>
              <Button variant="secondary" asChild>
                <NextLink href="/invoices/create">
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

          <div className="grid gap-2 sm:grid-cols-3">
            <Select
              value={team.id}
              onValueChange={(id) => setTeam((t) => ({ ...t, id }))}
            >
              <option value="">Todas as equipes</option>
              {team.items.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
            <Select
              value={person.id}
              onValueChange={(id) => setPerson((p) => ({ ...p, id }))}
            >
              <option value="">Todas as pessoas</option>
              {person.items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
            <Select value={paid} onValueChange={setPaid}>
              <option value="">Pagos e Não Pagos</option>
              <option value="true">Pagos</option>
              <option value="false">Não Pagos</option>
            </Select>
          </div>

          {!invoice.loading ? (
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
                  {invoice.items.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-3 py-2 font-medium">{invoice.id}</td>
                      <td className="px-3 py-2">{invoice.person.team.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {invoice.person.name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(
                          invoice.products.reduce(
                            (value, product) => value + product.value,
                            0,
                          ) / 100,
                        )}
                      </td>
                      <td className="px-3 py-2 text-green-600 text-center">
                        {invoice.paidAt !== null && (
                          <CheckIcon className="inline-block h-4" />
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <Button variant="secondary" asChild>
                          <NextLink href={`/invoices/${invoice.id}`}>
                            <EyeIcon className="h-4" />
                          </NextLink>
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
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(
                        invoice.items.reduce(
                          (total, i) =>
                            total +
                            i.products.reduce(
                              (subtotal, p) => subtotal + p.value,
                              0,
                            ),
                          0,
                        ) / 100,
                      )}
                    </td>
                  </tr>
                </tfoot>
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
