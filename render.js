/* ═════════════════════════════════════════════════════════════════════════
   DEMO DEL DÍA 8 - El DOM

   Hoy la página deja de ser HTML escrito a mano. El arreglo de datos.js se
   convierte en las tarjetas que se ven en pantalla.

   QUÉ ES EL DOM: al cargar la página, el navegador lee el HTML y construye
   con él un ÁRBOL DE OBJETOS en memoria. Ese árbol es el DOM.

       el archivo index.html   es el plano
       el DOM                  es el edificio ya construido

   JavaScript no modifica el archivo: modifica el edificio. Por eso al
   recargar vuelve todo a como estaba en el plano.

   Se puede ver el árbol en la pestaña Elements del inspector, y editarlo ahí
   a mano: es el mismo DOM que toca este archivo.
   ═════════════════════════════════════════════════════════════════════════ */

/* ═════════════════════════════════════════════════════════════════════════
   DEMO DEL DÍA 8 - El DOM y Renderizado de Cursos de Modelaje MAHE

   El arreglo de datos.js se convierte en tarjetas elegantes en pantalla.
   JavaScript lee los datos y construye dinámicamente los elementos en el DOM.
   ═════════════════════════════════════════════════════════════════════════ */

// ── 1. SELECCIONAR ──────────────────────────────────────────────────────
const contenedor = document.querySelector("#lista-productos") || document.querySelector(".contenedor-modelos");
const titulos = document.querySelectorAll("h2");

console.log("El contenedor de cursos existe:", contenedor !== null);
console.log("Hay", titulos.length, "encabezados h2 en la página");

// ── 2. CREAR ELEMENTOS: TARJETA DE CURSO DE MODELAJE ────────────────────
function crearTarjeta(producto) {
  const articulo = document.createElement("article");

  articulo.classList.add("tarjeta");
  if (!producto.disponible || producto.stock <= 0) {
    articulo.classList.add("agotado");
  }

  // Atributos data-* para filtros y eventos
  articulo.dataset.nombre = producto.nombre;
  articulo.dataset.categoria = producto.categoria;
  articulo.dataset.publico = producto.publico || "Todos";
  articulo.dataset.precio = producto.precio;

  const stockTexto = (producto.disponible && producto.stock > 0)
    ? `<span class="stock-badge disponible">${producto.stock} cupos disponibles</span>`
    : `<span class="stock-badge sin-stock">Cupos agotados</span>`;

  articulo.innerHTML = `
    <div class="tarjeta-header">
      <span class="badge-categoria cat-${producto.categoria.toLowerCase()}">${producto.categoria}</span>
      ${stockTexto}
    </div>
    <h3>${producto.nombre}</h3>
    <p class="descripcion-curso">${producto.descripcion || "Formación integral con certificación oficial de pasarela."}</p>
    <div class="tarjeta-footer">
      <div class="precio-contenedor">
        <span class="precio-label">Inversión mensual</span>
        <span class="precio-monto">Bs ${producto.precio.toFixed(2)}</span>
      </div>
      <button type="button" class="btn-inscribir" data-nombre="${producto.nombre}" data-precio="${producto.precio}">
        Inscribirme
      </button>
    </div>
  `;

  return articulo;
}

// ── 3. RENDER: EL PATRÓN DEL MÓDULO ─────────────────────────────────────
// 1. Vaciar el contenedor
// 2. Recorrer los datos recibidos
// 3. Insertar cada elemento en el DOM
function render(lista) {
  if (!contenedor) return;

  contenedor.innerHTML = "";                 // 1. vaciar

  lista.forEach(producto => {                // 2. recorrer
    contenedor.append(crearTarjeta(producto)); // 3. insertar
  });

  // Estado visual si no hay coincidencias
  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="sin-resultados">
        <p>No encontramos cursos de modelaje que coincidan con tu búsqueda.</p>
        <button type="button" class="btn-restablecer" id="btn-restablecer-cursos">
          Ver todos los cursos
        </button>
      </div>
    `;
  }
}

// ── 4. PINTAR INICIAL ───────────────────────────────────────────────────
if (typeof productos !== "undefined") {
  render(productos);
}

// ── 5. NAVEGACIÓN EN EL ÁRBOL DOM ───────────────────────────────────────
const primeraTarjeta = document.querySelector(".tarjeta");
if (primeraTarjeta) {
  console.log("Padre de la primera tarjeta:", primeraTarjeta.parentElement ? primeraTarjeta.parentElement.id : "sin id");
  console.log("Su curso es:", primeraTarjeta.dataset.nombre);
}

