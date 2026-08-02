/* Shared behaviour: lightweight, keyboard-accessible and dependency-free. */
const header = document.querySelector("header");
const searchButton = document.getElementById("search-toggle");
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");
const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");

const searchIndex = isEnglish ? [
  { title: "Work", detail: "Painting, drawing and sculpture", url: "shop.html", terms: "art collection paintings drawing sculpture" },
  { title: "Archive", detail: "Studio notes and processes", url: "archive.html", terms: "studio process sketchbook" },
  { title: "About", detail: "Biography and artistic practice", url: "about.html", terms: "artist biography xavier cáceres" },
  { title: "Contact", detail: "Enquiries, commissions and collaborations", url: "contact.html", terms: "email commission exhibition collaboration" }
] : [
  { title: "Obra en proceso", detail: "Próxima colección", url: "shop.html", terms: "obra pinturas dibujo escultura colección" },
  { title: "Archivo", detail: "Notas y procesos del estudio", url: "archive.html", terms: "estudio proceso cuaderno" },
  { title: "Acerca de", detail: "Biografía y práctica artística", url: "about.html", terms: "artista biografía xavier cáceres" },
  { title: "Contacto", detail: "Consultas, encargos y colaboraciones", url: "contact.html", terms: "correo encargo exposición colaboración" }
];

const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (searchButton && searchOverlay && searchInput) {
  const results = document.createElement("div");
  results.className = "search-results";
  results.setAttribute("aria-live", "polite");
  searchOverlay.append(results);
  searchOverlay.setAttribute("role", "dialog");
  searchOverlay.setAttribute("aria-modal", "true");
  searchOverlay.setAttribute("aria-label", isEnglish ? "Search the site" : "Buscar en el sitio");
  searchButton.setAttribute("aria-expanded", "false");

  const renderResults = () => {
    const query = searchInput.value.trim().toLocaleLowerCase("es");
    if (!query) {
      results.innerHTML = `<p class="search-hint">${isEnglish ? "Search by section, discipline or subject." : "Busca por sección, disciplina o tema."}</p>`;
      return;
    }
    const matches = searchIndex.filter((item) => `${item.title} ${item.detail} ${item.terms}`.toLocaleLowerCase("es").includes(query));
    results.innerHTML = matches.length
      ? matches.map((item) => `<a href="${item.url}" class="search-result"><strong>${item.title}</strong><span>${item.detail}</span></a>`).join("")
      : `<p class="search-hint">${isEnglish ? "No results found." : "No se han encontrado resultados."}</p>`;
  };

  const closeSearch = () => {
    searchOverlay.classList.remove("active");
    searchButton.setAttribute("aria-expanded", "false");
    searchInput.value = "";
    results.innerHTML = "";
    searchButton.focus();
  };

  searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    searchOverlay.classList.add("active");
    searchButton.setAttribute("aria-expanded", "true");
    renderResults();
    searchInput.focus();
  });
  searchInput.addEventListener("input", renderResults);
  searchOverlay.addEventListener("click", (event) => { if (event.target === searchOverlay) closeSearch(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && searchOverlay.classList.contains("active")) closeSearch(); });
}

document.querySelectorAll("footer").forEach((footer) => {
  const utilities = footer.querySelector(".footer-links") || document.createElement("div");
  if (!utilities.parentElement) { utilities.className = "footer-links"; footer.append(utilities); }
  const links = [
    ["https://instagram.com/xavier__art", "Instagram"],
    ["privacidad.html", isEnglish ? "Privacy" : "Privacidad"],
    ["aviso-legal.html", isEnglish ? "Legal notice" : "Aviso legal"]
  ];
  links.forEach(([href, label]) => {
    if (utilities.querySelector(`a[href="${href}"]`)) return;
    const link = document.createElement("a");
    link.href = href; link.textContent = label;
    if (href.startsWith("http")) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
    utilities.append(link);
  });
});

document.querySelectorAll("nav").forEach((nav) => {
  if (nav.querySelector(".language-toggle")) return;
  const languageLink = document.createElement("a");
  const englishPage = location.pathname.endsWith("/en.html");
  languageLink.href = englishPage ? "index.html" : "en.html";
  languageLink.className = "language-toggle";
  languageLink.textContent = englishPage ? "ES" : "EN";
  languageLink.setAttribute("aria-label", englishPage ? "Cambiar a español" : "Switch to English");
  nav.append(languageLink);
});

document.querySelectorAll("main img").forEach((image, index) => {
  image.decoding = "async";
  if (index > 0) image.loading = "lazy";
});
