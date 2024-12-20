const cartButton = document.getElementById('cart-button');
const cartContainer = document.getElementById('cart-container');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const discountInput = document.createElement('input'); // Input para el código de descuento
const applyDiscountButton = document.createElement('button'); // Botón para aplicar el descuento
const checkoutButton = document.createElement('button'); // Crear el botón de comprar

let cart = [];
let discount = 0;

// Ocultar el botón de comprar
checkoutButton.textContent = 'Comprar';
checkoutButton.style.display = 'none';
checkoutButton.style.backgroundColor = '#9c97da'; // Color del botón de comprar
checkoutButton.style.color = 'white';
checkoutButton.style.border = 'none';
checkoutButton.style.padding = '10px 20px';
checkoutButton.style.cursor = 'pointer';

// Configuración del input de descuento
discountInput.placeholder = 'Código de descuento';
discountInput.style.marginBottom = '10px';
discountInput.style.width = '100px'; // Ancho del input

// Agregar primero el input de descuento y el botón de aplicar descuento
cartContainer.appendChild(discountInput);
cartContainer.appendChild(applyDiscountButton); // Agregar el botón de aplicar descuento
cartContainer.appendChild(checkoutButton); // Agregar el botón de comprar

// Configuración del botón de aplicar descuento
applyDiscountButton.textContent = 'Aplicar descuento';
applyDiscountButton.style.marginBottom = '10px';
applyDiscountButton.style.backgroundColor = '#9c97da'; // Color del botón de aplicar descuento
applyDiscountButton.style.color = 'white';
applyDiscountButton.style.border = 'none';
applyDiscountButton.style.padding = '5px 10px';
applyDiscountButton.style.cursor = 'pointer';

// Mostrar / ocultar carrito al hacer clic en el botón, considerando el tipo de usuario
cartButton.addEventListener('click', function() {
    const userType = localStorage.getItem('userType');
    if (userType === "admin") {
      alert("El administrador no tiene acceso al carrito de compras.");
    } else {
      toggleCart();
    }
  });
  
  // Función para alternar el carrito
  function toggleCart() {
    if (cartContainer.style.right === '-300px') {
      cartContainer.style.right = '0';
    } else {
      cartContainer.style.right = '-300px';
    }
  }
  
  // Cerrar el carrito al hacer clic fuera de él
  document.addEventListener('click', function(event) {
    if (!cartContainer.contains(event.target) && !cartButton.contains(event.target)) {
      cartContainer.style.right = '-300px';
    }
  });
  
  // Cerrar el carrito al presionar la tecla "Esc"
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      cartContainer.style.right = '-300px';
    }
  });

// Función para añadir un producto al carrito
function addToCart(name, price, imageSrc) {
    const existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
        existingProduct.quantity += 1; // Si ya está en el carrito, aumenta la cantidad
    } else {
        cart.push({
            name: name,
            price: parseFloat(price.replace('$', '')),
            imageSrc: imageSrc,
            quantity: 1
        });
    }

    renderCartItems();
    updateCartTotal();
    toggleCheckoutButton(); // Verificar si el botón de "Comprar" debe mostrarse

    // Disparar evento personalizado de carrito actualizado
    const cartUpdatedEvent = new CustomEvent('cartUpdated', { detail: cart });
    document.dispatchEvent(cartUpdatedEvent);
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(event) { // Agregar el parámetro 'event'
      event.stopPropagation(); // Detener la propagación del evento
      const userType = localStorage.getItem('userType');
      if (userType === "admin") {
        alert("El administrador no puede realizar compras.");
      } else {
        const productName = this.previousElementSibling.previousElementSibling.textContent;
        const productPrice = this.previousElementSibling.textContent;
        const productImage = this.parentElement.querySelector('img').src;
        addToCart(productName, productPrice, productImage);
      }
    });
  });

// Función para renderizar los productos en el carrito
function renderCartItems() {
    cartItems.innerHTML = ''; // Limpiar la lista del carrito

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        
        li.innerHTML = `
            <img src="${item.imageSrc}" alt="${item.name}">
            <div>
                <strong>${item.name}</strong><br>
                $${item.price.toFixed(2)} x 
                <input type="number" id="quantity-${index}" value="${item.quantity}" min="1" style="width: 50px;" />
            </div>
            <i class="fas fa-trash remove-item" data-name="${item.name}"></i>
        `;
        cartItems.appendChild(li);

        // Evento para el input de cantidad
        const quantityInput = document.getElementById(`quantity-${index}`);
        quantityInput.addEventListener('change', function() {
            const newQuantity = parseInt(this.value);
            if (newQuantity > 0) {
                updateProductQuantity(item.name, newQuantity);
            } else {
                this.value = item.quantity; // Restablecer a la cantidad actual si no es válido
            }
        });

        // Botón para eliminar producto (icono de basura)
        const removeBtn = li.querySelector('.remove-item');
        removeBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevenir que el evento se propague
            removeFromCart(item.name); // Eliminar una unidad del producto
        });
    });
}

// Función para actualizar la cantidad de un producto
function updateProductQuantity(productName, newQuantity) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity = newQuantity; // Actualizar la cantidad
        renderCartItems();
        updateCartTotal();

        // Disparar evento personalizado de carrito actualizado
        const cartUpdatedEvent = new CustomEvent('cartUpdated', { detail: cart });
        document.dispatchEvent(cartUpdatedEvent);
    }
}

// Función para eliminar una unidad de un producto del carrito
function removeFromCart(productName) {
    const productIndex = cart.findIndex(item => item.name === productName);

    if (productIndex !== -1) {
        if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1; // Disminuir cantidad si hay más de uno
        } else {
            cart.splice(productIndex, 1); // Eliminar completamente si solo queda uno
        }
    }

    renderCartItems();
    updateCartTotal();
    toggleCheckoutButton(); // Verificar si el botón de "Comprar" debe mostrarse

    // Disparar evento personalizado de carrito actualizado
    const cartUpdatedEvent = new CustomEvent('cartUpdated', { detail: cart });
    document.dispatchEvent(cartUpdatedEvent);
}

// Función para actualizar el total del carrito
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountedTotal = total * (1 - discount); // Aplicar descuento
    cartTotal.textContent = `Total: $${discountedTotal.toFixed(2)}`;
}

// Función para mostrar / ocultar el botón de "Comprar"
function toggleCheckoutButton() {
    if (cart.length > 0) {
        checkoutButton.style.display = 'block'; // Mostrar botón si hay productos
    } else {
        checkoutButton.style.display = 'none'; // Ocultarlo si el carrito está vacío
    }
}

// Evento para aplicar el código de descuento
applyDiscountButton.addEventListener('click', function() {
    const code = discountInput.value.trim();
    if (code === 'Emotes5') {
        discount = 0.05; // 5% de descuento
        alert('Descuento del 5% aplicado.');

        // Disparar evento personalizado de descuento aplicado
        const discountAppliedEvent = new CustomEvent('discountApplied', { detail: discount });
        document.dispatchEvent(discountAppliedEvent);
    } else {
        discount = 0; // No hay descuento
        alert('Código de descuento inválido.');
    }
    updateCartTotal(); // Actualizar total después de aplicar descuento
});

// Evento del botón "Comprar"
checkoutButton.addEventListener('click', function() {
    alert('¡Gracias por tu compra!');

    // Disparar evento personalizado de compra completada
    const checkoutCompletedEvent = new CustomEvent('checkoutCompleted', { detail: cart });
    document.dispatchEvent(checkoutCompletedEvent);
});

// Manejo de los eventos personalizados
document.addEventListener('cartUpdated', function(event) {
    console.log('El carrito ha sido actualizado:', event.detail);
});

document.addEventListener('discountApplied', function(event) {
    console.log('Descuento aplicado:', event.detail);
});

document.addEventListener('checkoutCompleted', function(event) {
    console.log('Compra completada:', event.detail);
});

// ----------zoom en las imagenes----------

// Seleccionar elementos
const overlay = document.getElementById('overlay');
const overlayImage = document.getElementById('overlayImage');
const zoomableImages = document.querySelectorAll('.zoomable');

// Función para mostrar la imagen en el overlay
function showOverlay(imageSrc) {
    overlayImage.src = imageSrc;
    overlay.style.display = 'flex';
}

// Función para ocultar el overlay
function hideOverlay() {
    overlay.style.display = 'none';
}

// Añadir evento de clic a cada imagen
zoomableImages.forEach(img => {
    img.addEventListener('click', function() {
        showOverlay(this.src);
    });
});

// Añadir evento de clic al overlay para ocultarlo
overlay.addEventListener('click', hideOverlay);

// scroll
let imageCount = 5; // Contador de imágenes inicial
const totalImages = 15; // Total de imágenes que deseas cargar

// Simulación de carga de imágenes
const loadImages = () => {
    const galleryContainer = document.querySelector('.gallery');

    // Solo cargar imágenes si hay más para mostrar
    if (imageCount < totalImages) {
        for (let i = imageCount; i < imageCount + 5 && i < totalImages; i++) {
            const img = document.createElement('img');
            img.src = 'imagenes/Ejemplo emotes.jpg'; // Cambia esto por la URL de tus imágenes
            img.alt = `emote${i + 1}`;
            galleryContainer.appendChild(img);

            // Usamos un timeout para que la clase "visible" se añada después de un pequeño delay
            setTimeout(() => {
                img.classList.add('visible');
            }, 5);
        }

        imageCount += 5; // Aumenta el contador
    }
};

// Evento de scroll
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loadImages();
    }
});
