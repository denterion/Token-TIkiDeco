#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const templates = {
  build: {
    title: "Build in public",
    asset: "docs/community/assets/telegram-facts-miami.png",
    text: `TikiDeco build log

Today the project is less about hype and more about making every claim checkable.

Current:
- TIDE is a Sepolia testnet prototype.
- Token and vesting vault source are verified.
- V1 privileged actions are controlled by a Sepolia Safe.
- Public copy is checked against PROJECT_FACTS.md.

Next focus: make the site and updates easier for non-crypto readers.

No sale. No mainnet. No stated monetary value.
https://tikideco.xyz/`
  },
  transparency: {
    title: "Transparency brief",
    asset: "docs/community/assets/tikideco-x-roadmap-status.png",
    text: `Transparency brief

TikiDeco keeps a simple rule: public statements should point back to evidence.

What can be checked today:
- Sepolia deployment manifest
- verified token and vault source
- Safe ownership records
- public facts and claims matrix
- automation status reports

V2 is still candidate code, not the canonical deployment.

Project facts:
https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PROJECT_FACTS.md`
  },
  community: {
    title: "Community preview",
    asset: "docs/community/assets/telegram-facts-miami.png",
    text: `Community preview

The best feedback right now is not about price. It is about clarity.

Useful questions:
- Can a normal reader understand what Sepolia means?
- Are the no-sale and no-mainnet boundaries visible?
- Are planned utility ideas clearly separated from live benefits?
- Is the roadmap understandable without crypto background?

TIDE remains a testnet prototype and is not offered for sale.
https://tikideco.xyz/`
  },
  roadmap: {
    title: "Roadmap pulse",
    asset: "docs/community/assets/telegram-roadmap-miami.png",
    text: `Roadmap pulse

Current track:
1. Public preview stabilization
2. Governance and counsel intake prep
3. V2 audit-package readiness
4. Community-preview feedback
5. Mainnet discussion only after formal gates

Important boundary: mainnet is not approved, independent audit has not started, and utility pilot material remains draft/not-live.

Roadmap:
https://github.com/denterion/Token-TIkiDeco/blob/main/docs/ROADMAP.md`
  },
  facts: {
    title: "TikiDeco fact card",
    asset: "docs/community/assets/telegram-facts-miami.png",
    text: `TikiDeco fact card

What exists today:
- Ethereum Sepolia testnet prototype
- fixed supply in the deployed V1 contract
- verified token and vault source
- Safe-controlled privileged operations
- public project facts and reports

What does not exist today:
- no token sale
- no mainnet deployment
- no stated monetary value
- no independent audit completion
- no live hotel benefit

Facts source:
https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PROJECT_FACTS.md`
  },
  plain: {
    title: "Plain-language note",
    asset: "docs/community/assets/telegram-roadmap-miami.png",
    text: `Plain-language note

TikiDeco is testing a simple idea:

Can a future hospitality project make its token rules, reports, controls, and possible loyalty/access ideas easier to verify publicly?

Right now this is a Sepolia testnet prototype. Sepolia is for testing, not a live financial market.

No sale. No investment claim. No promised hotel benefit.

Simple overview:
https://github.com/denterion/Token-TIkiDeco/blob/main/docs/PLAIN_LANGUAGE_OVERVIEW.md`
  }
};

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

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${command} ${args.join(" ")} failed.\n${output}`);
  }

  const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
  if (output) console.log(output);
  return result.stdout.trim();
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
  if (day === 5) return "community";
  if (day === 0) return "plain";
  if (day === 2) return "facts";
  return "roadmap";
}

function writeStatus(theme, text, dryRun) {
  const dir = path.join(process.cwd(), "docs", "community", "outbox");
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = path.join(dir, `${stamp}-${theme}${dryRun ? "-dry-run" : ""}.txt`);
  fs.writeFileSync(file, text + os.EOL, "utf8");
  return file;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const theme = chooseTheme();
  const update = templates[theme];
  const outboxFile = writeStatus(theme, update.text, dryRun);

  console.log(`Prepared Telegram update: ${update.title}`);
  console.log(`Outbox: ${outboxFile}`);
  console.log("Running claims gate...");
  run("npm", ["run", "claims:check"]);

  const args = ["scripts/publish-telegram.cjs", "--file", outboxFile];
  if (update.asset && fs.existsSync(path.join(process.cwd(), update.asset))) {
    args.push("--photo", path.join(process.cwd(), update.asset));
  }
  if (dryRun) args.push("--dry-run");
  run("node", args);

  console.log(dryRun ? "Telegram dry-run completed." : "Telegram update published.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
