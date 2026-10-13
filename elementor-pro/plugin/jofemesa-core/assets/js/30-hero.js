/* ==========================================================================
   JOFEMESA · 30 PORTADA
   · Hero en carrusel (HeroCarrusel.tsx): dos portadas que son contenedores
     nativos de Elementor; este archivo solo orquesta.
   · Buscador [jm_buscador], próxima convocatoria
     [jm_proxima_convocatoria] y las flechas de cabecera del carrusel de
     destacadas (Destacadas.tsx).
   ========================================================================== */
(function () {
  "use strict";
  if (!window.JM) return;
  var JM = window.JM;

  /** Lo que dura cada portada. Es la duración de la barra de progreso. */
  var DURACION_MS = 8000;
  var ROTULOS = { alquiler: "Alquiler", formacion: "Formación" };

  /* Trazos de Lucide (ISC), los mismos iconos que el original. */
  var TRAZOS = {
    izquierda: '<path d="m15 18-6-6 6-6"/>',
    derecha: '<path d="m9 18 6-6-6-6"/>',
    abajo: '<path d="m6 9 6 6 6-6"/>'
  };
  function icono(nombre, tam, trazo) {
    return '<svg class="jm-ico" xmlns="http://www.w3.org/2000/svg" width="' + tam + '" height="' + tam +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + trazo +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + TRAZOS[nombre] + "</svg>";
  }
  function crear(etiqueta, clase, html) {
    var el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (html) el.innerHTML = html;
    return el;
  }
  /** Fuerza el reinicio de una animación CSS al volver a poner la clase. */
  function reiniciarClase(el, clase) {
    el.classList.remove(clase);
    void el.offsetWidth;
    el.classList.add(clase);
  }

  /* ========================================================================
     Hero
     ======================================================================== */

  function iniciarHero(raiz) {
    var portadas = Array.prototype.filter.call(raiz.querySelectorAll("[data-jm-portada]"), function (p) {
      return p.closest('[data-jm="hero"]') === raiz;
    });
    var n = portadas.length;
    if (n < 2) {
      if (n === 1) portadas[0].setAttribute("data-estado", "activa");
      raiz.setAttribute("data-jm-listo", "");
      return;
    }

    var rotulos = portadas.map(function (p) {
      var id = p.getAttribute("data-jm-portada") || "";
      return p.getAttribute("data-jm-rotulo") || ROTULOS[id] || (id.charAt(0).toUpperCase() + id.slice(1));
    });

    var activa = 0;
    var previa = null;
    var ciclo = 0;
    var encima = false;
    var foco = false;
    /* Con «reducir movimiento» la barra no avanza sola; en el editor, tampoco. */
    var quieto = JM.reducido || JM.enEditor();
    if (quieto) raiz.classList.add("jm-hero--quieto");

    var siguienteDe = function (paso) { return (activa + paso + n) % n; };

    /* ---------- Accesibilidad de la raíz y de las portadas ---------- */
    raiz.setAttribute("aria-roledescription", "carrusel");
    if (!raiz.getAttribute("aria-label")) raiz.setAttribute("aria-label", "Portadas de JOFEMESA");
    portadas.forEach(function (p, i) {
      p.setAttribute("role", "group");
      p.setAttribute("aria-roledescription", "portada");
      p.setAttribute("aria-label", (i + 1) + " de " + n + ": " + rotulos[i]);
      /* Al terminar la cortina, la portada de debajo se oculta. */
      p.addEventListener("animationend", function (e) {
        if (e.target === p && e.animationName === "jm-hero-cortina") {
          previa = null;
          pintar();
        }
      });
    });

    /* ---------- Flechas laterales (desde 1440 px) ---------- */
    var flechaAnt = crear("button", "jm-hero__flecha jm-hero__flecha--anterior", icono("izquierda", 26, 2));
    var flechaSig = crear("button", "jm-hero__flecha jm-hero__flecha--siguiente", icono("derecha", 26, 2));
    [flechaAnt, flechaSig].forEach(function (b) { b.type = "button"; });
    flechaAnt.addEventListener("click", function () { ir(activa - 1); });
    flechaSig.addEventListener("click", function () { ir(activa + 1); });

    /* ---------- Mando: pestañas con progreso + flechas ---------- */
    var mando = crear("div", "jm-hero__mando");
    var fila = crear("div", "jm-contenedor jm-hero__mando-fila");
    var lista = crear("div", "jm-hero__pestanas");
    lista.setAttribute("role", "tablist");
    lista.setAttribute("aria-label", "Elegir portada");
    var pestanas = rotulos.map(function (r, i) {
      var b = crear("button", "jm-hero__pestana");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.innerHTML = '<span class="jm-hero__rotulo"></span><span class="jm-hero__carril"></span>';
      b.querySelector(".jm-hero__rotulo").textContent = r;
      b.addEventListener("click", function () { ir(i); });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") ir(activa + 1);
        if (e.key === "ArrowLeft") ir(activa - 1);
      });
      lista.appendChild(b);
      return b;
    });

    var botones = crear("div", "jm-hero__botones-mando");
    var btnAtras = crear("button", "jm-hero__boton jm-hero__boton--atras", icono("izquierda", 20, 2));
    btnAtras.type = "button";
    btnAtras.setAttribute("aria-label", "Portada anterior");
    btnAtras.addEventListener("click", function () { ir(activa - 1); });
    /* «Siguiente: Formación», con nombre: una flecha sola no dice qué hay detrás. */
    var btnSig = crear("button", "jm-hero__boton jm-hero__boton--siguiente",
      '<span class="jm-hero__boton-texto"></span><span class="jm-hero__boton-circulo">' + icono("derecha", 17, 2.25) + "</span>");
    btnSig.type = "button";
    btnSig.addEventListener("click", function () { ir(activa + 1); });
    botones.appendChild(btnAtras);
    botones.appendChild(btnSig);

    fila.appendChild(lista);
    fila.appendChild(botones);
    mando.appendChild(fila);

    /* Pista de scroll, decorativa. */
    var pista = crear("div", "jm-hero__pista", icono("abajo", 22, 1.75));
    pista.setAttribute("aria-hidden", "true");

    raiz.appendChild(flechaAnt);
    raiz.appendChild(flechaSig);
    raiz.appendChild(mando);
    raiz.appendChild(pista);

    /* ---------- Pausa: ratón encima o foco dentro (el buscador) ---------- */
    function pausa() {
      if (encima || foco) raiz.setAttribute("data-pausado", "");
      else raiz.removeAttribute("data-pausado");
    }
    raiz.addEventListener("mouseenter", function () { encima = true; pausa(); });
    raiz.addEventListener("mouseleave", function () { encima = false; pausa(); });
    raiz.addEventListener("focusin", function () { foco = true; pausa(); });
    raiz.addEventListener("focusout", function (e) {
      if (!raiz.contains(e.relatedTarget)) { foco = false; pausa(); }
    });

    /* ---------- La barra de progreso ES el temporizador ---------- */
    var barra = null;
    function ponerBarra() {
      if (barra && barra.parentNode) barra.parentNode.removeChild(barra);
      barra = crear("span", "jm-hero__progreso");
      barra.style.setProperty("--duracion-hero", DURACION_MS + "ms");
      if (!quieto) {
        barra.addEventListener("animationend", function (e) {
          if (e.animationName === "jm-hero-progreso") ir(activa + 1);
        });
      }
      pestanas[activa].querySelector(".jm-hero__carril").appendChild(barra);
    }

    function pintar() {
      portadas.forEach(function (p, i) {
        var esActiva = i === activa;
        p.setAttribute("data-estado", esActiva ? "activa" : (i === previa ? "previa" : ""));
        /* Ni el tabulador ni el lector de pantalla entran en una portada que no se ve. */
        if (esActiva) p.removeAttribute("inert");
        else p.setAttribute("inert", "");
      });
      pestanas.forEach(function (b, i) { b.setAttribute("aria-selected", i === activa ? "true" : "false"); });
      flechaAnt.setAttribute("aria-label", "Portada anterior: " + rotulos[siguienteDe(-1)]);
      flechaSig.setAttribute("aria-label", "Portada siguiente: " + rotulos[siguienteDe(1)]);
      btnSig.setAttribute("aria-label", "Portada siguiente: " + rotulos[siguienteDe(1)]);
      btnSig.querySelector(".jm-hero__boton-texto").textContent = "Siguiente: " + rotulos[siguienteDe(1)];
    }

    function ir(i) {
      var destino = (i + n) % n;
      if (destino === activa) return;
      previa = activa;
      activa = destino;
      ciclo += 1;
      pintar();

      var p = portadas[activa];
      portadas.forEach(function (q) { q.classList.remove("jm-hero--cortina", "jm-hero--entra"); });
      /* La cortina va sobre la portada ENTERA: si solo cubría la foto, el
         texto nuevo aparecía encima del viejo. */
      if (!JM.reducido) reiniciarClase(p, "jm-hero--cortina");
      else previa = null;
      reiniciarClase(p, "jm-hero--entra");

      /* La cuchilla roja: fuera de las portadas, o la cortina la recortaría. */
      var vieja = raiz.querySelector(".jm-hero__cuchilla");
      if (vieja) vieja.parentNode.removeChild(vieja);
      if (!JM.reducido) {
        var cuchilla = crear("span", "jm-hero__cuchilla");
        cuchilla.setAttribute("aria-hidden", "true");
        cuchilla.addEventListener("animationend", function () {
          if (cuchilla.parentNode) cuchilla.parentNode.removeChild(cuchilla);
        });
        raiz.appendChild(cuchilla);
      }
      ponerBarra();
      if (JM.reducido) pintar();
    }

    pintar();
    portadas[activa].classList.add("jm-hero--entra");
    ponerBarra();
    raiz.setAttribute("data-jm-listo", "");
  }

  /* ========================================================================
     Buscador: sin «?q=» vacío en la URL (el original no lo pone)
     ======================================================================== */

  function iniciarBuscador(raiz) {
    var form = raiz.querySelector("form");
    var campo = raiz.querySelector('input[name="q"]');
    if (!form || !campo) return;
    form.addEventListener("submit", function () {
      var v = campo.value.trim();
      campo.value = v;
      if (!v) {
        campo.disabled = true;
        setTimeout(function () { campo.disabled = false; }, 0);
      }
    });
  }

  /* ========================================================================
     Próxima convocatoria: la elige el navegador, que sabe qué día es
     ======================================================================== */

  var MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  function partesFecha(iso) {
    var p = iso.split("-").map(Number);
    var f = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    return {
      dia: p[2],
      mesCorto: MESES_CORTOS[p[1] - 1],
      diaSemana: DIAS[f.getUTCDay()],
      claveMes: p[0] + "-" + String(p[1]).padStart(2, "0")
    };
  }

  function iniciarProxima(raiz) {
    var nodo = raiz.querySelector(".jm-proxima__datos");
    var lista = [];
    try { lista = JSON.parse(nodo ? nodo.textContent : "[]") || []; } catch (e) { lista = []; }
    var hoy = JM.hoy();
    var proximas = lista.filter(function (c) { return c.f >= hoy; });
    var sig = proximas[0];
    if (!sig) {
      raiz.hidden = true;
      return;
    }
    var f = partesFecha(sig.f);
    var mas = proximas.filter(function (c) { return partesFecha(c.f).claveMes === f.claveMes; }).length - 1;
    var poner = function (campo, texto) {
      var el = raiz.querySelector('[data-campo="' + campo + '"]');
      if (el) el.textContent = texto;
    };
    poner("dia", String(f.dia));
    poner("mes", f.mesCorto);
    poner("curso", sig.c || "");
    poner("norma", sig.n ? " · " + sig.n : "");
    poner("sede", sig.s || "");
    poner("semana", f.diaSemana);
    poner("mas", mas > 0 ? "+" + mas + " este mes" : "Calendario");
    raiz.hidden = false;
  }

  /* ========================================================================
     Destacadas: el par de flechas de la cabecera mueve el Loop Carousel
     ======================================================================== */

  function iniciarDestacadas(raiz) {
    var acciones = raiz.querySelector(".jm-destacadas__acciones");
    var carrusel = raiz.querySelector(".jm-destacadas__carrusel") || raiz.querySelector(".elementor-widget-loop-carousel");
    if (!acciones || !carrusel) return;

    function mover(sentido) {
      var el = carrusel.querySelector(".swiper, .swiper-container");
      var inst = el && (el.swiper || (window.jQuery && window.jQuery(el).data("swiper")));
      if (inst && typeof inst.slideNext === "function") {
        if (sentido < 0) inst.slidePrev();
        else inst.slideNext();
        return;
      }
      var nativo = carrusel.querySelector(sentido < 0 ? ".elementor-swiper-button-prev" : ".elementor-swiper-button-next");
      if (nativo) nativo.click();
    }

    var grupo = crear("div", "jm-destacadas__flechas");
    [["Ver las anteriores", -1, "izquierda"], ["Ver las siguientes", 1, "derecha"]].forEach(function (d) {
      var b = crear("button", "jm-destacadas__flecha", icono(d[2], 19, 2));
      b.type = "button";
      b.setAttribute("aria-label", d[0]);
      b.addEventListener("click", function () { mover(d[1]); });
      grupo.appendChild(b);
    });
    acciones.insertBefore(grupo, acciones.firstChild);
  }

  JM.enCada('[data-jm="hero"]', iniciarHero);
  JM.enCada('[data-jm="buscador"]', iniciarBuscador);
  JM.enCada('[data-jm="proxima-convocatoria"]', iniciarProxima);
  JM.enCada('[data-jm="destacadas"]', iniciarDestacadas);
})();
