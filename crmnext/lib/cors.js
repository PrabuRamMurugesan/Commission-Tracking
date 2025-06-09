import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "POST", "OPTIONS"], // Allow these
  origin: "*", // You can restrict this to only localhost:5173 if needed
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      return result instanceof Error ? reject(result) : resolve(result);
    });
  });
}

export default async function handleCors(req, res) {
  await runMiddleware(req, res, cors);
}
