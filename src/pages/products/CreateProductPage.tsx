import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useError } from "../../hooks/useError";
import { useSuccess } from "../../hooks/useSuccess";
import { api } from "../../services/api";

interface CreateProductFormData {
  name: string;
  value: string;
}

interface CreateProductDTO {
  name: string;
  value: number;
}

export function CreateProductPage() {
  const navigate = useNavigate();
  const { accessToken } = useAuthentication();
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    if (typeof accessToken !== "string") return;
    const handleSuccess = () => {
      setSuccess(true);
      navigate("/products");
    };

    event.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(event.target as HTMLFormElement);
    const o = Object.fromEntries(fd) as unknown as CreateProductFormData;
    const data: CreateProductDTO = { ...o, value: Number(o.value) };

    api
      .post("/products", { data, accessToken })
      .then(() => handleSuccess())
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" asChild>
              <RouterLink to="/products">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </RouterLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">Criar Produto</div>
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
            <TextField
              label="Nome"
              type="text"
              name="name"
              disabled={loading || success}
              maxLength={24}
              pattern="[A-zÀ-ú0-9][A-zÀ-ú0-9 ]{1,22}[A-zÀ-ú0-9]"
              placeholder="Cuscuz com Ovo"
              title="O nome é obrigatório e deve ser composto por até 24 caracteres sem espaço nas laterais"
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
              inputMode="numeric"
              required
            />
            <Button type="submit" disabled={loading || success}>
              Cadastrar
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
