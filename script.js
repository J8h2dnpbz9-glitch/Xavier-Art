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

/* The public entry is now the lobby. Existing personal pages continue to point home to Xavier Art. */
document.querySelectorAll('a[href="index.html"]').forEach((link) => {
  link.href = "/xavier/";
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
