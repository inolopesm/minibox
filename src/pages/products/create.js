import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import knex from "knex";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { TextField } from "../../components/TextField";
import { HttpClient } from "../../utils/HttpClient";

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

export default function CreateProductPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      window.scroll({ left: 0, top: 0 });
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      window.scroll({ left: 0, top: 0 });
    }
  }, [success]);

  function handleSubmit(event) {
    function handleSuccess() {
      setSuccess(true);
      router.push("/products");
    }

    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = Object.fromEntries(new FormData(event.target));
    data.value = Number.parseInt(data.value, 10);

    HttpClient
      .post("/api/products", { data })
      .then(() => handleSuccess())
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="secondary" asChild>
            <NextLink href="/products">
              <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
            </NextLink>
          </Button>
          <div className="font-bold text-gray-900 text-xl">
            Criar Produto
          </div>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
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
            type="text"
            name="value"
            min={1}
            max={99999}
            disabled={loading || success}
            helperText="Em centavos para ajudar a realizar cálculos precisos posteriormente"
            placeholder="350"
            required
          />
          <Button type="submit" disabled={loading || success}>
            Cadastrar
          </Button>
        </form>
      </div>
    </div>
  );
}
