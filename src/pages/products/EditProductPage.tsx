import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useError } from "../../hooks/useError";
import { useSuccess } from "../../hooks/useSuccess";
import { api } from "../../services/api";
import type { Product } from "../../entities";

interface UpdateProductFormData {
  name: string;
  value: string;
}

interface UpdateProductDTO {
  name: string;
  value: number;
}

export function EditProductPage() {
  const navigate = useNavigate();
  const { productId } = useParams() as { productId: string };
  const { accessToken } = useAuthentication();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();

  useEffect(() => {
    if (typeof accessToken !== "string") return;
    setLoading(true);

    api
      .get(`/products/${productId}`, { accessToken })
      .then((response) => setProduct(response.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [accessToken, productId, setError]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    if (typeof accessToken === "string" && product !== null) {
      const handleSuccess = () => {
        setSuccess(true);
        navigate("/products");
      };

      event.preventDefault();
      setLoading(true);
      setError(null);

      const fd = new FormData(event.target as HTMLFormElement);
      const o = Object.fromEntries(fd) as unknown as UpdateProductFormData;
      const data: UpdateProductDTO = { ...o, value: Number(o.value) };

      api
        .put(`/products/${product.id}`, { data, accessToken })
        .then(() => handleSuccess())
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border shadow rounded border-gray-200 p-6 max-w-xs mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" asChild>
              <RouterLink to="/products">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </RouterLink>
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
                  defaultValue={product.value}
                  inputMode="numeric"
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
