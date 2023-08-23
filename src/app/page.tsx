import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function HomePage() {
  const accessToken = cookies().get("accessToken");
  if (!accessToken) redirect("/login");

  return (
    <div>
      <h1>Sistema de Gerenciamento de Fiado</h1>
      <h2>Equipes</h2>
      <ul>
        <li>
          <Link href="/equipes/criar">
            Criar Equipe
          </Link>
        </li>
      </ul>
    </div>
  );
}
