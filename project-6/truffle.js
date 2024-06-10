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
      provider: () =>
        new HDWallet(
          process.env.MNEMONIC,
          `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`
        ),
      networkCheckTimeout: 1000000,
      timeoutBlocks: 500,
      network_id: 11155111, // Sepolia's id
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },
  compilers: {
    solc: {
      version: "^0.4.25",
    },
  },
};
