export const Money = {
  format: new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format,

  centavosToReal: (value: number) => value / 100,
};
