export function formatCurrency(
  value: number,
  currencyCode: string,
  locale?: string,
) {
  const majorUnits = value / 100;
  try {

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    }).format(majorUnits);
  } catch (e: any) {
    return majorUnits.toFixed(2) + " " + currencyCode;
  }
}
