import { useEffect, useState } from "react";
import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { TextField } from "../../components/TextField";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { api } from "../../services/api";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useError } from "../../hooks/useError";
import { useSuccess } from "../../hooks/useSuccess";

interface Product {
  id: number;
  name: string;
  value: number;
}

interface UpdateProductFormData {
  name: string;
  value: number;
}

interface UpdateProductDTO {
  name: string;
  value: number;
}

export default function EditProductPage() {
  const router = useRouter();
  const { accessToken } = useAuthentication(router);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();

  useEffect(() => {
    if (typeof accessToken === "string" && router.isReady) {
      setLoading(true);

      api
        .get(`/products/${router.query.productId}`, { accessToken })
        .then((response) => setProduct(response.data))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, [accessToken, router.isReady, router.query.productId, setError]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    if (typeof accessToken === "string") {
      const handleSuccess = () => {
        setSuccess(true);
        router.push("/products");
      };

      event.preventDefault();
      setLoading(true);
      setError(null);

      const fd = new FormData(event.target as HTMLFormElement);
      const o = Object.fromEntries(fd) as unknown as UpdateProductFormData;
      const data: UpdateProductDTO = { ...o, value: Number(o.value) };

      api
        .put(`/products/${router.query.productId}`, { data, accessToken })
        .then(() => handleSuccess())
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      <NextHead>
        <title>Editar Produto | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="bg-white border shadow rounded border-gray-200 p-6 max-w-xs mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" asChild>
              <NextLink href="/products">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </NextLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">
              Editar Produto
            </div>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="error" onClose={() => setError(null)}>
                {error.message}
              </Alert>
            )}
            {success && (
              <Alert variant="success">
                Produto editado com sucesso. Redirecionando para a listagem.
              </Alert>
            )}
            {product !== null && (
              <>
                <TextField
                  label="Nome"
                  type="text"
                  name="name"
                  disabled={loading || success}
                  maxLength={24}
                  pattern="[A-zÀ-ú0-9][A-zÀ-ú0-9 ]{1,22}[A-zÀ-ú0-9]"
                  placeholder="Cuscuz com Ovo"
                  title="O nome é obrigatório e deve ser composto por até 24 caracteres sem espaço nas laterais"
                  defaultValue={product.name}
                  required
                />
                <TextField
                  label="Valor em centavos"
                  type="number"
                  name="value"
                  min="1"
                  max="99999"
                  disabled={loading || success}
                  helperText="Em centavos para ajudar a realizar cálculos precisos posteriormente"
                  title="O valor é obrigatório e deve ser um número entre 1 e 99999"
                  placeholder="350"
                  defaultValue={product.value + ""}
                  required
                />
              </>
            )}
            <Button type="submit" disabled={loading || success}>
              Salvar
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
