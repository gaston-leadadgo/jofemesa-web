/* ==========================================================================
   JOFEMESA · 10 GLOBAL
   Cabecera, franja y menú móvil:
   · contador de fundación en vivo  [data-jm="contador-fundacion"]
   · antigüedad en línea            [data-jm="antiguedad"]
   · desplegables (delegaciones, teléfonos)  [data-jm="desplegable"]
   · compactación de la cabecera    [data-jm="cabecera"]  (Avanzado → Atributos)
   · menú móvil                     [data-jm="boton-menu"] → #menu-movil
   · enlace activo del menú         .jm-menu (Mega Menu) y .jm-nav-movil
   ========================================================================== */
(function () {
  "use strict";
  if (!window.JM) return;
  var JM = window.JM;

  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
    "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  function plural(n, uno, varios) { return n === 1 ? uno : varios; }

  /** «1987-03-24» → [1987, 3, 24], o null si no es una fecha. */
  function partes(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
    return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
  }

  /**
   * Años, meses y días exactos desde la fundación (src/lib/utils/antiguedad.ts).
   * En hora LOCAL: una fecha ISO sin hora se lee como medianoche UTC y al
   * oeste de Greenwich caería el día anterior.
   */
  function desglose(iso, hoy) {
    var p = partes(iso);
    if (!p) return null;
    var desde = new Date(p[0], p[1] - 1, p[2]);
    var anios = hoy.getFullYear() - desde.getFullYear();
    var meses = hoy.getMonth() - desde.getMonth();
    var dias = hoy.getDate() - desde.getDate();
    if (dias < 0) {
      meses -= 1;
      // Día 0 del mes actual = último día del mes anterior.
      dias += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
    }
    if (meses < 0) {
      anios -= 1;
      meses += 12;
    }
    return { anios: anios, meses: meses, dias: dias };
  }

  function fundacionDe(el) {
    return el.getAttribute("data-fundacion") || JM.datos.fundacion || "1987-03-24";
  }

  /**
   * Repinta cuando cambia el día: se comprueba cada minuto y solo se toca
   * el DOM si la cadena «a|m|d» ha cambiado de verdad.
   */
  function alCambiarDia(iso, pintar) {
    var clave = "";
    function revisar() {
      var d = desglose(iso, new Date());
      if (!d) return;
      var nueva = d.anios + "|" + d.meses + "|" + d.dias;
      if (nueva === clave) return;
      clave = nueva;
      pintar(d);
    }
    revisar();
    window.setInterval(revisar, 60000);
  }

  /* ---------- Contador de la franja ----------
     La cuenta de 0 a N es CSS (@property --jm-n + counter()). El valor
     visible es un pseudo-elemento, así que la frase completa va aparte
     para el lector de pantalla. */
  function cifra(n, retardo) {
    return '<span class="jm-cifra" style="--jm-n:' + Number(n) + ";--jm-retardo-cifra:" + Number(retardo) + 'ms"></span>';
  }

  function iniciarContador(raiz) {
    var texto = raiz.querySelector(".jm-contador__texto");
    var iso = fundacionDe(raiz);
    var p = partes(iso);
    if (!texto || !p) return;
    var dd = String(p[2]).padStart(2, "0");
    var mm = String(p[1]).padStart(2, "0");

    alCambiarDia(iso, function (d) {
      var sep = '<span class="jm-contador__sep"> · </span>';
      texto.innerHTML =
        '<span class="jm-sr">' + d.anios + " años, " + d.meses + " meses y " + d.dias +
        " días desde el " + p[2] + " de " + MESES[p[1] - 1] + " de " + p[0] + "</span>" +
        '<span class="jm-contador__cifras" aria-hidden="true">' +
        cifra(d.anios, 0) + " " + plural(d.anios, "año", "años") + sep +
        cifra(d.meses, 180) + " " + plural(d.meses, "mes", "meses") + sep +
        cifra(d.dias, 360) + " " + plural(d.dias, "día", "días") +
        '<span class="jm-contador__desde"> desde el ' + dd + "·" + mm + "·" + p[0] + "</span>" +
        "</span>";
    });
  }

  function iniciarAntiguedad(el) {
    alCambiarDia(fundacionDe(el), function (d) {
      el.textContent =
        d.anios + " " + plural(d.anios, "año", "años") + " · " +
        d.meses + " " + plural(d.meses, "mes", "meses") + " · " +
        d.dias + " " + plural(d.dias, "día", "días");
    });
  }

  /* ---------- Desplegables (useDesplegable.ts) ----------
     Se abren con clic, no al pasar por encima. Se cierran con Escape
     (devolviendo el foco al botón), con un clic fuera, cuando el foco sale
     del bloque con el tabulador y al pulsar un enlace del panel. */
  function iniciarDesplegable(raiz) {
    var boton = raiz.querySelector("[data-jm-boton]");
    var panel = raiz.querySelector("[data-jm-panel]");
    if (!boton || !panel) return;
    var abierto = false;

    function alPulsarFuera(e) {
      if (!raiz.contains(e.target)) fijar(false);
    }
    function alPulsarTecla(e) {
      if (e.key === "Escape") fijar(false, true);
    }
    function fijar(valor, devolverFoco) {
      if (valor === abierto) return;
      abierto = valor;
      boton.setAttribute("aria-expanded", valor ? "true" : "false");
      panel.hidden = !valor;
      raiz.classList.toggle("jm-abierto", valor);
      if (valor) {
        document.addEventListener("pointerdown", alPulsarFuera);
        document.addEventListener("keydown", alPulsarTecla);
        // El de teléfonos cierra el menú móvil al abrirse (alAbrir en Header.tsx).
        if (raiz.hasAttribute("data-cierra-menu")) JM.emitir("cerrar-menu");
        JM.emitir("desplegable-abierto", raiz);
      } else {
        document.removeEventListener("pointerdown", alPulsarFuera);
        document.removeEventListener("keydown", alPulsarTecla);
        if (devolverFoco) boton.focus();
      }
    }

    boton.addEventListener("click", function () { fijar(!abierto); });
    raiz.addEventListener("focusout", function (e) {
      if (abierto && e.relatedTarget && !raiz.contains(e.relatedTarget)) fijar(false);
    });
    panel.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a")) fijar(false);
    });
    JM.escuchar("desplegable-abierto", function (otro) {
      if (otro !== raiz) fijar(false);
    });
  }

  /* ---------- Cabecera que se compacta al bajar ---------- */
  function iniciarCabecera(cab) {
    var compacta = null;
    function medir() {
      var valor = window.scrollY > 120;
      if (valor === compacta) return;
      compacta = valor;
      cab.classList.toggle("jm-compacta", valor);
    }
    medir();
    window.addEventListener("scroll", medir, { passive: true });
  }

  /* ---------- Menú móvil ----------
     El botón lo pinta [jm_boton_menu]; el panel es un contenedor nativo de
     Elementor con ID CSS «menu-movil». Bloquea el scroll de fondo mientras
     está abierto; se cierra con Escape, al pulsar un enlace del panel, al
     abrir el desplegable de teléfonos y al pasar a escritorio. */
  function iniciarBotonMenu(boton) {
    var idPanel = boton.getAttribute("aria-controls") || "menu-movil";
    var abierto = false;
    var escritorio = window.matchMedia("(min-width: 1024px)");

    function panel() { return document.getElementById(idPanel); }

    function fijar(valor, devolverFoco) {
      var p = panel();
      if (!p || valor === abierto) return;
      abierto = valor;
      if (valor) {
        var cab = boton.closest('[data-jm="cabecera"]') || document.querySelector('[data-jm="cabecera"]');
        if (cab) {
          p.style.setProperty("--jm-menu-movil-top", Math.max(0, Math.round(cab.getBoundingClientRect().bottom)) + "px");
        }
      }
      p.classList.toggle("jm-abierto", valor);
      boton.setAttribute("aria-expanded", valor ? "true" : "false");
      boton.setAttribute("aria-label", valor ? "Cerrar menú" : "Abrir menú");
      if (!JM.enEditor()) document.body.style.overflow = valor ? "hidden" : "";
      if (!valor && devolverFoco) boton.focus();
    }

    boton.addEventListener("click", function () { fijar(!abierto); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && abierto) fijar(false, true);
    });
    document.addEventListener("click", function (e) {
      if (!abierto) return;
      var a = e.target.closest ? e.target.closest("a") : null;
      var p = panel();
      if (a && p && p.contains(a)) fijar(false);
    });
    JM.escuchar("cerrar-menu", function () { fijar(false); });
    var alCambiar = function (e) { if (e.matches) fijar(false); };
    if (escritorio.addEventListener) escritorio.addEventListener("change", alCambiar);
    else if (escritorio.addListener) escritorio.addListener(alCambiar);
  }

  /* ---------- Enlace activo ----------
     Como `activa()` de Header.tsx: la portada solo cuenta si es exacta; el
     resto, también en sus subrutas (/alquiler/elevacion/ marca «Alquiler»). */
  function limpia(ruta) { return ruta.replace(/\/+$/, "") || "/"; }
  var rutaInicio = (function () {
    try { return limpia(new URL(JM.datos.inicio || "/", location.href).pathname); } catch (e) { return "/"; }
  })();

  function esActiva(href) {
    var u;
    try { u = new URL(href, location.href); } catch (e) { return false; }
    if (u.origin !== location.origin) return false;
    var ruta = limpia(u.pathname);
    var actual = limpia(location.pathname);
    if (ruta === rutaInicio) return actual === rutaInicio;
    return actual === ruta || actual.indexOf(ruta + "/") === 0;
  }

  function marcar(enlace, contenedor) {
    if (!enlace.getAttribute("href") || !esActiva(enlace.href)) return;
    enlace.setAttribute("aria-current", "page");
    (contenedor || enlace).classList.add("jm-activo");
  }

  function iniciarMenu(raiz) {
    var nav = raiz.querySelector("nav");
    if (nav) nav.setAttribute("aria-label", "Navegación principal");
    raiz.querySelectorAll(".e-n-menu-title-container[href]").forEach(function (a) {
      marcar(a, a.closest(".e-n-menu-title"));
    });
  }

  function iniciarNavMovil(raiz) {
    raiz.querySelectorAll(".jm-nav-movil__enlace").forEach(function (a) { marcar(a); });
  }

  JM.enCada('[data-jm="contador-fundacion"]', iniciarContador);
  JM.enCada('[data-jm="antiguedad"]', iniciarAntiguedad);
  JM.enCada('[data-jm="desplegable"]', iniciarDesplegable);
  JM.enCada('[data-jm="cabecera"]', iniciarCabecera);
  JM.enCada('[data-jm="boton-menu"]', iniciarBotonMenu);
  JM.enCada(".jm-menu", iniciarMenu);
  JM.enCada(".jm-nav-movil", iniciarNavMovil);
})();
