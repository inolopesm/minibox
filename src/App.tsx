import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { ProductsPage } from "./pages/products/ProductsPage";
import { CreateProductPage } from "./pages/products/CreateProductPage";
import { EditProductPage } from "./pages/products/EditProductPage";
import { TeamsPage } from "./pages/teams/TeamsPage";
import { CreateTeamPage } from "./pages/teams/CreateTeamPage";
import { EditTeamPage } from "./pages/teams/EditTeamPage";
import { PeoplePage } from "./pages/people/PeoplePage";
import { CreatePersonPage } from "./pages/people/CreatePersonPage";
import { EditPersonPage } from "./pages/people/EditPersonPage";
import { InvoicesPage } from "./pages/invoices/InvoicesPage";
import { CreateInvoicePage } from "./pages/invoices/CreateInvoicePage";
import { InvoicePage } from "./pages/invoices/InvoicePage";

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
  { path: "/people", element: <PeoplePage /> },
  { path: "/people/create", element: <CreatePersonPage /> },
  { path: "/people/:personId", element: <EditPersonPage /> },
  { path: "/invoices", element: <InvoicesPage /> },
  { path: "/invoices/create", element: <CreateInvoicePage /> },
  { path: "/invoices/:invoiceId", element: <InvoicePage /> },
]);

export function App() {
  return <RouterProvider router={router} />;
}
