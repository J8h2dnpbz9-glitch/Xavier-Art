/* Shared behaviour: lightweight, keyboard-accessible and dependency-free. */
const header = document.querySelector("header");
const searchButton = document.getElementById("search-toggle");
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");
const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
const analyticsMeasurementId = "G-ERX6DQQ7FF";
const analyticsConsentKey = "xavierAnalyticsConsent";
let analyticsLoaded = false;

const readAnalyticsConsent = () => {
  try { return window.localStorage.getItem(analyticsConsentKey); } catch { return null; }
};

const writeAnalyticsConsent = (value) => {
  analyticsConsent = value;
  try { window.localStorage.setItem(analyticsConsentKey, value); } catch { /* Consent can still apply during this visit. */ }
};

let analyticsConsent = readAnalyticsConsent();

const clearAnalyticsCookies = () => {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.trim().split("=")[0];
    if (name === "_ga" || name.startsWith("_ga_")) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    }
  });
};

const track = (name, parameters = {}) => {
  if (analyticsConsent === "granted" && typeof window.gtag === "function") {
    window.gtag("event", name, parameters);
  }
};

const trackCurrentWork = () => {
  const work = document.querySelector(".work-page .work-info");
  if (!work) return;
  const title = work.querySelector("h2")?.textContent?.trim();
  const price = Array.from(work.querySelectorAll("p")).find((paragraph) => paragraph.querySelector("strong")?.textContent?.trim() === "Precio")?.textContent?.replace("Precio", "").trim();
  track("view_item", { item_name: title, price, currency: "EUR" });
};

const loadAnalytics = () => {
  if (analyticsLoaded) return;
  analyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
  window.gtag("js", new Date());
  window.gtag("config", analyticsMeasurementId, { allow_google_signals: false });

  const tag = document.createElement("script");
  tag.id = "google-analytics-tag";
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsMeasurementId}`;
  document.head.append(tag);
  trackCurrentWork();
};

const disableAnalytics = () => {
  window[`ga-disable-${analyticsMeasurementId}`] = true;
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", { analytics_storage: "denied" });
  }
  clearAnalyticsCookies();
};

const createConsentBanner = () => {
  if (document.getElementById("analytics-consent")) return;
  const banner = document.createElement("section");
  banner.id = "analytics-consent";
  banner.className = "analytics-consent";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-modal", "false");
  banner.setAttribute("aria-labelledby", "analytics-consent-title");
  const copy = isEnglish
    ? { title: "Analytics cookies", text: "We use Google Analytics to understand visits and improve the site. It only loads if you accept.", accept: "Accept", reject: "Reject", policy: "Privacy policy" }
    : { title: "Cookies de analítica", text: "Usamos Google Analytics para conocer las visitas y mejorar la web. Solo se carga si lo aceptas.", accept: "Aceptar", reject: "Rechazar", policy: "Política de privacidad" };
  banner.innerHTML = `<div><h2 id="analytics-consent-title">${copy.title}</h2><p>${copy.text} <a href="privacidad.html">${copy.policy}</a>.</p></div><div class="analytics-consent__actions"><button type="button" class="analytics-consent__reject">${copy.reject}</button><button type="button" class="analytics-consent__accept">${copy.accept}</button></div>`;
  document.body.append(banner);

  banner.querySelector(".analytics-consent__accept").addEventListener("click", () => {
    writeAnalyticsConsent("granted");
    window[`ga-disable-${analyticsMeasurementId}`] = false;
    loadAnalytics();
    banner.remove();
  });
  banner.querySelector(".analytics-consent__reject").addEventListener("click", () => {
    writeAnalyticsConsent("denied");
    disableAnalytics();
    banner.remove();
  });
};

const setupAnalyticsConsent = () => {
  if (analyticsConsent === "granted") {
    loadAnalytics();
  } else if (analyticsConsent === "denied") {
    disableAnalytics();
  } else {
    createConsentBanner();
  }
};

const works = [
  { title: "Rostro de Tupac", englishTitle: "Tupac's Face", detail: "Dibujo · Lápices de colores sobre papel · 1.250 €", englishDetail: "Drawing · Coloured pencils on paper · €1,250", url: "work1.html", category: "dibujo", price: 1250, terms: "tupac rostro face dibujo drawing lapices lápices colores coloured pencils papel paper 1250 1.250 retrato portrait" },
  { title: "La venus Itálica", englishTitle: "La venus Itálica", detail: "Dibujo · Lápices de colores sobre papel · 1.150 €", englishDetail: "Drawing · Coloured pencils on paper · €1,150", url: "work2.html", category: "dibujo", price: 1150, terms: "venus italica itálica dibujo drawing lapices lápices colores coloured pencils papel paper 1150 1.150 escultura clasica classical sculpture" },
  { title: "El Alma del Valle", englishTitle: "The Soul of the Valley", detail: "Escultura · Vendida · 145 €", englishDetail: "Sculpture · Sold · €145", url: "work3.html", category: "escultura", price: 145, terms: "alma valle soul valley escultura sculpture 145 vendida sold" },
  { title: "Dear Marshall", englishTitle: "Dear Marshall", detail: "Dibujo · Lápices de colores sobre papel · 820 €", englishDetail: "Drawing · Coloured pencils on paper · €820", url: "work5.html", category: "dibujo", price: 820, terms: "dear marshall eminem dibujo drawing lapices lápices colores coloured pencils papel paper 820" },
  { title: "Águila", englishTitle: "Eagle", detail: "Dibujo · Lápices de color sobre papel · 300 €", englishDetail: "Drawing · Coloured pencils on paper · €300", url: "work6.html", category: "dibujo", price: 300, terms: "aguila águila eagle dibujo drawing lapices lápices color coloured pencils papel paper 300" },
  { title: "Tenebrismo", englishTitle: "Tenebrism", detail: "Dibujo · Lápices de color sobre papel · 160 €", englishDetail: "Drawing · Coloured pencils on paper · €160", url: "work7.html", category: "dibujo", price: 160, terms: "tenebrismo tenebrism dibujo drawing lapices lápices color coloured pencils papel paper 160 carnero ram" },
  { title: "Guardianes del alba", englishTitle: "Guardians of Dawn", detail: "Dibujo · 110 €", englishDetail: "Drawing · €110", url: "work8.html", category: "dibujo", price: 110, terms: "guardianes alba guardians dawn dibujo drawing 110 camellos camels" }
];

const pageSearchIndex = isEnglish ? [
  { title: "Work", detail: "Painting, drawing and sculpture", url: "shop.html", terms: "art collection paintings drawing sculpture sketches prints" },
  { title: "Archive", detail: "Studio notes and processes", url: "archive.html", terms: "studio process sketchbook diary notes" },
  { title: "About", detail: "Biography and artistic practice", url: "about.html", terms: "artist biography xavier caceres cáceres" },
  { title: "Contact", detail: "Enquiries, commissions and collaborations", url: "contact.html", terms: "email commission exhibition collaboration" }
] : [
  { title: "Obra", detail: "Pinturas, dibujos y esculturas", url: "shop.html", terms: "arte coleccion pinturas dibujo escultura bocetos prints" },
  { title: "Archivo", detail: "Notas y procesos del estudio", url: "archive.html", terms: "estudio proceso cuaderno diario notas" },
  { title: "Acerca de", detail: "Biografía y práctica artística", url: "about.html", terms: "artista biografia biografía xavier caceres cáceres" },
  { title: "Contacto", detail: "Consultas, encargos y colaboraciones", url: "contact.html", terms: "correo email encargo exposicion exposición colaboracion colaboración" }
];

const searchIndex = [
  ...works.map((work) => ({
    title: isEnglish ? work.englishTitle : work.title,
    detail: isEnglish ? work.englishDetail : work.detail,
    url: work.url,
    terms: work.terms
  })),
  ...pageSearchIndex
];

const normaliseSearch = (value) => value.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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
    const query = normaliseSearch(searchInput.value.trim());
    if (!query) {
      results.innerHTML = `<p class="search-hint">${isEnglish ? "Search for a work, technique, category or price. Try: Tenebrism, pencil, sculpture or 300." : "Busca por obra, técnica, categoría o precio. Prueba: Tenebrismo, lápices, escultura o 300."}</p>`;
      return;
    }
    const terms = query.split(/\s+/).filter(Boolean);
    const matches = searchIndex.filter((item) => {
      const searchable = normaliseSearch(`${item.title} ${item.detail} ${item.terms}`);
      return terms.every((term) => searchable.includes(term));
    });
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

document.querySelectorAll("[data-work-gallery]").forEach((gallery) => {
  const cards = Array.from(gallery.querySelectorAll(".work-card"));
  const filterButtons = Array.from(document.querySelectorAll("[data-work-filter]"));
  const priceSelect = document.querySelector("[data-work-price]");
  const sortSelect = document.querySelector("[data-work-sort]");
  const emptyMessage = document.querySelector("[data-work-empty]");
  const metadataByUrl = new Map(works.map((work) => [work.url, work]));
  let activeCategory = "all";

  cards.forEach((card, index) => {
    const url = card.querySelector("a[href]")?.getAttribute("href");
    const work = metadataByUrl.get(url);
    if (!card.dataset.category) card.dataset.category = work?.category || (card.classList.contains("coming-soon") ? (index % 2 ? "print" : "boceto") : "all");
    if (!card.dataset.price) card.dataset.price = String(work?.price ?? 0);
    card.dataset.order = String(index);
  });

  const matchesPrice = (price, range) => {
    if (range === "all") return true;
    if (!price) return false;
    if (range === "under-200") return price <= 200;
    if (range === "200-500") return price > 200 && price <= 500;
    if (range === "500-1000") return price > 500 && price <= 1000;
    return price > 1000;
  };

  const applyFilters = () => {
    const range = priceSelect?.value || "all";
    const sort = sortSelect?.value || "featured";
    const sortedCards = [...cards].sort((a, b) => {
      if (sort === "low") return Number(a.dataset.price) - Number(b.dataset.price);
      if (sort === "high") return Number(b.dataset.price) - Number(a.dataset.price);
      return Number(a.dataset.order) - Number(b.dataset.order);
    });
    sortedCards.forEach((card) => gallery.append(card));
    let visibleCount = 0;
    cards.forEach((card) => {
      const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
      const visible = matchesCategory && matchesPrice(Number(card.dataset.price), range);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    if (emptyMessage) {
      emptyMessage.hidden = visibleCount > 0;
      emptyMessage.setAttribute("aria-live", "polite");
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.workFilter || "all";
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      applyFilters();
    });
  });
  priceSelect?.addEventListener("change", applyFilters);
  sortSelect?.addEventListener("change", applyFilters);
  applyFilters();
});

document.querySelectorAll("footer").forEach((footer) => {
  const utilities = footer.querySelector(".footer-links") || document.createElement("div");
  if (!utilities.parentElement) { utilities.className = "footer-links"; footer.append(utilities); }
  const links = [
    ["https://instagram.com/xavier__art", "Instagram"],
    ["privacidad.html", isEnglish ? "Privacy" : "Privacidad"],
    ["aviso-legal.html", isEnglish ? "Legal notice" : "Aviso legal"],
    ["#analytics-settings", isEnglish ? "Cookies" : "Cookies"]
  ];
  links.forEach(([href, label]) => {
    if (utilities.querySelector(`a[href="${href}"]`)) return;
    const link = document.createElement("a");
    link.href = href; link.textContent = label;
    if (href.startsWith("http")) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
    utilities.append(link);
  });
});

document.querySelectorAll('a[href="#analytics-settings"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    writeAnalyticsConsent("");
    disableAnalytics();
    createConsentBanner();
    document.getElementById("analytics-consent")?.querySelector("button")?.focus();
  });
});

document.querySelectorAll("nav").forEach((nav) => {
  if (nav.querySelector(".language-toggle")) return;
  const languageLink = document.createElement("a");
  const englishPage = location.pathname.endsWith("/en.html");
  languageLink.href = englishPage ? "/xavier/" : "en.html";
  languageLink.className = "language-toggle";
  languageLink.textContent = englishPage ? "ES" : "EN";
  languageLink.setAttribute("aria-label", englishPage ? "Cambiar a español" : "Switch to English");
  nav.append(languageLink);
});

/* Keep legacy home links pointing directly to Xavier Art. */
document.querySelectorAll('a[href="index.html"]').forEach((link) => {
  link.href = "/";
});

document.querySelectorAll("main img").forEach((image, index) => {
  image.decoding = "async";
  if (index > 0) image.loading = "lazy";
});

document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.addEventListener("click", () => track("generate_lead", { lead_type: link.classList.contains("buy-button") ? "artwork_enquiry" : "email_enquiry" }));
});

document.querySelectorAll("form.contact-form").forEach((form) => {
  form.addEventListener("submit", () => track("generate_lead", { lead_type: "contact_form" }));
});

document.querySelectorAll("form.newsletter-form").forEach((form) => {
  form.addEventListener("submit", () => track("sign_up", { method: "newsletter" }));
});

document.querySelectorAll(".language-toggle").forEach((link) => {
  link.addEventListener("click", () => track("change_language", { destination_language: isEnglish ? "es" : "en" }));
});

document.querySelectorAll('a[href*="instagram.com"]').forEach((link) => {
  link.addEventListener("click", () => track("click_social", { network: "instagram" }));
});

document.querySelectorAll(".work-carousel").forEach((carousel) => {
  const trackElement = carousel.querySelector(".work-carousel__track");
  const slides = carousel.querySelectorAll(".work-carousel__track img");
  const previous = carousel.querySelector(".work-carousel__previous");
  const next = carousel.querySelector(".work-carousel__next");
  const status = carousel.querySelector(".work-carousel__status");
  let activeSlide = 0;

  const updateCarousel = () => {
    trackElement.style.transform = `translateX(-${activeSlide * 100}%)`;
    status.textContent = `${activeSlide + 1} / ${slides.length}`;
  };

  previous.addEventListener("click", () => {
    activeSlide = (activeSlide - 1 + slides.length) % slides.length;
    updateCarousel();
  });
  next.addEventListener("click", () => {
    activeSlide = (activeSlide + 1) % slides.length;
    updateCarousel();
  });
});

setupAnalyticsConsent();
