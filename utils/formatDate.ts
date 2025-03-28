export const formatDateForSQL = (date: string) => {
  return date.replace("T", " ").replace("Z", ""); // Convertit le format
};
