const fs = require("fs");
const path = require("path");

const workflowsDir = path.join(__dirname, "..", ".github", "workflows");
const shaPattern = /^[a-f0-9]{40}$/;
let failed = false;

for (const file of fs.readdirSync(workflowsDir).filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"))) {
  const lines = fs.readFileSync(path.join(workflowsDir, file), "utf8").split(/\r?\n/);
  for (let index = 0; index < lines.length; index++) {
    const match = lines[index].match(/^\s*uses:\s*([^@\s]+)@([^\s#]+)/);
    if (!match) continue;
    const ref = match[2];
    if (!shaPattern.test(ref)) {
      console.error(`${file}:${index + 1} action is not pinned to a full commit SHA: ${lines[index].trim()}`);
      failed = true;
    }
    const previous = lines[index - 1] || "";
    if (!previous.includes("Action version:")) {
      console.error(`${file}:${index + 1} missing preceding action version comment`);
      failed = true;
    }
  }
}

if (failed) {
  throw new Error("Workflow action pin check failed");
}

console.log("All workflow actions are pinned to full commit SHAs with version comments.");
