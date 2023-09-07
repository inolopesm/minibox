import NextHead from "next/head";
import NextLink from "next/link";
import knex from "knex";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { Button } from "../../components/Button";
import { Link } from "../../components/Link";
import { TextField } from "../../components/TextField";
import { useEffect, useState } from "react";
import { HttpClient } from "../../utils/HttpClient";
import { Alert } from "../../components/Alert";
import { useDebounce } from "../../hooks/useDebounce";

export async function getServerSideProps(context) {
  const { accessToken } = context.req.cookies;

  if (!accessToken) {
    return { redirect: { destination: "/signin", permanent: false } };
  }

  const db = knex({ client: "pg", connection: process.env.DATABASE_URL });

  try {
    const [{ count }] = await db("User")
      .count({ count: "*" })
      .where({ accessToken });

    if (count === "0") {
      context.res.setHeader("Set-Cookie", "accessToken=; Max-Age=0; path=/");
      return { redirect: { destination: "/signin", permanent: false } };
    }

    return { props: {} };
  } finally {
    await db.destroy();
  }
}

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    setLoading(true);

    const url = new URL("/api/products", window.location.origin);
    url.searchParams.set("query", debouncedQuery);

    HttpClient
      .get(url.toString())
      .then((response) => setProducts(response.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <>
      <NextHead>
        <title>Produtos | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow grid gap-4">
          <div className="flex justify-between items-center gap-2">
            <Button variant="secondary" asChild>
              <NextLink href="/">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </NextLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">
              Produtos
            </div>
            <div>
              <Button variant="secondary" asChild>
                <NextLink href="/products/create">
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
            placeholder="Cuscuz com Ovo"
            value={query}
            onTextChange={setQuery}
          />

          {!loading
            ? (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
                      <tr>
                        <th className="px-6 py-3">Nome</th>
                        <th className="px-6 py-3">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <Link asChild>
                              <NextLink href={`/products/${product.id}`}>
                                {product.name}
                              </NextLink>
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            {new Intl.NumberFormat("pt-BR",{
                              style: "currency",
                              currency: "BRL",
                            }).format(product.value / 100)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
              : (
                <div className="text-center text-gray-500">
                  Carregando...
                </div>
              )
            }
        </div>
      </div>
    </>
  );
}
