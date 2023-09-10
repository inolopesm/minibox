import { useEffect, useState } from "react";
import NextHead from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import ShoppingCartIcon from "@heroicons/react/24/outline/ShoppingCartIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/outline/ArrowLeftOnRectangleIcon";
import { Button } from "../components/Button";
import { Cookie } from "../utils/Cookie";
import { JWT } from "../utils/JWT";

export default function HomePage() {
  const [accessToken, setAccessToken] = useState();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setAccessToken(Cookie.get("accessToken"));
  }, []);

  useEffect(() => {
    if (accessToken === null) {
      router.push("/signin");
    }
  }, [accessToken, router]);

  useEffect(() => {
    if (typeof accessToken === "string") {
      setUser(JWT.decode(accessToken));
    }
  }, [accessToken]);

  const handleLogout = () => {
    const confirmed = window.confirm("Você realmente deseja sair?");

    if (confirmed) {
      document.cookie = "accessToken=; Max-Age=0; path=/";
      router.push("/signin");
    }
  };

  return (
    <>
      <NextHead>
        <title>Página Inicial | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="font-bold text-gray-900 text-xl">
              Olá, {user?.username}
            </div>
            <div>
              <Button type="button" onClick={handleLogout} variant="secondary">
                <ArrowLeftOnRectangleIcon className="inline-block mr-2 h-4 align-[-0.1875rem]" />
                Sair
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NextLink
              className="grid justify-center px-4 py-8 text-center text-sm font-medium text-gray-900 border border-gray-200 rounded hover:bg-gray-100 hover:text-blue-700"
              href="/products"
            >
              <ShoppingCartIcon className="h-12" />
              Produtos
            </NextLink>
            <NextLink
              className="grid justify-center px-4 py-8 text-center text-sm font-medium text-gray-900 border border-gray-200 rounded hover:bg-gray-100 hover:text-blue-700"
              href="/teams"
            >
              <UserGroupIcon className="h-12" />
              Equipes
            </NextLink>
          </div>
        </div>
      </div>
    </>
  );
}
