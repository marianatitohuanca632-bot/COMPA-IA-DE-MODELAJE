let tableroPedidos = { seleccionados: [] };

const listaCursos = document.querySelector("#lista-productos");
const zonaPedido = document.querySelector("#zona-pedido");
const listaSeleccionados = document.querySelector("#cursos-seleccionados");
const canvasPedidos = document.querySelector("#grafico-pedidos");
const contextoPedidos = canvasPedidos.getContext("2d");
const selectorPedido = document.querySelector("#inscripcion");
const campoMeses = document.querySelector("#cantidad");

function normalizarNombreCurso(nombre) {
  return (nombre || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function obtenerCursosDelTablero() {
  return tableroPedidos.seleccionados.map((curso) => ({ ...curso }));
}

function sincronizarSelector(nombre = "") {
  if (!selectorPedido) return;
  const cursosPedido = tableroPedidos.seleccionados;
  const nombres = cursosPedido.length
    ? cursosPedido.map((curso) => normalizarNombreCurso(curso.nombre))
    : (nombre ? [normalizarNombreCurso(nombre)] : []);

  Array.from(selectorPedido.options).forEach((opcion) => {
    opcion.selected = nombres.includes(normalizarNombreCurso(opcion.value));
  });
}

function actualizarResumenFormulario() {
  const cursos = tableroPedidos.seleccionados;
  const lista = document.querySelector("#lista-resumen-inscripcion");
  const subtotalElemento = document.querySelector("#subtotal-formulario");
  const descuentoElemento = document.querySelector("#descuento-formulario");
  const totalElemento = document.querySelector("#total-formulario");
  if (!lista || !subtotalElemento || !descuentoElemento || !totalElemento) return;

  lista.replaceChildren();
  if (cursos.length === 0) {
    const vacio = document.createElement("li");
    vacio.textContent = "Aún no has seleccionado cursos.";
    lista.append(vacio);
  } else {
    cursos.forEach((curso) => {
      const item = document.createElement("li");
      item.textContent = `${curso.nombre} — Bs ${curso.precio.toFixed(2)} por mes`;
      lista.append(item);
    });
  }

  const subtotal = cursos.reduce((suma, curso) => suma + curso.precio, 0);
  const descuento = cursos.length >= 2 ? subtotal * 0.1 : 0;
  const meses = Math.max(1, Number(campoMeses?.value) || 1);
  subtotalElemento.textContent = `Bs ${(subtotal * meses).toFixed(2)}`;
  descuentoElemento.textContent = `Bs ${(descuento * meses).toFixed(2)}`;
  totalElemento.textContent = `Bs ${((subtotal - descuento) * meses).toFixed(2)}`;
}

function actualizarResumenPedido() {
  const cursos = tableroPedidos.seleccionados;
  const totalMensual = cursos.reduce((suma, curso) => suma + curso.precio, 0);
  const descuento = cursos.length >= 2 ? totalMensual * 0.1 : 0;
  const meses = Math.max(1, Number(campoMeses?.value) || 1);
  const totalFinal = (totalMensual - descuento) * meses;

  document.querySelector("#contador-pedido").textContent =
    `${cursos.length} ${cursos.length === 1 ? "curso" : "cursos"} en el pedido`;
  document.querySelector("#total-pedido").textContent = `Bs ${totalFinal.toFixed(2)}`;
  document.querySelector("#detalle-pedido").textContent = cursos.length >= 2
    ? `Incluye 10% de descuento por ${cursos.length} materias · ${meses} ${meses === 1 ? "mes" : "meses"}`
    : `${meses} ${meses === 1 ? "mes" : "meses"} · Total mensual antes de descuento: Bs ${totalMensual.toFixed(2)}`;
  sincronizarSelector();
  actualizarResumenFormulario();
}

function actualizarBotonesCatalogo() {
  const agregados = new Set(tableroPedidos.seleccionados.map((curso) => normalizarNombreCurso(curso.nombre)));
  listaCursos.querySelectorAll(".btn-agregar-pedido").forEach((boton) => {
    const producto = productos.find((curso) => normalizarNombreCurso(curso.nombre) === normalizarNombreCurso(boton.dataset.nombre));
    const yaAgregado = agregados.has(normalizarNombreCurso(boton.dataset.nombre));
    const sinCupos = producto && (producto.disponible === false || producto.stock <= 0);
    boton.disabled = yaAgregado || sinCupos;
    boton.textContent = yaAgregado ? "Agregado ✓" : sinCupos ? "Sin cupos" : "Agregar";
  });
}

function renderTableroPedidos() {
  listaSeleccionados.replaceChildren();

  if (tableroPedidos.seleccionados.length === 0) {
    const vacio = document.createElement("li");
    vacio.className = "pedido-vacio";
    vacio.textContent = "Todavía no agregaste cursos. Elige uno de la lista para empezar.";
    listaSeleccionados.append(vacio);
  }

  tableroPedidos.seleccionados.forEach((curso, indice) => {
    const ficha = document.createElement("li");
    ficha.className = "ficha-pedido";
    ficha.draggable = true;
    ficha.dataset.indice = String(indice);

    const emblemas = document.createElement("span");
    emblemas.className = "emblemas-pedido";
    emblemas.setAttribute("aria-hidden", "true");
    emblemas.innerHTML = '<span class="icono-diamante">✦</span><span class="icono-corona">♛</span>';

    const detalleCurso = document.createElement("span");
    detalleCurso.className = "detalle-curso-pedido";
    const nombreCurso = document.createElement("strong");
    nombreCurso.textContent = curso.nombre;
    const precioCurso = document.createElement("small");
    precioCurso.textContent = `Bs ${curso.precio.toFixed(2)} / mes`;
    detalleCurso.append(nombreCurso, precioCurso);

    const quitar = document.createElement("button");
    quitar.type = "button";
    quitar.className = "quitar-curso";
    quitar.dataset.indice = String(indice);
    quitar.setAttribute("aria-label", `Quitar ${curso.nombre} del pedido`);
    quitar.title = "Quitar del pedido";
    quitar.textContent = "×";

    ficha.append(emblemas, detalleCurso, quitar);
    listaSeleccionados.append(ficha);
  });

  actualizarResumenPedido();
  actualizarBotonesCatalogo();
  dibujarGraficoPedido();
}

function agregarCursoAlTablero(curso) {
  const producto = typeof productos !== "undefined"
    ? productos.find((item) => normalizarNombreCurso(item.nombre) === normalizarNombreCurso(curso.nombre))
    : curso;

  if (!producto || producto.disponible === false || producto.stock <= 0) return false;

  const yaAgregado = tableroPedidos.seleccionados.some(
    (item) => normalizarNombreCurso(item.nombre) === normalizarNombreCurso(producto.nombre)
  );
  if (yaAgregado) return false;

  const item = { id: producto.id, nombre: producto.nombre, precio: Number(producto.precio) };
  tableroPedidos.seleccionados.push(item);
  sincronizarSelector(item.nombre);
  renderTableroPedidos();
  return true;
}

function reordenarCurso(indiceOrigen, indiceDestino) {
  if (indiceOrigen === indiceDestino || !tableroPedidos.seleccionados[indiceOrigen]) return;
  const [curso] = tableroPedidos.seleccionados.splice(indiceOrigen, 1);
  const destino = Math.min(indiceDestino, tableroPedidos.seleccionados.length);
  tableroPedidos.seleccionados.splice(destino, 0, curso);
  renderTableroPedidos();
}

function limpiarTableroPedidos() {
  tableroPedidos.seleccionados = [];
  sincronizarSelector("");
  renderTableroPedidos();
}

window.agregarCursoAlTablero = agregarCursoAlTablero;
window.obtenerCursosDelTablero = obtenerCursosDelTablero;
window.limpiarTableroPedidos = limpiarTableroPedidos;

function dibujarGraficoPedido() {
  const ancho = canvasPedidos.clientWidth || 600;
  const alto = 220;
  const escala = window.devicePixelRatio || 1;
  canvasPedidos.width = ancho * escala;
  canvasPedidos.height = alto * escala;
  contextoPedidos.setTransform(escala, 0, 0, escala, 0, 0);
  contextoPedidos.clearRect(0, 0, ancho, alto);

  const estilo = getComputedStyle(document.body);
  const colorBarra = estilo.getPropertyValue("--color-principal").trim() || "#431349";
  const colorTexto = estilo.getPropertyValue("--color-texto").trim() || "#231626";
  const cursos = tableroPedidos.seleccionados;
  const maximo = Math.max(...cursos.map((curso) => curso.precio), 1);
  const margen = 36;
  const espacio = 12;
  const cantidad = Math.max(cursos.length, 1);
  const anchoBarra = Math.max(18, (ancho - margen * 2 - espacio * (cantidad - 1)) / cantidad);
  const altoUtil = 135;

  contextoPedidos.font = "12px Montserrat, sans-serif";
  contextoPedidos.textAlign = "center";
  contextoPedidos.fillStyle = colorTexto;

  if (cursos.length === 0) {
    contextoPedidos.fillText("Agrega cursos para ver el gráfico", ancho / 2, 110);
    return;
  }

  cursos.forEach((curso, indice) => {
    const x = margen + indice * (anchoBarra + espacio);
    const altoBarra = (curso.precio / maximo) * altoUtil;
    const y = 165 - altoBarra;
    contextoPedidos.fillStyle = colorBarra;
    contextoPedidos.fillRect(x, y, anchoBarra, altoBarra);
    contextoPedidos.fillStyle = colorTexto;
    contextoPedidos.fillText(`Bs ${curso.precio}`, x + anchoBarra / 2, Math.max(y - 8, 14));
    contextoPedidos.fillText(curso.nombre, x + anchoBarra / 2, 190, anchoBarra + 12);
  });
}

listaCursos.addEventListener("dragstart", (event) => {
  const tarjeta = event.target.closest(".tarjeta");
  if (!tarjeta) return;
  event.dataTransfer.setData("text/plain", JSON.stringify({ tipo: "nuevo", nombre: tarjeta.dataset.nombre }));
  event.dataTransfer.effectAllowed = "copy";
});

zonaPedido.addEventListener("dragover", (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
  zonaPedido.classList.add("encima");
});

zonaPedido.addEventListener("dragleave", (event) => {
  if (!zonaPedido.contains(event.relatedTarget)) zonaPedido.classList.remove("encima");
});

zonaPedido.addEventListener("drop", (event) => {
  event.preventDefault();
  zonaPedido.classList.remove("encima");
  try {
    const datos = JSON.parse(event.dataTransfer.getData("text/plain"));
    if (datos.tipo === "nuevo") {
      const producto = productos.find((item) => normalizarNombreCurso(item.nombre) === normalizarNombreCurso(datos.nombre));
      if (producto) agregarCursoAlTablero(producto);
    }
  } catch (error) {
    console.warn("No se pudo agregar el curso arrastrado.", error);
  }
});

listaSeleccionados.addEventListener("dragstart", (event) => {
  const ficha = event.target.closest(".ficha-pedido");
  if (!ficha) return;
  event.dataTransfer.setData("text/plain", JSON.stringify({ tipo: "orden", indice: Number(ficha.dataset.indice) }));
  event.dataTransfer.effectAllowed = "move";
  ficha.classList.add("arrastrando");
});

listaSeleccionados.addEventListener("dragend", (event) => {
  const ficha = event.target.closest(".ficha-pedido");
  if (ficha) ficha.classList.remove("arrastrando");
  listaSeleccionados.classList.remove("encima");
});

listaSeleccionados.addEventListener("dragover", (event) => {
  if (event.dataTransfer.types.includes("text/plain")) event.preventDefault();
});

listaSeleccionados.addEventListener("drop", (event) => {
  const destino = event.target.closest(".ficha-pedido");
  if (!destino) return;
  event.preventDefault();
  try {
    const datos = JSON.parse(event.dataTransfer.getData("text/plain"));
    if (datos.tipo === "orden") reordenarCurso(datos.indice, Number(destino.dataset.indice));
  } catch (error) {
    console.warn("No se pudo reordenar el pedido.", error);
  }
});

listaSeleccionados.addEventListener("click", (event) => {
  const botonQuitar = event.target.closest(".quitar-curso");
  if (!botonQuitar) return;
  tableroPedidos.seleccionados.splice(Number(botonQuitar.dataset.indice), 1);
  sincronizarSelector(tableroPedidos.seleccionados.at(-1)?.nombre || "");
  renderTableroPedidos();
});

document.querySelector("#vaciar-pedido").addEventListener("click", limpiarTableroPedidos);
if (campoMeses) campoMeses.addEventListener("input", actualizarResumenPedido);
if (selectorPedido) {
  selectorPedido.addEventListener("change", () => {
    Array.from(selectorPedido.selectedOptions).forEach((opcion) => {
      const producto = productos.find((item) => normalizarNombreCurso(item.nombre) === normalizarNombreCurso(opcion.value));
      if (producto) agregarCursoAlTablero(producto);
    });

    const seleccionados = new Set(Array.from(selectorPedido.selectedOptions, (opcion) => normalizarNombreCurso(opcion.value)));
    tableroPedidos.seleccionados = tableroPedidos.seleccionados.filter((curso) => seleccionados.has(normalizarNombreCurso(curso.nombre)));
    renderTableroPedidos();
  });
}

window.addEventListener("resize", dibujarGraficoPedido);
renderTableroPedidos();
