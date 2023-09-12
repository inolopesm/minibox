import { useState } from "react";
import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { TextField } from "../../components/TextField";
import { api } from "../../services/api";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useError } from "../../hooks/useError";
import { useSuccess } from "../../hooks/useSuccess";

interface CreateProductFormData {
  name: string;
  value: number;
}

interface CreateProductDTO {
  name: string;
  value: number;
}

export default function CreateProductPage() {
  const router = useRouter();
  const { accessToken } = useAuthentication(router);
  const [loading, setLoading] = useState(false);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    if (typeof accessToken === "string") {
      const handleSuccess = () => {
        setSuccess(true);
        void router.push("/products");
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
    }
  };

  return (
    <>
      <NextHead>
        <title>Criar Produto | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" asChild>
              <NextLink href="/products">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </NextLink>
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
