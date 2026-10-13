/* ==========================================================================
   JOFEMESA · 50 FORMACIÓN
   Traducción de CalendarioFormacion.tsx, EnlaceCalendario.tsx,
   ProximasCurso.tsx y la lógica de FormularioFormacion.tsx.

   1. Calendario  [data-jm="calendario"] ([jm_calendario_filtros]) + las filas
                  del Loop Grid jm_convocatorias (marcadas con [data-jm-conv]).
   2. Enlaces     a[href*="#calendario"]: #calendario-{curso} deja el
                  calendario filtrado por ese curso; #calendario-todos lo
                  limpia. Funciona también desde otra página y desde el modal.
   3. Próximas    [data-jm="proximas-curso"] ([jm_proximas_curso]).
   4. Formulario  .jm-form-formacion (widget Formulario de Elementor Pro).
   ========================================================================== */
(function () {
  "use strict";

  if (!window.JM) return;
  var JM = window.JM;

  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  function nombreMes(clave) {
    var p = clave.split("-");
    var mes = MESES[Number(p[1]) - 1] || "";
    return mes.charAt(0).toUpperCase() + mes.slice(1) + " " + p[0];
  }

  /* ---------------------------------------------------------------------
     1 · Calendario
     --------------------------------------------------------------------- */
  function iniciarCalendario(raiz) {
    var hoy = JM.hoy();
    var marcas = document.querySelectorAll("[data-jm-conv]");
    var filas = Array.prototype.map.call(marcas, function (m) {
      var el = m.closest(".e-loop-item") || m.closest("[data-elementor-type='loop-item']") || m.parentElement;
      el.classList.add("jm-conv-fila");
      if (m.hasAttribute("data-completo")) el.classList.add("jm-conv--completo");
      return {
        el: el,
        id: m.getAttribute("data-id"),
        curso: m.getAttribute("data-curso") || "",
        sede: m.getAttribute("data-sede") || "",
        fecha: m.getAttribute("data-fecha") || "",
        mes: (m.getAttribute("data-fecha") || "").slice(0, 7),
      };
    });

    /* Las pasadas se ocultan en el navegador, que es el que sabe qué día
       es (la página puede venir de caché). La de hoy dice «Hoy». */
    var vigentes = filas.filter(function (f) {
      var pasada = f.fecha < hoy;
      f.el.classList.toggle("jm-conv--pasada", pasada);
      var esHoy = f.fecha === hoy;
      var caja = f.el.querySelector(".jm-conv__fecha");
      if (caja) caja.classList.toggle("jm-conv__fecha--hoy", esHoy);
      var semana = f.el.querySelector(".jm-conv__semana");
      if (semana && esHoy) semana.textContent = "Hoy";
      return !pasada;
    });

    var chips = raiz.querySelectorAll(".jm-cal__chip");
    var selSede = raiz.querySelector('[data-filtro="sede"]');
    var selMes = raiz.querySelector('[data-filtro="mes"]');
    var quitar = raiz.querySelector(".jm-cal__quitar");
    var cuenta = raiz.querySelector(".jm-cal__cuenta");
    var vacio = raiz.querySelector(".jm-cal__vacio");
    var estado = { curso: null, sede: null, mes: null };

    /* Los meses salen de las vigentes, no del servidor. */
    if (selMes) {
      var meses = [];
      vigentes.forEach(function (f) { if (meses.indexOf(f.mes) < 0) meses.push(f.mes); });
      while (selMes.options.length > 1) selMes.remove(1);
      meses.forEach(function (m) { selMes.add(new Option(nombreMes(m), m)); });
    }

    var cursosValidos = Array.prototype.map.call(chips, function (c) { return c.getAttribute("data-curso"); });

    function pasa(f, ignorarCurso) {
      return (ignorarCurso || !estado.curso || f.curso === estado.curso) &&
        (!estado.sede || f.sede === estado.sede) &&
        (!estado.mes || f.mes === estado.mes);
    }

    function pintar() {
      var visibles = vigentes.filter(function (f) { return pasa(f, false); });
      var hayFiltro = !!(estado.curso || estado.sede || estado.mes);

      /* Chips: estado y recuento (el recuento ignora el curso, como el original). */
      Array.prototype.forEach.call(chips, function (chip) {
        var id = chip.getAttribute("data-curso") || null;
        chip.setAttribute("aria-pressed", String(id === estado.curso));
        var n = chip.querySelector(".jm-cal__chip-n");
        if (n) {
          n.textContent = String(vigentes.filter(function (f) {
            return (!id || f.curso === id) && pasa(f, true);
          }).length);
        }
      });
      if (selSede) selSede.value = estado.sede || "";
      if (selMes) selMes.value = estado.mes || "";
      if (quitar) quitar.hidden = !hayFiltro;

      if (cuenta) {
        cuenta.textContent = (visibles.length === 1 ? "1 convocatoria" : visibles.length + " convocatorias") +
          (hayFiltro ? " con estos filtros" : " abiertas");
      }
      if (vacio) vacio.hidden = visibles.length > 0;

      /* Filas y cabeceras de mes. */
      var lista = filas.length ? filas[0].el.parentNode : null;
      if (lista) {
        lista.querySelectorAll(".jm-cal__mes").forEach(function (h) { h.remove(); });
      }
      filas.forEach(function (f) {
        f.el.classList.remove("jm-conv--primera", "jm-conv--ultima");
        f.el.classList.toggle("jm-conv--oculta", visibles.indexOf(f) < 0);
        f.el.removeAttribute("aria-labelledby");
      });
      var grupos = {};
      var orden = [];
      visibles.forEach(function (f) {
        if (!grupos[f.mes]) { grupos[f.mes] = []; orden.push(f.mes); }
        grupos[f.mes].push(f);
      });
      orden.forEach(function (mes) {
        var g = grupos[mes];
        var h = document.createElement("h3");
        h.className = "jm-cal__mes";
        h.id = "mes-" + mes;
        h.innerHTML = JM.esc(nombreMes(mes)) + ' <span class="jm-cal__mes-n">' + g.length + "</span>";
        g[0].el.parentNode.insertBefore(h, g[0].el);
        g[0].el.classList.add("jm-conv--primera");
        g[g.length - 1].el.classList.add("jm-conv--ultima");
      });
    }

    function elegirCurso(curso) {
      estado.curso = curso && cursosValidos.indexOf(curso) >= 0 ? curso : null;
      pintar();
    }

    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener("click", function () {
        var id = chip.getAttribute("data-curso") || null;
        estado.curso = !id ? null : (estado.curso === id ? null : id);
        pintar();
      });
    });
    if (selSede) selSede.addEventListener("change", function () { estado.sede = selSede.value || null; pintar(); });
    if (selMes) selMes.addEventListener("change", function () { estado.mes = selMes.value || null; pintar(); });
    if (quitar) {
      quitar.addEventListener("click", function () {
        estado = { curso: null, sede: null, mes: null };
        pintar();
        var primero = raiz.querySelector(".jm-cal__chip");
        if (primero) primero.focus();
      });
    }

    JM.escuchar("calendario-curso", elegirCurso);
    pintar();
  }

  JM.enCada('[data-jm="calendario"]', iniciarCalendario);

  /* ---------------------------------------------------------------------
     2 · Enlaces al calendario (EnlaceCalendario)
     --------------------------------------------------------------------- */
  var RE_CAL = /^#calendario(?:-([a-z0-9-]+))?$/;

  function irAlCalendario(curso) {
    var destino = document.getElementById("calendario");
    if (!destino) return false;
    /* Cierra el modal del curso si el enlace venía de dentro. */
    document.querySelectorAll("dialog[open]").forEach(function (d) { try { d.close(); } catch (e) { /* nada */ } });
    if (curso !== undefined) JM.emitir("calendario-curso", curso === "todos" ? null : curso);
    destino.scrollIntoView({ behavior: JM.reducido ? "auto" : "smooth", block: "start" });
    try { history.replaceState(null, "", location.pathname + location.search + "#calendario"); } catch (e) { /* nada */ }
    return true;
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#calendario"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var url;
    try { url = new URL(a.getAttribute("href"), location.href); } catch (err) { return; }
    if (url.origin !== location.origin || url.pathname.replace(/\/$/, "") !== location.pathname.replace(/\/$/, "")) return;
    var m = RE_CAL.exec(url.hash);
    if (!m) return;
    if (irAlCalendario(m[1])) e.preventDefault();
  });

  /* Llegada desde otra página (ficha del curso, portada…) con #calendario-{curso}. */
  (function () {
    var m = RE_CAL.exec(location.hash);
    if (!m || !m[1]) return;
    var ir = function () { irAlCalendario(m[1]); };
    if (document.readyState === "complete") setTimeout(ir, 0);
    else window.addEventListener("load", ir);
  })();

  /* ---------------------------------------------------------------------
     3 · Próximas convocatorias del curso
     --------------------------------------------------------------------- */
  function iniciarProximas(raiz) {
    var hoy = JM.hoy();
    var max = Number(raiz.getAttribute("data-max")) || 4;
    var items = raiz.querySelectorAll(".jm-proximas__item");
    var vigentes = 0;
    Array.prototype.forEach.call(items, function (li) {
      var ok = (li.getAttribute("data-fecha") || "") >= hoy;
      li.hidden = !ok || vigentes >= max;
      if (ok) vigentes++;
    });
    var vacio = raiz.querySelector(".jm-proximas__vacio");
    var todas = raiz.querySelector(".jm-proximas__todas");
    var texto = raiz.querySelector(".jm-proximas__todas-texto");
    if (vacio) vacio.hidden = vigentes > 0;
    if (todas) todas.hidden = vigentes === 0;
    if (texto) texto.textContent = vigentes > max ? "Ver las " + vigentes + " fechas en el calendario" : "Ver en el calendario";
  }

  JM.enCada('[data-jm="proximas-curso"]', iniciarProximas);

  /* La ficha también se abre en el modal (44-modal.js), que inserta el
     HTML después de cargar: se inicia lo que aparezca. */
  if ("MutationObserver" in window) {
    new MutationObserver(function (cambios) {
      cambios.forEach(function (c) {
        Array.prototype.forEach.call(c.addedNodes, function (n) {
          if (n.nodeType !== 1) return;
          var nodos = n.matches('[data-jm="proximas-curso"]') ? [n] : n.querySelectorAll('[data-jm="proximas-curso"]');
          Array.prototype.forEach.call(nodos, function (el) {
            if (el.dataset.jmProximas) return;
            el.dataset.jmProximas = "1";
            iniciarProximas(el);
          });
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ---------------------------------------------------------------------
     4 · Formulario de formación
     --------------------------------------------------------------------- */

  /* cifValido de src/lib/leads/schema.ts */
  function cifValido(v) {
    var s = String(v).toUpperCase().replace(/[\s-]/g, "");
    var letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    if (/^\d{8}[A-Z]$/.test(s)) return letras[Number(s.slice(0, 8)) % 23] === s[8];
    if (/^[XYZ]\d{7}[A-Z]$/.test(s)) return letras[Number(String("XYZ".indexOf(s[0])) + s.slice(1, 8)) % 23] === s[8];
    if (/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(s)) {
      var suma = 0;
      s.slice(1, 8).split("").map(Number).forEach(function (d, i) {
        if (i % 2 === 0) { var doble = d * 2; suma += doble > 9 ? doble - 9 : doble; } else { suma += d; }
      });
      var control = (10 - (suma % 10)) % 10;
      return s[8] === String(control) || s[8] === "JABCDEFGHI"[control];
    }
    return false;
  }

  /* FOR-2026-28637: año, día del año y dos cifras al azar (actions.ts). */
  function referencia() {
    var d = new Date();
    var dia = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    var azar = Math.floor(Math.random() * 90 + 10);
    return "FOR-" + d.getFullYear() + "-" + String(dia).padStart(3, "0") + azar;
  }

  var IZQUIERDA = ["bloque_curso", "curso", "info_curso", "convocatoria", "aviso_medida", "curso_medida", "lugar", "alumnos", "localidad"];

  function iniciarFormulario(raiz) {
    var form = raiz.querySelector("form.elementor-form") || raiz.querySelector("form");
    if (!form) return;
    var envoltorio = form.querySelector(".elementor-form-fields-wrapper") || form;
    var grupo = function (id) { return form.querySelector(".elementor-field-group-" + id); };
    var campo = function (id) { return form.querySelector('[name="form_fields[' + id + ']"]'); };
    var datos = JM.json("jm-datos-formacion") || { convocatorias: [], cursos: {} };
    var hoy = JM.hoy();

    /* --- Ayudas: el campo HTML «ayuda_X» se mete dentro del grupo X. --- */
    Array.prototype.forEach.call(form.querySelectorAll('[class*="elementor-field-group-ayuda_"]'), function (g) {
      var m = /elementor-field-group-ayuda_([a-z0-9_]+)/.exec(g.className);
      var destino = m && grupo(m[1]);
      if (!destino) return;
      var ayuda = document.createElement("span");
      ayuda.className = "jm-form__ayuda";
      ayuda.id = "ayuda-" + m[1];
      ayuda.innerHTML = g.innerHTML;
      destino.appendChild(ayuda);
      var input = campo(m[1]);
      if (input) input.setAttribute("aria-describedby", ayuda.id);
      g.remove();
    });

    /* --- Dos columnas: «El curso» y «Quién lo pide». --- */
    var colA = document.createElement("div");
    colA.className = "jm-form-formacion__col jm-form-formacion__col--curso";
    var colB = document.createElement("div");
    colB.className = "jm-form-formacion__col jm-form-formacion__col--quien";
    var grupos = Array.prototype.slice.call(envoltorio.querySelectorAll(":scope > .elementor-field-group"));
    grupos.forEach(function (g) {
      var m = /elementor-field-group-([a-z0-9_]+)/.exec(g.className);
      var id = m ? m[1] : "";
      (IZQUIERDA.indexOf(id) >= 0 ? colA : colB).appendChild(g);
    });
    envoltorio.appendChild(colA);
    envoltorio.appendChild(colB);
    /* La nota «Sin pago online…» (widget de texto aparte) va bajo el botón. */
    var nota = raiz.parentNode && raiz.parentNode.querySelector(".jm-form-formacion__nota");
    if (nota) colB.appendChild(nota);

    /* --- Referencia --- */
    var ref = campo("referencia");
    if (ref && !ref.value) ref.value = referencia();

    /* --- Convocatorias: copia de todas las opciones para poder filtrar. --- */
    var selCurso = campo("curso");
    var selConv = campo("convocatoria");
    var todasConv = selConv ? Array.prototype.map.call(selConv.options, function (o) {
      return { valor: o.value, texto: o.textContent };
    }) : [];
    var porId = {};
    (datos.convocatorias || []).forEach(function (c) { porId[c.id] = c; });

    function infoCurso(slug) { return (datos.cursos || {})[slug] || null; }
    function esCurso(slug) { return !!slug && slug !== "otro" && (!!infoCurso(slug) || !!(selCurso && selCurso.querySelector('option[value="' + slug + '"]'))); }
    function abierta(slug) { var c = infoCurso(slug); return !!(c && c.abierta); }
    function fechasDe(slug) {
      return (datos.convocatorias || []).filter(function (c) { return c.curso === slug && c.fecha >= hoy; });
    }

    function mostrar(id, si) {
      var g = grupo(id);
      if (!g) return;
      g.classList.toggle("jm-oculto", !si);
      g.hidden = !si;
      Array.prototype.forEach.call(g.querySelectorAll("input, select, textarea"), function (el) { el.disabled = !si; });
    }

    function rellenarConvocatorias(slug, elegida) {
      if (!selConv) return;
      var validas = {};
      fechasDe(slug).forEach(function (c) { validas[c.id] = true; });
      while (selConv.options.length) selConv.remove(0);
      todasConv.forEach(function (o) {
        /* Sin datos del plugin no se filtra (mejor todas que ninguna). */
        if (o.valor === "" || validas[o.valor] || !datos.convocatorias.length) {
          selConv.add(new Option(o.texto, o.valor));
        }
      });
      selConv.value = elegida && validas[elegida] ? elegida : (elegida === "" ? "" : selConv.options.length ? selConv.options[0].value : "");
    }

    function aplicar() {
      var curso = selCurso ? selCurso.value : "";
      var cursoId = esCurso(curso) ? curso : null;
      var otro = curso === "otro";
      var conAbierta = !!(cursoId && abierta(cursoId));
      var convVal = conAbierta && selConv ? selConv.value : "";
      var aMedida = !convVal;

      mostrar("info_curso", !!cursoId);
      var enlace = form.querySelector("[data-jm-info-curso]") || (grupo("info_curso") && grupo("info_curso").querySelector("a"));
      if (enlace && cursoId) {
        var info = infoCurso(cursoId);
        enlace.setAttribute("href", info && info.url ? info.url : (JM.datos.inicio || "/") + "formacion/cursos/" + cursoId + "/");
      }
      mostrar("convocatoria", conAbierta);
      mostrar("aviso_medida", !!cursoId && !conAbierta);
      mostrar("curso_medida", otro);
      var medida = campo("curso_medida");
      if (medida) {
        medida.required = otro;
        medida.setAttribute("aria-required", String(otro));
        var gm = grupo("curso_medida");
        if (gm) gm.classList.toggle("elementor-field-required", otro);
      }
      mostrar("lugar", !!curso && aMedida);
      mostrar("localidad", !!curso && aMedida);
    }

    /* --- Estado inicial (URL > valor por defecto del widget). --- */
    var q = new URLSearchParams(location.search);
    var conv = porId[q.get("convocatoria") || ""] || null;
    var cursoUrl = q.get("curso");
    if (selCurso) {
      var inicial = conv ? conv.curso : (cursoUrl && (esCurso(cursoUrl) || cursoUrl === "otro") ? cursoUrl : selCurso.value);
      if (inicial && selCurso.querySelector('option[value="' + inicial + '"]')) selCurso.value = inicial;
      if (abierta(selCurso.value)) rellenarConvocatorias(selCurso.value, conv ? conv.id : "");
    }
    aplicar();

    if (selCurso) {
      selCurso.addEventListener("change", function () {
        var nuevo = selCurso.value;
        /* Al cambiar de curso se preselecciona su primera fecha. */
        if (esCurso(nuevo) && abierta(nuevo)) rellenarConvocatorias(nuevo, null);
        else if (selConv) selConv.value = "";
        aplicar();
      });
    }
    if (selConv) selConv.addEventListener("change", aplicar);

    /* --- Aviso de CIF (no bloquea el envío) --- */
    var cif = campo("cif");
    if (cif) {
      var aviso = document.createElement("span");
      aviso.className = "jm-form__aviso-cif";
      aviso.hidden = true;
      aviso.setAttribute("aria-live", "polite");
      cif.closest(".elementor-field-group").appendChild(aviso);
      cif.addEventListener("input", function () {
        var v = cif.value.trim();
        var malo = v !== "" && !cifValido(v);
        aviso.hidden = !malo;
        aviso.textContent = malo ? "Este CIF/NIF no cuadra con el dígito de control. Puedes enviarlo igualmente y lo comprobamos nosotros." : "";
      });
    }

    /* --- «Enviando…» mientras Elementor espera la respuesta --- */
    var boton = form.querySelector('button[type="submit"] .elementor-button-text');
    if (boton && "MutationObserver" in window) {
      var original = boton.textContent;
      new MutationObserver(function () {
        boton.textContent = form.classList.contains("elementor-form-waiting") ? "Enviando…" : original;
      }).observe(form, { attributes: true, attributeFilter: ["class"] });
    }
  }

  JM.enCada(".jm-form-formacion", iniciarFormulario);
})();
