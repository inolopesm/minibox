export interface Product {
  id: number;
  name: string;
  value: number;
}

export interface Team {
  id: number;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  teamId: number;
}

export interface InvoiceProduct {
  id: number;
  invoiceId: number;
  name: string;
  value: number;
}

export interface Invoice {
  id: number;
  personId: number;
  createdAt: number;
  paidAt: number | null;
}
