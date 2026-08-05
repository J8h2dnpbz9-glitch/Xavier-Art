import { demoPosts, communityComments } from "./data.js";

const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
const getPost = (id) => demoPosts.find((post) => post.id === id) || demoPosts[0];

const postCard = (post) => `
  <article class="post-card">
    <a class="post-card__image" href="post.html?id=${encodeURIComponent(post.id)}"><img src="${post.image}" alt="${escapeHTML(post.title)}, publicación de ${escapeHTML(post.author)}"></a>
    <div class="post-card__meta"><span>${escapeHTML(post.category)} · ${escapeHTML(post.date)}</span><span>${post.comments} comentarios</span></div>
    <h2><a href="post.html?id=${encodeURIComponent(post.id)}">${escapeHTML(post.title)}</a></h2>
    <p>Por ${escapeHTML(post.author)} · ${escapeHTML(post.handle)}</p>
    <p>${escapeHTML(post.excerpt)}</p>
    <div class="post-card__actions"><button class="text-button like-button" type="button" aria-pressed="false" data-likes="${post.likes}">Apoyar <span>${post.likes}</span></button><button class="text-button report-button" type="button">Denunciar</button></div>
  </article>`;

document.querySelectorAll("[data-community-feed]").forEach((feed) => {
  const amount = Number(feed.dataset.communityFeed) || demoPosts.length;
  feed.innerHTML = demoPosts.slice(0, amount).map(postCard).join("");
});

document.addEventListener("click", (event) => {
  const like = event.target.closest(".like-button");
  if (like) {
    const active = like.getAttribute("aria-pressed") === "true";
    const likes = Number(like.dataset.likes) + (active ? 0 : 1);
    like.setAttribute("aria-pressed", String(!active));
    like.querySelector("span").textContent = likes;
    return;
  }
  const report = event.target.closest(".report-button");
  if (report) {
    report.textContent = "Denuncia registrada";
    report.disabled = true;
  }
});

const detail = document.getElementById("post-detail");
if (detail) {
  const post = getPost(new URLSearchParams(location.search).get("id"));
  detail.innerHTML = `
    <div class="post-detail__image"><img src="${post.image}" alt="${escapeHTML(post.title)}, obra compartida por ${escapeHTML(post.author)}"></div>
    <div class="post-detail__body"><p class="post-detail__category">${escapeHTML(post.category)} · ${escapeHTML(post.date)}</p><h1>${escapeHTML(post.title)}</h1><p class="post-detail__author">Por ${escapeHTML(post.author)} · ${escapeHTML(post.handle)}</p><p class="post-detail__description">${escapeHTML(post.description)}</p><div class="post-card__actions"><button class="text-button like-button" type="button" aria-pressed="false" data-likes="${post.likes}">Apoyar <span>${post.likes}</span></button><button class="text-button report-button" type="button">Denunciar publicación</button><button class="text-button" type="button" id="share-post">Copiar enlace</button></div><section class="comments" aria-labelledby="comments-title"><h2 id="comments-title">Comentarios (${post.comments})</h2><div id="comment-list"></div><form class="comment-form" id="comment-form"><label for="comment-text" class="sr-only">Escribe un comentario</label><textarea id="comment-text" maxlength="500" required placeholder="Comparte una observación respetuosa…"></textarea><p class="form-hint">Máximo 500 caracteres. Los comentarios se revisan antes de publicarse.</p><button class="district-button" type="submit">Enviar comentario</button></form></section></div>`;
  const commentList = document.getElementById("comment-list");
  const addComment = (comment) => { const article = document.createElement("article"); article.className = "comment"; const header = document.createElement("header"); const name = document.createElement("strong"); const date = document.createElement("span"); const text = document.createElement("p"); const report = document.createElement("button"); name.textContent = comment.author; date.textContent = comment.date; text.textContent = comment.text; report.type = "button"; report.className = "text-button report-button"; report.textContent = "Denunciar"; header.append(name, date, report); article.append(header, text); commentList.append(article); };
  communityComments.forEach(addComment);
  document.getElementById("share-post").addEventListener("click", async (event) => { try { await navigator.clipboard.writeText(location.href); event.currentTarget.textContent = "Enlace copiado"; } catch { event.currentTarget.textContent = "Copia la URL del navegador"; } });
  document.getElementById("comment-form").addEventListener("submit", (event) => { event.preventDefault(); const input = document.getElementById("comment-text"); const text = input.value.trim(); if (!text) return; addComment({ author: "Tu comentario", date: "Pendiente de revisión", text }); input.value = ""; event.currentTarget.querySelector(".form-hint").textContent = "Comentario añadido a esta vista de prueba. No se ha enviado ni almacenado."; });
}

const publishForm = document.getElementById("publish-form");
if (publishForm) {
  const status = document.getElementById("publish-status");
  const imageInput = document.getElementById("publication-image");
  const preview = document.getElementById("upload-preview");
  imageInput.addEventListener("change", () => { const file = imageInput.files[0]; preview.innerHTML = ""; if (!file) return; if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024) { status.hidden = false; status.dataset.state = "error"; status.textContent = "Selecciona una imagen JPG, PNG o WEBP de hasta 8 MB."; imageInput.value = ""; return; } const image = document.createElement("img"); image.src = URL.createObjectURL(file); image.alt = "Vista previa de la imagen seleccionada"; preview.append(image); });
  publishForm.addEventListener("submit", (event) => { event.preventDefault(); const title = document.getElementById("publication-title"); const description = document.getElementById("publication-description"); const author = document.getElementById("publication-author"); const rules = document.getElementById("publication-rules"); if (!imageInput.files[0] || !title.value.trim() || !author.value.trim() || !description.value.trim() || !rules.checked) { status.hidden = false; status.dataset.state = "error"; status.textContent = "Completa todos los campos, selecciona una imagen y acepta las normas."; return; } status.hidden = false; status.dataset.state = "success"; status.textContent = "Publicación validada en modo demostración. Aún no se ha enviado ni almacenado: requerirá una cuenta y un backend."; });
}
