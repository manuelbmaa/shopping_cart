// Formatear precio
const formatTotal = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Formatear descripción
const formatDescription = (description) => {
  return description.length > 60
    ? `${description.slice(0, 60)}...`
    : description;
};

// Alertas
const showAlert = (title, text, icon, textButton = "Seguir comprando") => {
  return Swal.fire({
    position: "center",
    icon,
    title,
    text,
    confirmButtonText: textButton,
  });
};
