/* ==========================================================================
   JOFEMESA · campaña (UTM y gclid) para los formularios
   El visitante suele entrar por una página (Inicio, una ficha…) y pedir
   desde otra: los parámetros de la URL de entrada se guardan en el
   navegador 90 días y se copian en los campos ocultos del formulario
   (utm_source, utm_medium, utm_term, utm_content, utm_campaign, gclid).
   Gana la última campaña con la que llegó. Sin dependencias.
   ========================================================================== */
(function () {
  "use strict";

  var CLAVES = ["utm_source", "utm_medium", "utm_term", "utm_content", "utm_campaign", "gclid"];
  var ALMACEN = "jm:campana";
  var DURACION = 90 * 24 * 60 * 60 * 1000;

  function leer() {
    try {
      var d = JSON.parse(localStorage.getItem(ALMACEN) || "null");
      if (d && d.t && Date.now() - d.t < DURACION) return d.v || {};
    } catch (e) { /* modo privado */ }
    return {};
  }

  /* Si la URL trae alguno, sustituye a lo guardado (última campaña). */
  var url = new URLSearchParams(window.location.search);
  var nuevos = {};
  var hay = false;
  CLAVES.forEach(function (k) {
    var v = url.get(k);
    if (v) { nuevos[k] = v.slice(0, 200); hay = true; }
  });
  if (hay) {
    try { localStorage.setItem(ALMACEN, JSON.stringify({ t: Date.now(), v: nuevos })); } catch (e) { /* modo privado */ }
  }
  var campana = hay ? nuevos : leer();

  function rellenar(raiz) {
    CLAVES.forEach(function (k) {
      if (!campana[k]) return;
      (raiz || document).querySelectorAll('input[name="form_fields[' + k + ']"]').forEach(function (i) {
        if (!i.value) i.value = campana[k];
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { rellenar(); });
  else rellenar();
  /* Por si el formulario se pinta más tarde (ventana emergente, editor). */
  document.addEventListener("submit", function (e) { rellenar(e.target); }, true);
})();
