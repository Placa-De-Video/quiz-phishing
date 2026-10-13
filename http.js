const { validateName, validateTurma } = require("./names");
const { withRoom } = require("./store");

function pack(room, extra) {
  if (extra.you && extra.you.id) room.markSeen(extra.you.id);
  const snap = room.snapshot();
  const you = extra.you
    ? snap.players.find((player) => player.id === extra.you.id) || null
    : null;
  return { ...snap, ...extra, you };
}

async function handleState(id) {
  return withRoom((room) => {
    if (id) room.markSeen(id);
    const snap = room.snapshot();
    const you = id ? snap.players.find((player) => player.id === id) || null : null;
    return { ...snap, you, resume: id ? room.resume(id) : null };
  });
}

async function handlePlay(message) {
  const body = message || {};
  return withRoom((room) => {
    if (body.id) room.markSeen(body.id);

    if (body.type === "join") {
      const name = validateName(body.name);
      if (!name.ok) return { type: "error", error: name.error };
      const turma = validateTurma(body.turma);
      if (!turma.ok) return { type: "error", error: turma.error };
      const created = room.addPlayer({
        name: name.name,
        key: name.key,
        turma: turma.turma,
        avatar: body.avatar,
      });
      if (!created.ok) return { type: "error", error: created.error };
      const snap = room.snapshot();
      const you = snap.players.find((player) => player.id === created.player.id);
      return { ...snap, type: "joined", you };
    }

    if (!body.id) return { type: "error", error: "Crie seu perfil antes de jogar." };

    if (body.type === "start") {
      const started = room.start(body.id);
      if (!started.ok) return pack(room, { type: "error", error: started.error, you: { id: body.id } });
      return pack(room, { type: "question", question: started.question, you: { id: body.id } });
    }

    if (body.type === "answer") {
      const result = room.answer(body.id, body.option, body.elapsed);
      if (!result.ok) return pack(room, { type: "error", error: result.error, you: { id: body.id } });
      return pack(room, { type: "reveal", ...result, you: { id: body.id } });
    }

    if (body.type === "next") {
      const step = room.advance(body.id);
      if (step.finished) return pack(room, { type: "finished", you: { id: body.id } });
      if (step.question) return pack(room, { type: "question", question: step.question, you: { id: body.id } });
      return pack(room, { type: "state", you: { id: body.id } });
    }

    return { type: "error", error: "Não entendi essa jogada." };
  });
}

module.exports = { handleState, handlePlay };
