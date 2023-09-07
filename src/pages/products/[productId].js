import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import knex from "knex";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { TextField } from "../../components/TextField";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
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

    const productId = +context.query.productId;

    if (Number.isNaN(productId)) {
      return { notFound: true };
    }

    const product = await db("Product")
      .where({ id: productId, deletedAt: null })
      .first();

    if (product === undefined) {
      return { notFound: true };
    }

    return { props: { product } };
  } finally {
    await db.destroy();
  }
}

export default function EditProductPage({ product }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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
      setSuccess("editado");
      router.push("/products");
    }

    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = Object.fromEntries(new FormData(event.target));
    data.value = Number.parseInt(data.value, 10);

    HttpClient
      .put(`/api/products/${product.id}`, { data })
      .then(() => handleSuccess())
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  function handleDelete() {
    const confirmed = window.confirm("Você deseja realmente excluir este produto?");

    if (confirmed) {
      function handleSuccess() {
        setSuccess("deletado");
        router.push("/products");
      }

      HttpClient
        .delete(`/api/products/${product.id}`)
        .then(() => handleSuccess())
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="bg-white border shadow rounded border-gray-200 p-6 max-w-xs mx-auto">
        <div className="flex justify-between items-center gap-2 mb-4">
          <Button variant="secondary" asChild>
            <NextLink href="/products">
              <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
            </NextLink>
          </Button>
          <div className="font-bold text-gray-900 text-xl">
            Editar Produto
          </div>
          <div>
            <Button variant="secondary" onClick={handleDelete}>
              <TrashIcon className="h-4 inline-block align-[-0.1875rem]" />
            </Button>
          </div>
        </div>
        <form
          className="grid gap-4"
          onSubmit={handleSubmit}
        >
          {error && (
            <Alert variant="error" onClose={() => setError(null)}>
              {error.message}
            </Alert>
          )}
          {success !== null && (
            <Alert variant="success">
              Produto {success} com sucesso. Redirecionando para a listagem.
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
            defaultValue={product.name}
            required
          />
          <TextField
            label="Valor em centavos"
            type="number"
            name="value"
            min={1}
            max={99999}
            disabled={loading || success}
            helperText="Em centavos para ajudar a realizar cálculos precisos posteriormente"
            title="O valor é obrigatório e deve ser um número entre 1 e 99999"
            placeholder="350"
            defaultValue={product.value}
            required
          />
          <Button type="submit" disabled={loading || success}>
            Salvar
          </Button>
        </form>
      </div>
    </div>
  );

}

