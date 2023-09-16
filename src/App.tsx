import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SignInPage } from "./pages/SignInPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signin",
    element: <SignInPage />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
