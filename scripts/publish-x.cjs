#!/usr/bin/env node

const fs = require("node:fs");
const { execFileSync } = require("node:child_process");

function readEnv(name) {
  if (process.env[name]) return process.env[name];

  if (process.platform === "win32") {
    try {
      return execFileSync(
        "powershell",
        ["-NoProfile", "-Command", `[Environment]::GetEnvironmentVariable('${name}','User')`],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
      ).trim() || null;
    } catch {
      return null;
    }
  }

  return null;
}

function readArg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1] || null;
}

function usage() {
  console.error("Usage: node scripts/publish-x.cjs --text \"post\" [--media path/to/image.png] [--dry-run]");
  console.error("   or: node scripts/publish-x.cjs --file path/to/post.txt [--media path/to/image.png] [--dry-run]");
}

function mediaTypeFor(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".webp")) return "image/webp";
  throw new Error(`Unsupported media type for ${filePath}. Use PNG, JPG, GIF, or WebP.`);
}

async function uploadMedia({ token, filePath }) {
  if (!fs.existsSync(filePath)) throw new Error(`Media file does not exist: ${filePath}`);

  const stats = fs.statSync(filePath);
  if (stats.size > 5 * 1024 * 1024) {
    throw new Error(`Image is ${stats.size} bytes; X image upload limit is 5 MB.`);
  }

  const mediaType = mediaTypeFor(filePath);
  const bytes = fs.readFileSync(filePath);
  const form = new FormData();
  form.append("media", new Blob([bytes], { type: mediaType }), filePath.split(/[\\/]/).pop());
  form.append("media_category", "tweet_image");
  form.append("media_type", mediaType);

  const response = await fetch("https://api.x.com/2/media/upload", {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
    body: form
  });

  const payload = await response.json();
  if (!response.ok || !payload.data?.id) {
    throw new Error(`X media upload failed: ${payload.detail || payload.title || response.statusText}`);
  }

  return payload.data.id;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run") || readEnv("TIKIDECO_X_DRY_RUN") === "1";
  const file = readArg("--file");
  const inlineText = readArg("--text");
  const mediaPath = readArg("--media");

  if (!file && !inlineText) {
    usage();
    process.exitCode = 1;
    return;
  }

  const text = file ? fs.readFileSync(file, "utf8").trim() : inlineText.trim();
  if (!text) throw new Error("X post is empty.");
  if (text.length > 280) throw new Error(`X post is ${text.length} characters; keep it at or under 280.`);

  if (dryRun) {
    console.log(`[dry-run] X post prepared (${text.length}/280 chars).`);
    if (mediaPath) console.log(`[dry-run] Media prepared: ${mediaPath}`);
    console.log(text);
    return;
  }

  const token = readEnv("TIKIDECO_X_USER_ACCESS_TOKEN");
  if (!token) throw new Error("TIKIDECO_X_USER_ACCESS_TOKEN is not set.");

  const mediaIds = [];
  if (mediaPath) {
    mediaIds.push(await uploadMedia({ token, filePath: mediaPath }));
  }

  const response = await fetch("https://api.x.com/2/tweets", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      text,
      ...(mediaIds.length > 0 ? { media: { media_ids: mediaIds } } : {})
    })
  });

  const payload = await response.json();
  if (!response.ok || !payload.data?.id) {
    throw new Error(`X publish failed: ${payload.detail || payload.title || response.statusText}`);
  }

  console.log(`X post published: ${payload.data.id}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
