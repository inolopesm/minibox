import ArrowLeftOnRectangleIcon from "@heroicons/react/24/outline/ArrowLeftOnRectangleIcon";
import BuildingOfficeIcon from "@heroicons/react/24/outline/BuildingOfficeIcon";
import ReceiptPercentIcon from "@heroicons/react/24/outline/ReceiptPercentIcon";
import ShoppingCartIcon from "@heroicons/react/24/outline/ShoppingCartIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuthentication } from "../hooks/useAuthentication";
import { JWT } from "../utils/JWT";

interface User {
  sub: number;
  username: string;
  exp: number;
}

export function HomePage() {
  const navigate = useNavigate();
  const { accessToken } = useAuthentication();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof accessToken === "string") {
      setUser(JWT.decode<User>(accessToken));
    }
  }, [accessToken]);

  const handleLogout = () => {
    const confirmed = window.confirm("Você realmente deseja sair?");

    if (confirmed) {
      document.cookie = "accessToken=; Max-Age=0; path=/";
      navigate("/signin");
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
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
            <RouterLink
              className="grid justify-center px-4 py-8 text-center text-sm font-medium text-gray-900 border border-gray-200 rounded hover:bg-gray-100 hover:text-blue-700"
              to="/products"
            >
              <ShoppingCartIcon className="h-12" />
              Produtos
            </RouterLink>
            <RouterLink
              className="grid justify-center px-4 py-8 text-center text-sm font-medium text-gray-900 border border-gray-200 rounded hover:bg-gray-100 hover:text-blue-700"
              to="/teams"
            >
              <BuildingOfficeIcon className="h-12" />
              Equipes
            </RouterLink>
            <RouterLink
              className="grid justify-center px-4 py-8 text-center text-sm font-medium text-gray-900 border border-gray-200 rounded hover:bg-gray-100 hover:text-blue-700"
              to="/people"
            >
              <UserGroupIcon className="h-12" />
              Pessoas
            </RouterLink>
            <RouterLink
              className="grid justify-center px-4 py-8 text-center text-sm font-medium text-gray-900 border border-gray-200 rounded hover:bg-gray-100 hover:text-blue-700"
              to="/invoices"
            >
              <ReceiptPercentIcon className="h-12" />
              Faturas
            </RouterLink>
          </div>
        </div>
      </div>
    </>
  );
}
