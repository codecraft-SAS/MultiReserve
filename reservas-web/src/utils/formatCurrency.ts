/**
 * Formatea un número crudo a formato de pesos colombianos (COP).
 * Ejemplo: 60000 -> $60.000
 */
export const formatCurrency = (value: number): string => {
  if (value === undefined || value === null) return "$0";
  
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};