"use client";
import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../client/components/Input";
import { Label } from "../../client/components/Label";
import { Button } from "../../client/components/Button";
import { useCookie } from "../../client/hooks/useCookie";
import { api } from "../../client/services/api";
import { extractDataFromForm } from "../../client/utils/html";
import type { Session } from "../api/sessions/route";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [accessToken, setAccessToken] = useCookie("accessToken");
  const usernameId = useId();
  const passwordId = useId();
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      router.push("/");
    }
  }, [accessToken, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<Session>("/api/sessions", {
        headers: { authorization: `Bearer ${accessToken}` },
        data: extractDataFromForm(event.target as HTMLFormElement),
      });

      setAccessToken(response.data.accessToken);
      router.push("/");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xs mx-auto py-8">
      <p className="text-gray-600">Sistema de Gerenciamento de Fiado</p>
      <h1 className="text-2xl mt-2 mb-6">Acessar a Plataforma</h1>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {error && (<div className="text-red-600">{error.message}</div>)}
        <div>
          <Label htmlFor={usernameId}>Usuário</Label>
          <Input
            id={usernameId}
            name="username"
            autoCapitalize="off"
            pattern="[a-z]+"
            title="Apelido deve conter apenas letras minúsculas"
            maxLength={24}
            disabled={loading}
            required
          />
        </div>
        <div>
          <Label htmlFor={passwordId}>Senha</Label>
          <Input
            type="password"
            id={passwordId}
            name="password"
            disabled={loading}
            maxLength={24}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>Entrar</Button>
      </form>
    </div>
  );
}
