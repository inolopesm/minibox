import { useEffect, useState } from "react";
import Head from "next/head";
import { TextField } from "../components/TextField";
import { Button } from "../components/Button";
import { Alert } from "../components/Alert";
import { HttpClient } from "../utils/HttpClient";

export function getServerSideProps(context) {
  if (context.req.cookies.accessToken) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: {} };
}

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      window.scroll({ left: 0, top: 0 });
    }
  }, [error]);

  function handleSubmit(event) {
    function handleSuccess(response) {
      const cookie = [`accessToken=${response.data.accessToken}`];
      cookie.push("samesite=strict");
      cookie.push("path=/");
      if (process.env.NODE_ENV === "production") cookie.push("Secure");
      document.cookie = cookie.join("; ");
    }

    event.preventDefault();
    setLoading(true);

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
            <TextField
              label="Usuário"
              type="text"
              name="username"
              disabled={loading}
            />
            <TextField
              label="Senha"
              type="password"
              name="password"
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
