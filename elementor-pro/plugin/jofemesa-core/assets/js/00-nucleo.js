/* ==========================================================================
   JOFEMESA · núcleo JS
   Define `window.JM`, que usan todos los módulos. Sin dependencias.
   ========================================================================== */
(function () {
  "use strict";

  var html = document.documentElement;
  var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var registros = [];

  function enEditor() {
    return !!(window.elementorFrontend && window.elementorFrontend.isEditMode && window.elementorFrontend.isEditMode());
  }

  /**
   * Ejecuta `fn(elemento)` en cada coincidencia de `selector`, una sola vez
   * por elemento: al cargar y cada vez que Elementor repinta un widget en el
   * editor (así lo que se monta en el panel se ve funcionando).
   */
  function enCada(selector, fn) {
    registros.push([selector, fn]);
    barrer(document, selector, fn);
  }
  function barrer(raiz, selector, fn) {
    var nodos = [];
    if (raiz.matches && raiz.matches(selector)) nodos.push(raiz);
    Array.prototype.push.apply(nodos, raiz.querySelectorAll(selector));
    nodos.forEach(function (el) {
      var marca = "jmIniciado" + registros.findIndex(function (r) { return r[0] === selector && r[1] === fn; });
      if (el.dataset[marca]) return;
      el.dataset[marca] = "1";
      try { fn(el); } catch (e) { if (window.console) console.error("[JOFEMESA]", selector, e); }
    });
  }

  function guardar(clave, valor) {
    try { localStorage.setItem("jm:" + clave, JSON.stringify(valor)); } catch (e) { /* modo privado */ }
  }
  function leer(clave, defecto) {
    try {
      var v = localStorage.getItem("jm:" + clave);
      return v == null ? defecto : JSON.parse(v);
    } catch (e) { return defecto; }
  }

  /** «2026-10-13» en la zona del navegador: la convocatoria no se mueve de día. */
  function hoy() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function normaliza(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /** Lee un JSON impreso por un shortcode en <script type="application/json">. */
  function json(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch (e) { return null; }
  }

  /** Avisa a otros módulos (comparador, filtros…). */
  function emitir(nombre, detalle) {
    document.dispatchEvent(new CustomEvent("jm:" + nombre, { detail: detalle }));
  }
  function escuchar(nombre, fn) {
    document.addEventListener("jm:" + nombre, function (e) { fn(e.detail); });
  }

  window.JM = {
    datos: window.JM_DATOS || {},
    reducido: reducido,
    enEditor: enEditor,
    enCada: enCada,
    guardar: guardar,
    leer: leer,
    hoy: hoy,
    normaliza: normaliza,
    esc: esc,
    json: json,
    emitir: emitir,
    escuchar: escuchar,
  };

  /* ---------- Motor de revelado ----------
     Un único IntersectionObserver para todo lo que lleve `data-revelar` o la
     clase `jm-filete`. Elementor Pro: Avanzado → Atributos → data-revelar|  */
  function iniciarRevelado() {
    if (reducido || enEditor() || !("IntersectionObserver" in window)) {
      html.removeAttribute("data-motor");
      return;
    }
    html.setAttribute("data-motor", "");
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.setAttribute("data-visible", "");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    function observar(raiz) {
      raiz.querySelectorAll("[data-revelar], .jm-filete").forEach(function (el) {
        if (el.hasAttribute("data-visible")) return;
        /* Lo que ya está en pantalla al cargar se muestra sin esperar. */
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          requestAnimationFrame(function () { el.setAttribute("data-visible", ""); });
        } else {
          io.observe(el);
        }
      });
    }
    observar(document);

    /* `data-escalonar` en un contenedor: sus hijos entran uno detrás de otro. */
    document.querySelectorAll("[data-escalonar]").forEach(function (grupo) {
      var hijos = grupo.querySelectorAll(":scope > .elementor-element, :scope > .e-con-inner > .elementor-element, :scope > *:not(.elementor-element)");
      Array.prototype.forEach.call(hijos, function (h, i) {
        if (!h.hasAttribute("data-revelar")) h.setAttribute("data-revelar", "");
        h.style.setProperty("--retardo", String(i));
        io.observe(h);
      });
    });
  }

  function arrancar() {
    iniciarRevelado();
    if (window.jQuery && window.elementorFrontend && window.elementorFrontend.hooks) {
      window.elementorFrontend.hooks.addAction("frontend/element_ready/global", function ($el) {
        var nodo = $el && $el[0];
        if (!nodo) return;
        registros.forEach(function (r) { barrer(nodo, r[0], r[1]); });
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar);
  else arrancar();
})();
