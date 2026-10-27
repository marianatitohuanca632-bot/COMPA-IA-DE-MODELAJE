// ── 1. OBJETO LITERAL ──────────────────────────────────────────────
const CompaniaModelaje = {
  nombre: "Clase mensual damas",
  precio: 250,
  categoria: "Modelaje",
  stock: 40,
  disponible: true,
};

console.log(CompaniaModelaje.nombre);

const propiedad = "precio";
console.log(CompaniaModelaje[propiedad]);

CompaniaModelaje.stock = 35;
CompaniaModelaje.horarios = "Mañana y tarde";
delete CompaniaModelaje.horarios;

// ── 2. DESTRUCTURING ────────────────────────────────────────────────────
const { nombre, precio } = CompaniaModelaje;
console.log(`${nombre} cuesta Bs ${precio}`);

const claseEspecial = { ...CompaniaModelaje, precio: 220, nombre: "Clase Especial Damas" };
console.log(claseEspecial);

// ── 3. ARREGLO DE OBJETOS (Cursos de la Compañía de Modelaje MAHE) ───────
const productos = [
  { id: 1, nombre: "Categoria Damas", precio: 250, categoria: "Modelaje", publico: "Damas", stock: 40, disponible: true, descripcion: "Técnica de pasarela de alta costura, postura corporal y proyección escénica femenina." },
  { id: 2, nombre: "Categoria Varones", precio: 200, categoria: "Modelaje", publico: "Varones", stock: 25, disponible: true, descripcion: "Presencia escénica, pasarela comercial moderna y porte de distinción masculino." },
  { id: 3, nombre: "Categoria Kids", precio: 180, categoria: "Modelaje", publico: "Kids", stock: 30, disponible: true, descripcion: "Desarrollo de seguridad personal, postura adecuada y expresión creativa infantil." },
  { id: 4, nombre: "Oratoria y Locucion", precio: 120, categoria: "Formacion", publico: "Todos", stock: 20, disponible: true, descripcion: "Vocalización, dominio de micrófono ante público y seguridad ante cámaras de televisión." },
  { id: 5, nombre: "Pasarela y Giros", precio: 150, categoria: "Modelaje", publico: "Damas", stock: 20, disponible: true, descripcion: "Dominio de giros técnicos, ritmo en pasarela y manejo de prendas de diseñador." },
  { id: 6, nombre: "Baile y Coreografia", precio: 130, categoria: "Danza", publico: "Todos", stock: 25, disponible: true, descripcion: "Ritmo, coordinación corporal, agilidad y destreza para espectáculos de moda." },
  { id: 7, nombre: "Expresion Corporal", precio: 100, categoria: "Formacion", publico: "Todos", stock: 20, disponible: true, descripcion: "Manejo gestual, soltura frente a audiencias y dominio emocional en escena." },
  { id: 8, nombre: "Etiqueta y Protocolo", precio: 120, categoria: "Formacion", publico: "Todos", stock: 15, disponible: true, descripcion: "Comportamiento diplomático, modales en cócteles, eventos sociales y cenas de gala." },
  { id: 9, nombre: "Fotopose Editorial", precio: 100, categoria: "Fotografia", publico: "Todos", stock: 15, disponible: true, descripcion: "Ángulos faciales, iluminación de estudio y poses para catálogos y revistas de moda." },
  { id: 10, nombre: "Maquillaje y Estilismo", precio: 140, categoria: "Belleza", publico: "Damas", stock: 15, disponible: true, descripcion: "Técnicas profesionales de automaquillaje para pasarela, iluminación y combinación de vestuario." },
];

// ── 4. LOS MÉTODOS QUE IMPORTAN ─────────────────────────────────────────
productos.forEach(p => console.log(p.nombre));

const nombres = productos.map(p => p.nombre);
console.log(nombres);

const disponibles = productos.filter(p => p.disponible);
console.log(disponibles.length, "de", productos.length, "disponibles");

const caro = productos.find(p => p.precio > 200);
console.log(caro);

console.log(nombres.includes("Oratoria y Locucion"));
console.log(productos.some(p => p.stock === 0));
console.log(productos.every(p => p.precio > 0));

const porPrecio = [...productos].sort((a, b) => a.precio - b.precio);
console.log(porPrecio.map(p => p.nombre));

const valorInventario = productos.reduce((acumulador, p) => acumulador + p.precio * p.stock, 0);
console.log("Valor total de servicios: Bs", valorInventario.toFixed(2));

// ── 5. ENCADENAR ────────────────────────────────────────────────────────
const nombresDisponibles = productos
  .filter(p => p.disponible)
  .map(p => p.nombre);
console.log(nombresDisponibles);

const totalFotografiaEnStock = productos
  .filter(p => p.categoria === "Fotografia" && p.disponible)
  .reduce((total, p) => total + p.precio * p.stock, 0);
console.log("Cursos de Fotografía en stock: Bs", totalFotografiaEnStock.toFixed(2));

const porCategoria = productos.reduce((grupos, p) => {
  if (!grupos[p.categoria]) grupos[p.categoria] = [];
  grupos[p.categoria].push(p.nombre);
  return grupos;
}, {});
console.log(porCategoria);

// ── 6. CLASES ───────────────────────────────────────────────────────────
class ServicioModelaje {
  constructor(nombre, precio, stock) {
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  estaDisponible() {
    return this.stock > 0;
  }

  valorEnStock() {
    return this.precio * this.stock;
  }
}

const cursoOratoria = new ServicioModelaje("Oratoria y Locucion", 120, 20);
console.log(cursoOratoria.nombre, cursoOratoria.estaDisponible(), cursoOratoria.valorEnStock());

class ServicioConDescuento extends ServicioModelaje {
  constructor(nombre, precio, stock, descuento) {
    super(nombre, precio, stock);
    this.descuento = descuento;
  }

  precioFinal() {
    return this.precio * (1 - this.descuento / 100);
  }
}

const promoPasarela = new ServicioConDescuento("Pasarela y Giros", 150, 20, 10);
console.log(promoPasarela.precioFinal(), promoPasarela.estaDisponible());