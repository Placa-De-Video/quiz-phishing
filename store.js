const { neon } = require("@neondatabase/serverless");
const { createRoom } = require("./game");

const EMPTY = { usage: {}, players: {}, seq: 1 };
let memory = null;
let schemaReady = null;

function connectionString() {
  return process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || "";
}

function memoryRoom() {
  if (!memory) memory = createRoom();
  return memory;
}

function asData(value) {
  if (!value) return EMPTY;
  if (typeof value === "string") return JSON.parse(value);
  return value;
}

async function ensureSchema(sql) {
  if (!schemaReady) {
    schemaReady = sql`CREATE TABLE IF NOT EXISTS room_state (
      id TEXT PRIMARY KEY,
      version INTEGER NOT NULL DEFAULT 0,
      data JSONB NOT NULL
    )`.then(() => sql`INSERT INTO room_state (id, version, data)
      VALUES ('sala', 0, ${JSON.stringify(EMPTY)}::jsonb)
      ON CONFLICT (id) DO NOTHING`);
  }
  await schemaReady;
}

async function withPostgres(url, fn) {
  const sql = neon(url);
  await ensureSchema(sql);
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const rows = await sql`SELECT version, data FROM room_state WHERE id = 'sala'`;
    const version = Number(rows[0].version);
    const room = createRoom(asData(rows[0].data));
    const result = fn(room);
    const saved = await sql`UPDATE room_state
      SET data = ${JSON.stringify(room.dump())}::jsonb, version = version + 1
      WHERE id = 'sala' AND version = ${version}
      RETURNING version`;
    if (saved.length) return result;
  }
  const error = new Error("Sala ocupada");
  error.publicMessage = "A sala está movimentada. Tente de novo.";
  throw error;
}

async function withRoom(fn) {
  const url = connectionString();
  if (!url) return fn(memoryRoom());
  return withPostgres(url, fn);
}

module.exports = { withRoom, connectionString };
