import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { CreateProductPage } from "./pages/products/CreateProductPage";
import { EditProductPage } from "./pages/products/EditProductPage";
import { ProductsPage } from "./pages/products/ProductsPage";
import { CreateTeamPage } from "./pages/teams/CreateTeamPage";
import { EditTeamPage } from "./pages/teams/EditTeamPage";
import { TeamsPage } from "./pages/teams/TeamsPage";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/signin", element: <SignInPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/products", element: <ProductsPage /> },
  { path: "/products/create", element: <CreateProductPage /> },
  { path: "/products/:productId", element: <EditProductPage /> },
  { path: "/teams", element: <TeamsPage /> },
  { path: "/teams/create", element: <CreateTeamPage /> },
  { path: "/teams/:teamId", element: <EditTeamPage /> },
]);

export function App() {
  return <RouterProvider router={router} />;
}
