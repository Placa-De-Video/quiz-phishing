const { handlePlay } = require("../http");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ type: "error", error: "Use POST." });
    return;
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    res.status(200).json(await handlePlay(body));
  } catch (error) {
    res.status(500).json({ type: "error", error: error.publicMessage || "Não consegui falar com o banco agora." });
  }
};
