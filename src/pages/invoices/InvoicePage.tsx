import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useError } from "../../hooks/useError";
import { useSuccess } from "../../hooks/useSuccess";
import { api } from "../../services/api";
import { DateTime } from "../../utils/DateTime";
import { Money } from "../../utils/Money";
import type { Invoice, InvoiceProduct, Person, Team } from "../../entities";

export type InvoiceDTO = Invoice & {
  products: InvoiceProduct[];
  person: Person & { team: Team };
};

export function InvoicePage() {
  const navigate = useNavigate();
  const { invoiceId } = useParams() as { invoiceId: string };
  const { accessToken } = useAuthentication();
  const [invoice, setInvoice] = useState<InvoiceDTO | null>(null);
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof accessToken !== "string") return;
    setLoading(true);

    api
      .get(`/invoices/${invoiceId}`, { accessToken })
      .then(({ data }) => setInvoice(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [accessToken, invoiceId, setError]);

  const handlePay = () => {
    if (typeof accessToken !== "string") return;
    if (invoice === null) return;

    const confirmed = window.confirm("Confirma que realmente foi pago?");
    if (!confirmed) return;

    const handleSuccess = () => {
      setSuccess(true);
      navigate("/invoices");
    };

    setLoading(true);

    api
      .put(`/invoices/${invoice.id}/pay`, { accessToken })
      .then(() => handleSuccess())
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <div className="bg-white border shadow rounded border-gray-200 p-6 max-w-xs mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="secondary" asChild>
              <RouterLink to="/invoices">
                <ArrowLeftIcon className="h-4 inline-block align-[-0.1875rem]" />
              </RouterLink>
            </Button>
            <div className="font-bold text-gray-900 text-xl">Exibir Fatura</div>
          </div>
          {error && (
            <Alert variant="error" onClose={() => setError(null)}>
              {error.message}
            </Alert>
          )}
          {success && (
            <Alert variant="success">
              Produto criado com sucesso. Redirecionando para a listagem.
            </Alert>
          )}
          {loading ? (
            <div className="text-center text-gray-500">Carregando...</div>
          ) : invoice === null ? (
            <div className="text-center text-gray-500">
              Fatura não encontrada
            </div>
          ) : (
            <div className="grid gap-4">
              <div>
                <div className="text-gray-500 text-sm">#{invoice.id}</div>
                <div>
                  <span className="font-medium">Equipe:</span>{" "}
                  {invoice.person.team.name}
                </div>
                <div>
                  <span className="font-medium">Pessoa:</span>{" "}
                  {invoice.person.name}
                </div>
                <div>
                  {invoice.paidAt !== null ? (
                    <span className="font-medium text-green-800">
                      Pago em {DateTime.format(invoice.paidAt)}
                    </span>
                  ) : (
                    <span className="font-medium text-red-800">A Pagar</span>
                  )}
                </div>
              </div>
              <div className="relative overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
                    <tr>
                      <th className="px-3 py-1.5">Nome</th>
                      <th className="px-3 py-1.5">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-900">
                    {invoice.products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-3 py-2">{product.name}</td>
                        <td className="px-3 py-2">
                          {Money.format(product.value / 100)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 text-gray-700 uppercase">
                    <tr>
                      <td className="px-3 py-1.5 font-bold">Total</td>
                      <td className="px-3 py-1.5 font-bold">
                        {Money.format(
                          Money.centavosToReal(
                            invoice.products.reduce(
                              (total, product) => total + product.value,
                              0,
                            ),
                          ),
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {invoice.paidAt === null && (
                <Button type="button" onClick={handlePay}>
                  Marcar como pago
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
