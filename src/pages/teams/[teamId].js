import { useEffect, useState } from "react";
import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import knex from "knex";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
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

    const teamId = +context.query.teamId;

    if (Number.isNaN(teamId)) {
      return { notFound: true };
    }

    const team = await db("Team")
      .where({ id: teamId, deletedAt: null })
      .first();

    if (team === undefined) {
      return { notFound: true };
    }

    return { props: { team } };
  } finally {
    await db.destroy();
  }
}

export default function EditTeamPage({ team }) {
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
      setSuccess("editada");
      router.push("/teams");
    }

    event.preventDefault();
    setLoading(true);
    setError(null);

    HttpClient
      .put(`/api/teams/${team.id}`, { data: Object.fromEntries(new FormData(event.target)) })
      .then(() => handleSuccess())
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <NextHead>
        <title>Editar Equipe | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="bg-white border shadow rounded border-gray-200 p-6 max-w-xs mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" asChild>
              <NextLink href="/teams">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </NextLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">
              Editar Equipe
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
                Equipe {success} com sucesso. Redirecionando para a listagem.
              </Alert>
            )}
            <TextField
              label="Nome"
              type="text"
              name="name"
              disabled={loading || success}
              maxLength={24}
              pattern="[A-zÀ-ú0-9][A-zÀ-ú0-9 ]{1,22}[A-zÀ-ú0-9]"
              placeholder="Minibox"
              title="O nome é obrigatório e deve ser composto por até 24 caracteres sem espaço nas laterais"
              defaultValue={team.name}
              required
            />
            <Button type="submit" disabled={loading || success}>
              Salvar
            </Button>
          </form>
        </div>
      </div>
    </>
  );

}

