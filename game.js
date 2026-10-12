const { QUESTIONS, pickQuestions, presentQuestion } = require("./questions");

const TIME_LIMIT = { baixo: 25000, medio: 25000, dificil: 30000, impossivel: 35000 };
const BASE_POINTS = { baixo: 600, medio: 900, dificil: 1300, impossivel: 2000 };
const AVATAR_OPTIONS = {
  skin: 6,
  eyes: 6,
  eyeColor: 6,
  hair: 8,
  hairColor: 6,
  hat: 7,
  patch: 3,
  glasses: 4,
  mouth: 5,
  frame: 6,
  extra: 4,
};

function clampIndex(value, size) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number >= size) return 0;
  return number;
}

function sanitizeAvatar(input) {
  const source = input && typeof input === "object" ? input : {};
  return {
    skin: clampIndex(source.skin, AVATAR_OPTIONS.skin),
    eyes: clampIndex(source.eyes, AVATAR_OPTIONS.eyes),
    eyeColor: clampIndex(source.eyeColor, AVATAR_OPTIONS.eyeColor),
    hair: clampIndex(source.hair, AVATAR_OPTIONS.hair),
    hairColor: clampIndex(source.hairColor, AVATAR_OPTIONS.hairColor),
    hat: clampIndex(source.hat, AVATAR_OPTIONS.hat),
    patch: clampIndex(source.patch, AVATAR_OPTIONS.patch),
    glasses: clampIndex(source.glasses, AVATAR_OPTIONS.glasses),
    mouth: clampIndex(source.mouth, AVATAR_OPTIONS.mouth),
    frame: clampIndex(source.frame, AVATAR_OPTIONS.frame),
    extra: clampIndex(source.extra, AVATAR_OPTIONS.extra),
  };
}

function scoreAnswer(difficulty, elapsedMs, correct, streak) {
  if (!correct) return 0;
  const limit = TIME_LIMIT[difficulty];
  const elapsed = Math.min(Math.max(elapsedMs, 0), limit);
  const speed = 0.55 + 0.45 * (1 - elapsed / limit);
  const streakBonus = 1 + Math.min(streak, 4) * 0.08;
  return Math.round(BASE_POINTS[difficulty] * speed * streakBonus);
}

function createRoom(initial) {
  const usage = new Map(Object.entries(initial?.usage || {}));
  const players = new Map(Object.entries(initial?.players || {}));
  let seq = initial?.seq || 1;

  function publicPlayer(player) {
    return {
      id: player.id,
      name: player.name,
      turma: player.turma,
      avatar: player.avatar,
      score: player.score,
      correct: player.correct,
      wrong: player.wrong,
      streak: player.streak,
      answered: player.answered,
      total: player.total,
      status: player.status,
      online: player.online,
    };
  }

  function leaderboard() {
    return [...players.values()]
      .map(publicPlayer)
      .sort((a, b) => b.score - a.score || b.correct - a.correct || a.name.localeCompare(b.name, "pt"));
  }

  function extremes(list) {
    const started = list.filter((player) => player.answered > 0);
    if (!started.length) return { most: null, least: null };
    const byCorrect = [...started].sort(
      (a, b) => b.correct - a.correct || b.score - a.score || a.name.localeCompare(b.name, "pt"),
    );
    const leastPool = [...started].sort(
      (a, b) => a.correct - b.correct || a.score - b.score || a.name.localeCompare(b.name, "pt"),
    );
    return {
      most: byCorrect[0],
      least: leastPool[0].id === byCorrect[0].id && started.length > 1 ? leastPool.find((player) => player.id !== byCorrect[0].id) || leastPool[0] : leastPool[0],
    };
  }

  function snapshot() {
    const now = Date.now();
    players.forEach((player) => {
      player.online = now - (player.lastSeen || 0) < 20000;
    });
    const board = leaderboard();
    return {
      type: "state",
      players: board,
      highlights: extremes(board),
      pool: QUESTIONS.length,
    };
  }

  function dump() {
    return {
      usage: Object.fromEntries(usage),
      players: Object.fromEntries(players),
      seq,
    };
  }

  function markSeen(id) {
    const player = players.get(id);
    if (!player) return;
    player.lastSeen = Date.now();
  }

  function resume(id) {
    const player = players.get(id);
    if (!player) return null;
    if (player.status === "lobby") return { type: "lobby" };
    if (player.status === "done") return { type: "finished" };
    if (player.locked && player.lastReveal) return { type: "reveal", ...player.lastReveal };
    if (player.status === "playing" && player.current) return { type: "question", question: viewQuestion(player) };
    return null;
  }

  function addPlayer({ name, key, turma, avatar }) {
    if ([...players.values()].some((player) => player.key === key)) {
      return { ok: false, error: "Esse nome já está no placar. Cada pessoa usa o próprio nome completo." };
    }
    if (players.size >= 48) return { ok: false, error: "A sala está cheia." };
    const id = `p${seq++}`;
    const player = {
      id,
      name,
      key,
      turma,
      avatar: sanitizeAvatar(avatar),
      score: 0,
      correct: 0,
      wrong: 0,
      streak: 0,
      answered: 0,
      total: 15,
      status: "lobby",
      online: true,
      lastSeen: Date.now(),
      questions: [],
      current: null,
      startedAt: 0,
    };
    players.set(id, player);
    return { ok: true, player };
  }

  function start(id) {
    const player = players.get(id);
    if (!player) return { ok: false, error: "Entre de novo para jogar." };
    if (player.status === "playing") return { ok: true, question: viewQuestion(player) };
    if (player.status === "done") return { ok: false, error: "Você já terminou esta rodada." };
    player.questions = pickQuestions(usage, 15).map(presentQuestion);
    player.total = player.questions.length;
    player.status = "playing";
    player.cursor = 0;
    return openQuestion(player);
  }

  function openQuestion(player) {
    const question = player.questions[player.cursor];
    player.current = question;
    player.startedAt = Date.now();
    player.locked = false;
    return { ok: true, question: viewQuestion(player) };
  }

  function viewQuestion(player) {
    const question = player.current;
    return {
      index: player.cursor + 1,
      total: player.total,
      startedAt: player.startedAt,
      id: question.id,
      difficulty: question.difficulty,
      text: question.text,
      options: question.options,
      timeLimit: TIME_LIMIT[question.difficulty],
    };
  }

  function answer(id, optionIndex, elapsedMs) {
    const player = players.get(id);
    if (!player || player.status !== "playing" || !player.current || player.locked) {
      return { ok: false, error: "Essa resposta não vale mais." };
    }
    player.locked = true;
    const choice = Number(optionIndex);
    const elapsed = Date.now() - player.startedAt;
    void elapsedMs;
    const correct = choice === player.current.answer;
    if (correct) {
      player.streak += 1;
      player.correct += 1;
    } else {
      player.streak = 0;
      player.wrong += 1;
    }
    const gained = scoreAnswer(player.current.difficulty, elapsed, correct, player.streak - (correct ? 1 : 0));
    player.score += gained;
    player.answered += 1;
    const reveal = {
      ok: true,
      correct,
      selected: Number.isInteger(choice) ? choice : -1,
      answer: player.current.answer,
      gained,
      score: player.score,
      correctCount: player.correct,
      finished: player.cursor + 1 >= player.questions.length,
    };
    player.lastReveal = reveal;
    return reveal;
  }

  function advance(id) {
    const player = players.get(id);
    if (!player || player.status !== "playing" || !player.locked) return { ok: false };
    player.cursor += 1;
    if (player.cursor >= player.questions.length) {
      player.status = "done";
      player.current = null;
      return { ok: true, finished: true };
    }
    return { ...openQuestion(player), finished: false };
  }

  return { addPlayer, start, answer, advance, snapshot, resume, markSeen, dump, players, sanitizeAvatar };
}

module.exports = {
  TIME_LIMIT,
  BASE_POINTS,
  AVATAR_OPTIONS,
  sanitizeAvatar,
  scoreAnswer,
  createRoom,
};
