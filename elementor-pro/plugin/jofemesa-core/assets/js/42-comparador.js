/* ==========================================================================
   JOFEMESA · 42 COMPARADOR
   Traducción de lib/compare (bandeja en localStorage, máximo 4, ?m=),
   BandejaComparador.tsx, BotonComparar.tsx, la casilla de la tarjeta,
   ComparadorCliente.tsx y AnadirMaquina.tsx.

   Expone `JM.comparador` para 43-solicitud.js:
     lista(), contiene(s), alternar(s), anadir(s), quitar(s), limpiar(),
     lleno(), MAX, indice() → {base, lista, porSlug}, reflejarEnUrl(slugs),
     miniatura(m, clase).
   Avisa con el evento `jm:comparador` (detalle: la lista).
   ========================================================================== */
(function () {
  "use strict";
  if (!window.JM) return;

  var MAX = 4;
  var CLAVE = "comparador";
  var memoria = [];

  function ico(trazos, tam, grosor) {
    return '<svg width="' + tam + '" height="' + tam + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + grosor +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + trazos + "</svg>";
  }
  var T_X = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';
  var T_CHECK = '<path d="M20 6 9 17l-5-5"/>';
  var T_MAS = '<path d="M5 12h14"/><path d="M12 5v14"/>';

  /** Registra un módulo también para el contenido que trae el modal. */
  function registrar(selector, fn) {
    var clave = "__jm" + selector;
    function una(el) {
      if (el[clave]) return;
      el[clave] = true;
      fn(el);
    }
    JM.enCada(selector, una);
    JM.escuchar("contenido", function (nodo) {
      if (!nodo || !nodo.querySelectorAll) return;
      if (nodo.matches && nodo.matches(selector)) una(nodo);
      nodo.querySelectorAll(selector).forEach(una);
    });
  }

  /* ------------------------------------------------------------------
     Índice de máquinas (lo imprime 70-catalogo.php en wp_footer)
     ------------------------------------------------------------------ */
  var indice = null;
  function datosIndice() {
    if (indice && indice.lista.length) return indice;
    var d = JM.json("jm-indice-maquinas") || {};
    indice = { base: d.base || "", lista: d.maquinas || [], porSlug: {} };
    if (d.max) MAX = d.max;
    indice.lista.forEach(function (m) { indice.porSlug[m.s] = m; });
    return indice;
  }
  function valido(s) {
    var i = datosIndice();
    return !i.lista.length || !!i.porSlug[s];
  }
  function nombre(s) {
    var m = datosIndice().porSlug[s];
    return m ? (m.ma + " " + m.mo).trim() : s;
  }
  function miniatura(m, clase) {
    if (m && m.mini) return '<img class="' + clase + '" src="' + JM.esc(m.mini) + '" alt="" loading="lazy" decoding="async">';
    var icono = (m && m.i) || "tijera";
    return '<span class="jm-mini-icono" aria-hidden="true" style="--jm-icono:url(\'' + JM.esc(datosIndice().base + "maquina-" + icono + ".svg") + '\')"></span>';
  }

  /* ------------------------------------------------------------------
     La bandeja: estado del navegador
     ------------------------------------------------------------------ */
  function lista() {
    var l = JM.leer(CLAVE, memoria);
    if (!Array.isArray(l)) l = [];
    return l.filter(function (s) { return typeof s === "string" && valido(s); }).slice(0, MAX);
  }
  function escribir(l) {
    memoria = l;
    JM.guardar(CLAVE, l);
    JM.emitir("comparador", lista());
  }
  function contiene(s) { return lista().indexOf(s) !== -1; }
  function lleno() { return lista().length >= MAX; }
  function alternar(s) {
    var l = lista();
    var i = l.indexOf(s);
    if (i !== -1) { l.splice(i, 1); escribir(l); } else if (l.length < MAX) { l.push(s); escribir(l); }
  }
  function anadir(s) { if (!contiene(s)) alternar(s); }
  function quitar(s) { escribir(lista().filter(function (x) { return x !== s; })); }
  function limpiar() { escribir([]); }

  /* Otra pestaña puede cambiar la bandeja: nos enteramos. */
  window.addEventListener("storage", function (e) {
    if (!e.key || e.key === "jm:" + CLAVE) JM.emitir("comparador", lista());
  });

  /** Refleja una lista en ?m= sin recargar, con la coma legible (se comparte por WhatsApp). */
  function reflejarEnUrl(slugs) {
    var url = new URL(location.href);
    var actual = url.searchParams.get("m") || "";
    var siguiente = slugs.join(",");
    if (actual === siguiente) return;
    if (siguiente) url.searchParams.set("m", siguiente);
    else url.searchParams.delete("m");
    history.replaceState(history.state, "", url.pathname + url.search.replace(/%2C/g, ",") + url.hash);
  }
  function slugsDeUrl() {
    var u = new URLSearchParams(location.search);
    var out = [];
    u.getAll("m").forEach(function (v) {
      v.split(",").forEach(function (s) {
        s = s.trim();
        if (s && out.indexOf(s) === -1) out.push(s);
      });
    });
    return out;
  }

  JM.comparador = {
    MAX: MAX, lista: lista, contiene: contiene, alternar: alternar, anadir: anadir, quitar: quitar,
    limpiar: limpiar, lleno: lleno, indice: datosIndice, reflejarEnUrl: reflejarEnUrl,
    slugsDeUrl: slugsDeUrl, miniatura: miniatura,
  };

  /* ------------------------------------------------------------------
     ¿De qué máquina es este botón?
     ------------------------------------------------------------------ */
  function slugDe(el) {
    var n = el.closest("[data-jm-slug]");
    if (n && n.getAttribute("data-jm-slug")) return n.getAttribute("data-jm-slug");
    var c = el.closest('[class*="jm-maq-"]');
    if (c) {
      var m = String(c.className).match(/(?:^|\s)jm-maq-(\S+)/);
      if (m) return m[1];
    }
    var raiz = el.closest("[data-jm-modal-contenido]");
    var d = raiz && raiz.querySelector("[data-jm-slug]");
    return d ? d.getAttribute("data-jm-slug") : null;
  }

  /* ------------------------------------------------------------------
     Botón Comparar (widget Botón con clase jm-btn-comparar y enlace #comparar)
     ------------------------------------------------------------------ */
  function pintarBotones() {
    var l = lista();
    var ll = l.length >= MAX;
    document.querySelectorAll(".jm-btn-comparar").forEach(function (w) {
      var a = w.matches("a, button") ? w : w.querySelector("a, button");
      if (!a) return;
      var s = slugDe(w);
      if (!s) return;
      var marcada = l.indexOf(s) !== -1;
      var bloq = ll && !marcada;
      var enTarjeta = !!w.closest(".jm-tarjeta-maquina");
      var texto = a.querySelector(".elementor-button-text") || a;
      if (!a.hasAttribute("data-jm-texto")) {
        a.setAttribute("data-jm-texto", texto.textContent.trim());
        a.setAttribute("role", "button");
        if (!enTarjeta) {
          var sr = document.createElement("span");
          sr.className = "jm-sr";
          sr.textContent = " — " + nombre(s);
          a.appendChild(sr);
        }
      }
      var activo = w.getAttribute("data-jm-activo") || (enTarjeta ? "Añadida" : "En el comparador");
      texto.textContent = marcada ? activo : a.getAttribute("data-jm-texto");
      a.setAttribute("aria-pressed", marcada ? "true" : "false");
      if (bloq) {
        a.setAttribute("aria-disabled", "true");
        if (!enTarjeta) a.setAttribute("title", "Ya hay " + MAX + " máquinas en el comparador");
      } else {
        a.removeAttribute("aria-disabled");
        a.removeAttribute("title");
      }
      w.classList.toggle("jm-comparar--activo", marcada);
      w.classList.toggle("jm-comparar--bloqueado", bloq);
    });
    document.querySelectorAll(".jm-casilla-comparar").forEach(pintarCasilla);
  }

  document.addEventListener("click", function (e) {
    var w = e.target.closest && e.target.closest(".jm-btn-comparar");
    if (!w) return;
    e.preventDefault();
    if (w.classList.contains("jm-comparar--bloqueado")) return;
    var s = slugDe(w);
    if (s) alternar(s);
  });

  /* ------------------------------------------------------------------
     Casilla siempre visible sobre la foto de la tarjeta
     ------------------------------------------------------------------ */
  function iniciarCasilla(foto) {
    var s = slugDe(foto);
    if (!s || foto.querySelector(".jm-casilla-comparar")) return;
    /* La foto es un segundo enlace a la ficha: fuera del tabulador. */
    foto.querySelectorAll("a").forEach(function (a) {
      a.tabIndex = -1;
      a.setAttribute("aria-hidden", "true");
    });
    var label = document.createElement("label");
    label.className = "jm-casilla-comparar";
    label.setAttribute("data-slug", s);
    label.innerHTML = '<input type="checkbox" class="jm-sr" aria-label="' + JM.esc("Comparar " + nombre(s)) + '">' +
      '<span class="jm-casilla-comparar__caja">' + ico(T_CHECK, 15, 3) + "</span>";
    label.querySelector("input").addEventListener("change", function () { alternar(s); });
    foto.appendChild(label);
    pintarCasilla(label);
  }
  function pintarCasilla(label) {
    var s = label.getAttribute("data-slug");
    var marcada = contiene(s);
    var bloq = lleno() && !marcada;
    var inp = label.querySelector("input");
    inp.checked = marcada;
    inp.disabled = bloq;
    label.classList.toggle("jm-casilla-comparar--marcada", marcada);
    label.classList.toggle("jm-casilla-comparar--bloqueada", bloq);
    label.title = bloq ? "Máximo " + MAX + " máquinas — quita una para añadir otra" : marcada ? "Quitar del comparador" : "Añadir al comparador";
  }

  registrar(".jm-tarjeta-maquina__foto", iniciarCasilla);
  registrar(".jm-btn-comparar", function () { pintarBotones(); });
  JM.escuchar("comparador", pintarBotones);

  /* ------------------------------------------------------------------
     Bandeja flotante (impresa en wp_footer)
     ------------------------------------------------------------------ */
  function rutaComparador() {
    return (JM.datos.rutas && JM.datos.rutas.comparador) || "/comparador/";
  }
  function enComparador() {
    try {
      var r = new URL(rutaComparador(), location.href).pathname.replace(/\/+$/, "");
      return location.pathname.replace(/\/+$/, "") === r;
    } catch (e) { return false; }
  }

  function iniciarBandeja(b) {
    var ul = b.querySelector("[data-jm-lista]");
    var n = b.querySelector("[data-jm-n]");
    var ir = b.querySelector("[data-jm-ir]");
    var irN = b.querySelector("[data-jm-ir-n]");
    function pintar() {
      var l = lista();
      var oculta = !l.length || enComparador();
      b.hidden = oculta;
      /* Hueco al final de la página para que la bandeja no tape el pie. */
      var alto = function () { document.documentElement.style.setProperty("--jm-alto-bandeja", b.hidden ? "0px" : b.offsetHeight + "px"); };
      if (oculta) { alto(); return; }
      var idx = datosIndice().porSlug;
      ul.innerHTML = l.map(function (s) {
        var m = idx[s] || { s: s, ma: "", mo: s };
        return '<li class="jm-bandeja__item"><span class="jm-bandeja__foto">' + miniatura(m, "jm-bandeja__img") + "</span>" +
          '<span class="jm-bandeja__modelo">' + JM.esc(m.mo) + "</span>" +
          '<button type="button" class="jm-boton jm-bandeja__quitar" data-jm-quitar="' + JM.esc(s) + '" aria-label="' +
          JM.esc("Quitar " + (m.ma + " " + m.mo).trim() + " del comparador") + '">' + ico(T_X, 16, 2) + "</button></li>";
      }).join("");
      if (n) n.textContent = l.length + "/" + MAX;
      if (ir) ir.setAttribute("href", rutaComparador() + "?m=" + l.join(","));
      if (irN) irN.textContent = "(" + l.length + ")";
      alto();
    }
    b.addEventListener("click", function (e) {
      var q = e.target.closest("[data-jm-quitar]");
      if (q) { quitar(q.getAttribute("data-jm-quitar")); return; }
      if (e.target.closest("[data-jm-vaciar]")) limpiar();
    });
    JM.escuchar("comparador", pintar);
    JM.escuchar("modal", pintar);
    window.addEventListener("popstate", pintar);
    pintar();
  }
  JM.enCada('[data-jm="bandeja"]', iniciarBandeja);

  /* ------------------------------------------------------------------
     Página /comparador/ ([jm_comparador]) — también dentro del modal
     ------------------------------------------------------------------ */
  function iniciarComparador(raiz) {
    var tabla = raiz.querySelector("[data-jm-tabla]");
    var caja = raiz.querySelector("[data-jm-anadir]");
    var aviso = raiz.querySelector("[data-jm-lleno]");
    var input = caja && caja.querySelector("input");
    var listbox = caja && caja.querySelector(".jm-anadir__lista");
    var desdeUrl = slugsDeUrl();
    /* null = nadie ha tocado nada aquí: manda la bandeja. La URL manda si trae ?m=. */
    var elegidas = desdeUrl.length ? desdeUrl.slice(0, MAX) : null;
    var cargadas = (raiz.getAttribute("data-m") || "").split(",").filter(Boolean);
    var peticion = 0;

    function puestas() { return (elegidas || lista()).slice(0, MAX); }

    function cargar(p) {
      cargadas = p.slice();
      var yo = ++peticion;
      raiz.setAttribute("aria-busy", "true");
      var url = (JM.datos.ajax || "/wp-admin/admin-ajax.php") + "?action=jm_comparador&m=" + encodeURIComponent(p.join(",")).replace(/%2C/g, ",");
      fetch(url, { credentials: "same-origin" })
        .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.text(); })
        .then(function (html) {
          if (yo !== peticion || !raiz.isConnected) return;
          tabla.innerHTML = html;
          raiz.setAttribute("data-m", p.join(","));
        })
        .catch(function (e) { if (window.console) console.error("[JOFEMESA] comparador", e); })
        .then(function () { if (yo === peticion) raiz.removeAttribute("aria-busy"); });
    }

    function sincronizar() {
      if (!raiz.isConnected) return;
      var p = puestas();
      reflejarEnUrl(p);
      var ll = p.length >= MAX;
      if (caja) caja.hidden = ll;
      if (aviso) aviso.hidden = !ll;
      if (input) input.placeholder = "Añadir máquina a la comparación (" + p.length + "/" + MAX + ")";
      if (p.join(",") !== cargadas.join(",")) cargar(p);
      if (listbox && !listbox.hidden) pintarCandidatas();
    }

    /* --- Añadir máquina: buscador con lista, no un <select> de 145 --- */
    function candidatas() {
      var q = JM.normaliza(input.value).trim();
      var ya = puestas();
      return datosIndice().lista.filter(function (m) {
        if (ya.indexOf(m.s) !== -1) return false;
        if (!q) return true;
        var heno = JM.normaliza(m.ma + " " + m.mo + " " + (m.subn || ""));
        return q.split(/\s+/).every(function (t) { return heno.indexOf(t) !== -1; });
      }).slice(0, 40);
    }
    function pintarCandidatas() {
      var c = candidatas();
      listbox.innerHTML = c.length
        ? c.map(function (m) {
          return '<li class="jm-anadir__item" role="option"><button type="button" class="jm-boton jm-anadir__opcion" data-jm-anadir-slug="' + JM.esc(m.s) + '">' +
            '<span class="jm-anadir__mas">' + ico(T_MAS, 16, 2.5) + "</span>" +
            '<span class="jm-anadir__texto"><span class="jm-anadir__nombre">' + JM.esc(m.ma + " " + m.mo) + "</span>" +
            '<span class="jm-label-sm jm-anadir__sub">' + JM.esc(m.subn || "") + "</span></span></button></li>";
        }).join("")
        : '<li class="jm-anadir__nada">Ninguna máquina cuadra con «' + JM.esc(input.value) + "».</li>";
    }
    function abrirLista(si) {
      if (!listbox) return;
      listbox.hidden = !si;
      input.setAttribute("aria-expanded", si ? "true" : "false");
      if (si) pintarCandidatas();
    }
    if (input) {
      input.addEventListener("input", function () { abrirLista(true); });
      input.addEventListener("focus", function () { abrirLista(true); });
      input.addEventListener("keydown", function (e) { if (e.key === "Escape") abrirLista(false); });
      document.addEventListener("click", function (e) {
        if (raiz.isConnected && caja && !caja.contains(e.target)) abrirLista(false);
      });
    }

    raiz.addEventListener("click", function (e) {
      var a = e.target.closest("[data-jm-anadir-slug]");
      if (a) {
        var s = a.getAttribute("data-jm-anadir-slug");
        var p = puestas();
        if (p.indexOf(s) === -1 && p.length < MAX) {
          elegidas = p.concat([s]);
          anadir(s); /* que la casilla aparezca marcada al volver al catálogo */
        }
        input.value = "";
        abrirLista(false);
        sincronizar();
        return;
      }
      var q = e.target.closest("[data-jm-quitar]");
      if (q) {
        var sq = q.getAttribute("data-jm-quitar");
        elegidas = puestas().filter(function (x) { return x !== sq; });
        quitar(sq);
        sincronizar();
        return;
      }
      if (e.target.closest("[data-jm-vaciar]")) {
        elegidas = null;
        limpiar();
        sincronizar();
        return;
      }
      if (e.target.closest("[data-jm-imprimir]")) window.print();
    });

    JM.escuchar("comparador", function () { if (!elegidas) sincronizar(); });
    sincronizar();
  }
  registrar('[data-jm="comparador"]', iniciarComparador);
})();
