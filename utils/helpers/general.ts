export const formatCurrency = (amount: number, includeSymbol = true, isFixedPoint = true) => {
  if (isNaN(amount)) return includeSymbol ? '₹0.00' : '0.00';

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: isFixedPoint ? 2 : 0,
    maximumFractionDigits: isFixedPoint ? 2 : 0,
  };

  if (includeSymbol) {
    options.style = 'currency';
    options.currency = 'INR';
  }

  return new Intl.NumberFormat('en-IN', options).format(amount);
};

export const formatIndianNumber = (num: string | number) => {
  const x = num?.toString().replace(/,/g, "");
  const lastThree = x?.substring(x.length - 3);
  const otherNumbers = x?.substring(0, x.length - 3);
  return otherNumbers !== ""
    ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
    : lastThree;
}