# COMPAÑÍA DE MODELAJE MAHE

**Estudiante:** Mariana Helen Tito Huanca  
**Cliente:** Estudiantes, jóvenes y niñas/os que desean formarse en modelaje profesional, pasarela y alta costura en La Paz, Bolivia.  
**URL publicada:** En despliegue  

---

## Qué resuelve
Digitaliza y agiliza por completo el proceso de inscripción para la academia de modelaje. Permite a las y los postulantes explorar los cursos (Damas, Varones, Kids, Pasarela, Fotopose, Oratoria, etc.), filtrar por categoría, consultar disponibilidad de cupos en tiempo real e inscribirse de forma digital sin pérdida de formularios en papel.

---

## Cómo está construido y relación entre archivos

El proyecto integra semántica HTML5, estilos avanzados en CSS con diseño de alta costura y una arquitectura modular en JavaScript y jQuery:

1. **`index.html` (Estructura semántica):**
   - Utiliza etiquetas semánticas de HTML5 (`header`, `nav`, `main`, `section`, `article`, `table`, `form`, `aside`, `footer`).
   - Contiene los controles de búsqueda, filtros por categoría, selectores de ordenación, tabla de horarios oficiales, acordeón de preguntas frecuentes, avisos de castings y formulario de inscripción con validaciones.

2. **`stilo.css` (Diseño & Estética Elegante):**
   - **Paleta de Colores:** Diseñada con tonos de alta costura: Ciruela Real Profundo (`#431349`), Oro Metálico Clásico (`#c59b27`), Champaña Luminoso (`#f9f5ec`), Rosa Seda (`#fdf5f8`) y Fondo Marfil Cálido (`#fcfaf8`).
   - **Tipografía:** Combinación de tipografías serif de lujo (*Playfair Display*, *Bodoni MT*, *Didot*) con tipografía sans-serif moderna y legible (*Montserrat*).
   - **Layout:** Rejilla bidimensional con CSS Grid en áreas nombradas (`cabecera`, `principal`, `lateral`, `pie`) y Flexbox para la barra de navegación y barras de controles responsivas.

3. **`datos.js` (Estructura de Datos):**
   - Modela los servicios de la academia mediante objetos literales y un arreglo de cursos con sus respectivas categorías (`Modelaje`, `Formacion`, `Danza`, `Fotografia`, `Belleza`), precios en Bs, cupos y descripciones.
   - Demuestra destructuring, métodos funcionales (`map`, `filter`, `reduce`, `find`, `sort`, `some`, `every`) y clases orientadas a objetos (`ServicioModelaje`).

4. **`app.js` y `modelo.js` (Estado de la Agencia):**
   - Gestionan las variables institucionales (año de fundación, lema oficial, estado de inscripciones).
   - `modelo.js` controla los cupos disponibles por categoría (Damas, Varones, Kids) y actualiza el encabezado del sitio.

5. **`funciones.js` (Lógica Funcional):**
   - Implementa funciones puras, cálculo de aranceles con descuentos e impuestos, paso de funciones como valores y closures (`crearContador`) para la contabilización de inscripciones y certificados emitidos.

6. **`render.js` (Manipulación del DOM):**
   - Implementa el patrón render: vacía el contenedor `#lista-productos`, recorre los datos y genera tarjetas dinámicas con badges de categoría, estado de cupos y botones de inscripción.

7. **`eventos.js` (Interactividad y Reactividad):**
   - Conecta el buscador en vivo (`input`), la botonera de categorías mediante delegación de eventos, el ordenamiento por precio y el checkbox de disponibilidad.
   - Enlaza el botón "Inscribirme" de cada tarjeta con el formulario y procesa la inscripción digital con validación de expresiones regulares (`RegExp`) para números celulares bolivianos de 7 u 8 dígitos.
   - Descuenta cupos en tiempo real al registrar una nueva plaza.

8. **`jquery-comparado.js` y `jquery-panel.js` (Componentes jQuery):**
   - `jquery-comparado.js` contrasta de forma práctica las APIs nativas de Vanilla JS vs jQuery.
   - `jquery-panel.js` dinamiza el menú móvil responsivo (`slideToggle`), el acordeón interactivo de Preguntas Frecuentes y el despliegue animado escalonado de avisos y castings.

9. **`remoto.js` y `datos.json` (Comunicación Asíncrona, Fetch, Ajax y JSON):**
   - Carga asíncrona de cursos especializados desde un archivo `datos.json` local/remoto utilizando la API moderna `fetch` con `async/await` y también mediante jQuery con `$.getJSON()`.
   - Manejo integral de los tres estados de red: *cargando* (con animación de pulso), *éxito* (con renderizado de tarjetas en `#lista-remota`) y *error* (simulado con peticiones 404 a archivos inexistentes).

10. **`preferencias.js` (Tema y Geolocalización):**
    - Guarda el tema claro u oscuro mediante `localStorage` y lo restaura al recargar la página.
    - Solicita la ubicación solo cuando la persona presiona el botón correspondiente.
    - Calcula la distancia aproximada entre la ubicación del usuario y la academia mediante la fórmula de Haversine, con mensajes para permiso denegado, ubicación no disponible y tiempo agotado.

11. **`tablero.js` (Pedido interactivo, Drag & Drop y Canvas):**
    - Muestra todos los cursos disponibles en una lista lateral con botones de acceso rápido para agregarlos al pedido.
    - Permite arrastrar cursos desde el catálogo hacia la zona de pedido y quitar o reordenar cursos seleccionados.
    - Actualiza automáticamente la cantidad de cursos, subtotal, descuento y total según los meses seleccionados.
    - Sincroniza el pedido con el formulario de inscripción múltiple.
    - Dibuja y actualiza un gráfico de barras con Canvas según los cursos agregados.

---

## Laboratorio 2

### Interfaz, datos, DOM y comunicación con la web

El Laboratorio 2 amplió la aplicación de la academia con JavaScript aplicado al catálogo real de MAHE. Se utilizaron datos estructurados, funciones, renderizado dinámico, eventos y componentes interactivos.

### Funcionalidades desarrolladas

- Creación de objetos y arreglos de cursos con nombre, categoría, público, precio, cupos, disponibilidad y descripción.
- Uso de destructuring, operadores funcionales (`map`, `filter`, `reduce`, `find`, `sort`, `some` y `every`) y clases para representar los servicios de modelaje.
- Creación dinámica de las tarjetas de cursos dentro de `#lista-productos` mediante el patrón render.
- Búsqueda de cursos en tiempo real, filtros por categoría y público, ordenamiento por nombre o precio y filtro de cursos disponibles.
- Sincronización de los botones destacados, navegación por categorías y contador de resultados.
- Gestión de inscripciones mediante delegación de eventos, selección del curso en el formulario y muestra de notificaciones visuales.
- Validación de datos personales, teléfono boliviano, correo, fecha de inicio y aceptación de términos.
- Actualización inmediata de los cupos después de confirmar una inscripción.
- Implementación de componentes con jQuery: menú móvil, acordeón de preguntas frecuentes, efectos de castings y comparación entre Vanilla JavaScript y jQuery.
- Carga asíncrona de cursos desde `datos.json` utilizando `fetch`, `async/await` y `$.getJSON()`.
- Control visual de los estados de carga, éxito y error en el catálogo remoto.
- Diseño responsivo, semántico y elegante con CSS Grid, Flexbox, variables, estados visuales y tema de alta costura MAHE.

---

## Laboratorio 3

### Almacenamiento, ubicación, tablero de pedidos y gráficos

El Laboratorio 3 integró la persistencia de preferencias y un selector interactivo de cursos para convertir el catálogo en una experiencia de inscripción más completa.

### Funcionalidades desarrolladas

- Guardado del tema claro u oscuro con `localStorage`, reaplicación al recargar y cambio mediante un botón accesible.
- Uso de `try/catch` para soportar almacenamiento bloqueado o datos que no se puedan leer.
- Solicitud de geolocalización únicamente al accionarla mediante el botón de ubicación.
- Manejo de permisos denegados, ubicación no disponible, solicitud agotada y ausencia de soporte geográfico.
- Cálculo aproximado de distancia entre el usuario y el local MAHE con la fórmula de Haversine.
- Catálogo con los cursos disponibles ubicado a la izquierda y zona de pedido ubicada a la derecha.
- Botón “Agregar” en cada curso, deshabilitado cuando el curso ya fue agregado o ya no tiene cupos.
- Arrastre de cursos desde las tarjetas hacia la zona de pedido mediante HTML5 Drag & Drop.
- Reordenamiento de cursos seleccionados dentro del pedido y eliminación individual de cada curso.
- Visualización de cada curso elegido como ficha elegante con iconos de diamante y corona, nombre y precio mensual.
- Actualización directa del contador, subtotal, descuento del 10% para dos o más materias y cantidad a pagar.
- Selección múltiple sincronizada en el formulario, con lista de todos los cursos que la estudiante o estudiante tomará.
- Recalculo del importe según la cantidad de meses y envío de todos los cursos confirmados.
- Gráfico con Canvas que representa los precios mensuales de los cursos seleccionados y se adapta al tamaño de la pantalla.
- Diseño responsivo: disposición en dos columnas en escritorio y apilada en dispositivos móviles.

---

## Capturas
![Escritorio](parte%20de%20arriba.png)

---

## Lo más difícil
El mayor desafío consistió en sincronizar y dar coherencia temática a todos los archivos JavaScript con la temática de la Compañía de Modelaje MAHE, asegurando que la interacción entre el renderizado de cursos, los filtros de búsqueda y el formulario de inscripción funcionaran sin conflictos en el DOM y adaptándose con elegancia tanto en dispositivos móviles como en pantallas de escritorio.

