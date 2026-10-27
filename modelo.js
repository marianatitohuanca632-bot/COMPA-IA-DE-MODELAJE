// ── COMPAÑÍA DE MODELAJE MAHE - MODELO Y GESTIÓN DE CUPOS ───────────────
// Archivo de estadísticas y control de clases de modelaje

{
  // ── 1. CONSTANTES ───────────────────────────────────────────────────────
  const nombreAgencia = "Compañía de Modelaje MAHE";
  const fundacion = 2022;

  // ── 2. VARIABLES ────────────────────────────────────────────────────────
  let clasesDisponiblesDamas = 40;
  let clasesDisponiblesVarones = 25;
  let clasesDisponiblesKids = 30;

  // ── 3. TIPOS ────────────────────────────────────────────────────────────
  const precioCursosDamas = 250;
  const inscripcionesAbiertas = true;
  const promocionDelMes = "10% de descuento en pasarela y giros";
  let contactoDirecto = "71990990";

  console.log("Tipos en modelo.js:", typeof nombreAgencia, typeof precioCursosDamas, typeof inscripcionesAbiertas);
  console.log("Promoción actual:", promocionDelMes, "| Contacto:", contactoDirecto);

  // ── 4. TEMPLATE LITERAL ─────────────────────────────────────────────────
  const resumenFemenina = `${nombreAgencia} (desde ${fundacion}): ${clasesDisponiblesDamas} cupos para damas.`;
  console.log(resumenFemenina);
  const resumenVarones = `${nombreAgencia} (desde ${fundacion}): ${clasesDisponiblesVarones} cupos para varones.`;
  console.log(resumenVarones);
  const resumenKids = `${nombreAgencia} (desde ${fundacion}): ${clasesDisponiblesKids} cupos para kids.`;
  console.log(resumenKids);

  // ── 5. COMPARACIÓN ──────────────────────────────────────────────────────
  console.log("250" == precioCursosDamas);  // true
  console.log("250" === precioCursosDamas); // false

  // ── 6. CAMBIO EN LA PÁGINA ──────────────────────────────────────────────
  const badgeCupos = document.querySelector("#cupos-resumen");
  if (badgeCupos) {
    badgeCupos.textContent = `Cupos: Damas (${clasesDisponiblesDamas}) • Varones (${clasesDisponiblesVarones}) • Kids (${clasesDisponiblesKids})`;
  }
}
