import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { Link } from "../../components/Link";
import { TextField } from "../../components/TextField";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useDebounce } from "../../hooks/useDebounce";
import { useError } from "../../hooks/useError";
import { api } from "../../services/api";
import { Money } from "../../utils/Money";
import type { Product } from "../../entities";

export function ProductsPage() {
  const { accessToken } = useAuthentication();
  const { error, setError } = useError();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const debouncedName = useDebounce(name);

  useEffect(() => {
    if (typeof accessToken !== "string") return;
    setLoading(true);

    const searchParams = new URLSearchParams({ name: debouncedName });

    api
      .get(`/products?${searchParams.toString()}`, { accessToken })
      .then((response) => setProducts(response.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [accessToken, debouncedName, setError]);

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
            <div className="font-bold text-gray-900 text-xl">Produtos</div>
            <div>
              <Button variant="secondary" asChild>
                <RouterLink to="/products/create">
                  <PlusIcon className="h-4 inline-block align-[-0.1875rem]" />
                </RouterLink>
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
            value={name}
            onTextChange={setName}
            maxLength={48}
          />

          {!loading ? (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
                  <tr>
                    <th className="px-3 py-1.5">#</th>
                    <th className="px-3 py-1.5">Nome</th>
                    <th className="px-3 py-1.5">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-3 py-2 font-medium text-gray-900">
                        {product.id}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                        <Link asChild>
                          <RouterLink to={`/products/${product.id}`}>
                            {product.name}
                          </RouterLink>
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-gray-900 whitespace-nowrap">
                        {Money.format(Money.centavosToReal(product.value))}
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
