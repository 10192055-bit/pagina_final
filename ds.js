
// ============================================================
// FUNCIONES AUXILIARES PARA SELECCIONAR ELEMENTOS DEL HTML
// ============================================================

// $  -> devuelve el PRIMER elemento que coincida con el selector CSS
// $$ -> devuelve TODOS los elementos que coincidan, en una lista (array)
// Ejemplo: $('.tarjeta') trae una tarjeta; $$('.tarjeta') trae todas
//
// ¿POR QUÉ? Porque document.querySelector(...) es muy largo de escribir.
// Estas funciones nos ahorran repetir código en todo el archivo.
//
// ¿QUÉ PASA SI SE ELIMINAN? El resto del JS deja de funcionar por
// completo, porque todo usa $ y $$ para buscar elementos del HTML.
//
// ¿QUÉ ES `c=document`? Es un parámetro con valor por defecto: si no
// se pasa un segundo argumento, busca en todo el documento (document).
// Sirve para buscar dentro de un contenedor: $$('.tarjeta', miContenedor).
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];


// ============================================================
// MENÚ PARA CELULAR (BOTÓN HAMBURGUESA)
// ============================================================

// Estas 3 líneas guardan referencias a los 3 elementos del menú
// que están en el HTML. Guardarlos en variables evita volver a
// buscarlos cada vez que se necesita alguno (es más rápido y limpio).
//
// ¿QUÉ PASA SI SE ELIMINAN? El menú de celular deja de abrirse y
// el navegador marcará errores en la consola porque el resto del
// código no sabrá a qué elementos referirse.
const botonMenu = $('#botonMenu');      // botón de 3 rayitas (solo visible en celular)
const listaEnlaces = $('#listaEnlaces'); // lista de enlaces del menú
const capaMenu = $('#capaMenu');         // fondo oscuro detrás del menú

// Abre o cierra el menú según "abierto" (true = abrir, false = cerrar).
// Está centralizado en una función para que todos los cierres
// (botón, fondo oscuro, enlace, Escape) hagan exactamente lo mismo
// sin repetir el mismo código 4 veces.
//
// ¿POR QUÉ una sola función? Porque si cada cierre hiciera cosas
// distintas, después sería difícil mantener el código y podrían
// aparecer bugs (errores).
//
// ¿QUÉ HACE CADA LÍNEA?
// - setAttribute('aria-expanded', abierto): le dice al navegador y a
//   programas de accesibilidad (como lectores de pantalla) si el
//   menú está abierto o cerrado. También es lo que el CSS usa para
//   transformar las rayitas en una "X".
// - classList.toggle('abierto', abierto): agrega o quita la clase "abierto".
//   Sin esa clase el menú está escondido; con ella, el CSS lo baja
//   con una animación.
// - classList.toggle('visible', abierto): lo mismo pero para la capa
//   oscura, que se usa para cerrar tocando afuera del menú.
// - body.classList.toggle('sin-scroll', abierto): bloquea el scroll de
//   la página mientras el menú está abierto, para que no se mueva el
//   contenido de atrás.
//
// ¿QUÉ PASA SI SE ELIMINA? El menú se queda abierto para siempre
// y no hay forma de cerrarlo desde el celular.
function cambiarEstadoMenu(abierto) {
  botonMenu.setAttribute('aria-expanded', abierto);
  listaEnlaces.classList.toggle('abierto', abierto);
  capaMenu.classList.toggle('visible', abierto);
  document.body.classList.toggle('sin-scroll', abierto);
}

// Clic en el botón hamburguesa: alterna entre abierto y cerrado.
//
// ¿POR QUÉ se lee el valor actual en vez de usar una variable?
// Porque 'aria-expanded' ya guarda el estado. getAttribute devuelve
// el texto "true" o "false". Si es "true" (!== 'true' da false, o
// sea abierto=false) lo cierra; si es "false" lo abre. Así no hace
// falta una variable extra que pueda desincronizarse.
//
// ¿QUÉ PASA SI SE ELIMINA? Tocar las rayitas ya no hace nada.
botonMenu.addEventListener('click', () => {
  cambiarEstadoMenu(botonMenu.getAttribute('aria-expanded') !== 'true');
});

// Clic en la capa oscura: cierra el menú.
// Es el comportamiento esperado en apps móviles: tocar "afuera"
// del menú lo cierra.
//
// ¿QUÉ PASA SI SE ELIMINA? Solo se podría cerrar con la X o con
// un enlace, lo cual es molesto en celular.
capaMenu.addEventListener('click', () => cambiarEstadoMenu(false));

// Si se toca un enlace del menú, este se cierra automáticamente.
//
// ¿POR QUÉ? Porque el usuario eligió una opción: después de ir a
// "Menú" o "Historia", el panel no debe seguir tapando la pantalla.
// forEach recorre cada enlace y le agrega su propio evento.
//
// ¿QUÉ PASA SI SE ELIMINA? Al tocar un enlace el menú sigue
// abierto y tapa el contenido de la página.
$$('.contenedor-enlaces a').forEach(a => a.addEventListener('click', () => cambiarEstadoMenu(false)));

// Tecla Escape: también cierra el menú (útil con teclado).
// 'keydown' detecta cuando se presiona cualquier tecla.
//
// ¿POR QUÉ Escape? Es el estándar para cerrar ventanas y menús
// en prácticamente todos los programas. También ayuda a personas
// que navegan con teclado (accesibilidad).
//
// ¿QUÉ PASA SI SE ELIMINA? Se pierde la forma de cerrar con teclado;
// el menú solo se cierra con toque/clic.
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') cambiarEstadoMenu(false);
});

// Si la pantalla se agranda (girar el celular, redimensionar la
// ventana), se resetea el menú para que no quede abierto.
//
// ¿POR QUÉ? En pantallas de 768px o más el menú se muestra como
// barra horizontal (no como panel desplegable). Si el celular gira
// a horizontal y el menú seguía "abierto", el panel seguiría puesto
// de más. Al forzar cambiarEstadoMenu(false) todo vuelve a su estado normal.
//
// ¿QUÉ PASA SI SE ELIMINA? Al girar el celular puede quedar el
// menú abierto o la capa oscura puesta sin motivo.
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) cambiarEstadoMenu(false);
});


// ============================================================
// CARRUSEL DE IMÁGENES
// ============================================================

// Solo se ejecuta si el carrusel existe en la página (evita errores).
// Cada ".imagen-carrusel" es un espacio: funcionará igual con o sin imagen.
//
// ¿POR QUÉ el `if (pistaCarrusel)`? Si esta misma página se copia a otro
// archivo que NO tenga el carrusel (por ejemplo menu.html, que también
// usa ds.js), el resto del código intentaría buscar botones que no
// existen y el navegador mostraría errores. Con el if, simplemente
// se salta todo el carrusel.
const pistaCarrusel = $('#pistaCarrusel');   // la fila que se desliza con las imágenes

if (pistaCarrusel) {
  const imagenesCarrusel = $$('.imagen-carrusel', pistaCarrusel); // lista de todos los espacios del carrusel
  const puntosCarrusel = $('#puntosCarrusel');                     // contenedor donde se crean los puntitos
  let indiceActual = 0;                                           // índice = qué imagen se muestra ahora (empieza en 0 = la primera)
  let temporizador;                                                // guardará el ID del temporizador del avance automático

  // Crea un puntito por cada espacio del carrusel.
  // Se crea con JavaScript y no en el HTML porque si algún día se
  // agregan o quitan imágenes, los puntos se ajustan solos y no hay
  // que tocar nada más.
  //
  // ¿QUÉ ES createElement('button')? Crea un botón nuevo en la memoria
  // del navegador. Después se le da estilo (className) y un texto
  // accesible (aria-label) para que lectores de pantalla digan
  // "Ir a la imagen 3".
  imagenesCarrusel.forEach((_, i) => {
    const punto = document.createElement('button');
    punto.className = 'punto-carrusel';
    punto.setAttribute('aria-label', 'Ir a la imagen ' + (i + 1));
    // Al hacer clic en un punto, salta a esa imagen y reinicia el
    // temporizador para que no cambie justo después de elegir.
    punto.addEventListener('click', () => { irA(i); reiniciarAutomatico(); });
    puntosCarrusel.appendChild(punto);   // agrega el punto al HTML
  });
  // Después de crearlos, guarda la lista de todos los puntos para
  // poder encender/apagar el activo desde otras funciones.
  const listaPuntos = $$('.punto-carrusel', puntosCarrusel);

  // Mueve el carrusel al espacio indicado (i) y marca su puntito.
  //
  // ¿POR QUÉ el módulo `% imagenesCarrusel.length`? Es un truco de
  // programación: si i es mayor que el último índice (ej. al pasar
  // del final al principio), el resto de la división lo devuelve al
  // inicio. Así las flechas "dan la vuelta" sin llegar a un final
  // muerto. Ejemplo con 8 imágenes: -1 % 8 = 7 (la última).
  //
  // ¿QUÉ HACE transform? Mueve la fila horizontalmente. translateX(-100%)
  // la corre un ancho completo hacia la izquierda; -200% corre dos, etc.
  // El CSS tiene una transición que hace ese movimiento suave.
  //
  // ¿QUÉ PASA SI SE ELIMINA? El carrusel no se movería nunca.
  function irA(i) {
    indiceActual = (i + imagenesCarrusel.length) % imagenesCarrusel.length;
    pistaCarrusel.style.transform = 'translateX(-' + (indiceActual * 100) + '%)';
    // Enciende el punto de la imagen actual y apaga los demás
    listaPuntos.forEach((d, j) => d.classList.toggle('activo', j === indiceActual));
  }

  // Avanza (paso=1) o retrocede (paso=-1) un espacio.
  // Es solo un atajo corto para no escribir irA(indiceActual + 1) en
  // todos lados.
  //
  // ¿QUÉ PASA SI SE ELIMINA? Las flechas y el automático dejarían
  // de funcionar (no hay otra forma de moverse).
  function mover(paso) {
    irA(indiceActual + paso);
  }

  // Reinicia el avance automático (cambia de imagen cada 5 segundos).
  //
  // ¿QUÉ ES setInterval? Cada cierto tiempo (5000 ms = 5 segundos)
  // ejecuta la función que se le pase. Devuelve un ID que se guarda
  // en temporizador.
  //
  // ¿POR QUÉ clearInterval primero? Para que no se apile: si cada
  // clic creara un temporizador nuevo sin borrar el anterior, el
  // carrusel avanzaría cada vez más rápido (habría varios relojes
  // corriendo a la vez).
  //
  // ¿QUÉ PASA SI SE ELIMINA? El carrusel solo se movería al tocar
  // las flechas o puntos, nunca solo.
  function reiniciarAutomatico() {
    clearInterval(temporizador);
    temporizador = setInterval(() => mover(1), 5000);
  }

  // Botones de flecha: retroceder o avanzar una imagen.
  // Al hacer clic también se reinicia el automático para que la
  // imagen elegida se pueda ver completa los 5 segundos.
  //
  // ¿QUÉ PASA SI SE ELIMINA? Desaparecen las flechas laterales.
  $('#flechaAnterior').addEventListener('click', () => { mover(-1); reiniciarAutomatico(); });
  $('#flechaSiguiente').addEventListener('click', () => { mover(1); reiniciarAutomatico(); });

  // Pausa el avance automático mientras el mouse está encima, y lo
  // reanuda al salir.
  //
  // ¿POR QUÉ? Sin esto, la imagen cambiaría justo cuando el usuario
  // está mirando una, lo cual resulta molesto. Se usa parentElement
  // porque el contenedor (.carrusel) es el área completa con las
  // flechas y los puntos.
  //
  // ¿QUÉ PASA SI SE ELIMINA? El carrusel seguirá cambiando aunque el
  // usuario pase el mouse para ver una imagen con calma.
  pistaCarrusel.parentElement.addEventListener('mouseenter', () => clearInterval(temporizador));
  pistaCarrusel.parentElement.addEventListener('mouseleave', reiniciarAutomatico);

  irA(0);                // muestra la primera imagen al cargar la página
  reiniciarAutomatico(); // arranca el avance automático
}


// ============================================================
// AÑO AUTOMÁTICO EN EL PIE DE PÁGINA
// ============================================================

// Inserta el año actual dentro del <span id="anio"> del footer,
// así no hay que cambiarlo a mano cada año.
//
// ¿QUÉ ES new Date().getFullYear()? Crea un objeto con la fecha y
// hora actuales y extrae solo el año (2026).
//
// ¿QUÉ HACE textContent? Escribe texto dentro de la etiqueta span.
// Si el span no existiera, saldría un error en la consola.
//
// ¿QUÉ PASA SI SE ELIMINA? El footer mostraría "© Naruko Ramen"
// sin año, o un año viejo si se escribiera a mano en el HTML.
const anio = $('#anio');
if (anio) anio.textContent = new Date().getFullYear();
