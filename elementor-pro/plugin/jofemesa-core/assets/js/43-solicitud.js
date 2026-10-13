/* ==========================================================================
   JOFEMESA · 43 SOLICITUD DE ALQUILER
   Traducción de FormularioDisponibilidad.tsx sobre el widget Formulario
   nativo de Elementor Pro (IDs de campo fijos: ver estructura/52-*.md).

   - Lista de máquinas: ?m= y, si no hay, la bandeja del comparador. Quitar
     una actualiza el campo oculto `maquinas` y la URL.
   - Referencia SOL-AAAA-DDDNN en el campo oculto `referencia`.
   - Fechas con mínimo hoy; «Hasta» no antes de «Desde».
   - ?del=madrid → selecciona la delegación por su nombre.
   - Aviso del dígito de control del CIF (avisa, no bloquea).
   - Dos columnas en escritorio, resumen de errores y «Enviando…».
   ========================================================================== */
(function () {
  "use strict";
  if (!window.JM) return;

  var IZQUIERDA = ["fecha_inicio", "fecha_fin", "provincia", "localidad", "direccion", "ayuda_direccion", "delegacion", "ayuda_delegacion"];

  /** Dígito de control real de CIF, NIF y NIE (lib/leads/schema.ts). */
  function cifValido(v) {
    var s = String(v).toUpperCase().replace(/[\s-]/g, "");
    var letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    if (/^\d{8}[A-Z]$/.test(s)) return letras[Number(s.slice(0, 8)) % 23] === s[8];
    if (/^[XYZ]\d{7}[A-Z]$/.test(s)) {
      var n = Number(String("XYZ".indexOf(s[0])) + s.slice(1, 8));
      return letras[n % 23] === s[8];
    }
    if (/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(s)) {
      var suma = 0;
      s.slice(1, 8).split("").map(Number).forEach(function (d, i) {
        if (i % 2 === 0) { var doble = d * 2; suma += doble > 9 ? doble - 9 : doble; } else suma += d;
      });
      var control = (10 - (suma % 10)) % 10;
      return s[8] === String(control) || s[8] === "JABCDEFGHI"[control];
    }
    return false;
  }

  /** SOL-2026-28637: año, día del año y dos cifras al azar. */
  function referencia() {
    var d = new Date();
    var dia = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
    var azar = Math.floor(Math.random() * 90 + 10);
    return "SOL-" + d.getFullYear() + "-" + String(dia).padStart(3, "0") + azar;
  }

  function campo(form, id) {
    return form.querySelector('[name="form_fields[' + id + ']"]') || form.querySelector("#form-field-" + id);
  }
  function grupo(form, id) {
    return form.querySelector(".elementor-field-group-" + id);
  }

  function iniciar(raiz) {
    var C = JM.comparador;
    var form = document.querySelector(".jm-form-solicitud form") ||
      (function () { var f = document.querySelector('[name="form_fields[maquinas]"]'); return f && f.form; })();
    var ul = raiz.querySelector("[data-jm-lista]");
    var vacio = raiz.querySelector("[data-jm-vacio]");
    var url = C ? C.slugsDeUrl() : [];
    /* null = el usuario no ha tocado nada: manda la bandeja del comparador. */
    var elegidas = url.length ? url : null;

    function seleccion() { return elegidas || (C ? C.lista() : []); }

    function pintar() {
      if (!raiz.isConnected) return;
      var s = seleccion();
      var idx = C ? C.indice().porSlug : {};
      ul.innerHTML = s.map(function (slug) {
        var m = idx[slug];
        if (!m) return "";
        var nombre = (m.ma + " " + m.mo).trim();
        return '<li class="jm-solicitud-maquinas__item" data-slug="' + JM.esc(slug) + '">' +
          '<span class="jm-solicitud-maquinas__foto">' + C.miniatura(m, "jm-imagen-maquina__img") + "</span>" +
          '<span class="jm-solicitud-maquinas__nombre"><span class="jm-label-sm jm-solicitud-maquinas__marca">' + JM.esc(m.ma) + "</span>" +
          '<span class="jm-solicitud-maquinas__modelo">' + JM.esc(m.mo) + "</span></span>" +
          '<button type="button" class="jm-boton jm-solicitud-maquinas__quitar" data-jm-quitar="' + JM.esc(slug) + '" aria-label="' +
          JM.esc("Quitar " + nombre + " de la solicitud") + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></li>';
      }).join("");
      var hay = !!ul.children.length;
      ul.hidden = !hay;
      if (vacio) vacio.hidden = hay;
      var validos = s.filter(function (slug) { return !!idx[slug]; });
      if (form) {
        var oculto = campo(form, "maquinas");
        if (oculto) oculto.value = validos.join(",");
      }
      if (C) C.reflejarEnUrl(validos);
    }

    raiz.addEventListener("click", function (e) {
      var q = e.target.closest("[data-jm-quitar]");
      if (!q) return;
      var slug = q.getAttribute("data-jm-quitar");
      elegidas = seleccion().filter(function (x) { return x !== slug; });
      pintar();
    });
    JM.escuchar("comparador", function () { if (!elegidas) pintar(); });
    pintar();

    /* Con ?asunto= el bloque habla de fechas, no de máquinas. */
    var asunto = document.querySelector("[data-jm-asunto]");
    var titulo = document.querySelector(".jm-solicitud__titulo");
    if (asunto && titulo) {
      var h = titulo.querySelector(".elementor-heading-title") || titulo;
      h.textContent = asunto.getAttribute("data-titulo") || h.textContent;
    }

    if (form) prepararFormulario(form, raiz);
  }

  function prepararFormulario(form, raiz) {
    var params = new URLSearchParams(location.search);

    /* Referencia que verá el cliente en la página de gracias. */
    var ref = campo(form, "referencia");
    if (ref && !ref.value) ref.value = referencia();

    /* Fechas: nunca en el pasado y «Hasta» después de «Desde». */
    var hoy = JM.hoy();
    var ini = campo(form, "fecha_inicio");
    var fin = campo(form, "fecha_fin");
    [ini, fin].forEach(function (f) { if (f && f.type === "date") f.min = hoy; });
    if (ini && fin) {
      ini.addEventListener("change", function () {
        if (fin.type === "date") fin.min = ini.value || hoy;
        if (fin.value && ini.value && fin.value < ini.value) fin.value = ini.value;
      });
    }

    /* ?del=madrid → la opción cuyo valor es el nombre de la delegación. */
    var del = params.get("del");
    var sel = campo(form, "delegacion");
    if (del && sel && sel.tagName === "SELECT") {
      var mapa = {};
      try { mapa = JSON.parse(raiz.getAttribute("data-delegaciones") || "{}"); } catch (e) { mapa = {}; }
      var buscado = JM.normaliza(mapa[del] || del);
      Array.prototype.forEach.call(sel.options, function (o) {
        if (JM.normaliza(o.value) === buscado) sel.value = o.value;
      });
    }

    /* El CIF se comprueba pero NO bloquea. */
    var cif = campo(form, "cif");
    if (cif) {
      var aviso = document.createElement("span");
      aviso.className = "jm-form-aviso";
      aviso.setAttribute("aria-live", "polite");
      aviso.hidden = true;
      (grupo(form, "cif") || cif.parentNode).appendChild(aviso);
      var revisar = function () {
        var v = cif.value.trim();
        var mal = v && !cifValido(v);
        aviso.hidden = !mal;
        aviso.textContent = mal ? "Este CIF/NIF no cuadra con el dígito de control. Puedes enviarlo igualmente y lo comprobamos nosotros." : "";
      };
      cif.addEventListener("input", revisar);
    }

    /* Dos columnas (escritorio): qué se pide | quién lo pide. */
    var envoltorio = form.querySelector(".elementor-form-fields-wrapper");
    if (envoltorio && !envoltorio.querySelector(".jm-solicitud__col")) {
      var izq = document.createElement("div");
      izq.className = "jm-solicitud__col jm-solicitud__col--izq";
      var der = document.createElement("div");
      der.className = "jm-solicitud__col jm-solicitud__col--der";
      var cabecera = document.querySelector(".jm-solicitud__cabecera");
      if (cabecera) izq.appendChild(cabecera);
      var grupos = Array.prototype.slice.call(envoltorio.querySelectorAll(":scope > .elementor-field-group"));
      grupos.forEach(function (g) {
        if (g.classList.contains("elementor-field-type-hidden") || g.classList.contains("elementor-field-type-honeypot")) return;
        var id = (g.className.match(/elementor-field-group-(\S+)/) || [])[1];
        (IZQUIERDA.indexOf(id) !== -1 ? izq : der).appendChild(g);
      });
      /* La nota «Sin compromiso…» va debajo del botón, como en el original. */
      var nota = der.querySelector(".elementor-field-group-nota_envio");
      if (nota) der.appendChild(nota);
      envoltorio.insertBefore(der, envoltorio.firstChild);
      envoltorio.insertBefore(izq, der);
      form.classList.add("jm-form--columnas");
    }

    /* Resumen de errores: el foco va a él, o el lector de pantalla no se entera. */
    var resumen = document.createElement("div");
    resumen.className = "jm-form-resumen";
    resumen.setAttribute("role", "alert");
    resumen.tabIndex = -1;
    resumen.hidden = true;
    var tituloQuien = grupo(form, "titulo_quien");
    if (tituloQuien) tituloQuien.parentNode.insertBefore(resumen, tituloQuien.nextSibling);
    else form.insertBefore(resumen, form.firstChild);

    var boton = form.querySelector('[type="submit"]');
    var textoBoton = boton && (boton.querySelector(".elementor-button-text") || boton);
    var original = textoBoton ? textoBoton.textContent : "";
    var esperando = false;

    function revisarEstado() {
      var espera = form.classList.contains("elementor-form-waiting");
      if (textoBoton && espera !== esperando) {
        esperando = espera;
        textoBoton.textContent = espera ? "Enviando…" : original;
      }
      var n = form.querySelectorAll(".elementor-field-group.elementor-error").length;
      if (!espera) {
        if (n) {
          var era = resumen.hidden;
          resumen.innerHTML = '<svg class="jm-form-resumen__ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>' +
            '<div><p class="jm-form-resumen__titulo">Faltan ' + n + " datos por revisar.</p>" +
            '<p class="jm-form-resumen__texto">Están marcados más abajo. No se ha perdido nada de lo que ya habías escrito.</p></div>';
          resumen.hidden = false;
          if (era) resumen.focus();
        } else {
          resumen.hidden = true;
        }
      }
    }
    if ("MutationObserver" in window) {
      new MutationObserver(revisarEstado).observe(form, { attributes: true, attributeFilter: ["class"], subtree: true });
    }
  }

  JM.enCada('[data-jm="solicitud"]', iniciar);
})();
