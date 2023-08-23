import { useState } from "react";
import { HttpClient } from "../utils/HttpClient";

export function getServerSideProps(context) {
  if (context.req.cookies.accessToken) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: {} };
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      .post("/api/login", { data: Object.fromEntries(new FormData(event.target)) })
      .then((response) => handleSuccess(response))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  return (
    <div>
      <div>Login Page</div>
      <form onSubmit={handleSubmit}>
        {error && <div>{error.message}</div>}
        <input name="username" disabled={loading} />
        <input name="password" disabled={loading} />
        <button type="submit" disabled={loading}>Entrar</button>
      </form>
    </div>
  );
}
