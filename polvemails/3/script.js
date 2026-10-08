/* =========================================================
   NÉBULA MAIL — Lógica de la aplicación (JS vanilla)
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. DATOS DE EJEMPLO
     --------------------------------------------------------- */
  const AVATAR_COLORS = ["#4F46E5", "#0EA5A5", "#DB2777", "#D97706", "#2563EB", "#16A34A", "#7C3AED"];

  function initials(name) {
    return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  }

  function colorFor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }

  // Estado de la app: cada correo vive en un folder ("inbox", "sent", "drafts", "trash")
  // y puede estar destacado (starred: true) independientemente del folder.
  let messages = [
    {
      id: "m1", folder: "inbox", unread: true, starred: true,
      from: "Laura Gómez", email: "laura.gomez@estudio-creativo.com",
      to: "camila.arce@polvemails.local",
      subject: "Propuesta final de branding — revisión",
      snippet: "Hola Camila, adjunto la última versión del logo y la paleta de colores que discutimos ayer...",
      body: "Hola Camila,\n\nAdjunto la última versión del logo y la paleta de colores que discutimos ayer en la llamada. Hicimos tres ajustes principales:\n\n1. Simplificamos el ícono para que funcione mejor en tamaños pequeños.\n2. Ajustamos el tono del violeta principal para que contraste mejor con el blanco.\n3. Añadimos una variante horizontal para el uso en el footer del sitio.\n\n¿Podrías revisarlo antes del jueves? Nos gustaría cerrar esta fase antes de pasar a la aplicación en redes sociales.\n\nQuedo atenta a tus comentarios.\n\nSaludos,\nLaura",
      date: "2026-09-17T09:14:00", tags: ["work"]
    },
    {
      id: "m2", folder: "inbox", unread: true, starred: false,
      from: "Banco Andino", email: "notificaciones@bancoandino.com",
      to: "camila.arce@polvemails.local",
      subject: "Resumen de tu cuenta — Agosto 2026",
      snippet: "Tu resumen mensual ya está disponible. Aquí tienes un vistazo rápido de tus movimientos...",
      body: "Estimada Camila,\n\nTu resumen mensual de agosto ya está disponible en la app y en tu banca en línea.\n\nResumen rápido:\n- Ingresos: $2,340,000\n- Gastos: $1,870,500\n- Ahorro del mes: $469,500\n\nRecuerda que puedes activar alertas personalizadas desde la sección de configuración.\n\nGracias por confiar en nosotros.\n\nBanco Andino",
      date: "2026-09-17T07:02:00", tags: []
    },
    {
      id: "m3", folder: "inbox", unread: false, starred: false,
      from: "Marco Salinas", email: "marco.salinas@devteam.io",
      to: "camila.arce@polvemails.local",
      subject: "Re: Bug en el checkout — prioridad alta",
      snippet: "Ya identificamos el problema, era un conflicto con el middleware de validación de pagos...",
      body: "Hola equipo,\n\nYa identificamos el problema: era un conflicto entre el middleware de validación de pagos y la nueva versión de la pasarela. Ya está corregido en staging.\n\nLo desplegamos a producción esta tarde después de las pruebas finales. Les aviso apenas esté en vivo.\n\nGracias por la paciencia.\n\nMarco",
      date: "2026-09-16T18:40:00", tags: ["work", "urgent"]
    },
    {
      id: "m4", folder: "inbox", unread: false, starred: true,
      from: "Valentina Ruiz", email: "vale.ruiz@gmail.com",
      to: "camila.arce@polvemails.local",
      subject: "¡Cena el sábado?",
      snippet: "Hola! Estaba pensando en organizar una cena en mi casa el sábado, ¿te animas?",
      body: "¡Hola Cami!\n\nEstaba pensando en organizar una cena en mi casa el sábado por la noche, nada muy elaborado, algo tranquilo entre amigos. ¿Te animas?\n\nVoy a cocinar algo vegetariano así que no te preocupes por eso. Avísame si puedes para saber cuántos platos preparar.\n\n¡Un abrazo!\nValen",
      date: "2026-09-16T13:21:00", tags: ["personal"]
    },
    {
      id: "m5", folder: "inbox", unread: false, starred: false,
      from: "Newsletter Diseño UX", email: "hola@diseñoux.news",
      to: "camila.arce@polvemails.local",
      subject: "5 tendencias de UI para lo que resta de 2026",
      snippet: "Esta semana exploramos las interfaces con microinteracciones y los sistemas de diseño adaptativos...",
      body: "Esta semana en el boletín:\n\n1. Microinteracciones con propósito, no decoración.\n2. Sistemas de diseño que se adaptan al contexto del usuario.\n3. Tipografía variable como herramienta de jerarquía.\n4. Modo oscuro como opción de diseño, no solo accesibilidad.\n5. Componentes que explican el estado vacío como una oportunidad.\n\nLee el artículo completo en nuestro sitio.",
      date: "2026-09-15T08:00:00", tags: []
    },
    {
      id: "m6", folder: "sent", unread: false, starred: false,
      from: "Camila Arce", email: "camila.arce@polvemails.local",
      to: "laura.gomez@estudio-creativo.com",
      subject: "Re: Propuesta final de branding",
      snippet: "Hola Laura, revisé la propuesta y me parece excelente. Solo un comentario sobre el ícono...",
      body: "Hola Laura,\n\nRevisé la propuesta y me parece excelente el trabajo que hicieron. Solo tengo un comentario menor sobre el ícono: ¿podríamos probar una versión con los bordes un poco más redondeados?\n\nFuera de eso, aprobado de mi parte.\n\nGracias por el gran trabajo.\n\nCamila",
      date: "2026-09-16T11:05:00", tags: ["work"]
    },
    {
      id: "m7", folder: "sent", unread: false, starred: false,
      from: "Camila Arce", email: "camila.arce@polvemails.local",
      to: "equipo@polvemails.local",
      subject: "Agenda de la reunión del viernes",
      snippet: "Hola a todos, comparto la agenda para la reunión de planificación del viernes...",
      body: "Hola a todos,\n\nComparto la agenda para la reunión de planificación del viernes a las 10:00 a.m.:\n\n1. Revisión de objetivos del trimestre.\n2. Estado de los proyectos activos.\n3. Prioridades para el próximo sprint.\n4. Espacio abierto para preguntas.\n\nNos vemos el viernes.\n\nCamila",
      date: "2026-09-14T16:30:00", tags: ["work"]
    },
    {
      id: "m8", folder: "drafts", unread: false, starred: false,
      from: "Camila Arce", email: "camila.arce@polvemails.local",
      to: "contabilidad@polvemails.local",
      subject: "Solicitud de reembolso — viaje a Medellín",
      snippet: "Hola, quisiera solicitar el reembolso de los gastos del viaje a Medellín. Adjunto...",
      body: "Hola,\n\nQuisiera solicitar el reembolso de los gastos del viaje a Medellín del mes pasado. Adjunto las facturas correspondientes a continuación.\n\n[Borrador sin terminar]",
      date: "2026-09-13T10:00:00", tags: []
    },
    {
      id: "m9", folder: "trash", unread: false, starred: false,
      from: "Promociones ViajaYa", email: "ofertas@viajaya.com",
      to: "camila.arce@polvemails.local",
      subject: "¡Última oportunidad! 40% de descuento en vuelos",
      snippet: "No dejes pasar esta oferta exclusiva por tiempo limitado, vuelos desde...",
      body: "No dejes pasar esta oferta exclusiva por tiempo limitado.\n\nVuelos nacionales desde $89.000 y vuelos internacionales con hasta 40% de descuento. Válido hasta agotar existencias.",
      date: "2026-09-10T09:00:00", tags: []
    }
  ];

  let currentFolder = "inbox";
  let currentFilter = "all"; // all | unread
  let currentMessageId = null;
  let searchTerm = "";

  const FOLDER_TITLES = {
    inbox: "Bandeja de entrada",
    starred: "Destacados",
    sent: "Enviados",
    drafts: "Borradores",
    trash: "Papelera"
  };

  /* ---------------------------------------------------------
     2. REFERENCIAS AL DOM
     --------------------------------------------------------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const appEl = $("#app");
  const folderNav = $("#folderNav");
  const folderTitle = $("#folderTitle");
  const listTabs = $("#listTabs");
  const messagesEl = $("#messages");
  const emptyList = $("#emptyList");
  const searchInput = $("#searchInput");

  const readingEmpty = $("#readingEmpty");
  const readingContent = $("#readingContent");
  const readSubject = $("#readSubject");
  const readTags = $("#readTags");
  const readAvatar = $("#readAvatar");
  const readFrom = $("#readFrom");
  const readFromEmail = $("#readFromEmail");
  const readTo = $("#readTo");
  const readDate = $("#readDate");
  const readBody = $("#readBody");
  const btnStar = $("#btnStar");
  const btnDelete = $("#btnDelete");
  const btnArchive = $("#btnArchive");

  const composeOverlay = $("#composeOverlay");
  const composeForm = $("#composeForm");
  const composeTo = $("#composeTo");
  const composeSubject = $("#composeSubject");
  const composeBody = $("#composeBody");
  const scrim = $("#scrim");
  const toast = $("#toast");
  const toastMessage = $("#toastMessage");

  let toastTimer = null;
  let composeMode = { type: "new", replyTo: null }; // new | reply | forward

  /* ---------------------------------------------------------
     3. UTILIDADES
     --------------------------------------------------------- */
  function formatListDate(iso) {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) {
      return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
  }

  function formatFullDate(iso) {
    const d = new Date(iso);
    return d.toLocaleString("es-ES", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  }

  function tagLabel(tag) {
    return { work: "Trabajo", personal: "Personal", urgent: "Urgente" }[tag] || tag;
  }

  function showToast(text) {
    clearTimeout(toastTimer);
    toastMessage.textContent = text;
    toast.hidden = false;
    toast.classList.remove("hide");
    toastTimer = setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => { toast.hidden = true; }, 250);
    }, 3000);
  }

  /* ---------------------------------------------------------
     4. RENDER: contadores de carpetas
     --------------------------------------------------------- */
  function renderCounts() {
    const counts = {
      inbox: messages.filter(m => m.folder === "inbox" && m.unread).length,
      starred: messages.filter(m => m.starred && m.folder !== "trash").length,
      sent: 0,
      drafts: messages.filter(m => m.folder === "drafts").length,
      trash: 0
    };
    $$("[data-count]").forEach(el => {
      const key = el.dataset.count;
      const val = counts[key] || 0;
      el.textContent = val;
      el.dataset.zero = val === 0 ? "true" : "false";
    });
  }

  /* ---------------------------------------------------------
     5. RENDER: lista de mensajes según carpeta/filtro/búsqueda
     --------------------------------------------------------- */
  function getVisibleMessages() {
    let list = messages.filter(m => {
      if (currentFolder === "starred") return m.starred && m.folder !== "trash";
      return m.folder === currentFolder;
    });

    if (currentFilter === "unread") list = list.filter(m => m.unread);

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(m =>
        m.from.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.snippet.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function renderMessageList() {
    const list = getVisibleMessages();
    messagesEl.innerHTML = "";

    emptyList.hidden = list.length !== 0;

    list.forEach(msg => {
      const li = document.createElement("li");
      li.className = "message-item" + (msg.unread ? " unread" : "") + (msg.id === currentMessageId ? " selected" : "");
      li.dataset.id = msg.id;
      li.setAttribute("tabindex", "0");
      li.setAttribute("role", "button");

      const tagsHTML = msg.tags.map(t => `<span class="tag tag-${t}">${tagLabel(t)}</span>`).join("");

      li.innerHTML = `
        <span class="avatar" style="--avatar-color:${colorFor(msg.from)}">${initials(msg.from)}</span>
        <div class="message-body">
          <div class="message-top-row">
            <span class="message-sender">${escapeHTML(msg.from)}</span>
            <span class="message-date">${formatListDate(msg.date)}</span>
          </div>
          <p class="message-subject">${escapeHTML(msg.subject) || "(sin asunto)"}</p>
          <p class="message-snippet">${escapeHTML(msg.snippet)}</p>
          ${tagsHTML ? `<div class="message-meta-row">${tagsHTML}</div>` : ""}
        </div>
        ${msg.unread ? '<span class="unread-dot" aria-hidden="true"></span>' : ""}
        <button class="star-btn${msg.starred ? " active" : ""}" data-star="${msg.id}" aria-label="Destacar mensaje">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
        </button>
      `;

      messagesEl.appendChild(li);
    });

    renderCounts();
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------------------------------------------------------
     6. PANEL DE LECTURA
     --------------------------------------------------------- */
  function openMessage(id) {
    const msg = messages.find(m => m.id === id);
    if (!msg) return;

    currentMessageId = id;
    msg.unread = false;

    readingEmpty.hidden = true;
    readingContent.hidden = false;

    readSubject.textContent = msg.subject || "(sin asunto)";
    readTags.innerHTML = msg.tags.map(t => `<span class="tag tag-${t}">${tagLabel(t)}</span>`).join("");

    readAvatar.textContent = initials(msg.from);
    readAvatar.style.setProperty("--avatar-color", colorFor(msg.from));
    readFrom.textContent = msg.from;
    readFromEmail.textContent = `<${msg.email}>`;
    readTo.textContent = msg.to;
    readDate.textContent = formatFullDate(msg.date);
    readBody.textContent = msg.body;

    updateStarButton(msg);
    renderMessageList();

    // En móvil: mostrar panel de lectura
    appEl.classList.add("show-reading");
  }

  function updateStarButton(msg) {
    btnStar.classList.toggle("star-active", !!msg.starred);
  }

  function closeReadingIfCurrentDeleted() {
    currentMessageId = null;
    readingContent.hidden = true;
    readingEmpty.hidden = false;
  }

  /* ---------------------------------------------------------
     7. NAVEGACIÓN: carpetas y pestañas
     --------------------------------------------------------- */
  folderNav.addEventListener("click", (e) => {
    const btn = e.target.closest(".folder-item");
    if (!btn) return;
    $$(".folder-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFolder = btn.dataset.folder;
    folderTitle.textContent = FOLDER_TITLES[currentFolder];
    closeReadingIfCurrentDeleted();
    renderMessageList();
    appEl.classList.remove("sidebar-open");
    appEl.classList.remove("show-reading");
  });

  listTabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    $$(".tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderMessageList();
  });

  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderMessageList();
  });

  /* ---------------------------------------------------------
     8. INTERACCIÓN CON LA LISTA (abrir / destacar)
     --------------------------------------------------------- */
  messagesEl.addEventListener("click", (e) => {
    const starBtn = e.target.closest(".star-btn");
    if (starBtn) {
      e.stopPropagation();
      const id = starBtn.dataset.star;
      const msg = messages.find(m => m.id === id);
      msg.starred = !msg.starred;
      if (id === currentMessageId) updateStarButton(msg);
      renderMessageList();
      return;
    }
    const item = e.target.closest(".message-item");
    if (item) openMessage(item.dataset.id);
  });

  messagesEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const item = e.target.closest(".message-item");
    if (item) { e.preventDefault(); openMessage(item.dataset.id); }
  });

  /* ---------------------------------------------------------
     9. ACCIONES DEL PANEL DE LECTURA
     --------------------------------------------------------- */
  btnStar.addEventListener("click", () => {
    const msg = messages.find(m => m.id === currentMessageId);
    if (!msg) return;
    msg.starred = !msg.starred;
    updateStarButton(msg);
    renderMessageList();
  });

  btnDelete.addEventListener("click", () => {
    const msg = messages.find(m => m.id === currentMessageId);
    if (!msg) return;
    if (msg.folder === "trash") {
      messages = messages.filter(m => m.id !== msg.id);
    } else {
      msg.folder = "trash";
    }
    closeReadingIfCurrentDeleted();
    renderMessageList();
    showToast("Mensaje movido a la papelera");
    appEl.classList.remove("show-reading");
  });

  btnArchive.addEventListener("click", () => {
    showToast("Mensaje archivado");
  });

  $$('[data-action="reply"]').forEach(btn => btn.addEventListener("click", () => startReply(false)));
  $$('[data-action="forward"]').forEach(btn => btn.addEventListener("click", () => startReply(true)));

  function startReply(forward) {
    const msg = messages.find(m => m.id === currentMessageId);
    if (!msg) return;
    composeMode = { type: forward ? "forward" : "reply", replyTo: msg.id };
    composeTo.value = forward ? "" : msg.email;
    composeSubject.value = (forward ? "Fwd: " : "Re: ") + msg.subject;
    composeBody.value = `\n\n---------- Mensaje original ----------\nDe: ${msg.from} <${msg.email}>\nFecha: ${formatFullDate(msg.date)}\nAsunto: ${msg.subject}\n\n${msg.body}`;
    openCompose();
  }

  /* ---------------------------------------------------------
     10. MODAL DE REDACCIÓN
     --------------------------------------------------------- */
  function openCompose() {
    composeOverlay.hidden = false;
    scrim.hidden = false;
    setTimeout(() => composeTo.focus(), 50);
  }

  function closeCompose(clearFields = true) {
    composeOverlay.hidden = true;
    scrim.hidden = true;
    if (clearFields) composeForm.reset();
    composeMode = { type: "new", replyTo: null };
  }

  $("#btnCompose").addEventListener("click", () => {
    composeMode = { type: "new", replyTo: null };
    composeForm.reset();
    openCompose();
  });

  $("#btnCloseCompose").addEventListener("click", () => closeCompose());
  $("#btnMinimize").addEventListener("click", () => { composeOverlay.hidden = true; scrim.hidden = true; });
  scrim.addEventListener("click", () => closeCompose());

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !composeOverlay.hidden) closeCompose();
  });

  $("#btnDiscard").addEventListener("click", () => {
    closeCompose();
    showToast("Borrador descartado");
  });

  composeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!composeTo.value.trim()) {
      composeTo.focus();
      return;
    }

    const newMessage = {
      id: "m" + Date.now(),
      folder: "sent",
      unread: false,
      starred: false,
      from: "Camila Arce",
      email: "camila.arce@polvemails.local",
      to: composeTo.value.trim(),
      subject: composeSubject.value.trim(),
      snippet: composeBody.value.trim().slice(0, 90) || "(sin contenido)",
      body: composeBody.value.trim() || "(sin contenido)",
      date: new Date().toISOString(),
      tags: []
    };

    messages.push(newMessage);
    closeCompose();

    if (currentFolder === "sent") renderMessageList();
    else renderCounts();

    showToast("Correo enviado con éxito ✓");
  });

  /* ---------------------------------------------------------
     11. NAVEGACIÓN MÓVIL (sidebar y volver a la lista)
     --------------------------------------------------------- */
  $("#btnOpenSidebar").addEventListener("click", () => {
    appEl.classList.add("sidebar-open");
    scrim.hidden = false;
  });
  scrim.addEventListener("click", () => appEl.classList.remove("sidebar-open"));

  $("#btnBackToList").addEventListener("click", () => {
    appEl.classList.remove("show-reading");
  });

  /* ---------------------------------------------------------
     12. TEMA CLARO / OSCURO (con persistencia en memoria)
     --------------------------------------------------------- */
  const themeToggle = $("#themeToggle");
  const themeLabel = themeToggle.querySelector(".theme-label");
  let isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function applyTheme() {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    themeLabel.textContent = isDark ? "Modo claro" : "Modo oscuro";
  }

  themeToggle.addEventListener("click", () => {
    isDark = !isDark;
    applyTheme();
  });

  applyTheme();

  /* ---------------------------------------------------------
     13. MODAL DE DETALLE DE CONEXIÓN (TLS / certificado)
     --------------------------------------------------------- */
  const connModal = $("#connModal");

  $("#connStatus").addEventListener("click", () => {
    connModal.hidden = false;
    scrim.hidden = false;
  });
  $("#btnCloseConn").addEventListener("click", () => {
    connModal.hidden = true;
    scrim.hidden = true;
  });
  scrim.addEventListener("click", () => {
    if (!connModal.hidden) { connModal.hidden = true; scrim.hidden = true; }
  });

  /* ---------------------------------------------------------
     14. INICIALIZACIÓN
     --------------------------------------------------------- */
  renderMessageList();
})();
