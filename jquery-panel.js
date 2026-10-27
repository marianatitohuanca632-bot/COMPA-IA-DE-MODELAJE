/* ═════════════════════════════════════════════════════════════════════════
   DEMO DEL DÍA 11 - jQuery: eventos, efectos y funciones

   Tres componentes que aparecen en casi cualquier sitio real, escritos con
   jQuery: un menú que se despliega, un acordeón, y una lista que aparece de
   a poco.

   Lo de hoy no es sintaxis nueva: es la misma idea del Día 9 (escuchar
   eventos) escrita más corta, más los efectos, que sí son propios de jQuery.
   ═════════════════════════════════════════════════════════════════════════ */

// ── 1. .on() ES LA FORMA ÚNICA ──────────────────────────────────────────
// jQuery tiene atajos: .click(), .hover(), .focus(). Están DESACONSEJADOS
// desde la versión 3 y algunos ya se eliminaron.
//
//     $("#b").click(fn);          // atajo, no usar
//     $("#b").on("click", fn);    // la forma que se usa
//
// Razón práctica: .on() sirve para todo (eventos nativos, personalizados y
// delegación), así que hay una sola cosa que recordar.
$("#menu-toggle").on("click", function () {
  const $menu = $("#menu-movil");

  // slideToggle: si está oculto lo despliega, si está visible lo pliega.
  // El 200 son milisegundos. Sin número, jQuery usa 400.
  $menu.slideToggle(200);

  // El atributo tiene que reflejar el estado REAL, o miente al lector de
  // pantalla. Se calcula del elemento, no de una variable aparte que puede
  // desincronizarse.
  const abierto = $(this).attr("aria-expanded") === "true";
  $(this).attr("aria-expanded", !abierto);
});

// Sobre ese `this`: dentro de un handler escrito con `function`, this es el
// elemento donde ocurrió el evento. $(this) lo envuelve para poder usar
// métodos de jQuery sobre él. Con una arrow function NO funciona: las arrow
// no tienen this propio.

// ── 2. DELEGACIÓN, EN UNA LÍNEA ─────────────────────────────────────────
// El Día 9 la delegación se escribió a mano: un listener en el padre, y
// dentro un closest() para saber en qué hijo se hizo clic.
//
// jQuery lo resuelve con un segundo argumento:
//
//     $("#padre").on("click", ".hijo", fn);
//                              └── solo se dispara si el clic vino de un .hijo
//
// Es la misma idea, y sirve igual para elementos creados después.
$("#acordeon").on("click", ".titulo", function () {
  const $titulo = $(this);
  const $cuerpo = $titulo.next(".cuerpo");   // el hermano siguiente

  // .stop() vacía la cola de animaciones antes de empezar otra.
  // SIN ESTO: al hacer clic rápido varias veces, cada clic encola una
  // animación y el panel se abre y cierra solo durante varios segundos.
  // Es el bug más visible de jQuery y casi nadie lo conoce.
  $cuerpo.stop(true, true).slideToggle(200);

  $titulo.attr("aria-expanded", $titulo.attr("aria-expanded") !== "true");

  // Acordeón de verdad: cerrar los demás. .not() excluye de una selección.
  $("#acordeon .cuerpo").not($cuerpo).stop(true, true).slideUp(200);
  $("#acordeon .titulo").not($titulo).attr("aria-expanded", "false");
});

// ── 3. LOS EFECTOS ──────────────────────────────────────────────────────
// Tres familias, y todas tienen la misma forma:
//
//     .show()  .hide()  .toggle()            aparecer y desaparecer
//     .fadeIn()  .fadeOut()  .fadeToggle()   con opacidad
//     .slideDown()  .slideUp()  .slideToggle()  desplegando en altura
//
// Todas aceptan (duración, callback):
//
//     $("#x").fadeIn(300, function () { ... });   // se ejecuta AL TERMINAR
//
// El callback es la única forma de encadenar algo DESPUÉS de la animación:
// si se pone la línea siguiente sin callback, se ejecuta de inmediato,
// mientras la animación todavía corre.

// ── 4. .each() Y EL ESCALONADO ──────────────────────────────────────────
// .each() recorre una selección. El primer argumento del callback es el
// índice, y this es el elemento de esta vuelta.
$("#mostrar-avisos").on("click", function () {
  $("#avisos li").each(function (indice) {
    // .delay() retrasa el inicio de la siguiente animación de la cola.
    // Multiplicando por el índice, cada elemento arranca más tarde que el
    // anterior: eso produce el efecto escalonado.
    $(this).stop(true, true).delay(indice * 120).fadeIn(250);
  });

  // Cambiar el texto del botón según lo que va a hacer la próxima vez.
  $(this).text("Ocultar avisos").off("click").on("click", function () {
    $("#avisos li").stop(true, true).fadeOut(200);
    $(this).text("Mostrar avisos");
  });
});
// .off("click") quita el handler anterior. Sin eso, el botón acumularía
// handlers y al tercer clic haría tres cosas a la vez.

// ── 5. .animate(), PARA LO QUE NO CUBRE UN EFECTO ───────────────────────
// Anima cualquier propiedad NUMÉRICA. No sirve para color de fondo, porque
// un color no es un número (para eso hace falta un plugin, o CSS).
//
//     $("#caja").animate({ opacity: 0.5, width: "200px" }, 400);
//
// COMPARACIÓN HONESTA: para casi todo lo anterior, las
// transiciones de CSS son mejores. El navegador las ejecuta en la tarjeta
// gráfica y no consumen el hilo principal:
//
//     .caja { transition: opacity .3s; }
//     .caja.oculta { opacity: 0; }
//
// jQuery conviene cuando la animación depende de LÓGICA: cuánto dura, en qué
// orden, qué pasa al terminar. Para "que se desvanezca al pasar el mouse",
// CSS gana.

// ── 6. UNA FUNCIÓN PROPIA QUE DEVUELVE LA SELECCIÓN ─────────────────────
// La convención de jQuery: si un método devuelve la selección, se puede
// encadenar. Una función propia puede seguir esa convención.
function resaltar($seleccion, milisegundos = 1200) {
  $seleccion.addClass("resaltado");
  setTimeout(() => $seleccion.removeClass("resaltado"), milisegundos);
  return $seleccion;              // devolver la selección permite encadenar
}

// Y por eso esto funciona:
resaltar($("#panel h2")).css("letter-spacing", "0.5px");

// Un PLUGIN de jQuery es lo mismo, pero enganchado a $.fn para poder
// llamarlo como método. A nivel de reconocerlo, no de escribir una librería:
//
//     $.fn.resaltar = function () { ... ; return this; };
//     $("#panel h2").resaltar();
//
// Todo plugin devuelve `this` al final. Esa es la regla que los hace
// encadenables, y es la razón por la que casi todos terminan igual.

