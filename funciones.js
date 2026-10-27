/* ═════════════════════════════════════════════════════════════════════════
   DEMO DEL DÍA 6 - Tipos, control de flujo y funciones

   La lógica del negocio, todavía sin tocar la página. Todo se comprueba en
   la consola: F12, pestaña Console.

   Casi todo lo de hoy ya se sabe de Programación I y II, y es traducción de
   sintaxis. Solo hay TRES cosas nuevas de verdad:

       1. el tipado dinámico y su coerción      (secciones 1 y 2)
       2. que las funciones son VALORES         (sección 6)
       3. el scope de bloque y los closures     (sección 7)

   El resto va rápido a propósito.
   ═════════════════════════════════════════════════════════════════════════ */

// ── 1. COERCIÓN ─────────────────────────────────────────────────────────
// Coerción es la conversión AUTOMÁTICA de tipos que hace JavaScript cuando
// una operación recibe tipos que no esperaba.
//
// El + está sobrecargado: sirve para sumar números y para unir textos. Con
// un string de un lado, gana el significado de unir. El - no tiene esa
// ambigüedad (no existe "restar textos"), así que convierte y resta.
//
// No hay que memorizar las rarezas: hay que no depender de ellas.
console.log("5" + 3);              // "53"  concatena
console.log("5" - 3);              // 2     convierte y resta

// La defensa es convertir a propósito, no confiar en la conversión automática.
console.log(Number("5") + 3);      // 8

// ── 2. VALORES FALSY ────────────────────────────────────────────────────
// Un if no necesita un booleano: acepta cualquier valor y decide si "cuenta
// como verdadero". Seis valores cuentan como false, y son solo esos seis:
//
//     0     ""     null     undefined     NaN     false
//
// TODO lo demás es truthy, incluido lo que sorprende: el texto "0", el
// arreglo vacío [] y el objeto vacío {}.
//
// Se usa a diario para comprobar si algo llegó: if (nombre) { ... } entra
// solo si nombre tiene un valor no vacío.
console.log(Boolean(0), Boolean(""), Boolean("0"), Boolean([]));
// false false true true  <- "0" y [] SÍ son truthy, y sorprende

// ── 3. CONTROL DE FLUJO ─────────────────────────────────────────────────
// Nada nuevo aquí: es la misma lógica de Programación I y II con otra
// sintaxis. Lo único que conviene mirar con atención es for...of, que es el
// bucle que más se usa en JavaScript y que quizá no exista en el lenguaje
// del que vienen.
let stock = 12;

if (stock > 0) {
  console.log("hay stock");
} else {
  console.log("agotado");
}

// Ternario: el mismo if en una línea, cuando lo que se busca es un valor.
const estado = stock > 0 ? "disponible" : "agotado";
console.log(estado);

// for...of recorre los valores directamente. Es el bucle más usado en JS.
const preciosCursos = [100, 150, 250];
for (const precio of preciosCursos) {
  console.log("precio de módulo:", precio);
}

// ── 4. FUNCIONES: tres formas de escribir exactamente lo mismo ──────────
// Las tres calculan igual. La diferencia práctica es cuándo existen:
// una función declarada con `function` está disponible desde el principio del
// archivo; una guardada en const solo existe a partir de su línea.
// La arrow es la forma que más se ve en código actual.
function totalDeclarada(precio, cantidad) {          // declaración
  return precio * cantidad;
}

const totalExpresion = function (precio, cantidad) { // expresión
  return precio * cantidad;
};

const calcularTotal = (precio, cantidad) => precio * cantidad;   // arrow

console.log(totalDeclarada(250, 2), totalExpresion(250, 2), calcularTotal(250, 2));

// ── 5. ARROW: con llaves y sin llaves ───────────────────────────────────
// La diferencia que más bugs causa en toda la semana:
//
//     (n) => n * 2          sin llaves: DEVUELVE el resultado
//     (n) => { n * 2; }     con llaves: es un cuerpo, y sin return
//                           devuelve undefined
//
// Las llaves convierten la flecha en un bloque normal, y todo bloque necesita
// un return explícito para devolver algo.
const doble = (n) => n * 2;

const aplicarDescuento = (total, porcentaje) => {
  const descuento = total * (porcentaje / 100);
  return total - descuento;                  // sin este return devuelve undefined
};

// Parámetro por defecto: si no se pasa, vale 13.
const conImpuesto = (monto, tasa = 13) => monto * (1 + tasa / 100);

console.log(aplicarDescuento(250, 10), conImpuesto(250));
// Imprime 225 y el valor con impuesto
console.log(conImpuesto(250).toFixed(2));   // Formato moneda

// ── 6. LAS FUNCIONES SON VALORES ────────────────────────────────────────
// Esto sí es nuevo, y es lo más importante del día.
//
// Una función se puede guardar en una variable, pasar como argumento y
// devolver desde otra función, igual que un número o un texto.
//
// La distinción que hay que ver: con paréntesis se LLAMA a la función y se
// obtiene su resultado; sin paréntesis se REFIERE a la función misma.
//
//     const x = calcularTotal(2, 3);   // x vale 6
//     const f = calcularTotal;         // f ES la función
const operacion = calcularTotal;             // se guarda en una variable
console.log(operacion(150, 3));              // 450 (3 meses de curso)

function aplicarATodos(lista, fn) {          // recibe una función como argumento
  const salida = [];
  for (const elemento of lista) {
    salida.push(fn(elemento));
  }
  return salida;
}

console.log(aplicarATodos(preciosCursos, doble));            // [200, 300, 500]
console.log(aplicarATodos(preciosCursos, p => `Bs ${p}`));   // ["Bs 100", "Bs 150", "Bs 250"]

// ── 7. SCOPE Y CLOSURE ──────────────────────────────────────────────────
// Scope es dónde vive una variable. Con let y const, dentro de las llaves
// donde se declaró: fuera de ellas no existe.
//
// El closure es la consecuencia curiosa: crearContador termina y desaparece,
// pero la función que devolvió SIGUE VIENDO su variable cuenta. La función se
// lleva consigo el lugar donde nació.
//
// Por eso cada contador creado tiene su propio número y no se pisan.
function crearContador() {
  let cuenta = 0;
  return () => {
    cuenta = cuenta + 1;
    return cuenta;
  };
}

const alumnasInscritas = crearContador();
console.log("Inscripciones:", alumnasInscritas(), alumnasInscritas(), alumnasInscritas());   // 1 2 3

// Cada contador nace con su propia cuenta: son independientes.
const certificadosEmitidos = crearContador();
console.log("Certificados:", certificadosEmitidos());                                         // 1, no 4

