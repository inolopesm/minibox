import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import knex from "knex";
import { TextField } from "../components/TextField";
import { Button } from "../components/Button";
import { Alert } from "../components/Alert";
import { HttpClient } from "../utils/HttpClient";

export async function getServerSideProps(context) {
  const { accessToken } = context.req.cookies;

  if (accessToken) {
    const db = knex({ client: "pg", connection: process.env.DATABASE_URL });

    try {
      const [{ count }] = await db("User")
        .count({ count: "*" })
        .where({ accessToken });

      if (count === "1") {
        return { redirect: { destination: "/", permanent: false } };
      } else {
        context.res.setHeader("Set-Cookie", "accessToken=; Max-Age=0; path=/");
      }
    } finally {
      await db.destroy();
    }
  }

  return { props: {} };
}

export default function SignInPage() {
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
    function handleSuccess(response) {
      const cookie = [`accessToken=${response.data.accessToken}`];
      cookie.push("samesite=strict");
      cookie.push("path=/");
      if (process.env.NODE_ENV === "production") cookie.push("Secure");
      document.cookie = cookie.join("; ");
      setSuccess(true);
      router.push("/");
    }

    event.preventDefault();
    setLoading(true);
    setError(null);

    HttpClient
      .post("/api/signin", { data: Object.fromEntries(new FormData(event.target)) })
      .then((response) => handleSuccess(response))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <Head>
        <title>Acesse a plataforma | Minibox</title>
      </Head>
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow">
          <div className="font-bold mb-4 text-gray-900 text-xl">
            Acesse a plataforma
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
                Login realizado com sucesso. Redirecionando para a plataforma.
              </Alert>
            )}
            <TextField
              label="Usuário"
              type="text"
              name="username"
              disabled={loading || success}
            />
            <TextField
              label="Senha"
              type="password"
              name="password"
              disabled={loading || success}
            />
            <Button type="submit" disabled={loading || success}>
              Entrar
            </Button>
            <p className="text-center text-sm">
              Ainda não possui uma conta?{" "}
              <Link className="text-blue-600 hover:underline" href="/signup">
                Registre-se
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
