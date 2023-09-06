import Link from "next/link";
import { useRouter } from "next/router";
import knex from "knex";
import ShoppingCartIcon from "@heroicons/react/24/outline/ShoppingCartIcon"
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon"
import { Button } from "../components/Button";

export async function getServerSideProps(context) {
  const { accessToken } = context.req.cookies;

  if (!accessToken) {
    return { redirect: { destination: "/signin", permanent: false } };
  }

  const db = knex({ client: "pg", connection: process.env.DATABASE_URL });

  try {
    const user = await db("User")
      .select("username")
      .where({ accessToken })
      .first();

    if (user === undefined) {
      context.res.setHeader("Set-Cookie", "accessToken=; Max-Age=0; path=/");
      return { redirect: { destination: "/signin", permanent: false } };
    }

    return { props: { user } };
  } finally {
    await db.destroy();
  }
}

export default function HomePage({ user }) {
  const router = useRouter();

  const handleLogout = () => {
    const confirmed = window.confirm("Você realmente deseja sair?");

    if (confirmed) {
      document.cookie = "accessToken=; Max-Age=0; path=/";
      router.push("/signin");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <div className="font-bold text-gray-900 text-xl">
            Olá, {user.username}
          </div>
          <div>
            <Button type="button" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Link
            className="grid justify-center px-4 py-8 text-center text-sm font-medium text-gray-900 border border-gray-200 rounded hover:bg-gray-100 hover:text-blue-700"
            href="/products"
          >
            <ShoppingCartIcon className="h-12" />
            Produtos
          </Link>
          <Link
            className="grid justify-center px-4 py-8 text-center text-sm font-medium text-gray-900 border border-gray-200 rounded hover:bg-gray-100 hover:text-blue-700"
            href="/teams"
          >
            <UserGroupIcon className="h-12" />
            Equipes
          </Link>
        </div>
      </div>
    </div>
  );
}
