const UsCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const money = (cents: number | null | undefined) =>
  cents ? UsCurrency.format(cents / 100) : "";
