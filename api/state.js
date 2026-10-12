const { handleState } = require("../http");

module.exports = async (req, res) => {
  try {
    const id = req.query && req.query.id;
    res.status(200).json(await handleState(id));
  } catch (error) {
    res.status(500).json({ type: "error", error: error.publicMessage || "Não consegui falar com o banco agora." });
  }
};
