const BLOCKED = [
  "porra", "caralho", "merda", "bosta", "puta", "puto", "fdp", "viado", "viada",
  "buceta", "boceta", "foder", "fodase", "fodasse", "arrombado", "desgraca",
  "inferno", "otario", "idiota", "imbecil", "burro", "burrinho", "lixo",
  "nojento", "vadia", "piranha", "corno", "cacete", "porcaria", "estupido",
  "retardado", "nazista", "hitler", "sexo", "porn", "nude", "bunda", "penis",
  "vagina", "transa", "gostosa", "gostoso", "bobao", "trouxa", "besta",
  "macaco", "cuzao", "cuzão", "krl", "pqp", "vsf", "tnc",
  "safado", "safada", "prostituta", "drogado", "maconheiro", "babaca",
  "desgracado", "filhodaputa", "foda", "sexoanal", "xvideos", "onlyfans",
  "boquete", "punheta", "siririca", "bucetao", "putaria", "merdinha",
];

const NONSENSE = [
  "asdf", "qwer", "zxcv", "haha", "hehe", "kkk", "rsrs", "lol", "xxx",
  "abc", "teste", "test", "usuario", "user", "admin", "jogador", "player",
  "nick", "apelido", "anonimo", "anon", "fulano", "ciclano", "beltrano",
  "aaaa", "bbbb", "blah", "blabla", "nome", "sobrenome", "alguem", "ninguem",
  "sei la", "naosei", "qwerty", "asdfgh", "zxcvbn", "kkkk", "huehue", "kaka",
];

function fold(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z\s-]/g, "");
}

function titleCase(value) {
  return value
    .split(" ")
    .map((part) =>
      part
        .split("-")
        .map((piece) => (piece ? piece[0].toUpperCase() + piece.slice(1).toLowerCase() : piece))
        .join("-"),
    )
    .join(" ");
}

function hasBlockedWord(folded) {
  const compact = folded.replace(/[\s-]/g, "");
  const tokens = folded.split(/[\s-]+/).filter(Boolean);
  return BLOCKED.some((word) => {
    if (tokens.includes(word)) return true;
    return word.length >= 5 && compact.includes(word);
  });
}

function validateName(raw) {
  const original = String(raw || "").trim().replace(/\s+/g, " ");
  if (!original) return { ok: false, error: "Escreva seu nome completo." };
  if (original.length > 48) return { ok: false, error: "Esse nome está longo demais." };
  if (/\d/.test(original)) return { ok: false, error: "O nome não pode ter números." };
  if (!/^[\p{L}\s-]+$/u.test(original)) {
    return { ok: false, error: "Use só letras. Sem símbolos, apelidos ou besteira." };
  }

  const parts = original.split(" ").filter(Boolean);
  if (parts.length < 2) {
    return { ok: false, error: "Use o nome completo, com nome e sobrenome." };
  }
  if (parts.some((part) => part.replace(/-/g, "").length < 2)) {
    return { ok: false, error: "Cada parte do nome precisa ter pelo menos 2 letras." };
  }

  const folded = fold(original);
  if (hasBlockedWord(folded) || NONSENSE.some((word) => folded.includes(word))) {
    return { ok: false, error: "Esse nome não pode ser usado. Escolha seu nome completo de verdade." };
  }
  if (/(.)\1{2,}/i.test(folded.replace(/\s/g, ""))) {
    return { ok: false, error: "Esse nome parece inventado. Use seu nome completo." };
  }

  const tokens = folded.split(/[\s-]+/).filter(Boolean);
  if (tokens.some((token) => !/[aeiou]/.test(token) || /[bcdfghjklmnpqrstvwxyz]{5,}/.test(token))) {
    return { ok: false, error: "Esse nome não parece um nome real." };
  }
  if (new Set(tokens).size !== tokens.length) {
    return { ok: false, error: "Não repita o mesmo nome só para completar." };
  }

  return { ok: true, name: titleCase(original), key: folded };
}

const TURMAS = [
  "6º Ano A", "6º Ano B", "6º Ano C",
  "7º Ano A", "7º Ano B", "7º Ano C",
  "8º Ano A", "8º Ano B", "8º Ano C",
  "9º Ano A", "9º Ano B", "9º Ano C",
  "1ª Série A", "1ª Série B", "1ª Série C",
  "2ª Série A", "2ª Série B", "2ª Série C",
  "3ª Série A", "3ª Série B", "3ª Série C",
  "EJA",
];

function validateTurma(raw) {
  const turma = String(raw || "").trim();
  if (!TURMAS.includes(turma)) return { ok: false, error: "Escolha a turma da lista." };
  return { ok: true, turma };
}

module.exports = { validateName, validateTurma, TURMAS, fold };
