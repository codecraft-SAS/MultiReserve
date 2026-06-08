/**
 * Formatea una fecha en formato YYYY-MM-DD a un formato legible en español.
 * Ejemplo: "2026-06-04" -> "4 de junio de 2026"
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  
  // Dividimos para evitar problemas de desfase por zonas horarias (UTC vs Local)
  const [year, month, day] = dateString.split('-').map(Number);
  
  // El mes en JavaScript Date inicia en 0 (enero = 0, junio = 5)
  const date = new Date(year, month - 1, day);
  
  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};