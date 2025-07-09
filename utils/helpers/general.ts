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