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
    nombre: "Gallinaza",
    descripcion: "Sustancia rica en aportes nutricionales a las plantas.",
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

 <!-- SCRIPT PARA RENDERIZAR LOS PRODUCTOS EN CUADRÍCULA -->
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      // 1. Base de datos de productos con precios y presentaciones
      const productos = [
        {
          id: 1,
          nombre: "Tierra negra",
          descripcion: "Ideal para jardines, zonas verdes y preparación del terreno con excelente retención de humedad.",
          imagen: "https://unsplash.com",
          precios: [
            { etiqueta: "Kilo", valor: "\$500 COP" },
            { etiqueta: "Bulto 25 kg", valor: "\$12,500 COP" },
            { etiqueta: "Bulto 50 kg", valor: "\$25,000 COP" }
          ],
          notaAdicional: "Metro cúbico / Viajes: A cotizar según mercado."
        },
        {
          id: 2,
          nombre: "Tierra abonada",
          descripcion: "Mezcla enriquecida con nutrientes esenciales para acelerar el crecimiento de tus plantas.",
          imagen: "https://unsplash.com",
          precios: [
            { etiqueta: "Kilo", valor: "\$800 COP" },
            { etiqueta: "Bulto 25 kg", valor: "\$20,000 COP" },
            { etiqueta: "Bulto 50 kg", valor: "\$40,000 COP" }
          ],
          notaAdicional: "Metro cúbico / Viajes: A cotizar según mercado."
        },
        {
          id: 3,
          nombre: "Gallinaza",
          descripcion: "Abono orgánico natural de alto rendimiento para mejorar la fertilidad de suelos agrícolas.",
          imagen: "https://unsplash.com",
          precios: [
            { etiqueta: "Kilo", valor: "\$1,000 COP" }
          ],
          notaAdicional: "Venta exclusiva por kilo."
        }
      ];

      // 2. Función para inyectar las tarjetas en el contenedor #catalogo
      function crearTarjetasProductos() {
        const catalogo = document.getElementById("catalogo");
        if (!catalogo) return;

        catalogo.innerHTML = productos
          .map((producto) => {
            const listaPreciosHTML = producto.precios
              .map(p => `<li><strong>${p.etiqueta}:</strong> ${p.valor}</li>`)
              .join("");

            const notaHTML = producto.notaAdicional 
              ? `<li class="mt-1 text-muted"><em>${producto.notaAdicional}</em></li>` 
              : "";

            return `
              <div class="col-12 col-md-6 col-lg-4 d-flex">
                <article class="card w-100 shadow-sm border border-success border-opacity-25 rounded-4 overflow-hidden text-center mx-auto" style="max-width: 340px;">
                  <div class="overflow-hidden" style="height: 180px;">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="w-100 h-100 object-fit-cover" loading="lazy" />
                  </div>
                  <div class="card-body d-flex flex-column p-4">
                    <h3 class="card-title h5 fw-bold text-success mb-2">${producto.nombre}</h3>
                    <p class="card-text text-secondary small mb-3">${producto.descripcion}</p>
                    
                    <div class="bg-light p-3 rounded-3 mb-3 mt-auto border">
                      <ul class="list-unstyled mb-0 small text-start">
                        ${listaPreciosHTML}
                        ${notaHTML}
                      </ul>
                    </div>

                    <button class="btn btn-success w-100 seleccionar-producto" type="button" data-producto="${producto.nombre}">
                      Cotizar / Comprar
                    </button>
                  </div>
                </article>
              </div>
            `;
          })
          .join("");
      }

      // Ejecutar la función al cargar la página
      crearTarjetasProductos();
    });
  </script>
</body>
</html>
