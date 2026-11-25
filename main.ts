import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "You came up the mountain. Good. Sit. The kettle\u2014ah, never mind the kettle. Three hundred years I've kept this gate, and you are the forty-first sword to knock. I used to know all your names. Now I keep them in a book. Ink, page, ink, page. The candle drips. The key rusts. Somewhere below, a village still tells children I eat hearts. I don't. I eat... what was it. Bread. Cold bread. Stale, but mine. Here\u2014take the key. Take the crown, take the gate, take it all. Just\u2014promise me one thing. When the next sword knocks, you answer the door.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

if (TEXT.length < 1 || TEXT.length > 600) {
  throw new Error(`entry must be 1-600 characters, got ${TEXT.length}`);
}
if (TEXT.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (TEXT.includes("\n") || TEXT.includes("\r")) {
  throw new Error("entry must be a single line");
}
const words = TEXT.split(/\s+/).filter(Boolean);
if (words.length !== 100) {
  throw new Error(`entry must be exactly 100 words, got ${words.length}`);
}
const banned = ["tired", "weary", "exhausted", "sleepy", "lelah", "capai"];
const lower = TEXT.toLowerCase();
for (const word of banned) {
  if (lower.includes(word)) {
    throw new Error(`entry must never state tiredness directly: found "${word}"`);
  }
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, TEXT, "utf8");
const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== TEXT) {
  throw new Error("round-trip check failed: entry.txt differs from source text");
}
