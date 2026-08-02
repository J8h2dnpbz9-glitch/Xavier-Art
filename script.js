const header = document.querySelector("header");

// Añade aquí un identificador de Google Analytics (G-XXXXXXXXXX) para activar
// medición en todo el sitio. Se deja vacío hasta que el titular cree su cuenta.
const analyticsMeasurementId = "";

if (analyticsMeasurementId) {
    const analyticsScript = document.createElement("script");
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsMeasurementId}`;
    document.head.append(analyticsScript);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", analyticsMeasurementId, { anonymize_ip: true });
}

if (header) {
    window.addEventListener("scroll", () => {
        const scroll = window.scrollY;

        if (scroll < 180) {
            header.style.opacity = "1";
            header.style.transform = "translateY(0)";
            header.style.pointerEvents = "auto";
        } else if (scroll < 350) {
            const opacity = 1 - ((scroll - 180) / 170);
            header.style.opacity = opacity;
            header.style.transform = `translateY(-${(scroll - 180) / 10}px)`;
        } else {
            header.style.opacity = "0";
            header.style.transform = "translateY(-25px)";
            header.style.pointerEvents = "none";
        }
    });
}

const searchButton = document.getElementById("search-toggle");
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");

const searchIndex = [
    { title: "Sin título I", detail: "Pintura · Disponible · 1.200 €", url: "work1.html", terms: "oleo lienzo pintura disponible" },
    { title: "Sin título II", detail: "Pintura · Disponible", url: "work2.html", terms: "oleo lienzo pintura disponible" },
    { title: "Sin título III", detail: "Pintura · Reservada", url: "work3.html", terms: "oleo lienzo pintura reservada" },
    { title: "Sin título IV", detail: "Pintura · Vendida", url: "work4.html", terms: "oleo lienzo pintura vendida" },
    { title: "Pinturas", detail: "Selección de obras originales", url: "paintings.html", terms: "obra coleccion oleo" },
    { title: "Archivo", detail: "Notas y procesos del estudio", url: "archive.html", terms: "notas estudio proceso cuaderno" },
    { title: "Acerca de", detail: "Biografía y práctica artística", url: "about.html", terms: "artista biografia xavier caceres" },
    { title: "Contacto", detail: "Consultas, encargos y colaboraciones", url: "contact.html", terms: "correo encargo exposicion colaboracion" }
];

if (searchButton && searchOverlay && searchInput) {
    const results = document.createElement("div");
    results.className = "search-results";
    results.setAttribute("aria-live", "polite");
    searchOverlay.append(results);

    const closeSearch = () => {
        searchOverlay.classList.remove("active");
        searchInput.value = "";
        results.innerHTML = "";
        searchButton.focus();
    };

    const renderResults = () => {
        const query = searchInput.value.trim().toLocaleLowerCase("es");
        if (!query) {
            results.innerHTML = '<p class="search-hint">Busca por obra, técnica o sección.</p>';
            return;
        }

        const matches = searchIndex.filter((item) =>
            `${item.title} ${item.detail} ${item.terms}`.toLocaleLowerCase("es").includes(query)
        );

        results.innerHTML = matches.length
            ? matches.map((item) => `<a href="${item.url}" class="search-result"><strong>${item.title}</strong><span>${item.detail}</span></a>`).join("")
            : '<p class="search-hint">No se han encontrado resultados.</p>';
    };

    searchButton.addEventListener("click", (event) => {
        event.preventDefault();
        searchOverlay.classList.add("active");
        renderResults();
        searchInput.focus();
    });

    searchInput.addEventListener("input", renderResults);

    searchOverlay.addEventListener("click", (event) => {
        if (event.target === searchOverlay) closeSearch();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && searchOverlay.classList.contains("active")) closeSearch();
    });
}

document.querySelectorAll("footer").forEach((footer) => {
    const utilities = document.createElement("div");
    utilities.className = "footer-links";
    utilities.innerHTML = '<a href="https://instagram.com/xavier__art" target="_blank" rel="noopener noreferrer">Instagram</a><a href="privacidad.html">Privacidad</a><a href="aviso-legal.html">Aviso legal</a>';
    footer.append(utilities);
});

document.querySelectorAll("nav").forEach((nav) => {
    const languageLink = document.createElement("a");
    const englishPage = location.pathname.endsWith("/en.html");
    languageLink.href = englishPage ? "index.html" : "en.html";
    languageLink.className = "language-toggle";
    languageLink.textContent = englishPage ? "ES" : "EN";
    languageLink.setAttribute("aria-label", englishPage ? "Cambiar a español" : "Switch to English");
    nav.append(languageLink);
});
