const CLAVE_TEMA = "mahe:tema";
const botonTema = document.querySelector("#tema-toggle");

function leerTema() {
  try {
    return localStorage.getItem(CLAVE_TEMA) === "oscuro" ? "oscuro" : "claro";
  } catch (error) {
    return "claro";
  }
}

function guardarTema(tema) {
  try {
    localStorage.setItem(CLAVE_TEMA, tema);
  } catch (error) {
    console.warn("No se pudo guardar la preferencia de tema.", error);
  }
}

let temaActual = leerTema();

function aplicarTema() {
  const esOscuro = temaActual === "oscuro";
  document.body.classList.toggle("tema-oscuro", esOscuro);
  botonTema.setAttribute("aria-pressed", String(esOscuro));
  botonTema.textContent = esOscuro ? "☀ Modo claro" : "☾ Modo oscuro";
}

aplicarTema();

botonTema.addEventListener("click", () => {
  temaActual = temaActual === "oscuro" ? "claro" : "oscuro";
  guardarTema(temaActual);
  aplicarTema();
});

const LOCAL = { lat: -16.5, lng: -68.15 };
const botonUbicacion = document.querySelector("#ubicarme");
const estadoUbicacion = document.querySelector("#estado-ubicacion");

function distanciaKm(lat1, lng1, lat2, lng2) {
  const radioTierraKm = 6371;
  const aRad = (grados) => (grados * Math.PI) / 180;
  const dLat = aRad(lat2 - lat1);
  const dLng = aRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(aRad(lat1)) * Math.cos(aRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return radioTierraKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

botonUbicacion.addEventListener("click", () => {
  if (!navigator.geolocation) {
    estadoUbicacion.textContent = "Tu navegador no permite compartir la ubicación.";
    estadoUbicacion.className = "error";
    return;
  }

  estadoUbicacion.textContent = "Solicitando permiso para obtener tu ubicación...";
  estadoUbicacion.className = "cargando";

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const km = distanciaKm(coords.latitude, coords.longitude, LOCAL.lat, LOCAL.lng);
      estadoUbicacion.textContent = `Estás aproximadamente a ${km.toFixed(1)} km del local.`;
      estadoUbicacion.className = "ok";
    },
    (error) => {
      const mensajes = {
        [error.PERMISSION_DENIED]: "No diste permiso. Puedes seguir usando la página igual.",
        [error.POSITION_UNAVAILABLE]: "No se pudo determinar tu ubicación. Intenta de nuevo en otro lugar.",
        [error.TIMEOUT]: "La solicitud tardó demasiado. Intenta de nuevo.",
      };
      estadoUbicacion.textContent = mensajes[error.code] || "No se pudo obtener tu ubicación.";
      estadoUbicacion.className = "error";
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
  );
});
