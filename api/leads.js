const { createClient } = require("@supabase/supabase-js");

module.exports = async function handler(req, res) {
  // Configuración de encabezados HTTP
  res.setHeader("Cache-Control", "no-store");

  // Validar método HTTP permitido
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Método no permitido."
    });
  }

  // Carga y validación de variables de entorno
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Error: Faltan variables de entorno para Supabase.");
    return res.status(500).json({
      error: "El servicio de contactos no está configurado."
    });
  }

  // Extraer datos del cuerpo de la petición
  const {
    nombre = "",
    telefono = "",
    producto = "",
    cantidad = "",
    localidad = "",
    mensaje = "",
    aceptaDatos = false
  } = req.body || {};

  // Normalización básica de strings
  const nombreLimpio = String(nombre).trim();
  const telefonoLimpio = String(telefono).trim();
  const cantidadLimpia = String(cantidad).trim();
  const localidadLimpia = String(localidad).trim();
  const mensajeLimpio = String(mensaje).trim();

  // Lista de productos válidos
  const productosValidos = [
    "Tierra negra",
    "Tierra abonada",
    "Sustrato para plantas",
    "Otro producto"
  ];

  // Regla de validación para teléfonos (7 a 25 caracteres numéricos y símbolos de formato)
  const regexTelefono = /^[0-9+().\s-]{7,25}$/;

  // Validación de campos obligatorios y formato
  if (
    nombreLimpio.length < 2 ||
    nombreLimpio.length > 100 ||
    !regexTelefono.test(telefonoLimpio) ||
    !productosValidos.includes(producto) ||
    aceptaDatos !== true
  ) {
    return res.status(400).json({
      error: "Revisa tus datos y acepta la política de privacidad."
    });
  }

  // Validación de longitud en campos opcionales
  if (
    cantidadLimpia.length > 100 ||
    localidadLimpia.length > 100 ||
    mensajeLimpio.length > 1000
  ) {
    return res.status(400).json({
      error: "Uno de los campos supera el límite de caracteres permitido."
    });
  }

  // Inicialización de cliente Supabase
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  try {
    const { error } = await supabase.from("clientes").insert({
      nombre: nombreLimpio,
      telefono: telefonoLimpio,
      producto,
      cantidad: cantidadLimpia || null,
      localidad: localidadLimpia || null,
      mensaje: mensajeLimpio || null,
      acepta_datos: true
    });

    if (error) {
      console.error("Error de Supabase:", error.message, error.code);
      return res.status(500).json({
        error: "No fue posible registrar la solicitud."
      });
    }

    return res.status(201).json({
      mensaje: "Solicitud registrada correctamente."
    });
  } catch (error) {
    console.error("Error interno del servidor:", error);
    return res.status(500).json({
      error: "Ocurrió un error al procesar tu solicitud."
    });
  }
};
