export function formatPKRShort(num, includeSymbol = false, decimals = 2) {
  if (num === 0) return "0";
  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";
  const prefix = "";

  if (absNum >= 1000000)
    return sign + prefix + (absNum / 1000000).toFixed(decimals) + " Millions";
  if (absNum >= 100000)
    return sign + prefix + (absNum / 100000).toFixed(decimals) + " Lacs";
  if (absNum >= 1000)
    return (
      sign +
      prefix +
      (absNum / 1000).toFixed(decimals > 0 ? 1 : 0) +
      " Thousands"
    );
  return sign + prefix + absNum.toFixed(0);
}

export function formatNumber(num) {
  return formatPKRShort(num, false);
}
