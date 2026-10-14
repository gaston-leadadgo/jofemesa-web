/**
 * JOFEMESA · Panel de Formación (escritorio de WordPress).
 *
 *   · «Programar fechas»: varias fechas en chips, resumen y validación.
 *   · Calendario del mes: pulsar un día lo añade a las fechas.
 *   · Agenda: Próximas / Celebradas, filtros por curso y sede,
 *     «Programar otra igual», plazas − / + y papelera con «Deshacer».
 *
 * Sin dependencias. Sin JS el formulario sigue funcionando con una fecha.
 */
(function () {
  "use strict";

  var CFG = window.JM_FO || {};
  var panel = document.querySelector(".jm-adm-panel");
  if (!panel) return;

  var nodoDatos = document.getElementById("jm-fo-datos");
  var DATOS = { cursos: {}, sedes: {}, convocatorias: [] };
  try {
    if (nodoDatos) DATOS = JSON.parse(nodoDatos.textContent) || DATOS;
  } catch (e) {}

  var DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var MESES_C = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var HOY = CFG.hoy || new Date().toISOString().slice(0, 10);

  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }
  function fechaUTC(iso) { var p = iso.split("-"); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function iso(d) { return d.toISOString().slice(0, 10); }
  function corta(i) { var d = fechaUTC(i); return DIAS[d.getUTCDay()] + " " + d.getUTCDate() + " " + MESES_C[d.getUTCMonth()]; }

  /* ---------- Aviso flotante ---------- */
  var tostada = $("[data-tostada]");
  var tostadaReloj = null;
  function avisar(texto, accion, alPulsar) {
    if (!tostada) return;
    tostada.innerHTML = "";
    var t = document.createElement("span");
    t.textContent = texto;
    tostada.appendChild(t);
    if (accion) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = accion;
      b.addEventListener("click", function () { tostada.hidden = true; alPulsar(); });
      tostada.appendChild(b);
    }
    tostada.hidden = false;
    clearTimeout(tostadaReloj);
    tostadaReloj = setTimeout(function () { tostada.hidden = true; }, accion ? 9000 : 4500);
  }

  function pedir(accion, datos) {
    var cuerpo = new FormData();
    cuerpo.append("action", accion);
    cuerpo.append("nonce", CFG.nonce || "");
    Object.keys(datos).forEach(function (k) { cuerpo.append(k, datos[k]); });
    return fetch(CFG.ajax, { method: "POST", body: cuerpo, credentials: "same-origin" })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || !j.success) throw new Error((j && j.data && j.data.mensaje) || "No se ha podido guardar.");
        return j.data;
      });
  }

  /* ---------- Ir a una sección ---------- */
  function irA(id) {
    var destino = document.getElementById(id);
    if (!destino) return;
    destino.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    destino.classList.remove("es-destacada");
    void destino.offsetWidth;
    destino.classList.add("es-destacada");
  }
  $$("[data-ir-a]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      irA(a.getAttribute("data-ir-a"));
      if (a.getAttribute("data-ir-a") === "nueva" && entradaFecha) setTimeout(function () { entradaFecha.focus(); }, 350);
    });
  });

  /* =====================================================================
     PROGRAMAR FECHAS
     ===================================================================== */
  var form = $("[data-programar]");
  var entradaFecha = form ? $("[data-fecha]", form) : null;
  var fechas = [];
  var alCambiarFechas = [];

  if (form) {
    var botonAnadir = $("[data-anadir]", form);
    var chips = $("[data-chips]", form);
    var resumen = $("[data-resumen]", form);
    var textoEnviar = $("[data-enviar-texto]", form);
    var campo = function (n) { return $('[data-campo="' + n + '"]', form); };

    /* Con JS las fechas viajan en los chips; el campo solo sirve para elegir. */
    entradaFecha.removeAttribute("name");
    entradaFecha.removeAttribute("required");
    botonAnadir.hidden = false;

    var pintar = function () {
      fechas.sort();
      chips.innerHTML = "";
      fechas.forEach(function (f) {
        var li = document.createElement("li");
        var oculto = document.createElement("input");
        oculto.type = "hidden";
        oculto.name = "fechas[]";
        oculto.value = f;
        var quitar = document.createElement("button");
        quitar.type = "button";
        quitar.setAttribute("aria-label", "Quitar " + corta(f));
        quitar.textContent = "×";
        quitar.addEventListener("click", function () { alternar(f); entradaFecha.focus(); });
        li.appendChild(document.createTextNode(corta(f)));
        li.appendChild(oculto);
        li.appendChild(quitar);
        chips.appendChild(li);
      });
      actualizarResumen();
      alCambiarFechas.forEach(function (fn) { fn(); });
    };

    var alternar = function (f) {
      var i = fechas.indexOf(f);
      if (i >= 0) fechas.splice(i, 1);
      else fechas.push(f);
      pintar();
    };

    var anadirDesdeEntrada = function () {
      var f = entradaFecha.value;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(f)) {
        avisar("Elige un día en el selector de fecha.");
        entradaFecha.focus();
        return false;
      }
      if (f < HOY) {
        avisar("Esa fecha ya ha pasado.");
        return false;
      }
      if (fechas.indexOf(f) < 0) {
        fechas.push(f);
        pintar();
      }
      entradaFecha.value = "";
      return true;
    };

    botonAnadir.addEventListener("click", function () { anadirDesdeEntrada(); entradaFecha.focus(); });
    entradaFecha.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); anadirDesdeEntrada(); }
    });

    var actualizarResumen = function () {
      var c = DATOS.cursos[campo("curso").value];
      var s = DATOS.sedes[campo("sede").value];
      var n = fechas.length;
      textoEnviar.textContent = n > 1 ? "Crear " + n + " convocatorias" : "Crear convocatoria";
      if (!c || !s || !n) {
        var falta = [];
        if (!c) falta.push("el curso");
        if (!s) falta.push("la sede");
        if (!n) falta.push("al menos una fecha");
        resumen.textContent = "Falta " + falta.join(", ").replace(/, ([^,]*)$/, " y $1") + ".";
        return;
      }
      resumen.innerHTML = "";
      var b1 = document.createElement("strong");
      b1.textContent = n === 1 ? "1 convocatoria" : n + " convocatorias";
      var b2 = document.createElement("strong");
      b2.textContent = c.c;
      resumen.appendChild(document.createTextNode("Se publicarán "));
      resumen.appendChild(b1);
      resumen.appendChild(document.createTextNode(" de "));
      resumen.appendChild(b2);
      resumen.appendChild(document.createTextNode(" en " + s.n + " · " + campo("inicio").value + "–" + campo("fin").value + "."));
    };
    ["curso", "sede", "inicio", "fin"].forEach(function (n) { campo(n).addEventListener("change", actualizarResumen); });

    form.addEventListener("submit", function (e) {
      if (entradaFecha.value) anadirDesdeEntrada();
      if (!fechas.length) {
        e.preventDefault();
        avisar("Añade al menos una fecha.");
        entradaFecha.focus();
        return;
      }
      if (campo("fin").value && campo("inicio").value && campo("fin").value <= campo("inicio").value) {
        e.preventDefault();
        avisar("La hora de fin debe ser posterior a la de inicio.");
        campo("fin").focus();
        return;
      }
      var enviar = $("[data-enviar]", form);
      enviar.disabled = true;
      textoEnviar.textContent = "Publicando…";
    });

    /* Rellena el formulario (Programar otra igual / + Fechas de un curso). */
    window.jmFoRellenar = function (v) {
      if (v.curso) campo("curso").value = v.curso;
      if (v.sede) campo("sede").value = v.sede;
      if (v.inicio) campo("inicio").value = v.inicio;
      if (v.fin) campo("fin").value = v.fin;
      if ("plazas" in v) campo("plazas").value = v.plazas || "";
      fechas = [];
      pintar();
      irA("nueva");
      setTimeout(function () { entradaFecha.focus(); }, 350);
    };
    window.jmFoAlternarFecha = function (f) {
      if (f < HOY) return;
      alternar(f);
    };
    window.jmFoFechas = function () { return fechas; };

    pintar();
  }

  $$("[data-programar-curso]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (window.jmFoRellenar) window.jmFoRellenar({ curso: b.getAttribute("data-programar-curso") });
    });
  });

  /* =====================================================================
     CALENDARIO
     ===================================================================== */
  var cal = $("[data-calendario]");
  if (cal) {
    var rejilla = $("[data-cal-dias]", cal);
    var titulo = $("[data-cal-titulo]", cal);
    var hoyD = fechaUTC(HOY);
    var mes = new Date(Date.UTC(hoyD.getUTCFullYear(), hoyD.getUTCMonth(), 1));

    var porDia = function () {
      var m = {};
      DATOS.convocatorias.forEach(function (c) {
        (m[c.f] = m[c.f] || []).push(c);
      });
      return m;
    };

    var dibujar = function () {
      var eventos = porDia();
      var elegidas = window.jmFoFechas ? window.jmFoFechas() : [];
      titulo.textContent = MESES[mes.getUTCMonth()] + " " + mes.getUTCFullYear();
      rejilla.innerHTML = "";
      var primero = (mes.getUTCDay() + 6) % 7; // lunes = 0
      var dias = new Date(Date.UTC(mes.getUTCFullYear(), mes.getUTCMonth() + 1, 0)).getUTCDate();
      for (var h = 0; h < primero; h++) {
        var hueco = document.createElement("span");
        hueco.className = "jm-adm-cal__dia es-fuera";
        rejilla.appendChild(hueco);
      }
      for (var d = 1; d <= dias; d++) {
        var f = iso(new Date(Date.UTC(mes.getUTCFullYear(), mes.getUTCMonth(), d)));
        var lista = eventos[f] || [];
        var b = document.createElement("button");
        b.type = "button";
        b.className = "jm-adm-cal__dia";
        if (f < HOY) b.classList.add("es-pasado");
        if (f === HOY) b.classList.add("es-hoy");
        if (elegidas.indexOf(f) >= 0) b.classList.add("es-elegido");
        b.setAttribute("data-dia", f);
        var etiqueta = corta(f);
        if (lista.length) {
          etiqueta += ": " + lista.map(function (c) {
            var cu = DATOS.cursos[c.c];
            var se = DATOS.sedes[c.s];
            return (cu ? cu.c : "Sin curso") + (se ? " · " + se.n : "");
          }).join("; ");
        }
        if (f >= HOY && form) etiqueta += elegidas.indexOf(f) >= 0 ? " (pulsa para quitarla)" : " (pulsa para añadirla)";
        b.title = etiqueta;
        b.setAttribute("aria-label", etiqueta);
        if (f < HOY) b.setAttribute("aria-disabled", "true");
        var num = document.createElement("span");
        num.textContent = d;
        b.appendChild(num);
        var puntos = document.createElement("span");
        puntos.className = "jm-adm-cal__puntos";
        for (var i = 0; i < Math.min(3, lista.length); i++) puntos.appendChild(document.createElement("i"));
        b.appendChild(puntos);
        rejilla.appendChild(b);
      }
    };

    rejilla.addEventListener("click", function (e) {
      var b = e.target.closest("[data-dia]");
      if (!b || !window.jmFoAlternarFecha) return;
      var f = b.getAttribute("data-dia");
      if (f < HOY) return;
      window.jmFoAlternarFecha(f);
    });
    $$("[data-cal-mover]", cal).forEach(function (b) {
      b.addEventListener("click", function () {
        mes = new Date(Date.UTC(mes.getUTCFullYear(), mes.getUTCMonth() + +b.getAttribute("data-cal-mover"), 1));
        dibujar();
      });
    });
    $("[data-cal-hoy]", cal).addEventListener("click", function () {
      mes = new Date(Date.UTC(hoyD.getUTCFullYear(), hoyD.getUTCMonth(), 1));
      dibujar();
    });
    alCambiarFechas.push(dibujar);
    window.jmFoDibujarCalendario = dibujar;
    dibujar();
  }

  /* =====================================================================
     AGENDA
     ===================================================================== */
  var agenda = $("[data-agenda]");
  if (agenda) {
    var filtros = { cuando: "proxima", curso: "", sede: "" };
    var vacia = $("[data-agenda-vacia]", agenda);
    var vaciaTexto = $("[data-agenda-vacia-texto]", agenda);

    var aplicar = function () {
      var total = 0;
      $$("[data-mes]", agenda).forEach(function (mesNodo) {
        if (mesNodo.getAttribute("data-cuando") !== filtros.cuando) {
          mesNodo.hidden = true;
          return;
        }
        var visibles = 0;
        $$("[data-fila]", mesNodo).forEach(function (fila) {
          var ok = !fila.hasAttribute("data-borrada")
            && (!filtros.curso || fila.getAttribute("data-curso") === filtros.curso)
            && (!filtros.sede || fila.getAttribute("data-sede") === filtros.sede);
          fila.hidden = !ok;
          if (ok) visibles++;
        });
        $("[data-mes-n]", mesNodo).textContent = visibles;
        mesNodo.hidden = visibles === 0;
        total += visibles;
      });
      vacia.hidden = total > 0;
      vaciaTexto.textContent = filtros.curso || filtros.sede
        ? "Ninguna convocatoria con estos filtros."
        : (filtros.cuando === "proxima" ? "No hay convocatorias próximas." : "Todavía no hay convocatorias celebradas.");
    };

    $$("[data-cuando]", panel).forEach(function (b) {
      if (b.tagName !== "BUTTON") return;
      b.addEventListener("click", function () {
        $$(".jm-adm-segmento [data-cuando]").forEach(function (o) { o.setAttribute("aria-selected", o === b ? "true" : "false"); });
        filtros.cuando = b.getAttribute("data-cuando");
        aplicar();
      });
    });
    $$("[data-filtro]", panel).forEach(function (s) {
      s.addEventListener("change", function () {
        filtros[s.getAttribute("data-filtro")] = s.value;
        aplicar();
      });
    });

    agenda.addEventListener("click", function (e) {
      var fila = e.target.closest("[data-fila]");
      if (!fila) return;
      var id = fila.getAttribute("data-id");

      /* Programar otra igual */
      if (e.target.closest("[data-repetir]")) {
        if (window.jmFoRellenar) {
          window.jmFoRellenar({
            curso: fila.getAttribute("data-curso"),
            sede: fila.getAttribute("data-sede"),
            inicio: fila.getAttribute("data-inicio"),
            fin: fila.getAttribute("data-fin"),
            plazas: fila.getAttribute("data-plazas")
          });
          avisar("Formulario listo: elige el día de la nueva fecha.");
        }
        return;
      }

      /* Plazas − / + */
      var ocupar = e.target.closest("[data-ocupar]");
      if (ocupar) {
        /* Cada clic va a la cola de su fila: varios clics seguidos se
           guardan todos, en orden, y la barra muestra lo que dice el servidor. */
        var caja = fila.querySelector("[data-plazas-caja]");
        var delta = ocupar.getAttribute("data-ocupar");
        fila.jmPendientes = (fila.jmPendientes || 0) + 1;
        caja.classList.add("es-guardando");
        fila.jmCola = (fila.jmCola || Promise.resolve())
          .then(function () { return pedir("jm_fo_ocupadas", { id: id, delta: delta }); })
          .then(function (p) {
            caja.className = "jm-adm-plazas jm-adm-plazas--" + p.tono + " es-guardando";
            $("[data-plazas-texto]", caja).textContent = p.texto;
            $("[data-plazas-ocupadas]", caja).textContent = p.ocupadas;
            $("[data-plazas-barra]", caja).style.width = p.ancho + "%";
          })
          .catch(function (err) { avisar(err.message); })
          .then(function () {
            fila.jmPendientes--;
            if (!fila.jmPendientes) caja.classList.remove("es-guardando");
          });
        return;
      }

      /* Papelera, con Deshacer */
      if (e.target.closest("[data-papelera]")) {
        fila.classList.add("es-saliendo");
        pedir("jm_fo_papelera", { id: id })
          .then(function () {
            setTimeout(function () {
              fila.setAttribute("data-borrada", "");
              aplicar();
            }, 220);
            var copia = DATOS.convocatorias.slice();
            DATOS.convocatorias = DATOS.convocatorias.filter(function (c) { return String(c.id) !== id; });
            if (window.jmFoDibujarCalendario) window.jmFoDibujarCalendario();
            avisar("Convocatoria enviada a la papelera. Ya no se ve en la web.", "Deshacer", function () {
              pedir("jm_fo_restaurar", { id: id })
                .then(function () {
                  fila.removeAttribute("data-borrada");
                  fila.classList.remove("es-saliendo");
                  DATOS.convocatorias = copia;
                  if (window.jmFoDibujarCalendario) window.jmFoDibujarCalendario();
                  aplicar();
                  avisar("Convocatoria restaurada.");
                })
                .catch(function (err) { avisar(err.message); });
            });
          })
          .catch(function (err) {
            fila.classList.remove("es-saliendo");
            avisar(err.message);
          });
      }
    });

    aplicar();
  }

  /* Al llegar con #nueva (desde «Programar fechas» de un curso o un listado). */
  if (location.hash === "#nueva" && form) {
    setTimeout(function () { irA("nueva"); entradaFecha.focus(); }, 150);
  }
  /* Tras crear: las filas nuevas ya vienen resaltadas; se baja a la agenda. */
  if (location.hash === "#agenda") {
    setTimeout(function () { irA("agenda"); }, 150);
  }
})();
