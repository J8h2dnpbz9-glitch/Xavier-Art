(() => {
  const entriesElement = document.querySelector("[data-studio-notes]");
  if (!entriesElement) return;

  const dateFormatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const formatDate = (value) => {
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
  };

  const createEntry = ({ date, title, body }) => {
    const item = document.createElement("li");
    const article = document.createElement("article");
    article.className = "journal-note";

    const header = document.createElement("header");
    header.className = "journal-note__header";
    const heading = document.createElement("h3");
    heading.textContent = title || "Nota de estudio";
    const time = document.createElement("time");
    time.className = "journal-note__time";
    time.dateTime = date || "";
    time.textContent = formatDate(date || "");
    header.append(heading, time);

    const content = document.createElement("div");
    content.className = "journal-note__body";
    String(body || "").split(/\n\s*\n/).filter(Boolean).forEach((paragraph) => {
      const element = document.createElement("p");
      element.textContent = paragraph.trim();
      content.append(element);
    });

    article.append(header, content);
    item.append(article);
    return item;
  };

  fetch("content/studio-notes.json", { cache: "no-store" })
    .then((response) => response.ok ? response.json() : Promise.reject(new Error("No se pudo cargar el cuaderno")))
    .then(({ entries }) => {
      const notes = Array.isArray(entries) ? entries : [];
      if (!notes.length) return;
      entriesElement.replaceChildren(...notes
        .slice()
        .sort((first, second) => String(second.date).localeCompare(String(first.date)))
        .map(createEntry));
    })
    .catch(() => {
      // El estado inicial sigue visible si el archivo aún no se ha publicado.
    });
})();
