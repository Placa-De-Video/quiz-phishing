const test = require("node:test");
const assert = require("node:assert/strict");
const { QUESTIONS, pickQuestions, presentQuestion } = require("../questions");
const { validateName, validateTurma } = require("../names");
const { createRoom, scoreAnswer } = require("../game");
const { handlePlay, handleState } = require("../http");

test("o banco tem os quatro níveis e uma resposta correta em cada pergunta", () => {
  const levels = { baixo: 0, medio: 0, dificil: 0, impossivel: 0 };
  QUESTIONS.forEach((question) => {
    levels[question.difficulty] += 1;
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
  });
  assert.equal(levels.baixo, 12);
  assert.equal(levels.medio, 12);
  assert.equal(levels.dificil, 12);
  assert.equal(levels.impossivel, 12);
});

test("cada jogador recebe 15 perguntas, com os níveis misturados e opções embaralhadas", () => {
  const usage = new Map();
  const round = pickQuestions(usage, 15).map(presentQuestion);
  assert.equal(round.length, 15);
  assert.equal(new Set(round.map((question) => question.id)).size, 15);
  const difficulties = new Set(round.map((question) => question.difficulty));
  assert.equal(difficulties.size, 4);
  round.forEach((question) => {
    assert.equal(question.options.length, 4);
    assert.ok(question.answer >= 0 && question.answer < 4);
    const original = QUESTIONS.find((item) => item.id === question.id);
    assert.equal(question.options[question.answer], original.options[0]);
  });
});

test("a rodada seguinte prefere perguntas ainda pouco usadas", () => {
  const usage = new Map();
  const first = pickQuestions(usage, 15).map((question) => question.id);
  const second = pickQuestions(usage, 15).map((question) => question.id);
  const overlap = second.filter((id) => first.includes(id));
  assert.equal(overlap.length, 0);
  first.forEach((id) => assert.equal(usage.get(id), 1));
});

test("nome completo é único, sem número e sem ofensa", () => {
  assert.equal(validateName("Ana Silva").ok, true);
  assert.equal(validateName("ana silva").name, "Ana Silva");
  assert.equal(validateName("Ana").ok, false);
  assert.equal(validateName("Ana 2 Silva").ok, false);
  assert.equal(validateName("Ana Porra").ok, false);
  assert.equal(validateName("Asdf Qwer").ok, false);
  assert.equal(validateName("Ana Silva!").ok, false);
  assert.equal(validateTurma("7º Ano B").ok, true);
  assert.equal(validateTurma("Turma inventada").ok, false);
});

test("pontos, placar e nomes repetidos funcionam na sala", () => {
  const room = createRoom();
  const ana = room.addPlayer({ name: "Ana Silva", key: "ana silva", turma: "7º Ano B", avatar: { hat: 2, patch: 1, frame: 1 } });
  const repeated = room.addPlayer({ name: "Ana Silva", key: "ana silva", turma: "7º Ano B", avatar: {} });
  const bruno = room.addPlayer({ name: "Bruno Costa", key: "bruno costa", turma: "7º Ano B", avatar: {} });
  assert.equal(ana.ok, true);
  assert.equal(repeated.ok, false);
  assert.equal(bruno.ok, true);
  assert.equal(ana.player.avatar.hat, 2);
  assert.equal(ana.player.avatar.patch, 1);

  const started = room.start(ana.player.id);
  assert.equal(started.question.total, 15);
  assert.equal("answer" in started.question, false);
  const correct = room.players.get(ana.player.id).current.answer;
  const fast = scoreAnswer("impossivel", 0, true, 0);
  const slow = scoreAnswer("baixo", 20000, true, 0);
  assert.ok(fast > slow);
  assert.equal(scoreAnswer("medio", 1000, false, 3), 0);

  const result = room.answer(ana.player.id, correct, 999999);
  assert.equal(result.correct, true);
  assert.ok(result.gained > 0);
  room.advance(ana.player.id);
  const wrong = room.answer(ana.player.id, -1, 0);
  assert.equal(wrong.correct, false);
  const board = room.snapshot();
  assert.equal(board.highlights.most.name, "Ana Silva");
  assert.equal(board.players[0].score >= board.players[1].score, true);
});

test("o placar compartilhado guarda os dois jogadores", async () => {
  const helena = await handlePlay({
    type: "join",
    name: "Helena Duarte",
    turma: "8º Ano C",
    avatar: { hat: 1, frame: 2 },
  });
  const caio = await handlePlay({
    type: "join",
    name: "Caio Mendes",
    turma: "2ª Série A",
    avatar: {},
  });
  assert.equal(helena.type, "joined");
  assert.equal(caio.type, "joined");
  const state = await handleState(helena.you.id);
  assert.equal(state.players.length >= 2, true);
  assert.equal(state.resume.type, "lobby");
});
