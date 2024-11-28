let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function buscarProducto() {
    let input = document.getElementById('search');
    let value = input.value.toLowerCase();
    let productos = document.querySelectorAll('.producto');

    for (let i = 0; i < productos.length; i++) {
        let producto = productos[i];
        let title = producto.querySelector("h3").innerText.toLowerCase();

        if (value === "" || title.includes(value)) {
            producto.style.display = "";
        } else {
            producto.style.display = "none";
        }
    }
}

let encontrar = document.getElementById('search')
if (encontrar != null) {
    encontrar.addEventListener('input', buscarProducto);
}

function agregarAlCarrito(producto, precio, imagen) {
    const productoExistente = carrito.find(item => item.producto === producto);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ producto, precio, imagen, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
}

function actualizarCarrito() {
    const carritoCount = document.getElementById('carrito-count');
    if (carritoCount != null) {
        carritoCount.innerText = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    }

    const carritoItems = document.getElementById('carrito-items');
    const emptyMessage = document.getElementById('empty-message');
    carritoItems.innerHTML = '';

    if (carrito.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
        carrito.forEach((item, index) => {
            const div = document.createElement('div');
            div.classList.add('carrito-item');

            const img = document.createElement('img');
            img.src = item.imagen;
            img.alt = item.producto;
            img.style.width = '50px';
            img.style.height = '50px';

            const text = document.createElement('span');
            text.innerHTML = `${item.producto} - $${(item.precio * item.cantidad).toFixed(2)}`;
            text.classList.add('carrito-text');

            const cantidadDiv = document.createElement('div');
            cantidadDiv.classList.add('carrito-cantidad');
            cantidadDiv.innerHTML = `
                <button onclick="cambiarCantidad(${index}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button onclick="cambiarCantidad(${index}, 1)">+</button>
            `;

            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'Eliminar';
            deleteBtn.onclick = () => eliminarDelCarrito(index);

            div.appendChild(img);
            div.appendChild(text);
            div.appendChild(cantidadDiv);
            div.appendChild(deleteBtn);

            carritoItems.appendChild(div);
        });
        mostrarPrecioTotal();
    }

}

function mostrarPrecioTotal() {
    const carritoItems = document.getElementById('carrito-items');
    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const totalDiv = document.createElement('div');
    totalDiv.classList.add('carrito-total');
    totalDiv.innerHTML = `Total: $${total.toFixed(2)}`;

    const comprarBtn = document.createElement('button');
    comprarBtn.innerText = 'Comprar';
    comprarBtn.classList.add('btn-comprar-total');
    comprarBtn.onclick = realizarCompra;

    totalDiv.appendChild(comprarBtn);
    carritoItems.appendChild(totalDiv);
}

function realizarCompra() {
    const totalCompra = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
    localStorage.setItem('totalCompra', totalCompra);  // Guardar el total en localStorage
    
    window.location.href = 'checkout.html';  // Redirigir a la página de compra
}

function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad === 0) {
        carrito.splice(index, 1);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
}

function toggleCarrito() {
    const carritoMenu = document.getElementById('myModal');
    carritoMenu.style.display = carritoMenu.style.display === 'none' || carritoMenu.style.display === '' ? 'block' : 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('myModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function mostrarDetallesPedido() {
    const pedidoDetalles = document.getElementById('pedido-detalles');
    const totalPedido = document.getElementById('total-pedido');
    if (pedidoDetalles != null) {
        pedidoDetalles.innerHTML = '';
        let total = 0;

        carrito.forEach(item => {
            const div = document.createElement('div');
            const img = document.createElement('img');
            img.src = item.imagen;
            img.alt = item.producto;
            img.style.width = '50px';
            img.style.height = '50px';

            div.classList.add('pedido-detalles-item');
            div.innerHTML = `${item.producto} - $${(item.precio * item.cantidad).toFixed(2)} x ${item.cantidad}`;
            div.prepend(img);
            pedidoDetalles.appendChild(div);
            total += item.precio * item.cantidad;
        });

        totalPedido.innerHTML = `Total a Pagar: $${total.toFixed(2)}`;

    }
}

document.addEventListener('DOMContentLoaded', function(){
    mostrarDetallesPedido();
    actualizarCarrito();
});

let formCompra = document.getElementById('form-compra')
if (formCompra != null) {
    formCompra.addEventListener('submit', function (e) {
        e.preventDefault();
    
        // Obtener datos del formulario
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('email').value;
        const direccion = document.getElementById('direccion').value;
        const sector = document.getElementById('sector').value;
        const ciudad = document.getElementById('ciudad').value;
        const codigoPostal = document.getElementById('codigo_postal').value;
        const nombreTarjeta = document.getElementById('nombre_tarjeta').value;
        const numeroTarjeta = document.getElementById('numero_tarjeta').value;
        const fechaVencimiento = document.getElementById('fecha_vencimiento').value;
        const cvv = document.getElementById('cvv').value;

        const compra = {
            comprador: { nombre, apellido, email },
            direccionEnvio: { direccion, sector, ciudad, codigoPostal },
            metodoPago: { nombreTarjeta, numeroTarjeta, fechaVencimiento, cvv },
            detalles: carrito,
            total: carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)
        };

        fetch("http://localhost:3000/realizar-compra", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(compra),
        });

        alert(`Gracias por tu compra, ${nombre}. Total a pagar: $${compra.total}`);

        localStorage.removeItem('carrito');
        carrito = [];

        window.location.href = 'Pagina-Web.html';
    });
}
