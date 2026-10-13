/* ==========================================================================
   JOFEMESA · 44 MODAL GENÉRICO
   Traducción de ficha/ModalShell.tsx + las rutas interceptadas de @modal:
   la ficha (y el comparador, y la información de un curso) se abren encima
   del listado sin perder el scroll ni los filtros, y al recargar o pegar la
   URL se sirve la página completa.

   CONTRATO (lo usa también formación):
   · Disparadores: un enlace dentro de un elemento con clase `jm-abrir-modal`
     (o el propio <a>), o un enlace dentro de un contenedor con el atributo
     `data-jm-modal`. El valor de `data-jm-modal` es una lista de prefijos de
     ruta separados por comas (`/maquina/`); vacío = todos los enlaces del
     contenedor. Un enlace con clase `jm-sin-modal` (o dentro de una) nunca
     abre el modal.
   · La página destino marca lo que se enseña con el atributo
     `data-jm-modal-contenido` (Avanzado → Atributos: `data-jm-modal-contenido|`).
   · Opcionales, en el disparador o en el contenido:
       data-jm-modal-titulo   texto de la barra (por defecto, el <title>)
       data-jm-modal-enlace   texto del enlace a la página («Abrir la ficha»;
                              vacío = sin enlace)
       data-jm-modal-cerrar   etiqueta accesible de la ✕
   · Eventos: `jm:modal` {abierto, url} y `jm:contenido` (nodo insertado),
     para que los módulos inicien lo que traiga el contenido.
   ========================================================================== */
(function () {
  "use strict";
  if (!window.JM) return;

  function ico(trazos, tam) {
    return '<svg width="' + tam + '" height="' + tam + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + trazos + "</svg>";
  }
  var I_X = ico('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', 21);
  var I_MAX = ico('<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/>', 19);
  var I_MIN = ico('<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/>', 19);
  var I_EXT = ico('<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>', 15);

  var dlg = null, el = {};
  var abierto = false, cargando = false, completa = false;
  var focoPrevio = null, tituloPrevio = "", overflowPrevio = "";
  var urlBase = null, hashPendiente = null;

  function construir() {
    if (dlg) return;
    dlg = document.createElement("dialog");
    dlg.className = "jm-modal";
    dlg.innerHTML =
      '<div class="jm-modal__marco">' +
      '<div class="jm-modal__panel">' +
      '<div class="jm-modal__barra">' +
      '<p class="jm-label jm-modal__titulo"></p>' +
      '<div class="jm-modal__acciones">' +
      '<a class="jm-modal__enlace" href="#">' + I_EXT + '<span class="jm-modal__enlace-texto"></span></a>' +
      '<button type="button" class="jm-boton jm-modal__completa" aria-pressed="false" aria-label="Ver la ficha a pantalla completa">' + I_MAX + "</button>" +
      '<button type="button" class="jm-boton jm-modal__cerrar" autofocus>' + I_X + "</button>" +
      "</div></div>" +
      '<div class="jm-modal__cuerpo" tabindex="-1"><div class="jm-modal__contenido"></div></div>' +
      '<div class="jm-modal__pie"><a class="jm-modal__enlace-movil" href="#">' + I_EXT + '<span class="jm-modal__enlace-texto"></span></a></div>' +
      "</div></div>";
    document.body.appendChild(dlg);
    el.marco = dlg.querySelector(".jm-modal__marco");
    el.titulo = dlg.querySelector(".jm-modal__titulo");
    el.enlace = dlg.querySelector(".jm-modal__enlace");
    el.enlaceMovil = dlg.querySelector(".jm-modal__enlace-movil");
    el.pie = dlg.querySelector(".jm-modal__pie");
    el.completa = dlg.querySelector(".jm-modal__completa");
    el.cerrar = dlg.querySelector(".jm-modal__cerrar");
    el.cuerpo = dlg.querySelector(".jm-modal__cuerpo");
    el.contenido = dlg.querySelector(".jm-modal__contenido");

    el.cerrar.addEventListener("click", cerrar);
    el.completa.addEventListener("click", function () { ponerCompleta(!completa); });
    /* Escape: se evita el cierre nativo para poder retroceder la URL. */
    dlg.addEventListener("cancel", function (e) { e.preventDefault(); cerrar(); });
    /* Clic en el fondo, no en el panel. */
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg || e.target === el.marco) cerrar();
    });
  }

  function ponerCompleta(si) {
    completa = si;
    dlg.classList.toggle("jm-modal--completa", si);
    el.completa.setAttribute("aria-pressed", si ? "true" : "false");
    el.completa.setAttribute("aria-label", si ? "Salir de pantalla completa" : "Ver la ficha a pantalla completa");
    el.completa.innerHTML = si ? I_MIN : I_MAX;
  }

  function atributo(nombre, disparador, nodo) {
    var d = disparador && disparador.closest("[" + nombre + "]");
    if (d) return d.getAttribute(nombre);
    if (nodo && nodo.hasAttribute(nombre)) return nodo.getAttribute(nombre);
    return null;
  }

  function tituloDe(doc, nodo) {
    var t = (doc.title || "").split(/\s+[–—|-]\s+/)[0].trim();
    if (t) return t;
    var h = nodo.querySelector("h1");
    return h ? h.textContent.trim() : "";
  }

  /* Las hojas de estilo de la página destino que aquí no estén (CSS de la
     plantilla de Elementor) se añaden una vez. */
  function copiarEstilos(doc) {
    doc.querySelectorAll('link[rel="stylesheet"][href]').forEach(function (l) {
      var href = l.getAttribute("href");
      if (document.querySelector('link[rel="stylesheet"][href="' + href.replace(/"/g, '\\"') + '"]')) return;
      var n = document.createElement("link");
      n.rel = "stylesheet";
      n.href = href;
      document.head.appendChild(n);
    });
    doc.querySelectorAll('style[id^="elementor-post-"]').forEach(function (s) {
      if (document.getElementById(s.id)) return;
      document.head.appendChild(document.importNode(s, true));
    });
  }

  function iniciarContenido(nodo) {
    /* Lo que el motor de revelado no va a observar, se ve entero. */
    nodo.querySelectorAll("[data-revelar], .jm-filete").forEach(function (n) { n.setAttribute("data-visible", ""); });
    var ef = window.elementorFrontend;
    if (ef && ef.elementsHandler && ef.elementsHandler.runReadyTrigger) {
      nodo.querySelectorAll(".elementor-element").forEach(function (n) {
        try { ef.elementsHandler.runReadyTrigger(window.jQuery ? window.jQuery(n) : n); } catch (e) { /* widget sin manejador */ }
      });
    }
    JM.emitir("contenido", nodo);
  }

  function mostrar(nodo, titulo, enlaceTexto, cerrarTexto, href) {
    construir();
    focoPrevio = document.activeElement;
    tituloPrevio = document.title;
    el.titulo.textContent = titulo;
    dlg.setAttribute("aria-label", titulo);
    el.cerrar.setAttribute("aria-label", cerrarTexto || "Cerrar la ficha y volver al catálogo");
    var conEnlace = enlaceTexto !== "";
    [el.enlace, el.enlaceMovil].forEach(function (a) {
      a.hidden = !conEnlace;
      a.href = href;
      a.querySelector(".jm-modal__enlace-texto").textContent = enlaceTexto || "";
    });
    el.pie.hidden = !conEnlace;
    ponerCompleta(false);
    el.contenido.innerHTML = "";
    el.contenido.appendChild(nodo);
    if (!dlg.open) dlg.showModal();
    overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    el.cuerpo.scrollTop = 0;
    el.cerrar.focus();
    abierto = true;
    if (titulo) document.title = titulo;
    iniciarContenido(nodo);
    JM.emitir("modal", { abierto: true, url: href });
  }

  function ocultar() {
    if (!abierto) return;
    abierto = false;
    if (dlg.open) dlg.close();
    el.contenido.innerHTML = "";
    document.body.style.overflow = overflowPrevio;
    document.title = tituloPrevio;
    if (focoPrevio && focoPrevio.focus) focoPrevio.focus();
    JM.emitir("modal", { abierto: false, url: location.href });
    if (hashPendiente) {
      var h = hashPendiente;
      hashPendiente = null;
      setTimeout(function () { location.hash = h; }, 0);
    }
  }

  /* La ✕, el Escape, el fondo y el botón atrás hacen exactamente lo mismo. */
  function cerrar() {
    if (history.state && history.state.jmModal) history.back();
    else ocultar();
  }

  function abrir(href, disparador, desdeHistoria) {
    if (cargando) return;
    cargando = true;
    document.documentElement.classList.add("jm-modal-cargando");
    fetch(href, { credentials: "same-origin" })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var fuente = doc.querySelector("[data-jm-modal-contenido]");
        if (!fuente) throw new Error("sin contenido");
        copiarEstilos(doc);
        var nodo = document.importNode(fuente, true);
        /* Los módulos que necesitan saber de qué máquina se trata. */
        var conClase = fuente.closest('[class*="jm-maq-"]');
        var mm = conClase && String(conClase.className).match(/(?:^|\s)jm-maq-(\S+)/);
        if (mm && !nodo.hasAttribute("data-jm-slug")) nodo.setAttribute("data-jm-slug", mm[1]);
        var titulo = atributo("data-jm-modal-titulo", disparador, fuente) || tituloDe(doc, fuente);
        var enlace = atributo("data-jm-modal-enlace", disparador, fuente);
        if (enlace == null) enlace = "Abrir la ficha";
        var cierre = atributo("data-jm-modal-cerrar", disparador, fuente);
        if (!desdeHistoria) {
          urlBase = location.pathname + location.search;
          history.pushState({ jmModal: href }, "", href);
        }
        mostrar(nodo, titulo, enlace, cierre, href);
      })
      .catch(function () { location.href = href; })
      .then(function () {
        cargando = false;
        document.documentElement.classList.remove("jm-modal-cargando");
      });
  }

  function esDisparador(a) {
    if (!a || !a.getAttribute("href")) return false;
    if (a.target && a.target !== "_self") return false;
    if (a.hasAttribute("download") || a.closest(".jm-sin-modal")) return false;
    var url;
    try { url = new URL(a.href, location.href); } catch (e) { return false; }
    if (url.origin !== location.origin) return false;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return false;
    if (a.closest(".jm-abrir-modal")) return true;
    var c = a.closest("[data-jm-modal]");
    if (!c) return false;
    var prefijos = (c.getAttribute("data-jm-modal") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    if (!prefijos.length) return true;
    return prefijos.some(function (px) { return url.pathname.indexOf(px) === 0; });
  }

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (JM.enEditor() || !("showModal" in document.createElement("dialog"))) return;
    var a = e.target.closest && e.target.closest("a");
    if (!a) return;
    /* Enlace con almohadilla dentro del modal hacia la página de debajo
       (#calendario-{curso}): se cierra el modal y después se navega. */
    if (abierto && dlg && dlg.contains(a)) {
      var crudo = a.getAttribute("href") || "";
      var destino;
      try { destino = new URL(a.href, location.href); } catch (err) { return; }
      var aqui = destino.origin === location.origin && (crudo.charAt(0) === "#" || destino.pathname + destino.search === urlBase);
      if (destino.hash && aqui) {
        e.preventDefault();
        hashPendiente = destino.hash;
        cerrar();
      }
      return;
    }
    if (!esDisparador(a)) return;
    e.preventDefault();
    abrir(a.href, a, false);
  });

  window.addEventListener("popstate", function (e) {
    var st = e.state;
    if (abierto && !(st && st.jmModal)) ocultar();
    else if (!abierto && st && st.jmModal) abrir(st.jmModal, null, true);
  });
})();
