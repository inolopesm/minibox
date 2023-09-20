import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("./pages/HomePage")).HomePage,
    }),
  },
  {
    path: "/signin",
    lazy: async () => ({
      Component: (await import("./pages/SignInPage")).SignInPage,
    }),
  },
  {
    path: "/signup",
    lazy: async () => ({
      Component: (await import("./pages/SignUpPage")).SignUpPage,
    }),
  },
  {
    path: "/products",
    lazy: async () => ({
      Component: (await import("./pages/products/ProductsPage")).ProductsPage,
    }),
  },
  {
    path: "/products/create",
    lazy: async () => ({
      Component: (await import("./pages/products/CreateProductPage"))
        .CreateProductPage,
    }),
  },
  {
    path: "/products/:productId",
    lazy: async () => ({
      Component: (await import("./pages/products/EditProductPage"))
        .EditProductPage,
    }),
  },
  {
    path: "/teams",
    lazy: async () => ({
      Component: (await import("./pages/teams/TeamsPage")).TeamsPage,
    }),
  },
  {
    path: "/teams/create",
    lazy: async () => ({
      Component: (await import("./pages/teams/CreateTeamPage")).CreateTeamPage,
    }),
  },
  {
    path: "/teams/:teamId",
    lazy: async () => ({
      Component: (await import("./pages/teams/EditTeamPage")).EditTeamPage,
    }),
  },
  {
    path: "/people",
    lazy: async () => ({
      Component: (await import("./pages/people/PeoplePage")).PeoplePage,
    }),
  },
  {
    path: "/people/create",
    lazy: async () => ({
      Component: (await import("./pages/people/CreatePersonPage"))
        .CreatePersonPage,
    }),
  },
  {
    path: "/people/:personId",
    lazy: async () => ({
      Component: (await import("./pages/people/EditPersonPage")).EditPersonPage,
    }),
  },
  {
    path: "/invoices",
    lazy: async () => ({
      Component: (await import("./pages/invoices/InvoicesPage")).InvoicesPage,
    }),
  },
  {
    path: "/invoices/create",
    lazy: async () => ({
      Component: (await import("./pages/invoices/CreateInvoicePage"))
        .CreateInvoicePage,
    }),
  },
  {
    path: "/invoices/:invoiceId",
    lazy: async () => ({
      Component: (await import("./pages/invoices/InvoicePage")).InvoicePage,
    }),
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
