/**
 * Proxy OAuth para Decap CMS.
 * Las tres variables se configuran como secretos del Worker, nunca en GitHub:
 * GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET y ALLOWED_ORIGIN.
 */
const html = (message, origin) => `<!doctype html><meta charset="utf-8"><script>window.opener.postMessage(${JSON.stringify(message)}, ${JSON.stringify(origin)});window.close();</script>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const allowedOrigin = env.ALLOWED_ORIGIN;

    if (url.pathname === "/auth") {
      const authorize = new URL("https://github.com/login/oauth/authorize");
      authorize.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      authorize.searchParams.set("redirect_uri", `${url.origin}/callback`);
      authorize.searchParams.set("scope", "repo");
      return Response.redirect(authorize, 302);
    }

    if (url.pathname !== "/callback") return new Response("Not found", { status: 404 });
    const code = url.searchParams.get("code");
    if (!code) return new Response(html("authorization:github:error:missing_code", allowedOrigin), { headers: { "content-type": "text/html; charset=utf-8" } });

    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "accept": "application/json", "content-type": "application/json" },
      body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code })
    });
    const token = await tokenResponse.json();
    const message = token.access_token
      ? `authorization:github:success:${JSON.stringify({ token: token.access_token, provider: "github" })}`
      : "authorization:github:error:token_exchange_failed";
    return new Response(html(message, allowedOrigin), { headers: { "content-type": "text/html; charset=utf-8" } });
  }
};
