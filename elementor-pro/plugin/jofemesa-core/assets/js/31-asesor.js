/* ==========================================================================
   JOFEMESA · 31 ASESOR
   «¿Qué máquina necesito?» (src/components/asesor/Asesor.tsx): tres
   selectores, el segundo dependiente del primero, y la recomendación
   explicada en cuanto están las tres respuestas.

   La lógica es la de la web Next: `window.JMAsesor` (asesor-motor.js, que
   encola el shortcode [jm_asesor]). Este archivo solo pinta.
   · variante="pagina":  el estado vive en la URL (?trabajo=&parametro=&entorno=),
                         el botón atrás recorre el asistente.
   · variante="portada": estado local; nadie comparte el paso 2 de la home.
   ========================================================================== */
(function () {
  "use strict";
  if (!window.JM) return;
  var JM = window.JM;

  var ENUNCIADOS = {
    1: "¿Qué trabajo necesitas realizar?",
    2: "¿Con qué altura, carga o alcance?",
    3: "¿Dónde va a trabajar la máquina?"
  };
  var CLAVES = ["trabajo", "parametro", "entorno"];

  var TRAZOS = {
    atras: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    reiniciar: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    abajo: '<path d="m6 9 6 6 6-6"/>',
    ayuda: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    flecha: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    telefono: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
    alerta: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'
  };
  function icono(nombre, tam, trazo, clase) {
    return '<svg class="jm-ico' + (clase ? " " + clase : "") + '" xmlns="http://www.w3.org/2000/svg" width="' + tam + '" height="' + tam +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + trazo +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + TRAZOS[nombre] + "</svg>";
  }
  var esc = JM.esc;

  var datosCache = null;
  function datos() {
    if (!datosCache) datosCache = JM.json("jm-asesor-datos") || { maquinas: {}, iconos: {} };
    return datosCache;
  }

  function rutas() {
    var r = (JM.datos && JM.datos.rutas) || {};
    var inicio = (JM.datos && JM.datos.inicio) || "/";
    return {
      alquiler: r.alquiler || inicio + "alquiler/",
      solicitud: r.solicitud || inicio + "consultar-disponibilidad/"
    };
  }

  /** «/alquiler?familia=…» del motor → la URL real del catálogo en WordPress. */
  function urlCatalogo(enlace) {
    var q = String(enlace || "").indexOf("?");
    return rutas().alquiler + (q >= 0 ? String(enlace).slice(q) : "");
  }

  function leerUrl() {
    var q = new URLSearchParams(window.location.search);
    return { trabajo: q.get("trabajo") || "", parametro: q.get("parametro") || "", entorno: q.get("entorno") || "" };
  }

  /* ---------- Dato de especificación según su estado (DatoValor.tsx) ---------- */
  function datoValor(d) {
    var estado = d[1], texto = d[2], unidad = d[3], nota = d[4], esNumero = d[5] === 1;
    if (!estado || estado === "no_aplica") {
      return '<span class="jm-value jm-asesor__nd" title="No aplica a este tipo de máquina">—</span>';
    }
    if (estado === "pendiente") {
      return '<span class="jm-pendiente" title="' + esc(nota || "Te lo confirmamos al responder la solicitud.") + '">' +
        icono("alerta", 12, 2) + "Pendiente</span>";
    }
    var titulo = estado === "estimado"
      ? (nota || "Dato sin confirmar contra la unidad de flota. Lo comprobamos al responder tu solicitud.")
      : nota;
    return '<span class="jm-value jm-asesor__valor' + (estado === "estimado" ? " jm-estimado" : "") + '"' +
      (titulo ? ' title="' + esc(titulo) + '"' : "") + ">" + esc(texto) +
      (unidad && esNumero ? '<span class="jm-asesor__unidad">' + esc(unidad) + "</span>" : "") + "</span>";
  }

  /* ---------- Fila de resultado: compacta a propósito ---------- */
  function filaResultado(slug, razones, conRazones) {
    var m = datos().maquinas[slug];
    if (!m) return "";
    var nombre = ((m.ma || "") + " " + (m.mo || "")).trim() || m.t || slug;
    var imagen = m.f
      ? '<img src="' + esc(m.f) + '" alt="' + esc(m.a || nombre) + '" loading="lazy" decoding="async">'
      : '<span class="jm-asesor__dibujo" role="img" aria-label="' + esc("Dibujo técnico de " + nombre) + '">' + (datos().iconos[m.i] || datos().iconos.tijera || "") + "</span>";
    var specs = (m.d || []).map(function (d) {
      return '<div class="jm-asesor__dato"><dt class="jm-label-sm">' + esc(d[0]) + "</dt><dd>" + datoValor(d) + "</dd></div>";
    }).join("");
    var lista = conRazones && razones && razones.length
      ? '<ul class="jm-asesor__razones">' + razones.slice(0, 3).map(function (z) {
        return "<li>" + icono("check", 14, 2.5, "jm-asesor__check") + "<span>" + esc(z) + "</span></li>";
      }).join("") + "</ul>"
      : "";
    return '<li class="jm-asesor__fila">' +
      '<a class="jm-asesor__miniatura" href="' + esc(m.u) + '" tabindex="-1" aria-hidden="true">' + imagen + "</a>" +
      '<div class="jm-asesor__info">' +
      '<p class="jm-label-sm jm-asesor__sub">' + esc(m.s || m.ma || "") + "</p>" +
      '<h4 class="jm-title jm-asesor__nombre"><a href="' + esc(m.u) + '">' + esc(nombre) + "</a></h4>" +
      (specs ? '<dl class="jm-asesor__datos">' + specs + "</dl>" : "") +
      "</div>" + lista + "</li>";
  }

  function sinResultados() {
    var tel = (JM.datos && JM.datos.tel) || "+34913613131";
    var visible = (JM.datos && JM.datos.telefono) || "91 361 31 31";
    return '<div class="jm-panel jm-asesor__vacio">' +
      '<p class="jm-title jm-asesor__vacio-titulo">No tenemos una máquina que cumpla las tres condiciones a la vez.</p>' +
      '<p class="jm-asesor__vacio-texto">Eso no significa que no haya solución: casi siempre la hay combinando dos equipos o ajustando un requisito. Llámanos y lo vemos en dos minutos.</p>' +
      '<a class="jm-asesor__vacio-tel" href="tel:' + esc(tel) + '">' + icono("telefono", 18, 1.75) +
      '<span class="jm-value">' + esc(visible) + "</span></a></div>";
  }

  /* ========================================================================
     El asesor
     ======================================================================== */

  function iniciar(raiz) {
    var A = window.JMAsesor;
    var panel = raiz.querySelector(".jm-asesor__panel");
    if (!A || !panel) return;

    var pagina = raiz.getAttribute("data-variante") === "pagina";
    var verAlternativas = raiz.getAttribute("data-alternativas") === "1";
    var r = pagina ? leerUrl() : { trabajo: "", parametro: "", entorno: "" };
    var uid = "jm-asesor-" + Math.random().toString(36).slice(2, 8);

    /* ---------- El panel: barra de estado, preguntas y resultado ---------- */
    var campos = [1, 2, 3].map(function (n) {
      return '<label class="jm-asesor__campo" data-campo="' + n + '">' +
        '<span class="jm-etiqueta-campo jm-asesor__etiqueta"><span class="jm-value jm-asesor__numero" aria-hidden="true">' + n + "</span>" + esc(ENUNCIADOS[n]) + "</span>" +
        '<span class="jm-asesor__select"><select id="' + uid + "-" + n + '"></select>' + icono("abajo", 17, 2, "jm-asesor__chevron") + "</span>" +
        '<span class="jm-asesor__motivo" hidden></span>' +
        "</label>";
    }).join("");

    panel.innerHTML =
      '<div class="jm-asesor__barra">' +
      '<div class="jm-asesor__estado"><span class="jm-label jm-asesor__contador"></span>' +
      '<span class="jm-asesor__canales" aria-hidden="true">' +
      '<span class="jm-asesor__canal"><span class="jm-asesor__relleno"></span></span>' +
      '<span class="jm-asesor__canal"><span class="jm-asesor__relleno"></span></span>' +
      '<span class="jm-asesor__canal"><span class="jm-asesor__relleno"></span></span>' +
      "</span></div>" +
      '<div class="jm-asesor__acciones">' +
      '<button type="button" class="jm-asesor__accion jm-asesor__accion--atras" hidden>' + icono("atras", 15, 2) + "Atrás</button>" +
      '<button type="button" class="jm-asesor__accion jm-asesor__accion--reiniciar" hidden>' + icono("reiniciar", 14, 2) + "Empezar de nuevo</button>" +
      "</div></div>" +
      '<fieldset class="jm-asesor__preguntas">' +
      '<legend class="jm-display-3 jm-asesor__enunciado" tabindex="-1">Tres respuestas y te decimos qué encaja</legend>' +
      '<p class="jm-asesor__intro">Elige la opción que más se parezca. Si no lo tienes claro, marca <em>No lo sé</em>: el asesor ensancha la búsqueda en vez de bloquearse.</p>' +
      '<div class="jm-asesor__selectores">' + campos + "</div>" +
      '<ul class="jm-panel jm-asesor__ayudas" hidden></ul>' +
      '<p class="jm-asesor__pista">' + icono("ayuda", 15, 2, "jm-asesor__pista-ico") + "En cuanto contestes las tres, la recomendación aparece aquí mismo.</p>" +
      "</fieldset>" +
      '<div class="jm-asesor__resultado" hidden></div>';

    var $ = function (sel) { return panel.querySelector(sel); };
    var contador = $(".jm-asesor__contador");
    var rellenos = panel.querySelectorAll(".jm-asesor__relleno");
    var btnAtras = $(".jm-asesor__accion--atras");
    var btnReiniciar = $(".jm-asesor__accion--reiniciar");
    var preguntas = $(".jm-asesor__preguntas");
    var legend = $(".jm-asesor__enunciado");
    var ayudas = $(".jm-asesor__ayudas");
    var resultado = $(".jm-asesor__resultado");
    var selects = [1, 2, 3].map(function (n) { return document.getElementById(uid + "-" + n); });
    var etiquetasCampo = panel.querySelectorAll(".jm-asesor__campo");
    var opcionesPintadas = ["", "", ""];

    function paso() { return !r.trabajo ? 1 : !r.parametro ? 2 : !r.entorno ? 3 : 4; }

    function cambiar(parcial) {
      if (pagina) {
        var actual = leerUrl();
        CLAVES.forEach(function (k) { r[k] = actual[k]; });
      }
      Object.keys(parcial).forEach(function (k) { r[k] = parcial[k] || ""; });
      if (pagina) {
        var url = new URL(window.location.href);
        CLAVES.forEach(function (k) {
          if (r[k]) url.searchParams.set(k, r[k]);
          else url.searchParams.delete(k);
        });
        window.history.pushState(null, "", url);
      }
      pintar();
    }

    /* Cambiar de trabajo solo invalida la exigencia: el entorno vale igual. */
    selects[0].addEventListener("change", function () { cambiar({ trabajo: selects[0].value, parametro: "" }); });
    selects[1].addEventListener("change", function () { cambiar({ parametro: selects[1].value }); });
    selects[2].addEventListener("change", function () { cambiar({ entorno: selects[2].value }); });
    btnAtras.addEventListener("click", function () {
      var p = paso();
      cambiar(p === 4 ? { entorno: "" } : p === 3 ? { parametro: "" } : { trabajo: "" });
    });
    btnReiniciar.addEventListener("click", function () { cambiar({ trabajo: "", parametro: "", entorno: "" }); });
    if (pagina) {
      window.addEventListener("popstate", function () {
        r = leerUrl();
        pintar();
      });
    }

    function pintarSelector(i, valor, opciones, placeholder, motivo) {
      var sel = selects[i];
      var campo = etiquetasCampo[i];
      var bloqueado = !!motivo || opciones.length === 0;
      var clave = (bloqueado ? "b|" : "") + opciones.map(function (o) { return o.id; }).join(",");
      if (opcionesPintadas[i] !== clave) {
        opcionesPintadas[i] = clave;
        sel.innerHTML = '<option value="">' + esc(bloqueado ? "—" : placeholder) + "</option>" +
          opciones.map(function (o) { return '<option value="' + esc(o.id) + '">' + esc(o.label) + "</option>"; }).join("");
      }
      sel.value = valor;
      sel.disabled = bloqueado;
      campo.classList.toggle("jm-asesor__campo--bloqueado", bloqueado);
      campo.classList.toggle("jm-asesor__campo--hecho", !!valor && !bloqueado);
      campo.querySelector(".jm-asesor__numero").textContent = valor ? "✓" : String(i + 1);
      var m = campo.querySelector(".jm-asesor__motivo");
      m.hidden = !motivo;
      m.textContent = motivo || "";
    }

    function pintarAyudas() {
      var elegidas = [
        (A.TRABAJOS || []).filter(function (o) { return o.id === r.trabajo; })[0],
        ((A.PARAMETROS || {})[r.trabajo] || []).filter(function (o) { return o.id === r.parametro; })[0],
        (A.ENTORNOS || []).filter(function (o) { return o.id === r.entorno; })[0]
      ].filter(Boolean);
      ayudas.hidden = elegidas.length === 0;
      ayudas.innerHTML = elegidas.map(function (o) {
        return '<li><span class="jm-asesor__ayuda-label">' + esc(o.label) + "</span> — " + esc(o.desc) + "</li>";
      }).join("");
    }

    function pintarResultado() {
      var res = A.recomendar({ trabajo: r.trabajo, parametro: r.parametro, entorno: r.entorno });
      var rec = res.recomendadas || [];
      var visibles = rec.slice(0, 4);
      var r4 = visibles.map(function (x) { return x.slug; });
      var contexto = "?contexto=" + encodeURIComponent(A.resumen({ trabajo: r.trabajo, parametro: r.parametro, entorno: r.entorno })) +
        (rec.length ? "&m=" + r4.join(",") : "");

      var html = '<div class="jm-asesor__cabeza">' +
        '<h3 class="jm-display-3 jm-asesor__enunciado jm-asesor__titulo" tabindex="-1">' +
        (rec.length ? "Esto es lo que te encaja" : "Nada encaja del todo") + "</h3>" +
        (rec.length ? '<p class="jm-asesor__cuenta">' + rec.length + " de nuestro parque" +
          (res.relajado ? " · nada encajaba exacto, esto es lo más cercano" : "") + "</p>" : "") +
        "</div>";

      html += rec.length
        ? '<ul class="jm-asesor__filas">' + visibles.map(function (x) { return filaResultado(x.slug, x.razones, true); }).join("") + "</ul>"
        : sinResultados();

      /* Alternativas: el original no las enseña; se activan con alternativas="1". */
      if (verAlternativas && res.alternativas && res.alternativas.length) {
        html += '<p class="jm-label jm-asesor__alt-rotulo">También pueden servirte</p>' +
          '<ul class="jm-asesor__filas jm-asesor__filas--alt">' +
          res.alternativas.map(function (x) { return filaResultado(x.slug, x.razones, false); }).join("") + "</ul>";
      }

      /* El asesor y los filtros son el mismo sistema. */
      html += '<div class="jm-asesor__cta">' +
        '<a class="jm-btn jm-btn--acento jm-asesor__consultar" href="' + esc(rutas().solicitud + contexto) + '">Consultar disponibilidad</a>' +
        '<a class="jm-asesor__catalogo" href="' + esc(urlCatalogo(res.enlaceCatalogo)) + '">Ver estas máquinas en el catálogo' + icono("flecha", 16, 2) + "</a>" +
        "</div>";
      resultado.innerHTML = html;
    }

    var pasoPrevio = null;
    function pintar() {
      var p = paso();
      var contestadas = CLAVES.filter(function (k) { return !!r[k]; }).length;

      /* Ya no dice «paso 1 de 3»: lo que informa es cuántas llevas. */
      contador.textContent = p === 4 ? "Resultado" : contestadas + " de 3 contestadas";
      Array.prototype.forEach.call(rellenos, function (el, i) {
        if (contestadas >= i + 1) el.setAttribute("data-lleno", "");
        else el.removeAttribute("data-lleno");
      });
      btnAtras.hidden = p <= 1;
      btnReiniciar.hidden = p <= 1;

      if (p < 4) {
        preguntas.hidden = false;
        resultado.hidden = true;
        resultado.innerHTML = "";
        pintarSelector(0, r.trabajo, A.TRABAJOS || [], "Elige el trabajo", "");
        pintarSelector(1, r.parametro, (A.PARAMETROS || {})[r.trabajo] || [], "Elige la exigencia",
          !r.trabajo ? "Contesta primero qué trabajo tienes" : "");
        /* Sin bloqueo: dónde va a trabajar no depende de lo demás. */
        pintarSelector(2, r.entorno, A.ENTORNOS || [], "Elige el entorno", "");
        pintarAyudas();
      } else {
        preguntas.hidden = true;
        resultado.hidden = false;
        pintarResultado();
      }

      /* El foco viaja al enunciado nuevo: sin esto, quien navega con teclado
         se queda anclado al control que acaba de usar. */
      if (p !== pasoPrevio && p > 1) {
        var destino = p === 4 ? resultado.querySelector(".jm-asesor__titulo") : legend;
        if (destino) destino.focus();
      }
      pasoPrevio = p;
    }

    pintar();
    raiz.setAttribute("data-jm-listo", "");
  }

  /* El motor lo encola el shortcode en el pie, DESPUÉS de este archivo: se
     arranca cuando el documento está entero. */
  function arrancar() {
    if (window.JMAsesor) {
      JM.enCada('[data-jm="asesor"]', iniciar);
      return;
    }
    window.addEventListener("load", function () {
      if (window.JMAsesor) JM.enCada('[data-jm="asesor"]', iniciar);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar);
  else arrancar();
})();
