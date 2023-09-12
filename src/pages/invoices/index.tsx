import { useEffect, useState } from "react";
import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
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

interface Product {
  id: number;
  name: string;
  value: number;
}

interface Invoice {
  id: number;
  personId: number;
  createdAt: number;
  paidAt: number | null;

  person: Person;
  products: Product[];
}

export default function InvoicesPage() {
  const router = useRouter();
  const { accessToken } = useAuthentication(router);
  const { error, setError } = useError();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (typeof accessToken === "string") {
      setLoading(true);

      api
        .get("/invoices", { accessToken })
        .then((response) => setInvoices(response.data))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, [accessToken, setError]);

  return (
    <>
      <NextHead>
        <title>Faturas | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow grid gap-4">
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

          {!loading ? (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
                  <tr>
                    <th className="px-3 py-1.5">#</th>
                    <th className="px-3 py-1.5">Pessoa</th>
                    <th className="px-3 py-1.5">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-3 py-2 font-medium text-gray-900">
                        {invoice.id}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                        {invoice.person.name} #{invoice.person.id}
                      </td>
                      <td className="px-3 py-2 text-gray-900 whitespace-nowrap">
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
