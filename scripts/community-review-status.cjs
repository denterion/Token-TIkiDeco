const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const status = JSON.parse(fs.readFileSync(path.join(root, "config", "community-review", "status.json"), "utf8"));

console.log("# TikiDeco V2 Community Review Status\n");
console.log(`- Status: \`${status.status}\``);
console.log(`- Candidate source commit: \`${status.candidateCommit}\``);
console.log(`- Frozen V2 commit: \`${status.freezeCommit}\``);
console.log(`- Package SHA-256: \`${status.packageSha256}\``);
console.log(`- Opened: \`${status.openedAt}\``);
console.log(`- Public findings: ${status.publicFindingsCount}`);
console.log(`- Private findings disclosed as aggregate: ${status.privateFindingsCountPubliclyDisclosedAsAggregate}`);
console.log(`- Reviewers acknowledged: ${status.reviewersAcknowledged.length ? status.reviewersAcknowledged.join(", ") : "none"}`);
console.log(`- Formal independent audit: \`${status.formalAuditStatus}\``);
console.log("\nCommunity peer review is not a formal independent smart-contract audit. V2 remains non-canonical and non-deployed.");
