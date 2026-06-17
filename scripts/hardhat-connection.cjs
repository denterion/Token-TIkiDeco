async function getHardhatConnection() {
  const { network } = await import("hardhat");
  const connection = await network.create();
  const networkName = connection.networkName === "default"
    ? "hardhat"
    : connection.networkName;

  return {
    ...connection,
    networkName
  };
}

module.exports = {
  getHardhatConnection
};


