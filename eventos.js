/* ═════════════════════════════════════════════════════════════════════════
   DEMO DEL DÍA 9 - Eventos, formularios y validación: Compañía de Modelaje MAHE

   Permite buscar cursos en tiempo real, filtrar por categorías de modelaje
   (Damas, Varones, Kids, Alta Costura, Fotografía, etc.), ordenar por inversión,
   activar disciplinas y procesar inscripciones digitales para las alumnas.
   ═════════════════════════════════════════════════════════════════════════ */

// ── 1. UTILIDAD DE NORMALIZACIÓN DE TEXTO (ACENTOS Y MINÚSCULAS) ────────
function normalizar(texto) {
  return (texto || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// ── 2. SISTEMA DE NOTIFICACIONES FLOTANTES (FEEDBACK VISUAL) ────────────
let temporizadorNotificacion = null;

function mostrarNotificacion(mensaje, icono = "💎") {
  let toast = document.querySelector("#notificacion-flotante");
  if (!toast) {
    toast = document.createElement("aside");
    toast.id = "notificacion-flotante";
    toast.className = "notificacion-flotante";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="icono-toast" aria-hidden="true">${icono}</span>
    <p>${mensaje}</p>
  `;

  // Forzar reflujo para reiniciar animación si ya estaba visible
  toast.classList.remove("visible");
  void toast.offsetWidth;
  toast.classList.add("visible");

  if (temporizadorNotificacion) {
    clearTimeout(temporizadorNotificacion);
  }

  temporizadorNotificacion = setTimeout(() => {
    toast.classList.remove("visible");
  }, 3800);
}

// ── 3. ELEMENTOS DE CONTROL ─────────────────────────────────────────────
const buscador = document.querySelector("#buscador");
const filtros = document.querySelector("#filtros");
const resultado = document.querySelector("#resultado");
const selectorOrden = document.querySelector("#orden");
const checkDisponibles = document.querySelector("#soloDisponibles");
const formulario = document.querySelector("#formulario-inscripcion") || document.querySelector("form");
const selectInscripcion = document.querySelector("#inscripcion");

// Estado de la interfaz
let categoriaActiva = "todos";
let textoBuscado = "";
let ordenActivo = "predeterminado";
let soloDisponiblesActivo = false;

// ── 4. LÓGICA DE COINCIDENCIA DE FILTROS ────────────────────────────────
function coincideFiltro(producto, categoria) {
  if (!categoria || categoria === "todos") return true;

  const catNorm = normalizar(categoria);
  const prodCatNorm = normalizar(producto.categoria);
  const prodPubNorm = normalizar(producto.publico);
  const prodNomNorm = normalizar(producto.nombre);

  // 1. Coincidencia por categoría temática (modelaje, formacion, danza, fotografia, belleza)
  if (prodCatNorm === catNorm) return true;

  // 2. Coincidencia por público (damas, varones, kids)
  if (prodPubNorm === catNorm) return true;

  // 3. Coincidencia si el nombre del curso incluye la etiqueta (ej: Categoria Damas)
  if (prodNomNorm.includes(catNorm)) return true;

  return false;
}

// ── 5. ACTUALIZAR VISTA: FILTRADO Y ORDENACIÓN COMBINADA ────────────────
function actualizar() {
  if (typeof productos === "undefined") return;

  const termino = normalizar(textoBuscado);

  let filtrados = productos
    // Filtro por categoría o público
    .filter(p => coincideFiltro(p, categoriaActiva))
    // Filtro de búsqueda en tiempo real (nombre, descripción, categoría o público)
    .filter(p => {
      if (!termino) return true;
      const coincideNombre = normalizar(p.nombre).includes(termino);
      const coincideDesc = normalizar(p.descripcion).includes(termino);
      const coincideCat = normalizar(p.categoria).includes(termino);
      const coincidePub = normalizar(p.publico).includes(termino);
      return coincideNombre || coincideDesc || coincideCat || coincidePub;
    })
    // Filtro de solo cupos disponibles
    .filter(p => {
      if (!soloDisponiblesActivo) return true;
      return p.disponible && p.stock > 0;
    });

  // Ordenación
  if (ordenActivo === "nombre") {
    filtrados = [...filtrados].sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (ordenActivo === "precio-menor") {
    filtrados = [...filtrados].sort((a, b) => a.precio - b.precio);
  } else if (ordenActivo === "precio-mayor") {
    filtrados = [...filtrados].sort((a, b) => b.precio - a.precio);
  }

  // Renderizar tarjetas dinámicas
  if (typeof render === "function") {
    render(filtrados);
  }

  // Actualizar contador informativo
  if (resultado) {
    if (filtrados.length === 0) {
      resultado.textContent = `No se encontraron cursos para "${textoBuscado || categoriaActiva}"`;
    } else {
      const etiquetaFiltro = categoriaActiva === "todos" ? "todos los programas" : `categoría "${categoriaActiva}"`;
      resultado.textContent = `Mostrando ${filtrados.length} de ${productos.length} cursos en ${etiquetaFiltro}`;
    }
  }
}

// Inicializar lista al cargar
actualizar();

// ── 6. EVENTO INPUT: BÚSQUEDA EN VIVO ────────────────────────────────────
if (buscador) {
  buscador.addEventListener("input", (event) => {
    textoBuscado = event.target.value;
    actualizar();
  });
}

// ── 7. DELEGACIÓN DE EVENTOS EN BOTONES DE FILTRO SUPERIORES ─────────────
if (filtros) {
  filtros.addEventListener("click", (event) => {
    const boton = event.target.closest("button");
    if (!boton) return;

    categoriaActiva = boton.dataset.categoria || "todos";

    filtros.querySelectorAll("button").forEach(b => b.classList.remove("activo"));
    boton.classList.add("activo");

    actualizar();
  });
}

// ── 8. ORDENACIÓN Y DISPONIBILIDAD ──────────────────────────────────────
if (selectorOrden) {
  selectorOrden.addEventListener("change", (e) => {
    ordenActivo = e.target.value;
    actualizar();
  });
}

if (checkDisponibles) {
  checkDisponibles.addEventListener("change", (e) => {
    soloDisponiblesActivo = e.target.checked;
    actualizar();
  });
}

// ── 9. BOTONES DE DISCIPLINAS DESTACADAS (MODA FEMENINA, MASCULINA, KIDS)
// Se usa delegación en document para capturar clicks en .btn-disciplina
// y también en la tarjeta completa (excluyendo otros botones internos)
document.addEventListener("click", (event) => {
  // Prioridad 1: click directo sobre el botón de disciplina
  const btnDisciplina = event.target.closest(".btn-disciplina");
  // Prioridad 2: click en la tarjeta-disciplina (pero NO en otro botón interno)
  const tarjetaDisciplina = event.target.closest(".tarjeta-disciplina");

  let filtroDestino = null;

  if (btnDisciplina) {
    // Click en el botón Ver Cursos X
    filtroDestino = btnDisciplina.dataset.filtro;
  } else if (tarjetaDisciplina && !event.target.closest("button")) {
    // Click en el área de texto de la tarjeta (fuera del botón)
    filtroDestino = tarjetaDisciplina.dataset.filtro;
  }

  if (!filtroDestino) return;

  categoriaActiva = filtroDestino;

  // Sincronizar el botón activo en la barra superior de filtros
  if (filtros) {
    filtros.querySelectorAll("button").forEach(b => {
      if (normalizar(b.dataset.categoria) === normalizar(filtroDestino)) {
        b.classList.add("activo");
      } else {
        b.classList.remove("activo");
      }
    });
  }

  actualizar();

  // Desplazar suavemente hacia la lista de cursos
  const listaCursos = document.querySelector("#lista-productos");
  if (listaCursos) {
    listaCursos.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const nombresBonitos = {
    damas: "Moda Femenina & Pasarela Damas",
    varones: "Moda Masculina & Porte Varones",
    kids: "Moda Kids & Teens Formación Infantil"
  };

  mostrarNotificacion(
    `Mostrando cursos para <strong>${nombresBonitos[filtroDestino] || filtroDestino}</strong>`,
    "👑"
  );
});

// ── 10. BOTÓN RESTABLECER FILTROS (EN ESTADO VACÍO) ──────────────────────
document.addEventListener("click", (event) => {
  const btnReset = event.target.closest("#btn-restablecer-cursos");
  if (!btnReset) return;

  if (buscador) buscador.value = "";
  textoBuscado = "";
  categoriaActiva = "todos";
  soloDisponiblesActivo = false;
  if (checkDisponibles) checkDisponibles.checked = false;
  ordenActivo = "predeterminado";
  if (selectorOrden) selectorOrden.value = "predeterminado";

  if (filtros) {
    filtros.querySelectorAll("button").forEach(b => {
      b.classList.toggle("activo", b.dataset.categoria === "todos");
    });
  }

  actualizar();
  mostrarNotificacion("Mostrando el catálogo completo de cursos MAHE", "✨");
});

// ── 11. BOTÓN DE INSCRIBIRSE EN LAS TARJETAS ────────────────────────────
document.addEventListener("click", (event) => {
  const btnInscribir = event.target.closest(".btn-inscribir");
  if (!btnInscribir) return;

  const nombreCurso = btnInscribir.dataset.nombre || "";
  const precioCurso = btnInscribir.dataset.precio || "";

  // Mantener sincronizado el campo del formulario con el último curso agregado.
  if (selectInscripcion && nombreCurso) {
    let encontrado = false;
    const nombreNorm = normalizar(nombreCurso);

    for (const opt of selectInscripcion.options) {
      const optValNorm = normalizar(opt.value);
      const optTxtNorm = normalizar(opt.text);

      if (optValNorm.includes(nombreNorm) || optTxtNorm.includes(nombreNorm)) {
        opt.selected = true;
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      selectInscripcion.value = nombreCurso;
    }
  }

  const cursoAgregado = typeof window.agregarCursoAlTablero === "function"
    ? window.agregarCursoAlTablero({ nombre: nombreCurso, precio: Number(precioCurso) })
    : false;

  // Notificación flotante según si se agregó o ya estaba seleccionado.
  const precioTexto = precioCurso ? ` (Bs ${parseFloat(precioCurso).toFixed(2)})` : "";
  mostrarNotificacion(
    cursoAgregado
      ? `Se agregó <strong>${nombreCurso}</strong>${precioTexto} a tu pedido.`
      : `<strong>${nombreCurso}</strong>${precioTexto} ya está en tu pedido o no tiene cupos.`,
    "💎"
  );

  // Mostrar el resumen actualizado del pedido.
  const seccionPedido = document.querySelector("#tablero-pedidos") || document.querySelector("#pedido");
  if (seccionPedido) {
    seccionPedido.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// ── 12. EXPRESIONES REGULARES PARA VALIDACIÓN ───────────────────────────
const PATRONES = {
  telefono: /^[0-9]{7,8}$/,               // 7 u 8 dígitos exactos (Bolivia)
  correo: /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i, // correo electrónico válido
};

// ── 13. SUBMIT DE FORMULARIO CON VALIDACIÓN Y ACTUALIZACIÓN LIVE ────────
if (formulario) {
  formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!formulario.reportValidity()) {
      return;
    }

    const inputTelefono = formulario.querySelector("#telefono");
    if (inputTelefono && !PATRONES.telefono.test(inputTelefono.value.trim())) {
      inputTelefono.setCustomValidity("Ingresa un número telefónico boliviano válido de 7 u 8 dígitos.");
      inputTelefono.reportValidity();
      inputTelefono.addEventListener("input", () => inputTelefono.setCustomValidity(""), { once: true });
      return;
    }

    // Validación de fecha no pasada
    const fechaInput = formulario.querySelector("#fecha");
    if (fechaInput) {
      const hoy = new Date().toISOString().slice(0, 10);
      if (fechaInput.value < hoy) {
        fechaInput.setCustomValidity("La fecha de inicio de clases no puede ser anterior a hoy.");
        fechaInput.reportValidity();
        fechaInput.addEventListener("input", () => fechaInput.setCustomValidity(""), { once: true });
        return;
      }
    }

    const datos = Object.fromEntries(new FormData(formulario));
    const cursosPedido = typeof window.obtenerCursosDelTablero === "function"
      ? window.obtenerCursosDelTablero()
      : [];
    const totalMensual = cursosPedido.reduce((suma, curso) => suma + curso.precio, 0);
    const descuento = cursosPedido.length >= 2 ? totalMensual * 0.1 : 0;
    const meses = Math.max(1, Number(datos.cantidad) || 1);
    const totalInscripcion = (totalMensual - descuento) * meses;

    if (cursosPedido.length) {
      datos.inscripcion = cursosPedido.map((curso) => curso.nombre).join(", ");
      datos.subtotalMensual = totalMensual.toFixed(2);
      datos.descuento = descuento.toFixed(2);
      datos.total = totalInscripcion.toFixed(2);
    }
    console.log("Inscripción recibida en MAHE:", datos);

    // Descontar un cupo por cada curso incluido en el pedido.
    let huboCambioStock = false;
    cursosPedido.forEach(({ nombre }) => {
      const curso = productos.find((producto) => normalizar(producto.nombre) === normalizar(nombre));
      if (curso && curso.stock > 0) {
        curso.stock -= 1;
        curso.disponible = curso.stock > 0;
        huboCambioStock = true;
      }
    });
    if (huboCambioStock) {
      actualizar();
    }

    // Mostrar confirmación elegante
    let avisoConfirmacion = document.querySelector("#confirmacion-registro");
    if (!avisoConfirmacion) {
      avisoConfirmacion = document.createElement("div");
      avisoConfirmacion.id = "confirmacion-registro";
      avisoConfirmacion.className = "mensaje-exito";
      formulario.insertAdjacentElement("beforebegin", avisoConfirmacion);
    }

    avisoConfirmacion.innerHTML = `
      <div class="alerta-contenido">
        <h4>¡Inscripción confirmada con éxito!</h4>
        <p>Bienvenida/o <strong>${datos.nombre}</strong> a la <em>Compañía de Modelaje MAHE</em>.</p>
        <p>Tu plaza para <strong>${datos.inscripcion || "el curso seleccionado"}</strong> ha sido reservada para el <strong>${datos.fecha}</strong>. Te contactaremos al teléfono <strong>${datos.telefono}</strong>.</p>
        ${cursosPedido.length ? `<p>Total por ${meses} ${meses === 1 ? "mes" : "meses"}: <strong>Bs ${totalInscripcion.toFixed(2)}</strong>${descuento ? ` (incluye descuento de Bs ${descuento.toFixed(2)} por mes)` : ""}.</p>` : ""}
      </div>
    `;
    avisoConfirmacion.scrollIntoView({ behavior: "smooth", block: "center" });

    mostrarNotificacion(`¡Felicidades ${datos.nombre}! Tu inscripción ha sido registrada.`, "🎓");

    if (typeof window.limpiarTableroPedidos === "function") window.limpiarTableroPedidos();
    formulario.reset();
  });
}
