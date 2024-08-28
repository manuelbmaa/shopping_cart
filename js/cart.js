document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const containerCart = document.getElementById("container-cart");

  if (containerCart) {
    printCart(cart, containerCart);
  }

  const btnDeleteProduct = document.querySelectorAll("#btn-delete-product");

  if (btnDeleteProduct) {
    btnDeleteProduct.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        deleteProduct(id);
      });
    });
  }

  // Agregar validación al formulario de pago
  const checkoutButton = document.querySelector(".btn-info");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", (e) => {
      e.preventDefault(); // Prevenir que el formulario se envíe automáticamente
      validatePaymentForm();
    });
  }

});


// Validar formulario de pago
const validatePaymentForm = () => {
  const cardholderName = document.getElementById("cardholderName").value.trim();
  const cardNumber = document.getElementById("cardNumber").value.trim();
  const expiration = document.getElementById("expiration").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  let isValid = true;
  let errorMessage = "";

  if (!cardholderName) {
    isValid = false;
    errorMessage += "El nombre del titular de la tarjeta es obligatorio.<br>";
  }

  if (!cardNumber) {
    isValid = false;
    errorMessage += "El número de tarjeta es obligatorio.<br>";
  } else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(cardNumber)) {
    isValid = false;
    errorMessage += "El número de tarjeta debe tener el formato 1234 5678 9012 3456.<br>";
  }

  if (!expiration) {
    isValid = false;
    errorMessage += "La fecha de vencimiento es obligatoria.<br>";
  } else if (!/^\d{2}\/\d{2}$/.test(expiration)) {
    isValid = false;
    errorMessage += "La fecha de vencimiento debe tener el formato MM/YY.<br>";
  }

  if (!cvv) {
    isValid = false;
    errorMessage += "El CVV es obligatorio.<br>";
  } else if (!/^\d{3}$/.test(cvv)) {
    isValid = false;
    errorMessage += "El CVV debe tener 3 dígitos.<br>";
  }

  if (!isValid) {
    // Usar SweetAlert para mostrar el mensaje de error
    Swal.fire({
      icon: 'error',
      title: 'Error en el formulario',
      html: errorMessage
    });
  } else {
    // Usar SweetAlert para confirmar el procesamiento del pago
    Swal.fire({
      icon: 'success',
      title: 'Formulario válido',
      text: 'Procesando el pago...',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      // Redirigir a invoice.html después de que se haya confirmado el formulario
      window.location.href = "invoice.html";
    });
  }
};


// Agregar productos al carrito
const addProduct = (id) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const products = JSON.parse(localStorage.getItem("products"));

  const filteredProduct = products.find((product) => product.id == id);

  const newProducts = products.map((product) =>
    product.id == id ? { ...product, stock: product.stock - 1 } : product
  );
  localStorage.setItem("products", JSON.stringify(newProducts));

  const newCart = cart.find((product) => product.id == id)
    ? cart.map((product) =>
        product.id == id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    : [
        ...cart,
        {
          id: filteredProduct.id,
          title: filteredProduct.title,
          price: filteredProduct.price,
          description: filteredProduct.description,
          images: filteredProduct.images,
          quantity: 1,
        },
      ];
  localStorage.setItem("cart", JSON.stringify(newCart));

  showAlert("¡Éxito!", "Producto agregado al carrito", "success").then(() => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  });
};

// Eliminar productos del carrito
const deleteProduct = (id) => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const products = JSON.parse(localStorage.getItem("products"));

  showConfirm(
    "¿Está seguro/a del eliminar el producto?",
    "No podrás deshacer esta acción",
    "Eliminar"
  ).then((result) => {
    if (result.isConfirmed) {
      const newProducts = products.map((product) =>
        product.id == id
          ? {
              ...product,
              stock: product.stock + cart.find((p) => p.id == id).quantity,
            }
          : product
      );

      const newCart = cart.filter((product) => product.id != id);

      localStorage.setItem("products", JSON.stringify(newProducts));
      localStorage.setItem("cart", JSON.stringify(newCart));

      showAlert(
        "¡Éxito!",
        "Producto eliminado del carrito",
        "success",
        "Continuar en el carrito"
      ).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
    }
  });
};

// Vaciar carrito
const clearCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const products = JSON.parse(localStorage.getItem("products"));

  const newProducts = products.map((product) =>
    cart.find((p) => p.id == product.id)
      ? {
          ...product,
          stock: product.stock + cart.find((p) => p.id == product.id).quantity,
        }
      : product
  );

  localStorage.setItem("products", JSON.stringify(newProducts));
  localStorage.setItem("cart", JSON.stringify([]));

  showAlert(
    "¡Éxito!",
    "Carrito vaciado correctamente",
    "success",
    "Continuar comprando"
  ).then(() => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  });
};

// Imprimir productos en el carrito
printCart = (cart, container) => {
  const quantityItems = document.getElementById("quantity-items");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  const shippingCost = 20.00; // Costo de envío fijo

  if (cart.length > 0) {
    const totalItems = cart.reduce((acc, product) => acc + product.quantity, 0);
    quantityItems.innerHTML = `Tienes ${totalItems} item${totalItems > 1 ? 's' : ''} en tu carrito`;

    // Calcular subtotal
    const subtotal = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);
    subtotalElement.innerText = `$${subtotal.toFixed(2)}`;

    // Calcular total (subtotal + envío)
    const total = subtotal + shippingCost;
    totalElement.innerText = `$${total.toFixed(2)}`;
  } else {
    quantityItems.innerHTML = "Tu carrito está vacío";
    subtotalElement.innerText = `$0.00`;
    totalElement.innerText = `$${shippingCost.toFixed(2)}`;
  }

  let cardItem = "";
  container.innerHTML = "";
  cart.forEach((product) => {
    cardItem += `<div class="d-flex align-items-center border-bottom py-3">
      <img src="${product.images[0]}" width="50" alt="${product.title}" class="rounded">
      <div class="flex-grow-1 ms-3">
        <h6 class="mb-0">${product.title}</h6>
        <small class="text-muted">${formatDescription(product.description)}</small>
      </div>
      <div class="text-center" style="width: 50px;">
        <span>${product.quantity}</span>
      </div>
      <div class="text-end" style="width: 100px;">
        <span>${formatTotal(product.price * product.quantity)}</span>
      </div>
      <i data-id="${product.id}" id="btn-delete-product" class="bi bi-trash text-danger ms-3" style="cursor: pointer;"></i>
    </div>`;
  });
  container.innerHTML = cardItem;

  // Re-agrega los event listeners para eliminar productos
  document.querySelectorAll("#btn-delete-product").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      deleteProduct(id);
    });
  });
};
