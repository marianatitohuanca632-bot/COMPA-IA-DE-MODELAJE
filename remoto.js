/* ═════════════════════════════════════════════════════════════════════════
   DEMO DEL DÍA 12 - Ajax, fetch y JSON

   Hasta ayer los datos estaban escritos en datos.js, dentro del proyecto.
   Hoy llegan de afuera, y eso cambia una cosa fundamental: TARDAN.

   QUÉ SIGNIFICA ASÍNCRONO. El código no se detiene a esperar. Pide los datos,
   sigue ejecutando las líneas siguientes, y cuando la respuesta llega, el
   navegador ejecuta la función que se dejó preparada.

   Por eso la página no se congela mientras carga. Y por eso no se puede
   escribir así:

       const datos = pedirDatos();   // NO: cuando esta línea termina,
       console.log(datos);            // los datos todavía no llegaron

   AJAX es el nombre histórico de esta técnica (Asynchronous JavaScript And
   XML). La X es de XML porque en 2005 se usaba XML; hoy se usa JSON casi
   siempre. El nombre quedó.
   ═════════════════════════════════════════════════════════════════════════ */

const $estado = document.querySelector("#estado");
const listaRemota = document.querySelector("#lista-remota");

// ── 1. JSON ─────────────────────────────────────────────────────────────
// JSON es un formato de TEXTO para intercambiar datos. Se parece a un objeto
// de JavaScript, pero no es lo mismo:
//
//   en JSON                          en un objeto de JavaScript
//   ─────────────────────────        ──────────────────────────
//   las claves van entre comillas    no hace falta
//   dobles "                         simples o dobles, da igual
//   solo texto, número, booleano,    cualquier cosa, incluidas
//   null, arreglo y objeto           funciones y fechas
//   sin comentarios                  con comentarios
//   sin coma final                   la coma final se tolera
//
// Dos funciones, y son inversas:
//   JSON.parse(texto)     texto  -> objeto
//   JSON.stringify(obj)   objeto -> texto
const textoJson = '{"nombre":"Pasarela de Alta Costura","precio":150,"disponible":true}';
const objeto = JSON.parse(textoJson);
console.log("Servicio remoto:", objeto.nombre, "| Inversión:", objeto.precio, typeof objeto.precio);
console.log("JSON serializado:", JSON.stringify(objeto));

// ── 2. LOS TRES ESTADOS ─────────────────────────────────────────────────
// Cualquier cosa que venga de la red está SIEMPRE en uno de tres estados:
// cargando, éxito o error. Los tres se muestran al usuario.
function mostrarEstado(texto, tipo = "info") {
  if (!$estado) return;
  $estado.textContent = texto;
  $estado.className = tipo;              // el CSS decide cómo se ve cada tipo
}

function pintarRemoto(productos) {
  if (!listaRemota) return;
  listaRemota.innerHTML = "";
  productos.forEach(p => {
    const art = document.createElement("article");
    art.classList.add("tarjeta");
    if (!p.disponible) art.classList.add("agotado");

    const stockTexto = p.disponible && p.stock > 0
      ? `<span class="stock-badge disponible">${p.stock} cupos</span>`
      : `<span class="stock-badge sin-stock">Agotado</span>`;

    art.innerHTML = `
      <div class="tarjeta-header">
        <span class="badge-categoria cat-${(p.categoria || 'modelaje').toLowerCase()}">${p.categoria || 'Modelaje'}</span>
        ${stockTexto}
      </div>
      <h3>${p.nombre}</h3>
      <div class="tarjeta-footer">
        <div class="precio-contenedor">
          <span class="precio-label">Inversión</span>
          <span class="precio-monto">Bs ${p.precio.toFixed(2)}${p.unidad ? ` / ${p.unidad}` : ''}</span>
        </div>
        <button type="button" class="btn-inscribir" data-nombre="${p.nombre}">Inscribirme</button>
      </div>
    `;
    listaRemota.append(art);
  });
}

// ── 3. fetch Y async/await ──────────────────────────────────────────────
async function cargarConFetch(url = "datos.json") {
  mostrarEstado("Cargando catálogo remoto...", "cargando");

  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {                            // <- comprobación obligatoria
      throw new Error(`El servidor respondió con código ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    pintarRemoto(datos.productos);
    const nombreAgencia = datos.negocio ? datos.negocio.nombre : "Compañía MAHE";
    mostrarEstado(`✓ ${datos.productos.length} cursos remotos cargados desde ${nombreAgencia}`, "ok");

  } catch (error) {
    mostrarEstado(`No se pudieron cargar los datos remotos. ${error.message}`, "error");
    if (listaRemota) listaRemota.innerHTML = "";
  }
}

const btnFetch = document.querySelector("#cargar-fetch");
if (btnFetch) {
  btnFetch.addEventListener("click", () => cargarConFetch());
}

// Un archivo que no existe, para ver el camino del error de verdad (404).
const btnRoto = document.querySelector("#cargar-roto");
if (btnRoto) {
  btnRoto.addEventListener("click", () => cargarConFetch("no-existe.json"));
}

// ── 4. LO MISMO CON jQUERY ──────────────────────────────────────────────
if (typeof $ !== "undefined") {
  const $btnJquery = $("#cargar-jquery");
  if ($btnJquery.length) {
    $btnJquery.on("click", function () {
      mostrarEstado("Cargando catálogo con jQuery $.getJSON...", "cargando");

      $.getJSON("datos.json")
        .done(function (datos) {
          pintarRemoto(datos.productos);
          const nombreAgencia = datos.negocio ? datos.negocio.nombre : "Compañía MAHE";
          mostrarEstado(`✓ ${datos.productos.length} cursos remotos cargados (vía jQuery de ${nombreAgencia})`, "ok");
        })
        .fail(function (jqXHR) {
          mostrarEstado(`Falló la carga vía jQuery: ${jqXHR.status}`, "error");
        })
        .always(function () {
          console.log("Petición Ajax jQuery finalizada.");
        });
    });
  }
}

// ── 5. QUÉ ES UNA PROMESA ───────────────────────────────────────────────
// En su forma intuitiva: "te aviso cuando esté". Una promesa es un objeto que
// representa un valor que TODAVÍA NO EXISTE, y que va a llegar (o a fallar).
//
// fetch devuelve una promesa. await es la forma de decir "espera a que esta
// promesa se resuelva y dame el valor".
//
// Sin await, la forma antigua es .then():
//
//     fetch("datos.json")
//       .then(r => r.json())
//       .then(datos => pintarRemoto(datos.productos))
//       .catch(error => mostrarEstado(error.message, "error"));
//
// Hace lo mismo que la función de la sección 3. async/await se lee mejor
// cuando hay varios pasos encadenados, y por eso es lo que se usa hoy.

// ── 6. LA PESTAÑA NETWORK ───────────────────────────────────────────────
// Todo esto se puede VER: inspector -> pestaña Network -> recargar.
// Aparece cada petición con su método, su status code y su respuesta.
//
// Es la herramienta que resuelve el 90% de los problemas de este día: si algo
// no llega, ahí se ve si la petición se hizo, a qué URL, y qué contestó.

