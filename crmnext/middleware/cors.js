export default function allowCors(handler) {
  return async (req, res) => {

    const allowedOrigins = [
      "http://localhost:5174",
      "https://crm.bbscart.com"
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    return handler(req, res);
  };
}