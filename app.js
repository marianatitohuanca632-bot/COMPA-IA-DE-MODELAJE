/* ═════════════════════════════════════════════════════════════════════════
   DEMO DEL DÍA 5 - Primer contacto con JavaScript: Compañía de Modelaje MAHE

   Se ejecuta al cargar la página. Para verlo trabajar hay que abrir la consola:
   F12, pestaña Console.

   Lo que cambia respecto de Programación I y II no es la lógica: es el
   ENTORNO. Esto no corre en una terminal, corre dentro de la página web de
   nuestra academia de modelaje, y por eso puede alcanzar los elementos
   del HTML y modificarlos en tiempo real.
   ═════════════════════════════════════════════════════════════════════════ */

// ── 1. CONSTANTES ───────────────────────────────────────────────────────
// const es la opción por defecto: declara que el identificador no se reasigna.
const negocio = "Compañía de Modelaje MAHE";
const anioFundacion = 2022;

// ── 2. VARIABLES ────────────────────────────────────────────────────────
// let se utiliza cuando el valor puede variar: aquí los cupos disponibles cambian.
let cuposDisponibles = 45;
cuposDisponibles = 40;                   // Se inscribieron cinco nuevas alumnas

// ── 3. TIPOS ────────────────────────────────────────────────────────────
// El tipo lo tiene el valor, no la variable (tipado dinámico).
const precioMatricula = 250;            // number
const abiertoHoy = true;                // boolean
const promocionDelDia = "Beca del 10% en Pasarela"; // string o null
let telefonoContacto;                   // undefined: declarada, sin asignar aún

console.log("Tipos en MAHE:", typeof negocio, typeof precioMatricula, typeof abiertoHoy);
console.log("Promoción actual:", promocionDelDia, "| Teléfono sin asignar es:", telefonoContacto);

// ── 4. TEMPLATE LITERAL ─────────────────────────────────────────────────
// Permite interpolar variables con ${...} de manera limpia y legible.
const resumen = `${negocio} fundada en ${anioFundacion} cuenta con ${cuposDisponibles} cupos disponibles hoy.`;
console.log(resumen);

// ── 5. COMPARACIÓN ──────────────────────────────────────────────────────
// == realiza coerción implícita; === compara valor y tipo sin convertir.
console.log("250" == precioMatricula);   // true  - convierte string a number
console.log("250" === precioMatricula);  // false - string !== number

// ── 6. PRIMER CAMBIO EN LA PÁGINA ───────────────────────────────────────
// document representa el DOM. querySelector localiza elementos mediante selectores CSS.
const lemaCabecera = document.querySelector("#lema-agencia") || document.querySelector("header p");
if (lemaCabecera) {
  lemaCabecera.textContent = "ENSEÑANZA DE PRIMER NIVEL • PASARELA Y ALTA COSTURA";
}

console.log("Inicialización de app.js de MAHE completada con éxito.");

