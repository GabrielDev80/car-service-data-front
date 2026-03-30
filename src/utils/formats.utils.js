export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
  };
  return new Intl.DateTimeFormat("es-ES", options).format(date);
};

const now = new Date();
export const timeString = now.toLocaleTimeString("es-ES", {
  hour: "2-digit",
  minute: "2-digit",
  // second: "2-digit",
  hour12: false,
});

export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const number = Number(value);
  if (Number.isNaN(number)) return "-";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const capitalizeFirstLetter = (text) => {
  if (text === null || text === undefined || text === "") return "";
  const str = String(text);
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDateDDMMYYYY = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
