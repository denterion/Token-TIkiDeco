import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import hardhatEthersChaiMatchers from "@nomicfoundation/hardhat-ethers-chai-matchers";
import hardhatMocha from "@nomicfoundation/hardhat-mocha";
import { defineConfig } from "hardhat/config";
import "dotenv/config";

const { SEPOLIA_RPC_URL, DEPLOYER_PRIVATE_KEY } = process.env;

const networks = {
  hardhat: {
    type: "edr-simulated"
  },
  localhost: {
    type: "http",
    url: "http://127.0.0.1:8545"
  }
};

if (SEPOLIA_RPC_URL !== undefined && DEPLOYER_PRIVATE_KEY !== undefined) {
  networks.sepolia = {
    type: "http",
    url: SEPOLIA_RPC_URL,
    accounts: [DEPLOYER_PRIVATE_KEY]
  };
}

export default defineConfig({
  plugins: [
    hardhatEthers,
    hardhatEthersChaiMatchers,
    hardhatMocha
  ],
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "paris",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks,
  test: {
    mocha: {
      timeout: 60_000
    }
  }
});
