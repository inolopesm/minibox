import NextHead from "next/head";
import NextLink from "next/link";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { Button } from "../../components/Button";

export default function CreateInvoicePage() {
  return (
    <>
      <NextHead>
        <title>Criar Fatura | Minibox</title>
      </NextHead>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border border-gray-200 max-w-xs mx-auto p-6 rounded shadow">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" asChild>
              <NextLink href="/invoices">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </NextLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">Criar Fatura</div>
          </div>
        </div>
      </div>
    </>
  );
}
