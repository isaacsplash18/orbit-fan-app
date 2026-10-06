#!/usr/bin/env node
// i18n-audit.js
// Two checks:
//   1. The en/th UI-string dictionaries (const I18N = {...} in index.html)
//      must have exactly the same set of keys on both sides.
//   2. Every {en, th} pair inside the content/pack.js CONTENT object must
//      have a non-empty value on both sides.
// Plain Node, no dependencies — objects are extracted as source text and
// evaluated with `new Function` (this is a local build script over a
// trusted, checked-in file, not untrusted input).

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const INDEX_HTML = path.join(ROOT, "index.html");
const PACK_JS = path.join(ROOT, "content", "pack.js");

// ---------------------------------------------------------------------------
// Extract a balanced `{ ... }` object literal that starts at the first `{`
// found after `marker` in `source`. Tracks string/comment state so braces
// inside strings or comments don't throw off the depth count.
// ---------------------------------------------------------------------------
function extractBalancedObject(source, marker) {
  const markerIdx = source.indexOf(marker);
  if (markerIdx === -1) throw new Error(`Marker not found: ${marker}`);
  const braceStart = source.indexOf("{", markerIdx);
  if (braceStart === -1) throw new Error(`No "{" found after marker: ${marker}`);

  let depth = 0;
  let i = braceStart;
  let inString = null; // "'", '"', or "`"
  let inLineComment = false;
  let inBlockComment = false;

  for (; i < source.length; i++) {
    const c = source[i];
    const next = source[i + 1];

    if (inLineComment) {
      if (c === "\n") inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (c === "*" && next === "/") { inBlockComment = false; i++; }
      continue;
    }
    if (inString) {
      if (c === "\\") { i++; continue; } // skip escaped char
      if (c === inString) inString = null;
      continue;
    }
    if (c === "/" && next === "/") { inLineComment = true; i++; continue; }
    if (c === "/" && next === "*") { inBlockComment = true; i++; continue; }
    if (c === "'" || c === '"' || c === "`") { inString = c; continue; }

    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        return source.slice(braceStart, i + 1);
      }
    }
  }
  throw new Error(`Unbalanced braces while extracting object at marker: ${marker}`);
}

function loadI18N() {
  const html = fs.readFileSync(INDEX_HTML, "utf8");
  const objSrc = extractBalancedObject(html, "const I18N = ");
  // eslint-disable-next-line no-new-func
  return new Function(`return (${objSrc});`)();
}

function loadCONTENT() {
  const src = fs.readFileSync(PACK_JS, "utf8");
  // eslint-disable-next-line no-new-func
  return new Function(`${src}\nreturn CONTENT;`)();
}

function diffKeys(i18n) {
  const langs = Object.keys(i18n);
  const problems = [];
  if (langs.indexOf("en") === -1 || langs.indexOf("th") === -1) {
    problems.push(`I18N is missing an "en" or "th" top-level dictionary (found: ${langs.join(", ")})`);
    return problems;
  }
  const enKeys = new Set(Object.keys(i18n.en));
  const thKeys = new Set(Object.keys(i18n.th));

  enKeys.forEach((k) => {
    if (!thKeys.has(k)) problems.push(`key "${k}" exists in en but not in th`);
  });
  thKeys.forEach((k) => {
    if (!enKeys.has(k)) problems.push(`key "${k}" exists in th but not in en`);
  });
  return problems;
}

function isNonEmpty(v) {
  return typeof v === "string" ? v.trim().length > 0 : v !== undefined && v !== null;
}

// Recursively walk CONTENT. Any plain object carrying an "en" key must also
// carry a non-empty "th" key, and vice versa. Recurses into arrays and
// nested objects (including into the en/th values themselves, though those
// are strings so recursion naturally stops there).
function walkContentPairs(node, jsonPath, problems) {
  if (Array.isArray(node)) {
    node.forEach((item, idx) => walkContentPairs(item, `${jsonPath}[${idx}]`, problems));
    return;
  }
  if (node === null || typeof node !== "object") return;

  const hasEn = Object.prototype.hasOwnProperty.call(node, "en");
  const hasTh = Object.prototype.hasOwnProperty.call(node, "th");

  if (hasEn || hasTh) {
    if (hasEn && !isNonEmpty(node.th)) {
      problems.push(`${jsonPath || "<root>"}: has "en" but "th" is missing/empty`);
    }
    if (hasTh && !isNonEmpty(node.en)) {
      problems.push(`${jsonPath || "<root>"}: has "th" but "en" is missing/empty`);
    }
  }

  Object.keys(node).forEach((key) => {
    walkContentPairs(node[key], jsonPath ? `${jsonPath}.${key}` : key, problems);
  });
}

function main() {
  const problems = [];

  let i18n;
  try {
    i18n = loadI18N();
    problems.push(...diffKeys(i18n).map((p) => `[I18N] ${p}`));
  } catch (e) {
    problems.push(`[I18N] failed to load dictionaries from index.html: ${e.message}`);
  }

  let content;
  try {
    content = loadCONTENT();
    const contentProblems = [];
    walkContentPairs(content, "", contentProblems);
    problems.push(...contentProblems.map((p) => `[CONTENT] ${p}`));
  } catch (e) {
    problems.push(`[CONTENT] failed to load content/pack.js: ${e.message}`);
  }

  if (problems.length === 0) {
    console.log("i18n-audit: PASS — en/th dictionaries and CONTENT en/th pairs are fully matched.");
    process.exit(0);
  }

  console.log(`i18n-audit: FAIL — ${problems.length} problem(s) found.\n`);
  problems.forEach((p) => console.log(`  ${p}`));
  process.exit(1);
}

main();
