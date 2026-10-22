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

  // Aseguramos que el contenedor padre limpie los floats y active el Grid
  catalogo.style.display = "grid";
  catalogo.style.gridTemplateColumns = "repeat(auto-fit, minmax(280px, 1fr))";
  catalogo.style.gap = "32px";
  catalogo.style.width = "100%";
  catalogo.style.maxWidth = "1200px";
  catalogo.style.margin = "0 auto";

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
      const precioTexto = producto.precio === null
        ? "Precio por consultar"
        : `$${producto.precio.toLocaleString("es-CO")} COP / Kilo`;

      // Inyectamos HTML con estilos en línea de respaldo para evitar superposiciones
      return `
        <article class="product-card" style="display: flex; flex-direction: column; background: #ffffff; border: 1px solid #e2e6df; border-radius: 14px; overflow: hidden; width: 100%; position: relative; box-sizing: border-box;">
          <img
            src="${producto.imagen}"
            alt="${escaparHTML(producto.nombre)}"
            loading="lazy"
            style="width: 100%; height: 250px; object-fit: cover; display: block; position: relative; z-index: 1;"
          />
          <div class="product-info" style="display: flex; flex-direction: column; flex: 1; padding: 24px; background: #ffffff; position: relative; z-index: 2; align-items: flex-start;">
            <span class="product-tag" style="padding: 4px 9px; color: #183d2b; background-color: #eaf1e6; border-radius: 20px; font-size: 11px; font-weight: 700; margin-bottom: 8px;">Producto agrícola</span>
            <h3 style="margin: 8px 0; color: #183d2b; font-size: 22px; font-weight: 700;">${escaparHTML(producto.nombre)}</h3>
            <p style="flex: 1; color: #6d776f; font-size: 14px; margin: 0 0 16px 0; line-height: 1.6;">${escaparHTML(producto.descripcion)}</p>
            <strong style="font-size: 18px; color: #26352b; margin: 0 0 6px 0; display: block;">${precioTexto}</strong>
            <small style="display: block; margin: 0 0 20px 0; color: #6d776f; font-size: 12px; line-height: 1.4;">${escaparHTML(producto.unidad)}</small>
            <button
              class="button button-primary"
              type="button"
              data-producto="${producto.id}"
              style="width: 100%; margin-top: auto; cursor: pointer;"
            >
              Cotizar / Comprar
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
