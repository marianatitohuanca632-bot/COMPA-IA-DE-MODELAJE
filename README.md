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

1. **`EJ00-TITO.html` (Estructura semántica):**
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

---

## Capturas
![Escritorio](parte%20de%20arriba.png)

---

## Lo más difícil
El mayor desafío consistió en sincronizar y dar coherencia temática a todos los archivos JavaScript con la temática de la Compañía de Modelaje MAHE, asegurando que la interacción entre el renderizado de cursos, los filtros de búsqueda y el formulario de inscripción funcionaran sin conflictos en el DOM y adaptándose con elegancia tanto en dispositivos móviles como en pantallas de escritorio.

