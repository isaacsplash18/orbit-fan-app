#!/usr/bin/env node
// pack-sync.js
// index.html inlines content/pack.js verbatim between two marker comment
// lines so the two stay diffable (see index.html §7). This script extracts
// that inlined block and fails if it is not byte-identical to the canonical
// content/pack.js, ignoring leading/trailing blank lines on either side.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const INDEX_HTML = path.join(ROOT, "index.html");
const PACK_JS = path.join(ROOT, "content", "pack.js");

const BEGIN_MARKER = "BEGIN content/pack.js";
const END_MARKER = "END content/pack.js";

function stripBlankEdges(lines) {
  let start = 0;
  let end = lines.length - 1;
  while (start <= end && lines[start].trim() === "") start++;
  while (end >= start && lines[end].trim() === "") end--;
  return lines.slice(start, end + 1);
}

function main() {
  const indexSrc = fs.readFileSync(INDEX_HTML, "utf8");
  const indexLines = indexSrc.split(/\r?\n/);

  const beginIdx = indexLines.findIndex((l) => l.includes(BEGIN_MARKER));
  const endIdx = indexLines.findIndex((l) => l.includes(END_MARKER));

  if (beginIdx === -1 || endIdx === -1 || endIdx <= beginIdx) {
    console.log(
      `pack-sync: FAIL — could not find both marker lines ("${BEGIN_MARKER}" / "${END_MARKER}") in index.html.`
    );
    process.exit(1);
  }

  const inlined = stripBlankEdges(indexLines.slice(beginIdx + 1, endIdx));
  const canonical = stripBlankEdges(fs.readFileSync(PACK_JS, "utf8").split(/\r?\n/));

  const inlinedText = inlined.join("\n");
  const canonicalText = canonical.join("\n");

  if (inlinedText === canonicalText) {
    console.log("pack-sync: PASS — inlined content/pack.js block is byte-identical to content/pack.js.");
    process.exit(0);
  }

  // Find first differing line for a unified-style summary.
  const maxLen = Math.max(inlined.length, canonical.length);
  let firstDiff = -1;
  for (let i = 0; i < maxLen; i++) {
    if (inlined[i] !== canonical[i]) {
      firstDiff = i;
      break;
    }
  }

  console.log("pack-sync: FAIL — inlined block in index.html differs from content/pack.js.\n");
  if (inlined.length !== canonical.length) {
    console.log(
      `  Line count differs: index.html block has ${inlined.length} lines, content/pack.js has ${canonical.length} lines.`
    );
  }
  console.log(`  First difference at block line ${firstDiff + 1}` +
    ` (index.html:${beginIdx + 1 + firstDiff + 1}):`);
  console.log(`  --- content/pack.js`);
  console.log(`  -${firstDiff + 1}: ${canonical[firstDiff] !== undefined ? canonical[firstDiff] : "<no line>"}`);
  console.log(`  +++ index.html (inlined block)`);
  console.log(`  +${firstDiff + 1}: ${inlined[firstDiff] !== undefined ? inlined[firstDiff] : "<no line>"}`);
  process.exit(1);
}

main();
