
// FUNCIONES AUXILIARES PARA SELECCIONAR ELEMENTOS DEL HTML

// $  -> devuelve el PRIMER elemento que coincida con el selector CSS
// $$ -> devuelve TODOS los elementos que coincidan, en una lista
// Ejemplo: $('.card') trae una tarjeta; $$('.card') trae todas
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];


// ANIMACIONES AL HACER SCROLL (clase "reveal")

// IntersectionObserver avisa cuando un elemento entra en pantalla.
// Sirve para que las secciones aparezcan con una animación suave
// en lugar de verse todas de golpe al cargar la página.
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;      // si aún no es visible, no hace nada
    e.target.classList.add('in');       // agrega la clase "in" -> el CSS lo muestra animado
    io.unobserve(e.target);             // deja de observarlo (la animación solo pasa una vez)
  });
}, { threshold: .15 });                  // se activa cuando el 15% del elemento es visible

// Observa todos los elementos que tengan la clase "reveal"
$$('.reveal').forEach(el => io.observe(el));


// MENÚ PARA CELULAR (BOTÓN HAMBURGUESA)

const navToggle = $('#navToggle');    // botón de 3 rayitas
const navLinks = $('#navLinks');      // lista de enlaces del menú
const navOverlay = $('#navOverlay');  // fondo oscuro detrás del menú

// Abre o cierra el menú según "open" (true = abrir, false = cerrar).
// Está centralizado en una función para que todos los cierres
// (botón, fondo oscuro, enlace, Escape) hagan exactamente lo mismo.
function setMenu(open) {
  navToggle.setAttribute('aria-expanded', open);       // cambia el botón a forma de "X"
  navLinks.classList.toggle('open', open);             // muestra/oculta el panel (el CSS anima)
  navOverlay.classList.toggle('show', open);           // muestra/oculta el fondo oscuro
  document.body.classList.toggle('no-scroll', open);   // bloquea el scroll de la página con el menú abierto
}

// Clic en el botón hamburguesa: alterna entre abierto y cerrado
navToggle.addEventListener('click', () => {
  setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
});

// Clic en el fondo oscuro: cierra el menú
navOverlay.addEventListener('click', () => setMenu(false));

// Si se toca un enlace del menú, este se cierra automáticamente
$$('.nav-links a').forEach(a => a.addEventListener('click', () => setMenu(false)));

// Tecla Escape: también cierra el menú (útil con teclado)
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') setMenu(false);
});

// Si la pantalla se agranda (girar el celular, redimensionar ventana),
// se resetea el menú para que no quede abierto en escritorio
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) setMenu(false);
});


// AÑO AUTOMÁTICO EN EL PIE DE PÁGINA

// Inserta el año actual dentro del <span id="year"> del footer,
// así no hay que cambiarlo a mano cada año
$('#year').textContent = new Date().getFullYear();
