#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const templates = {
  build: `TikiDeco / TIDE is being built as a public Sepolia testnet prototype.

Focus: verifiable contracts, clear project facts, Safe-controlled operations, and careful public communication.

No sale. No mainnet. No stated monetary value.
https://tikideco.xyz/`,
  transparency: `TikiDeco updates are source-backed:

- Sepolia deployment manifest
- verified token and vault source
- project facts
- claims matrix
- transparency reports

Current status:
https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PROJECT_FACTS.md`,
  plain: `Plain-English version:

TikiDeco / TIDE is a testnet prototype for exploring transparent hotel-related loyalty and access ideas.

It is not a sale, not mainnet, and not a promise of profit or hotel benefits.`,
  roadmap: `TikiDeco roadmap focus:

public preview stabilization, governance/counsel prep, V2 audit-package readiness, and community-preview feedback.

Mainnet is not approved. Independent audit has not started.`
};

const defaultMediaPath = path.join(
  process.cwd(),
  "docs",
  "community",
  "assets",
  "tikideco-x-roadmap-status.png"
);

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1] || null;
}

function run(command, args) {
  let executable = command;
  let finalArgs = args;

  if (command === "node") {
    executable = process.execPath;
  } else if (process.platform === "win32" && command === "npm") {
    executable = "cmd.exe";
    finalArgs = ["/d", "/s", "/c", "npm", ...args];
  }

  const result = spawnSync(executable, finalArgs, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${command} ${args.join(" ")} failed.\n${output}`);
  }

  const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
  if (output) console.log(output);
}

function chooseTheme() {
  const requested = argValue("--theme");
  if (requested) {
    if (!templates[requested]) {
      throw new Error(`Unknown theme "${requested}". Use one of: ${Object.keys(templates).join(", ")}.`);
    }
    return requested;
  }

  const day = new Date().getDay();
  if (day === 1) return "build";
  if (day === 3) return "transparency";
  if (day === 5) return "plain";
  return "roadmap";
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const theme = chooseTheme();
  const text = templates[theme];
  const dir = path.join(process.cwd(), "docs", "community", "outbox");
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = path.join(dir, `${stamp}-x-${theme}${dryRun ? "-dry-run" : ""}.txt`);
  fs.writeFileSync(file, text + os.EOL, "utf8");

  console.log(`Prepared X update: ${theme}`);
  console.log(`Outbox: ${file}`);
  console.log("Running claims gate...");
  run("npm", ["run", "claims:check"]);

  const args = ["scripts/publish-x.cjs", "--file", file];
  if (fs.existsSync(defaultMediaPath)) args.push("--media", defaultMediaPath);
  if (dryRun) args.push("--dry-run");
  run("node", args);

  console.log(dryRun ? "X dry-run completed." : "X update published.");
}

main();
