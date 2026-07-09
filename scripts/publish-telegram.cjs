#!/usr/bin/env node

const fs = require("node:fs");
const { execFileSync } = require("node:child_process");

function readEnv(name) {
  if (process.env[name]) return process.env[name];

  if (process.platform === "win32") {
    try {
      const value = execFileSync(
        "powershell",
        [
          "-NoProfile",
          "-Command",
          `[Environment]::GetEnvironmentVariable('${name}','User')`
        ],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
      ).trim();
      return value || null;
    } catch {
      return null;
    }
  }

  return null;
}

const token = readEnv("TIKIDECO_TELEGRAM_BOT_TOKEN");
const chatId = process.env.TIKIDECO_TELEGRAM_CHAT_ID || "@tokenTikiDeco";

function usage() {
  console.error("Usage: node scripts/publish-telegram.cjs --text \"message\" [--photo path/to/image.png] [--dry-run]");
  console.error("   or: node scripts/publish-telegram.cjs --file path/to/message.txt [--photo path/to/image.png] [--dry-run]");
}

function readArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const file = readArg("--file");
  const inlineText = readArg("--text");
  const photo = readArg("--photo");

  if (!file && !inlineText) {
    usage();
    process.exitCode = 1;
    return;
  }

  const text = file ? fs.readFileSync(file, "utf8").trim() : inlineText.trim();

  if (!text) {
    throw new Error("Telegram message is empty.");
  }

  if (text.length > 4096) {
    throw new Error(`Telegram message is ${text.length} characters; maximum is 4096.`);
  }

  if (dryRun) {
    console.log(`[dry-run] Telegram message prepared for ${chatId}.`);
    if (photo) console.log(`[dry-run] Photo prepared: ${photo}`);
    console.log(text);
    return;
  }

  if (!token) {
    throw new Error("TIKIDECO_TELEGRAM_BOT_TOKEN is not set.");
  }

  if (photo) {
    if (!fs.existsSync(photo)) throw new Error(`Telegram photo does not exist: ${photo}`);

    const bytes = fs.readFileSync(photo);
    const form = new FormData();
    form.append("chat_id", chatId);
    form.append("photo", new Blob([bytes]), photo.split(/[\\/]/).pop());

    if (text.length <= 1024) {
      form.append("caption", text);
    }

    const photoResponse = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: "POST",
      body: form
    });
    const photoPayload = await photoResponse.json();
    if (!photoResponse.ok || !photoPayload.ok) {
      throw new Error(`Telegram photo publish failed: ${photoPayload.description || photoResponse.statusText}`);
    }

    if (text.length <= 1024) {
      console.log(`Telegram photo published to ${chatId} as message ${photoPayload.result.message_id}.`);
      return;
    }
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: false
    })
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(`Telegram publish failed: ${payload.description || response.statusText}`);
  }

  console.log(`Telegram message published to ${chatId} as message ${payload.result.message_id}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
