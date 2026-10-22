// ==========================================
// CONFIGURACIÓN Y CONSTANTES
// ==========================================
const TELEFONO = "573156535855"; 
const TELEFONO_LLAMADAS = "+573156535855"; 

// Lista de productos con la nueva información de precios y nombres técnicos incorporada
const productos = [
  {
    id: 1,
    nombre: "Tierra negra",
    descripcion: "Ideal para jardines, zonas verdes y preparación del terreno.",
    precio: 500 COP,
    unidad: "Kilo: \$500 COP | 25 kg: \$12.500 COP| 50 kg: \$25.000 COP. También disponible en metro cúbico, viajes u otras presentaciones (Valor según cotización y mercado). *No incluye transporte.",
    imagen: "https://unsplash.com"
  },
  {
    id: 2,
    nombre: "Tierra abonada",
    descripcion: "Para huertas, materas, jardines y cultivos.",
    precio: 800 COP,
    unidad: "Kilo: \$800 COP | 25 kg: \$20.000 COP | 50 kg: \$40.000 COP. *No incluye transporte.",
    imagen: "https://unsplash.com"
  },
  {
    id: 3,
    nombre: "Gallinaza",
    descripcion: "Abono orgánico ideal para aportar nutrientes y apoyar el crecimiento de plantas y cultivos.",
    precio: 1000 COP,
    unidad: "Venta exclusiva por Kilo. *No incluye transporte.",
    imagen: "https://unsplash.com"
  }
];

function escaparHTML(str) {
  return str.replace(/[&<>"']/g, (match) => {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return entities[match];
  });
}

// ==========================================
// FUNCIONES Y RENDERIZADO
// ==========================================

function crearTarjetasProductos() {
  const catalogo = document.getElementById("catalogo");
  if (!catalogo) return;

  catalogo.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-producto]");
    if (!boton) return;

    const productoId = Number(boton.dataset.producto);
    const producto = productos.find((item) => item.id === productoId);

    if (producto) {
      const campoProducto = document.getElementById("producto");
      if (campoProducto) campoProducto.value = producto.nombre;

      actualizarMensajeWhatsApp(producto.nombre);

      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
    }
  });

  catalogo.innerHTML = productos
    .map((producto) => {
      // Formatear el precio base por kilo de manera legible
      const precioTexto = producto.precio === null
        ? "Precio por consultar"
        : `$${producto.precio.toLocaleString("es-CO")} COP / Kilo`;

      return `
        <article class="product-card">
          <img
            src="${producto.imagen}"
            alt="${escaparHTML(producto.nombre)}"
            loading="lazy"
          />
          <div class="product-info">
            <span class="product-tag">Producto agrícola</span>
            <h3>${escaparHTML(producto.nombre)}</h3>
            <p>${escaparHTML(producto.descripcion)}</p>
            <strong>${precioTexto}</strong>
            <small style="display: block; margin-top: 5px; color: #555;">${escaparHTML(producto.unidad)}</small>
            <button
              class="button button-primary"
              type="button"
              data-producto="${producto.id}"
            >
              Solicitar información
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function actualizarMensajeWhatsApp(nombreProducto = "") {
  const textoBase = nombreProducto 
    ? `Hola, estoy interesado en el producto agrícola: *${nombreProducto}*. Quisiera conocer precios y disponibilidad.`
    : "Hola, estoy interesado en sus productos agrícolas. Quisiera conocer precios, presentaciones y disponibilidad.";

  const mensajeWhatsApp = encodeURIComponent(textoBase);

  document.querySelectorAll("[data-whatsapp]").forEach((elemento) => {
    elemento.setAttribute("href", `https://wa.me{TELEFONO}?text=${mensajeWhatsApp}`);
  });
}

function configurarContacto() {
  document.querySelectorAll("[data-llamar]").forEach((elemento) => {
    elemento.setAttribute("href", `tel:${TELEFONO_LLAMADAS}`);
  });

  actualizarMensajeWhatsApp();
}

function configurarFormulario() {
  const formulario = document.getElementById("formulario-contacto");
  const estado = document.getElementById("estado-formulario");

  if (!formulario || !estado) return;

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!formulario.reportValidity()) return;

    const botonSubmit = formulario.querySelector('button[type="submit"]');
    const formData = new FormData(formulario);
    const datos = Object.fromEntries(formData.entries());

    datos.nombre = (datos.nombre || "").trim();
    datos.telefono = (datos.telefono || "").trim();
    datos.aceptaDatos = formulario.querySelector('#aceptaDatos')?.checked || false;

    botonSubmit.disabled = true;
    estado.textContent = "Enviando tu solicitud...";

    try {
      const respuesta = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      const contentType = respuesta.headers.get("content-type");
      let resultado = {};
      if (contentType && contentType.includes("application/json")) {
        resultado = await respuesta.json();
      }

      if (!respuesta.ok) {
        throw new Error(resultado.error || "No se pudo enviar la solicitud.");
      }

      estado.textContent = "¡Gracias! Recibimos tus datos y podremos contactarte.";
      formulario.reset();
      actualizarMensajeWhatsApp(); 
    } catch (error) {
      estado.textContent = "No pudimos guardar tus datos. Intenta nuevamente o contáctanos por WhatsApp.";
      console.error("Error al registrar el contacto:", error);
    } finally {
      botonSubmit.disabled = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  crearTarjetasProductos();
  configurarContacto();
  configurarFormulario();
});
