export const formatCurrency = (amount: number, includeSymbol = true) => {
  if (isNaN(amount)) return includeSymbol ? '₹0.00' : '0.00';

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  if (includeSymbol) {
    options.style = 'currency';
    options.currency = 'INR';
  }

  return new Intl.NumberFormat('en-IN', options).format(amount);
};