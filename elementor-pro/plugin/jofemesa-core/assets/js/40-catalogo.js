/* ==========================================================================
   JOFEMESA · 40 CATÁLOGO DE ALQUILER
   Traducción de AlquilerCliente.tsx, PanelFiltros.tsx, TiraCategorias.tsx y
   lib/catalog (filtrar, ordenar, contarFacetas, filtrosQueMasExcluyen).

   Las 145 tarjetas las pinta el Loop Grid (ID de consulta jm_catalogo); aquí
   solo se filtran, se ordenan y se paginan de 24 en 24 en el navegador. Los
   filtros viven en la URL con los mismos nombres que la web original:
   ?fam=&sub=&energia=a,b&uso=&del=&marca=&hmin=&hmax=&carga=&q=&orden=
   ========================================================================== */
(function () {
  "use strict";
  if (!window.JM) return;

  var PASO = 24;
  var ETQ_ENERGIA = { electrico: "Eléctrica", diesel: "Diésel", hibrido: "Híbrida", gasolina: "Gasolina" };
  var ETQ_USO = { interior: "Interior", exterior: "Exterior" };
  var ORDENES = ["relevancia", "altura-asc", "altura-desc", "carga-desc"];
  var ICO_X = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

  /* ------------------------------------------------------------------
     Lógica de catálogo (lib/catalog/index.ts)
     ------------------------------------------------------------------ */

  function filtrar(lista, f) {
    var texto = f.texto ? JM.normaliza(f.texto) : null;
    var res = lista.filter(function (m) {
      if (f.familia && m.f !== f.familia) return false;
      if (f.subcategoria && m.sub !== f.subcategoria) return false;
      if (f.energia.length && f.energia.indexOf(m.e) === -1) return false;
      if (f.entorno.length && !f.entorno.some(function (e) { return m.en.indexOf(e) !== -1; })) return false;
      if (f.delegacion.length && !f.delegacion.some(function (d) { return m.del.indexOf(d) !== -1; })) return false;
      if (f.marca && m.ma !== f.marca) return false;
      /* Sin altura conocida queda FUERA del filtro de altura: no lo sabemos ≠ mide cero. */
      if (f.alturaMin != null || f.alturaMax != null) {
        if (m.h == null) return false;
        if (f.alturaMin != null && m.h < f.alturaMin) return false;
        if (f.alturaMax != null && m.h > f.alturaMax) return false;
      }
      if (f.cargaMin != null && (m.c == null || m.c < f.cargaMin)) return false;
      if (texto) {
        var heno = m.b || "";
        if (!texto.split(/\s+/).every(function (t) { return heno.indexOf(t) !== -1; })) return false;
      }
      return true;
    });
    return ordenar(res, f.orden);
  }

  function ordenar(lista, orden) {
    var copia = lista.slice();
    function asc(k) {
      return function (a, b) {
        var x = a[k] == null ? Infinity : a[k], y = b[k] == null ? Infinity : b[k];
        return x === y ? 0 : x < y ? -1 : 1;
      };
    }
    function desc(k) {
      return function (a, b) {
        var x = a[k] == null ? -Infinity : a[k], y = b[k] == null ? -Infinity : b[k];
        return x === y ? 0 : x > y ? -1 : 1;
      };
    }
    if (orden === "altura-asc") return copia.sort(asc("h"));
    if (orden === "altura-desc") return copia.sort(desc("h"));
    if (orden === "carga-desc") return copia.sort(desc("c"));
    /* El orden por defecto es EXACTAMENTE el del catálogo impreso. */
    return copia.sort(function (a, b) { return a.o - b.o; });
  }

  function con(f, parcial) {
    var r = {};
    Object.keys(f).forEach(function (k) { r[k] = f[k]; });
    Object.keys(parcial).forEach(function (k) { r[k] = parcial[k]; });
    return r;
  }

  function contarFacetas(lista, f, marcas) {
    var cuentas = { energia: {}, entorno: {}, marca: {} };
    Object.keys(ETQ_ENERGIA).forEach(function (e) { cuentas.energia[e] = filtrar(lista, con(f, { energia: [e] })).length; });
    Object.keys(ETQ_USO).forEach(function (e) { cuentas.entorno[e] = filtrar(lista, con(f, { entorno: [e] })).length; });
    marcas.forEach(function (m) { cuentas.marca[m] = filtrar(lista, con(f, { marca: m })).length; });
    return cuentas;
  }

  /** Las dos facetas activas que más resultados están excluyendo (y, si no basta, pares). */
  function filtrosQueMasExcluyen(lista, f) {
    var c = [];
    if (f.alturaMin != null || f.alturaMax != null) c.push({ etiqueta: "el filtro de altura", quitar: { alturaMin: null, alturaMax: null } });
    if (f.cargaMin != null) c.push({ etiqueta: "el filtro de carga", quitar: { cargaMin: null } });
    if (f.energia.length) c.push({ etiqueta: "el filtro de alimentación", quitar: { energia: [] } });
    if (f.entorno.length) c.push({ etiqueta: "el filtro de uso", quitar: { entorno: [] } });
    if (f.marca) c.push({ etiqueta: "el filtro de fabricante", quitar: { marca: null } });
    if (f.subcategoria && !f.subFija) c.push({ etiqueta: "la subcategoría", quitar: { subcategoria: null } });
    if (f.texto) c.push({ etiqueta: "la búsqueda por texto", quitar: { texto: null } });

    var solos = c.map(function (x) {
      return { etiqueta: x.etiqueta, quitar: x.quitar, resultados: filtrar(lista, con(f, x.quitar)).length };
    }).filter(function (x) { return x.resultados > 0; })
      .sort(function (a, b) { return b.resultados - a.resultados; });
    if (solos.length) return solos.slice(0, 2);

    var pares = [];
    for (var i = 0; i < c.length; i++) {
      for (var j = i + 1; j < c.length; j++) {
        var quitar = con(c[i].quitar, c[j].quitar);
        var n = filtrar(lista, con(f, quitar)).length;
        if (n > 0) pares.push({ etiqueta: c[i].etiqueta + " y " + c[j].etiqueta, quitar: quitar, resultados: n });
      }
    }
    return pares.sort(function (a, b) { return b.resultados - a.resultados; }).slice(0, 2);
  }

  /* ------------------------------------------------------------------
     Tira horizontal con flechas y degradados (TiraCategorias.tsx)
     ------------------------------------------------------------------ */

  function iniciarTira(tira) {
    var pista = tira.querySelector(".jm-tira__pista");
    var izq = tira.querySelector(".jm-tira__flecha--izq");
    var der = tira.querySelector(".jm-tira__flecha--der");
    if (!pista) return;
    function medir() {
      var margen = 4;
      var hayIzq = pista.scrollLeft > margen;
      var hayDer = pista.scrollLeft + pista.clientWidth < pista.scrollWidth - margen;
      tira.classList.toggle("jm-tira--izq", hayIzq);
      tira.classList.toggle("jm-tira--der", hayDer);
      if (izq) izq.hidden = !hayIzq;
      if (der) der.hidden = !hayDer;
    }
    function mover(sentido) {
      pista.scrollBy({ left: pista.clientWidth * 0.7 * sentido, behavior: JM.reducido ? "auto" : "smooth" });
    }
    if (izq) izq.addEventListener("click", function () { mover(-1); });
    if (der) der.addEventListener("click", function () { mover(1); });
    pista.addEventListener("scroll", medir, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(medir).observe(pista);
    else window.addEventListener("resize", medir);
    medir();
  }
  JM.enCada('[data-jm="tira"]', iniciarTira);

  /* ------------------------------------------------------------------
     Catálogo
     ------------------------------------------------------------------ */

  function iniciar(raiz) {
    var D = JM.json("jm-catalogo-datos");
    if (!D || !D.maquinas) return;

    var fija = D.fija || {};
    var base = D.maquinas;
    var porSlug = {}, porId = {};
    base.forEach(function (m) { porSlug[m.s] = m; porId[String(m.id)] = m; });

    /* --- Las tarjetas que ha pintado el Loop Grid --- */
    var rejilla = document.querySelector(".jm-catalogo-rejilla") || document;
    var elementos = {};
    var contenedor = null;
    rejilla.querySelectorAll(".e-loop-item").forEach(function (el) {
      var m = null;
      var c = el.className.match(/(?:^|\s)jm-maq-(\S+)/);
      if (c) m = porSlug[c[1]];
      if (!m) {
        var id = el.className.match(/(?:^|\s)e-loop-item-(\d+)/) || el.className.match(/(?:^|\s)post-(\d+)/);
        if (id) m = porId[id[1]];
      }
      if (!m) return;
      elementos[m.s] = el;
      contenedor = contenedor || el.parentNode;
    });

    var barra = document.querySelector('[data-jm-cat="barra"]');
    var pie = document.querySelector('[data-jm-cat="pie"]');
    var tiras = document.querySelector("[data-jm-tiras]");
    var hoja = raiz;

    /* --- Estado: los parámetros de la URL --- */
    function famId(v) {
      if (!v) return null;
      for (var i = 0; i < D.familias.length; i++) {
        if (D.familias[i].id === v || D.familias[i].slug === v) return D.familias[i].id;
      }
      return v;
    }
    function leerUrl() {
      var u = new URLSearchParams(location.search);
      function lista(k) { return (u.get(k) || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean); }
      function num(k) {
        var v = u.get(k);
        if (v == null || v === "") return null;
        var n = parseFloat(v);
        return isFinite(n) ? n : null;
      }
      var orden = u.get("orden");
      return {
        fam: famId(u.get("fam")), sub: u.get("sub") || null,
        energia: lista("energia"), uso: lista("uso"), del: lista("del"),
        marca: u.get("marca") || null, hmin: num("hmin"), hmax: num("hmax"), carga: num("carga"),
        q: u.get("q") || null, orden: ORDENES.indexOf(orden) !== -1 ? orden : "relevancia",
      };
    }
    var p = leerUrl();
    var visibles = PASO;
    var huella = "";
    var temporizador = null;

    function filtros() {
      return {
        familia: fija.familia || p.fam,
        subcategoria: fija.sub || p.sub,
        subFija: !!fija.sub,
        energia: p.energia, entorno: p.uso, delegacion: p.del,
        marca: p.marca, alturaMin: p.hmin, alturaMax: p.hmax, cargaMin: p.carga,
        texto: p.q, orden: p.orden,
      };
    }

    /* `replace` y no `push`: marcar una casilla no genera treinta entradas
       de historial, pero volver atrás desde una ficha restaura la vista. */
    function escribirUrl() {
      clearTimeout(temporizador);
      temporizador = setTimeout(function () {
        if (!raiz.isConnected) return;
        var u = new URLSearchParams(location.search);
        ["fam", "sub", "energia", "uso", "del", "marca", "hmin", "hmax", "carga", "q", "orden"].forEach(function (k) { u.delete(k); });
        if (p.fam && !fija.familia) u.set("fam", p.fam);
        if (p.sub && !fija.sub) u.set("sub", p.sub);
        if (p.energia.length) u.set("energia", p.energia.join(","));
        if (p.uso.length) u.set("uso", p.uso.join(","));
        if (p.del.length) u.set("del", p.del.join(","));
        if (p.marca) u.set("marca", p.marca);
        if (p.hmin != null) u.set("hmin", String(p.hmin));
        if (p.hmax != null) u.set("hmax", String(p.hmax));
        if (p.carga != null) u.set("carga", String(p.carga));
        if (p.q) u.set("q", p.q);
        if (p.orden !== "relevancia") u.set("orden", p.orden);
        var q = u.toString().replace(/%2C/g, ",");
        history.replaceState(history.state, "", location.pathname + (q ? "?" + q : "") + location.hash);
      }, 120);
    }

    function set(parcial) {
      Object.keys(parcial).forEach(function (k) { p[k] = parcial[k]; });
      pintar();
      escribirUrl();
    }

    function alterna(lista, v) {
      return lista.indexOf(v) !== -1 ? lista.filter(function (x) { return x !== v; }) : lista.concat([v]);
    }

    function limpiarTodo() {
      set({ fam: null, sub: null, energia: [], uso: [], del: [], marca: null, hmin: null, hmax: null, carga: null, q: null });
    }

    /* --- Chips de filtros activos --- */
    function chips() {
      var c = [];
      if (p.sub && !fija.sub) c.push({ etiqueta: D.subs[p.sub] || p.sub, quitar: { sub: null } });
      if (p.hmin != null || p.hmax != null) {
        c.push({ etiqueta: "Altura " + (p.hmin == null ? 0 : p.hmin) + "–" + (p.hmax == null ? "+" : p.hmax) + " m", quitar: { hmin: null, hmax: null } });
      }
      p.energia.forEach(function (e) { c.push({ etiqueta: ETQ_ENERGIA[e] || e, quitar: { energia: p.energia.filter(function (x) { return x !== e; }) } }); });
      p.uso.forEach(function (u) { c.push({ etiqueta: ETQ_USO[u] || u, quitar: { uso: p.uso.filter(function (x) { return x !== u; }) } }); });
      if (p.marca) c.push({ etiqueta: p.marca, quitar: { marca: null } });
      if (p.q) c.push({ etiqueta: "«" + p.q + "»", quitar: { q: null } });
      return c;
    }
    var chipsActuales = [];
    var rescatesActuales = [];

    function tramoActivo(t) {
      return p.hmin === (t.min == null ? null : t.min) && p.hmax === (t.max == null ? null : t.max);
    }

    /* --- Pintar --- */
    function pintar() {
      var f = filtros();
      var res = filtrar(base, f);
      var nueva = JSON.stringify(f);
      if (nueva !== huella) { huella = nueva; visibles = PASO; }
      var cuentas = contarFacetas(base, f, D.marcas);

      /* Tarjetas: orden y tandas. */
      if (contenedor) {
        var dentro = {};
        var frag = document.createDocumentFragment();
        res.forEach(function (m, i) {
          var el = elementos[m.s];
          if (!el) return;
          dentro[m.s] = true;
          el.classList.toggle("jm-oculta", i >= visibles);
          frag.appendChild(el);
        });
        Object.keys(elementos).forEach(function (s) {
          if (dentro[s]) return;
          elementos[s].classList.add("jm-oculta");
          frag.appendChild(elementos[s]);
        });
        contenedor.appendChild(frag);
      }

      /* Contadores. */
      var unidad = res.length === 1 ? "máquina" : "máquinas";
      document.querySelectorAll("[data-jm-cuenta]").forEach(function (n) { n.textContent = String(res.length); });
      document.querySelectorAll("[data-jm-unidad]").forEach(function (n) { n.textContent = unidad; });

      /* Chips. */
      chipsActuales = chips();
      if (barra) {
        var ul = barra.querySelector("[data-jm-chips]");
        var activos = barra.querySelector("[data-jm-activos]");
        if (activos) {
          activos.hidden = !chipsActuales.length;
          activos.textContent = String(chipsActuales.length);
        }
        if (ul) {
          ul.hidden = !chipsActuales.length;
          ul.innerHTML = chipsActuales.map(function (c, i) {
            return '<li><button type="button" class="jm-boton jm-cat-chip" data-jm-chip="' + i + '">' + JM.esc(c.etiqueta) + ICO_X + "</button></li>";
          }).join("") + (chipsActuales.length
            ? '<li><button type="button" class="jm-boton jm-cat-chips__borrar" data-jm-limpiar>Borrar todo (' + chipsActuales.length + ")</button></li>"
            : "");
        }
        var orden = barra.querySelector("[data-jm-orden]");
        if (orden) orden.value = p.orden;
      }

      /* Panel. */
      hoja.querySelectorAll('[data-jm-faceta]').forEach(function (inp) {
        var tipo = inp.getAttribute("data-jm-faceta");
        var marcado = (tipo === "energia" ? p.energia : p.uso).indexOf(inp.value) !== -1;
        var n = (tipo === "energia" ? cuentas.energia : cuentas.entorno)[inp.value] || 0;
        var vacio = n === 0 && !marcado;
        inp.checked = marcado;
        inp.disabled = vacio;
        var label = inp.closest(".jm-cat-opcion");
        if (label) {
          label.classList.toggle("jm-cat-opcion--vacia", vacio);
          label.classList.toggle("jm-cat-opcion--marcada", marcado);
          var cn = label.querySelector("[data-jm-n]");
          if (cn) cn.textContent = String(n);
        }
      });
      hoja.querySelectorAll("[data-jm-tramo]").forEach(function (inp) {
        var t = D.tramos[+inp.getAttribute("data-jm-tramo")];
        var activo = !!t && tramoActivo(t);
        inp.checked = activo;
        var label = inp.closest(".jm-cat-opcion");
        if (label) label.classList.toggle("jm-cat-opcion--marcada", activo);
      });
      var sel = hoja.querySelector("[data-jm-marca]");
      if (sel) {
        Array.prototype.forEach.call(sel.options, function (o) {
          if (!o.value) return;
          var n = cuentas.marca[o.value] || 0;
          o.textContent = o.value + " (" + n + ")";
          o.disabled = n === 0 && p.marca !== o.value;
        });
        sel.value = p.marca || "";
      }
      document.querySelectorAll("[data-jm-q]").forEach(function (inp) {
        if (document.activeElement !== inp) inp.value = p.q || "";
      });

      /* Tiras. */
      if (tiras) {
        var famActiva = fija.familia || p.fam || "";
        if (!fija.familia) {
          tiras.querySelectorAll("[data-jm-fam]").forEach(function (a) {
            if (a.getAttribute("data-jm-fam") === famActiva) a.setAttribute("aria-current", "page");
            else a.removeAttribute("aria-current");
          });
        }
        tiras.querySelectorAll("[data-jm-subs]").forEach(function (t) {
          t.hidden = t.getAttribute("data-jm-subs") !== famActiva;
        });
        var subActiva = fija.sub || p.sub || "";
        tiras.querySelectorAll("[data-jm-sub]").forEach(function (b) {
          b.setAttribute("aria-pressed", b.getAttribute("data-jm-sub") === subActiva ? "true" : "false");
        });
      }

      /* Estado vacío y «ver más». */
      if (pie) {
        var vacio = pie.querySelector("[data-jm-vacio]");
        rescatesActuales = res.length === 0 ? filtrosQueMasExcluyen(base, f) : [];
        if (vacio) {
          vacio.hidden = res.length !== 0;
          var bloque = vacio.querySelector("[data-jm-rescates]");
          var lista = vacio.querySelector("[data-jm-rescates-lista]");
          if (bloque) bloque.hidden = !rescatesActuales.length;
          if (lista) {
            lista.innerHTML = rescatesActuales.map(function (r, i) {
              return '<li><button type="button" class="jm-boton jm-cat-rescate" data-jm-rescate="' + i + '">Quitar ' + JM.esc(r.etiqueta) +
                '<span class="jm-value jm-cat-rescate__n">→ ' + r.resultados + "</span></button></li>";
            }).join("");
          }
        }
        var mas = pie.querySelector("[data-jm-mas]");
        if (mas) {
          mas.hidden = !(visibles < res.length);
          var n1 = mas.querySelector("[data-jm-mas-n]"), n2 = mas.querySelector("[data-jm-mas-vis]"), n3 = mas.querySelector("[data-jm-mas-total]");
          if (n1) n1.textContent = String(Math.min(PASO, res.length - visibles));
          if (n2) n2.textContent = String(visibles);
          if (n3) n3.textContent = String(res.length);
        }
      }
    }

    /* --- Hoja de filtros en móvil --- */
    var abridor = null;
    var mq = window.matchMedia("(min-width: 1024px)");
    function abrirHoja(origen) {
      abridor = origen || null;
      hoja.classList.add("jm-cat-filtros--abierta");
      hoja.setAttribute("role", "dialog");
      hoja.setAttribute("aria-modal", "true");
      document.body.style.overflow = "hidden";
      var cerrar = hoja.querySelector(".jm-cat-filtros__cerrar");
      if (cerrar) cerrar.focus();
    }
    function cerrarHoja() {
      if (!hoja.classList.contains("jm-cat-filtros--abierta")) return;
      hoja.classList.remove("jm-cat-filtros--abierta");
      hoja.removeAttribute("role");
      hoja.removeAttribute("aria-modal");
      document.body.style.overflow = "";
      if (abridor) abridor.focus();
    }
    var cambioMq = function (e) { if (e.matches) cerrarHoja(); };
    if (mq.addEventListener) mq.addEventListener("change", cambioMq); else if (mq.addListener) mq.addListener(cambioMq);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && hoja.classList.contains("jm-cat-filtros--abierta")) cerrarHoja();
    });

    /* --- Eventos --- */
    function alEscribir(e) {
      var t = e.target;
      if (t.matches && t.matches("[data-jm-q]")) set({ q: t.value || null });
    }
    document.addEventListener("input", alEscribir);

    hoja.addEventListener("change", function (e) {
      var t = e.target;
      if (t.matches("[data-jm-faceta]")) {
        var tipo = t.getAttribute("data-jm-faceta");
        if (tipo === "energia") set({ energia: alterna(p.energia, t.value) });
        else set({ uso: alterna(p.uso, t.value) });
      } else if (t.matches("[data-jm-tramo]")) {
        var tr = D.tramos[+t.getAttribute("data-jm-tramo")];
        if (tr) set({ hmin: tr.min == null ? null : tr.min, hmax: tr.max == null ? null : tr.max });
      } else if (t.matches("[data-jm-marca]")) {
        set({ marca: t.value || null });
      }
    });
    /* Un tramo ya marcado se desmarca al pulsarlo otra vez. */
    hoja.addEventListener("click", function (e) {
      var t = e.target;
      if (t.matches && t.matches("[data-jm-tramo]")) {
        var tr = D.tramos[+t.getAttribute("data-jm-tramo")];
        if (tr && tramoActivo(tr)) set({ hmin: null, hmax: null });
        return;
      }
      if (t.closest("[data-jm-cerrar-filtros]")) cerrarHoja();
      else if (t.closest("[data-jm-limpiar]")) limpiarTodo();
    });

    if (barra) {
      barra.addEventListener("change", function (e) {
        if (e.target.matches("[data-jm-orden]")) set({ orden: e.target.value });
      });
      barra.addEventListener("click", function (e) {
        var chip = e.target.closest("[data-jm-chip]");
        if (chip) {
          var c = chipsActuales[+chip.getAttribute("data-jm-chip")];
          if (c) set(c.quitar);
          return;
        }
        if (e.target.closest("[data-jm-limpiar]")) { limpiarTodo(); return; }
        var ab = e.target.closest("[data-jm-abrir-filtros]");
        if (ab) abrirHoja(ab);
      });
    }

    if (pie) {
      pie.addEventListener("click", function (e) {
        var r = e.target.closest("[data-jm-rescate]");
        if (r) {
          var q = (rescatesActuales[+r.getAttribute("data-jm-rescate")] || {}).quitar;
          if (!q) return;
          set({
            hmin: "alturaMin" in q ? null : p.hmin,
            hmax: "alturaMax" in q ? null : p.hmax,
            carga: "cargaMin" in q ? null : p.carga,
            energia: "energia" in q ? [] : p.energia,
            uso: "entorno" in q ? [] : p.uso,
            del: "delegacion" in q ? [] : p.del,
            marca: "marca" in q ? null : p.marca,
            sub: "subcategoria" in q ? null : p.sub,
            q: "texto" in q ? null : p.q,
          });
          return;
        }
        if (e.target.closest("[data-jm-ver-mas]")) {
          visibles += PASO;
          pintar();
        }
      });
    }

    if (tiras) {
      tiras.addEventListener("click", function (e) {
        var b = e.target.closest("[data-jm-sub]");
        if (!b || b.disabled) return;
        set({ sub: b.getAttribute("data-jm-sub") || null });
      });
    }

    raiz.classList.add("jm-cat-filtros--listo");
    pintar();
  }

  JM.enCada('[data-jm="catalogo"]', iniciar);
})();
