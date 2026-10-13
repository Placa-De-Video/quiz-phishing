const screen = document.querySelector("#screen");
const board = document.querySelector("#board");
const confetti = document.querySelector("#confetti");
const boardToggle = document.querySelector("#board-toggle");

const labels = {
  skin: ["Pele clara", "Pele rosada", "Pele dourada", "Pele mel", "Pele marrom", "Pele escura"],
  eyes: ["Redondos", "Felizes", "Grandes", "Piscando", "Sonolentos", "Estrela"],
  eyeColor: ["Castanho", "Azul", "Verde", "Mel", "Roxo", "Preto"],
  hair: ["Careca", "Curto", "De lado", "Comprido", "Afro", "Franja", "Coque", "Espetado", "Chanel", "Tranças", "Rabo", "Ondulado", "Moicano", "Maria-chiquinha", "Pixie", "Repartido"],
  hairColor: ["Preto", "Castanho", "Ruivo", "Loiro", "Azulado", "Rosa", "Branco", "Verde", "Azul", "Roxo"],
  hat: ["Sem chapéu", "Boné", "Coroa", "Touca", "Chapéu de bruxo", "Bandana", "Cartola", "Orelhas de gato", "Laço", "Flor", "Boina"],
  brows: ["Sem sobrancelha", "Suave", "Grossa", "Brava", "Surpresa"],
  facial: ["Sem barba", "Bigode", "Barba", "Cavanhaque"],
  ears: ["Sem brinco", "Argola", "Ponto", "Laço na orelha"],
  patch: ["Sem tapa-olho", "Tapa-olho esquerdo", "Tapa-olho direito"],
  glasses: ["Sem óculos", "Redondo", "Quadrado", "Escuro"],
  mouth: ["Sorriso", "Aberto", "Surpreso", "De lado", "Sério"],
  frame: ["Sem moldura", "Ouro", "Neon", "Tracejada", "Estrelas", "Fogo", "Arco-íris", "Corações"],
  extra: ["Sem extra", "Bochecha", "Sardas", "Cicatriz", "Curativo", "Coração"],
};
const levelName = { baixo: "Baixo", medio: "Médio", dificil: "Difícil", impossivel: "Impossível" };
const statusName = { lobby: "na sala", playing: "jogando", done: "terminou" };

const state = {
  ws: null,
  you: null,
  players: [],
  highlights: { most: null, least: null },
  turmas: [],
  avatar: Avatar.randomConfig(),
  draftName: "",
  draftTurma: "",
  phase: "profile",
  question: null,
  reveal: null,
  history: [],
  error: "",
  startedAt: 0,
  locked: false,
  clock: null,
};

boardToggle.addEventListener("click", () => board.classList.toggle("open"));

function applyBoard(message) {
  if (!message) return;
  if (message.turmas && message.turmas.length) state.turmas = message.turmas;
  if (message.players) {
    state.players = message.players;
    state.highlights = message.highlights || { most: null, least: null };
    if (state.you) state.you = message.players.find((player) => player.id === state.you.id) || state.you;
    renderBoard();
  }
}

function handle(message) {
  applyBoard(message);
  if (message.type === "joined") {
    state.you = message.you;
    restored = true;
    sessionStorage.setItem("desconfia-id", message.you.id);
    state.phase = "lobby";
    state.error = "";
    render();
    renderBoard();
  }
  if (message.type === "question") {
    state.question = message.question;
    state.reveal = null;
    state.locked = false;
    state.startedAt = message.question.startedAt || Date.now();
    state.phase = "quiz";
    render();
    startClock();
  }
  if (message.type === "reveal") {
    state.reveal = message;
    state.locked = true;
    stopClock();
    if (message.correct) burst();
    if (state.question) state.history[state.question.index - 1] = message.correct ? "good" : "bad";
    render();
    window.setTimeout(() => send({ type: "next" }), 1700);
  }
  if (message.type === "finished") {
    state.phase = "done";
    state.question = null;
    render();
  }
  if (message.type === "error") {
    state.error = message.error;
    state.locked = false;
    if (state.phase === "profile" || state.phase === "lobby") render();
  }
}

async function send(payload) {
  try {
    const response = await fetch("/api/play", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, id: state.you && state.you.id }),
    });
    handle(await response.json());
  } catch {
    state.error = "Não consegui falar com o servidor.";
    state.locked = false;
    if (state.phase === "profile" || state.phase === "lobby") render();
  }
}

let restored = false;

async function poll() {
  try {
    const saved = sessionStorage.getItem("desconfia-id");
    const id = (state.you && state.you.id) || saved || "";
    const response = await fetch(`/api/state${id ? `?id=${encodeURIComponent(id)}` : ""}`);
    const data = await response.json();
    if (data.turmas && data.turmas.length && !state.turmas.length && state.phase === "profile") {
      rememberDraft();
      state.turmas = data.turmas;
      render();
    }
    applyBoard(data);
    if (!restored && saved && data.resume && data.you) {
      restored = true;
      state.you = data.you;
      if (data.resume.type === "lobby") state.phase = "lobby";
      if (data.resume.type === "finished") {
        state.phase = "done";
        render();
      } else if (data.resume.type === "question" || data.resume.type === "reveal") {
        handle(data.resume.type === "question" ? { type: "question", question: data.resume.question } : data.resume);
      } else {
        render();
      }
    }
  } catch {
    state.error = "Não consegui atualizar o placar.";
  }
}

function connect() {
  poll();
  window.setInterval(poll, 1000);
}

function render() {
  if (state.phase === "profile") screen.innerHTML = profileHtml();
  if (state.phase === "lobby") screen.innerHTML = lobbyHtml();
  if (state.phase === "quiz") screen.innerHTML = quizHtml();
  if (state.phase === "done") screen.innerHTML = doneHtml();
  bind();
}

function profileHtml() {
  const fields = Object.entries(labels).map(([key, names]) => {
    const choices = names.map((name, index) => {
      const active = state.avatar[key] === index ? "active" : "";
      if (key === "skin" || key === "hairColor" || key === "eyeColor") {
        const color = swatchColor(key, index);
        return `<button class="swatch ${active}" type="button" data-part="${key}" data-index="${index}" style="background:${color}" title="${name}"></button>`;
      }
      return `<button class="choice ${active}" type="button" data-part="${key}" data-index="${index}">${name}</button>`;
    }).join("");
    return `<div><h2>${title(key)}</h2><div class="choices">${choices}</div></div>`;
  }).join("");
  const turmas = state.turmas.map((turma) => `<option value="${turma}" ${turma === state.draftTurma ? "selected" : ""}>${turma}</option>`).join("");
  return `<section class="panel">
    <div class="hero-copy">
      <h1>Monte seu rosto e entre no jogo.</h1>
      <p>São 15 perguntas embaralhadas. Uma alternativa é a correta. Quem responde certo ganha pontos pela rapidez, e o placar muda na hora.</p>
    </div>
    <div class="profile-grid">
      <div class="preview-card">
        ${Avatar.render(state.avatar)}
        <button id="random" class="ghost" type="button" style="color:#241447;background:#efe7ff">Avatar aleatório</button>
      </div>
      <form id="join" class="fields">
        <label>Nome completo<input id="name" name="name" maxlength="48" autocomplete="name" placeholder="Maria Silva" value="${escapeHtml(state.draftName)}" required></label>
        <p class="hint">Nome e sobrenome, só letras. Sem número, apelido, repetição ou palavra ofensiva. Cada nome entra uma vez.</p>
        <label>Turma<select id="turma">${turmas}</select></label>
        ${state.error ? `<div class="error">${escapeHtml(state.error)}</div>` : ""}
        <button class="primary" type="submit">Entrar na sala</button>
      </form>
    </div>
    <div class="editor">${fields}</div>
  </section>`;
}

function lobbyHtml() {
  const online = state.players.filter((player) => player.online).length;
  return `<section class="panel">
    <div class="hero-copy">
      <h1>Pronto, ${escapeHtml(state.you.name.split(" ")[0])}.</h1>
      <p>${escapeHtml(state.you.turma)} · ${online} pessoa(s) na sala. Cada uma recebe 15 perguntas, em ordem diferente, puxando primeiro as que ainda foram menos usadas.</p>
    </div>
    <div class="preview-card" style="margin-top:16px">${Avatar.render(state.you.avatar)}</div>
    ${state.error ? `<div class="error">${escapeHtml(state.error)}</div>` : ""}
    <div class="row-actions" style="margin-top:16px">
      <button id="start" class="primary" type="button">Começar as 15 perguntas</button>
    </div>
  </section>`;
}

function quizHtml() {
  const question = state.question;
  const reveal = state.reveal;
  const options = question.options.map((text, index) => {
    let cls = "";
    if (reveal) {
      if (index === reveal.answer) cls = "is-correct";
      else if (index === reveal.selected) cls = "is-wrong";
      else cls = "is-dim";
    }
    const points = reveal && index === reveal.selected && reveal.correct ? `<span class="float-points">+${reveal.gained}</span>` : "";
    return `<button class="option ${cls}" type="button" data-option="${index}" ${reveal ? "disabled" : ""}><span class="mark"></span><span>${escapeHtml(text)}</span>${points}</button>`;
  }).join("");
  const dots = Array.from({ length: question.total }, (_, index) => `<i class="${state.history[index] || ""} ${index === question.index - 1 && !state.history[index] ? "on" : ""}"></i>`).join("");
  const note = reveal
    ? (reveal.correct ? `Acertou! +${reveal.gained} pontos` : "Essa não era. A correta ficou destacada.")
    : "Escolha uma alternativa";
  return `<section class="quiz-wrap">
    <article class="q-card">
      <div class="q-top">
        <span class="badge ${question.difficulty}">${levelName[question.difficulty]}</span>
        <strong>${question.index}/${question.total}</strong>
      </div>
      <div class="timer" aria-hidden="true"><span id="timebar"></span></div>
      <h1 class="question">${escapeHtml(question.text)}</h1>
      <div class="options">${options}</div>
    </article>
    <div class="feedback"><span>${note}</span><div class="dots">${dots}</div></div>
  </section>`;
}

function doneHtml() {
  const me = state.you || { score: 0, correct: 0, wrong: 0, name: "" };
  const top = state.players.slice(0, 3);
  const podium = top.map((player, index) => `<div class="p${index + 1}">${Avatar.render(player.avatar)}<b>${index + 1}º</b><small>${escapeHtml(player.name)}</small></div>`).join("");
  return `<section class="panel done">
    <p class="hint">Fim de jogo</p>
    <h1>${me.score} pts</h1>
    <div class="stats">
      <div class="stat"><b>${me.correct}</b>acertos</div>
      <div class="stat"><b>${me.wrong}</b>erros</div>
      <div class="stat"><b>${rankOf(me.id)}º</b>lugar</div>
    </div>
    <div class="podium">${podium}</div>
  </section>`;
}

function bind() {
  document.querySelectorAll("[data-part]").forEach((button) => {
    button.addEventListener("click", () => {
      const part = button.dataset.part;
      state.avatar[part] = Number(button.dataset.index);
      refreshPreview();
      document.querySelectorAll(`[data-part="${part}"]`).forEach((el) => {
        el.classList.toggle("active", Number(el.dataset.index) === state.avatar[part]);
      });
    });
  });
  const random = document.querySelector("#random");
  if (random) {
    random.addEventListener("click", () => {
      rememberDraft();
      state.avatar = Avatar.randomConfig();
      render();
    });
  }
  const form = document.querySelector("#join");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      rememberDraft();
      state.error = "";
      send({
        type: "join",
        name: state.draftName,
        turma: state.draftTurma,
        avatar: state.avatar,
      });
    });
  }
  const start = document.querySelector("#start");
  if (start) start.addEventListener("click", () => send({ type: "start" }));
  document.querySelectorAll("[data-option]").forEach((button) => {
    button.addEventListener("click", () => choose(Number(button.dataset.option)));
  });
  const bar = document.querySelector("#timebar");
  if (bar && state.question && !state.reveal) paintTime(bar);
}

function rememberDraft() {
  const name = document.querySelector("#name");
  const turma = document.querySelector("#turma");
  if (name) state.draftName = name.value;
  if (turma) state.draftTurma = turma.value;
}

function refreshPreview() {
  const card = document.querySelector(".preview-card");
  const random = document.querySelector("#random");
  if (!card || !random) return;
  card.innerHTML = Avatar.render(state.avatar);
  card.appendChild(random);
}

function choose(option) {
  if (state.locked || !state.question) return;
  state.locked = true;
  send({ type: "answer", option, elapsed: Date.now() - state.startedAt });
}

function startClock() {
  stopClock();
  state.clock = window.setInterval(() => {
    const bar = document.querySelector("#timebar");
    if (!bar || !state.question || state.reveal) return;
    const left = state.question.timeLimit - (Date.now() - state.startedAt);
    paintTime(bar);
    if (left <= 0) choose(-1);
  }, 80);
}

function paintTime(bar) {
  const ratio = Math.max(0, 1 - (Date.now() - state.startedAt) / state.question.timeLimit);
  bar.style.transform = `scaleX(${ratio})`;
}

function stopClock() {
  if (state.clock) window.clearInterval(state.clock);
  state.clock = null;
}

function renderBoard() {
  const most = state.highlights.most;
  const least = state.highlights.least;
  const same = most && least && most.id === least.id;
  const spots = most ? `
    <div class="spot most"><small>Mais acertos</small><strong>${escapeHtml(most.name)}</strong>${most.correct} certas · ${most.score} pts</div>
    ${same ? "" : `<div class="spot least"><small>Menos acertos</small><strong>${escapeHtml(least.name)}</strong>${least.correct} certas · ${least.score} pts</div>`}
  ` : `<div class="empty">O placar aparece quando alguém começa a responder.</div>`;
  const rows = state.players.map((player, index) => `
    <div class="player ${state.you && player.id === state.you.id ? "me" : ""}">
      <span class="rank">${index + 1}</span>
      ${Avatar.render(player.avatar)}
      <div><b>${escapeHtml(player.name)}</b><small>${escapeHtml(player.turma)} · ${player.correct} acertos · ${player.online ? statusName[player.status] : "saiu"}</small></div>
      <span class="score">${player.score}</span>
    </div>`).join("");
  board.innerHTML = `<h2>Placar ao vivo</h2><div class="spotlights">${spots}</div>${rows || ""}`;
}

function burst() {
  const colors = ["#ff5a7a", "#ffd45a", "#3ee0ff", "#7c5cff", "#3dce7a"];
  for (let i = 0; i < 28; i += 1) {
    const bit = document.createElement("i");
    bit.className = "bit";
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.background = colors[i % colors.length];
    bit.style.animationDelay = `${Math.random() * 0.15}s`;
    confetti.appendChild(bit);
    window.setTimeout(() => bit.remove(), 1300);
  }
}

function rankOf(id) {
  const index = state.players.findIndex((player) => player.id === id);
  return index < 0 ? "-" : index + 1;
}

function title(key) {
  return {
    skin: "Rosto", eyes: "Olhos", eyeColor: "Cor dos olhos", hair: "Cabelo",
    hairColor: "Cor do cabelo", hat: "Chapéu", brows: "Sobrancelha", facial: "Barba",
    ears: "Brinco", patch: "Tapa-olho", glasses: "Óculos",
    mouth: "Boca", frame: "Moldura", extra: "Detalhe",
  }[key];
}

function swatchColor(key, index) {
  const sample = Avatar.randomConfig();
  sample[key] = index;
  if (key === "skin") return ["#f8d7b8", "#efc09a", "#d9a06c", "#c4844a", "#8d5a34", "#5c3a24"][index];
  if (key === "hairColor") return ["#2a211c", "#6a3e2a", "#d25a2b", "#e2b15c", "#3e4658", "#c43b68", "#f4f1ea", "#3c8f62", "#3a6fd8", "#7a4bb8"][index];
  return ["#4a3428", "#2c6bed", "#1f8a4c", "#7a4a1e", "#6d4ca8", "#222"][index];
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char]));
}

connect();
render();
renderBoard();
