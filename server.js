const path = require("path");
const express = require("express");
const { handlePlay, handleState } = require("./http");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.get("/api/state", async (req, res) => {
  try {
    res.json(await handleState(req.query.id));
  } catch (error) {
    res.status(500).json({ type: "error", error: error.publicMessage || "Não consegui falar com o banco agora." });
  }
});

app.post("/api/play", async (req, res) => {
  try {
    res.json(await handlePlay(req.body));
  } catch (error) {
    res.status(500).json({ type: "error", error: error.publicMessage || "Não consegui falar com o banco agora." });
  }
});

app.use(express.static(path.join(__dirname, "public")));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Quiz no ar em http://localhost:${PORT}`);
  });
}

module.exports = app;
