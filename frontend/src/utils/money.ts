const UsCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const convertToUsd = (cents: number | null | undefined) =>
  cents ? UsCurrency.format(cents / 100) : "";

export const convertToUsCents = (dollarAmount: string) => {
  // regex removes all non-numeric characters from the string
  const cents = parseInt(dollarAmount.replace(/[^0-9]/g, ""));
  // if the string contains a decimal, we assume it's already in cents after removing the decimal
  if (dollarAmount.includes(".")) {
    return cents;
  }
  return cents * 100;
};
