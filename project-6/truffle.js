const HDWallet = require("@truffle/hdwallet-provider");
require("dotenv").config();

module.exports = {
  networks: {
    development: {
      provider: function () {
        return new HDWallet(
          "coral siege okay vendor pledge uniform pink swap cactus mandate tribe cushion",
          "http://127.0.0.1:8545/",
          0,
          50
        );
      },
      network_id: "*", // Match any network id
    },
    sepolia: {
      provider: () => {
        return new HDWallet(
          process.env.MNEMONIC,
          `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`
        );
      },
      networkCheckTimeout: 10000000,
      timeoutBlocks: 600,
      gasPrice: 50000000000,
      network_id: 11155111, // Sepolia's id
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    bscTestnet: {
      provider: () =>
        new HDWallet(
          process.env.MNEMONIC,
          `https://data-seed-prebsc-1-s1.binance.org:8545/` // BSC Testnet RPC URL
        ),
      network_id: 97, // BSC Testnet ID
      confirmations: 10, // Number of confirmations to wait between deployments
      timeoutBlocks: 200, // Number of blocks before a deployment times out
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets)
    },
    holesky: {
      provider: () =>
        new HDWallet(
          process.env.MNEMONIC,
          `https://holesky.infura.io/v3/a85b7fe4a3e948e596d571e6a42a01fb`
        ),
      networkCheckTimeout: 10000000,
      timeoutBlocks: 600,
      network_id: 17000, // Sepolia's id
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },
  compilers: {
    solc: {
      version: "^0.4.25",
    },
  },
};
