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
    title,
    text,
    icon,
    confirmButtonColor: "#3085d6",
    confirmButtonText: textButton,
  });
};

// Alerta de confirmación
const showConfirm = (title, text, confirmButtonText = "Aceptar") => {
  return Swal.fire({
    position: "center",
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText,
    cancelButtonText: "Cancelar",
  });
};
