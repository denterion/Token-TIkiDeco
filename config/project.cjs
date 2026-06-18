const projectConfig = {
  projectName: process.env.PROJECT_NAME || "TikiDeco Sepolia prototype",
  businessEntity: process.env.BUSINESS_ENTITY || "TikiDeco project company / SPV to be formed",
  jurisdiction: process.env.PROJECT_JURISDICTION || "Florida, USA",
  projectURI: process.env.PROJECT_URI || "https://tikideco.example/project"
};

module.exports = {
  projectConfig
};
