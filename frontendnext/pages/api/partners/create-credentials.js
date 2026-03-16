export default async function handler(req, res) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ message: "Method Not Allowed" });

    const {
      partnerId,
      email,
      name,
      role = "franchise",
      platform = "BBSCART",
    } = req.body || {};
    if (!partnerId || !email) {
      return res
        .status(400)
        .json({ success: false, message: "partnerId and email required" });
    }

    const base = process.env.BBSCART_BASE || window.location.origin;

    const incomingAuth = req.headers.authorization || "";
    const bearer = incomingAuth.startsWith("Bearer ")
      ? incomingAuth.slice(7)
      : incomingAuth;
    const svcKey = process.env.CRM_SERVICE_KEY;

    const targetUrl = `${base}/api/admin/create-partner-user`;
    console.log("[CRM→BBSCART] POST", targetUrl);

    const headers = { "content-type": "application/json" };
    if (incomingAuth) headers["authorization"] = incomingAuth; // normal JWT
    if (bearer) headers["x-auth-token"] = bearer; // some middlewares read this
    if (svcKey) headers["x-service-key"] = svcKey; // S2S bypass

    const r = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        partnerId,
        email: String(email).trim().toLowerCase(),
        role,
        platform,
        name,
      }),
    });

    const text = await r.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error(
        "[create-credentials] Non-JSON response:",
        text.slice(0, 200)
      );
      return res.status(502).json({
        success: false,
        message: `BBSCART backend did not return JSON. Status: ${r.status}`,
      });
    }

    return res.status(r.status).json(data);
  } catch (err) {
    console.error("[CRM proxy create-credentials]", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
