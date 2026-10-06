#!/usr/bin/env node
// compliance-audit.js
// Enforces CLAUDE.md compliance rules (PRD §6, §9) against index.html and
// content/pack.js. Plain Node, no dependencies.
//
// Fails (exit 1) if:
//   (a) any banned economy word appears anywhere, case-insensitive, whole word:
//       token, coin, nft, blockchain, crypto, mint, wallet
//   (b) any banned stock-AI-default font name appears in index.html (Google
//       Fonts URL or font-family declarations)
//   (c) any "Lo" mascot asset is referenced (assets/lo, or lo-idle/lo-cheer/
//       lo-look/lo-rest)
//
// Every match is reported with file + line number.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const INDEX_HTML = path.join(ROOT, "index.html");
const PACK_JS = path.join(ROOT, "content", "pack.js");

const BANNED_WORDS = ["token", "coin", "nft", "blockchain", "crypto", "mint", "wallet"];

const BANNED_FONTS = [
  "Inter", "Roboto", "Open Sans", "Lato", "Poppins", "Montserrat",
  "Space Grotesk", "DM Sans", "Plus Jakarta Sans", "Manrope", "Sora",
  "Outfit", "Lexend", "Nunito", "Work Sans", "Fraunces",
];

// Emoji anywhere in the product (UI, copy, content pack) is a violation; icons are SVG.
const EMOJI_RE =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{2049}\u{203C}\u{2122}\u{2139}]/gu;

const MASCOT_PATTERNS = [
  /assets\/lo\b/i,
  /\blo-idle\b/i,
  /\blo-cheer\b/i,
  /\blo-look\b/i,
  /\blo-rest\b/i,
];

function readLines(filePath) {
  return fs.readFileSync(filePath, "utf8").split(/\r?\n/);
}

function wordRegexFor(term) {
  // term may contain internal spaces (multi-word font names) — treat each
  // space as a literal space, and require word boundaries on both ends.
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp("\\b" + escaped + "\\b", "i");
}

function scanFile(filePath, relLabel, violations) {
  const lines = readLines(filePath);

  lines.forEach((line, idx) => {
    const lineNo = idx + 1;

    BANNED_WORDS.forEach((word) => {
      const re = wordRegexFor(word);
      if (re.test(line)) {
        violations.push({
          file: relLabel,
          line: lineNo,
          rule: "banned-word",
          detail: `banned word "${word}"`,
          text: line.trim(),
        });
      }
    });

    if (relLabel === "index.html") {
      BANNED_FONTS.forEach((font) => {
        const re = wordRegexFor(font);
        if (re.test(line)) {
          violations.push({
            file: relLabel,
            line: lineNo,
            rule: "banned-font",
            detail: `banned font "${font}"`,
            text: line.trim(),
          });
        }
      });
    }

    MASCOT_PATTERNS.forEach((re) => {
      if (re.test(line)) {
        violations.push({
          file: relLabel,
          line: lineNo,
          rule: "mascot-asset",
          detail: `"Lo" mascot asset reference (${re})`,
          text: line.trim(),
        });
      }
    });

    const emoji = line.match(EMOJI_RE);
    if (emoji) {
      violations.push({
        file: relLabel,
        line: lineNo,
        rule: "emoji",
        detail: `emoji not allowed anywhere in the product (${emoji.join(" ")}) — use monoline SVG icons`,
        text: line.trim(),
      });
    }
  });
}

function main() {
  const violations = [];
  scanFile(INDEX_HTML, "index.html", violations);
  scanFile(PACK_JS, "content/pack.js", violations);

  if (violations.length === 0) {
    console.log("compliance-audit: PASS — no banned words, fonts, mascot assets, or emojis found.");
    process.exit(0);
  }

  console.log(`compliance-audit: FAIL — ${violations.length} violation(s) found.\n`);
  violations.forEach((v) => {
    console.log(`  ${v.file}:${v.line} — ${v.detail}`);
    console.log(`    ${v.text}`);
  });
  process.exit(1);
}

main();
