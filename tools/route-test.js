#!/usr/bin/env node
// route-test.js
// Statically cross-checks index.html's router against its section.page ids.
//
//   forward check:  every `<section class="page" id="page-XXX">` must be a
//                    real route target — it must appear either (a) in the
//                    router's `const PAGES = [...]` list, (b) in a literal
//                    `go('XXX')` / `go("XXX")` call, or (c) in a literal
//                    `href="#/XXX"`. (signin is only ever reached
//                    programmatically via go('signin'), never via an href —
//                    that's expected and handled by checking go() calls too.)
//
//   reverse check:  every literal `#/XXX` href and `go('XXX')` call must
//                    have a matching `page-XXX` section — no dangling links.
//
// Orphans in either direction are reported. Plain Node, no dependencies.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const INDEX_HTML = path.join(ROOT, "index.html");

function uniq(arr) { return Array.from(new Set(arr)); }

function main() {
  const html = fs.readFileSync(INDEX_HTML, "utf8");

  // --- section ids: id="page-XXX" -------------------------------------
  const sectionIds = uniq(
    Array.from(html.matchAll(/id="page-([a-zA-Z0-9_-]+)"/g)).map((m) => m[1])
  );

  // --- router: const PAGES = [ ... ]; ----------------------------------
  const pagesMatch = html.match(/const PAGES\s*=\s*\[([\s\S]*?)\];/);
  if (!pagesMatch) {
    console.log('route-test: FAIL — could not find "const PAGES = [...]" router array in index.html.');
    process.exit(1);
  }
  const routerPages = uniq(
    Array.from(pagesMatch[1].matchAll(/["']([a-zA-Z0-9_-]+)["']/g)).map((m) => m[1])
  );

  // --- literal go('XXX') / go("XXX") calls ------------------------------
  const goTargets = uniq(
    Array.from(html.matchAll(/\bgo\(\s*["']([a-zA-Z0-9_-]+)["']/g)).map((m) => m[1])
  );

  // --- literal href="#/XXX" (also matches href="#/item/' + ... via the
  //     stop-at-non-identifier capture) ------------------------------------
  const hrefTargets = uniq(
    Array.from(html.matchAll(/href=["']#\/([a-zA-Z0-9_-]+)/g)).map((m) => m[1])
  );

  const reachable = new Set([...routerPages, ...goTargets, ...hrefTargets]);
  const sectionSet = new Set(sectionIds);
  const linkTargetSet = new Set([...goTargets, ...hrefTargets]);

  const orphanSections = sectionIds.filter((id) => !reachable.has(id));
  const orphanRouteTargets = Array.from(linkTargetSet).filter((id) => !sectionSet.has(id));

  // Extra diagnostic: router list vs sections should match 1:1. Fold any
  // mismatch into the same pass/fail result since it signals a real bug
  // (a page added without wiring it into the router, or vice versa).
  const routerOnlyNoSection = routerPages.filter((id) => !sectionSet.has(id));
  const sectionOnlyNoRouter = sectionIds.filter((id) => !routerPages.includes(id));

  console.log(`route-test: found ${sectionIds.length} section.page id(s), ${routerPages.length} router entr${routerPages.length === 1 ? "y" : "ies"}.`);

  let failed = false;

  if (orphanSections.length) {
    failed = true;
    console.log(`\n  Orphan section(s) — page id has no route reference (not in PAGES, no go(), no href):`);
    orphanSections.forEach((id) => console.log(`    page-${id}`));
  }

  if (orphanRouteTargets.length) {
    failed = true;
    console.log(`\n  Orphan route target(s) — go()/href points at a route with no matching section:`);
    orphanRouteTargets.forEach((id) => console.log(`    ${id}`));
  }

  if (routerOnlyNoSection.length) {
    failed = true;
    console.log(`\n  Router entr${routerOnlyNoSection.length === 1 ? "y" : "ies"} with no matching section:`);
    routerOnlyNoSection.forEach((id) => console.log(`    "${id}" in PAGES, but no id="page-${id}"`));
  }

  if (sectionOnlyNoRouter.length) {
    failed = true;
    console.log(`\n  Section(s) not registered in the router's PAGES list:`);
    sectionOnlyNoRouter.forEach((id) => console.log(`    page-${id}, but "${id}" not in PAGES`));
  }

  if (!goTargets.includes("signin")) {
    // Not a failure by itself (signin is always reachable via PAGES/go from
    // boot), but worth flagging loudly if it ever regresses since signin has
    // no href anywhere and is only reached programmatically.
    console.log(`\n  Note: expected at least one literal go('signin') call (programmatic-only route) — none found.`);
    failed = true;
  }

  if (!failed) {
    console.log("\nroute-test: PASS — every section is a reachable route, every route has a matching section.");
    process.exit(0);
  }

  console.log("\nroute-test: FAIL — see orphans above.");
  process.exit(1);
}

main();
