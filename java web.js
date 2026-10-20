// ==========================================
// CONFIGURACIÓN Y CONSTANTES
// ==========================================
const TELEFONO = "573001234567"; // Reemplazar por el WhatsApp real (solo dígitos con código de país)
const TELEFONO_LLAMADAS = "+573001234567"; // Reemplazar por el teléfono real

const productos = [
  {
    id: 1,
    nombre: "Tierra negra",
    descripcion: "Ideal para jardines, zonas verdes y preparación del terreno.",
    precio: null,
    unidad: "Consultar presentación",
    imagen: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 2,
    nombre: "Tierra abonada",
    descripcion: "Para huertas, materas, jardines y cultivos.",
    precio: null,
    unidad: "Consultar presentación",
    imagen: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 3,
    nombre: "Sustrato para plantas",
    descripcion: "Mezcla para apoyar el crecimiento de plantas y cultivos.",
    precio: null,
    unidad: "Consultar presentación",
    imagen: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=85"
  }
];

// ==========================================
// FUNCIONES Y RENDERIZADO
// ==========================================

/**
 * Genera dinámicamente las tarjetas de productos en el DOM
 */
function crearTarjetasProductos() {
  const catalogo = document.getElementById("catalogo");
  if (!catalogo) return;

  catalogo.innerHTML = productos
    .map((producto) => {
      const precioTexto = producto.precio === null
        ? "Precio por consultar"
        : `$${producto.precio.toLocaleString("es-CO")}`;

      return `
        <article class="product-card">
          <img
            src="${producto.imagen}"
            alt="${producto.nombre}"
            loading="lazy"
          />
          <div class="product-info">
            <span class="product-tag">Producto agrícola</span>
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <strong>${precioTexto}</strong>
            <small>${producto.unidad}</small>
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

  // Evento para seleccionar producto y hacer scroll al formulario
  catalogo.querySelectorAll("[data-producto]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const productoId = Number(boton.dataset.producto);
      const producto = productos.find((item) => item.id === productoId);

      if (producto) {
        const campoProducto = document.getElementById("producto");
        if (campoProducto) {
          campoProducto.value = producto.nombre;
        }

        document.getElementById("contacto")?.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
}

/**
 * Configura los enlaces de llamadas directas y WhatsApp
 */
function configurarContacto() {
  document.querySelectorAll("[data-llamar]").forEach((boton) => {
    boton.href = `tel:${TELEFONO_LLAMADAS}`;
  });

  const mensajeWhatsApp = encodeURIComponent(
    "Hola, estoy interesado en sus productos agrícolas. Quisiera conocer precios, presentaciones y disponibilidad."
  );

  document.querySelectorAll("[data-whatsapp]").forEach((boton) => {
    boton.href = `https://wa.me/${TELEFONO}?text=${mensajeWhatsApp}`;
    boton.target = "_blank";
    boton.rel = "noopener noreferrer";
  });
}

/**
 * Maneja el envío asíncrono del formulario de contacto
 */
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

    // Limpieza de datos recibidos del formulario
    datos.nombre = (datos.nombre || "").trim();
    datos.telefono = (datos.telefono || "").trim();
    datos.aceptaDatos = datos.aceptaDatos === "on";

    botonSubmit.disabled = true;
    estado.textContent = "Enviando tu solicitud...";

    try {
      const respuesta = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.error || "No se pudo enviar la solicitud.");
      }

      estado.textContent = "¡Gracias! Recibimos tus datos y podremos contactarte.";
      formulario.reset();
    } catch (error) {
      estado.textContent = "No pudimos guardar tus datos. Intenta nuevamente o contáctanos por WhatsApp.";
      console.error("Error al registrar el contacto:", error);
    } finally {
      botonSubmit.disabled = false;
    }
  });
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  crearTarjetasProductos();
  configurarContacto();
  configurarFormulario();
});