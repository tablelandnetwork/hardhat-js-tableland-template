require("dotenv").config();
const { extendEnvironment } = require("hardhat/config");
require("hardhat-dependency-compiler");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("solidity-coverage");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@openzeppelin/hardhat-upgrades");
require("@tableland/hardhat");
require("@typechain/hardhat");

// Replace with your deployed contract address
const deployedContract = "";

const homestead = {
  url: `https://eth-mainnet.alchemyapi.io/v2/${
    process.env.ETHEREUM_API_KEY ?? ""
  }`,
  accounts:
    process.env.ETHEREUM_PRIVATE_KEY !== undefined
      ? [process.env.ETHEREUM_PRIVATE_KEY]
      : [],
};

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  dependencyCompiler: {
    paths: [
      // For unit testing purposes, the registry contract must be deployed
      "@tableland/evm/contracts/TablelandTables.sol",
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  localTableland: {
    silent: true,
    verbose: false,
  },
  etherscan: {
    apiKey: {
      // ethereum
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      // optimism
      optimisticEthereum: process.env.OPTIMISM_ETHERSCAN_API_KEY || "",
      optimisticSepolia: process.env.OPTIMISM_ETHERSCAN_API_KEY || "",
      // arbitrum
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      arbitrumNova: process.env.ARBISCAN_NOVA_API_KEY || "",
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || "",
      // polygon
      polygon: process.env.POLYSCAN_API_KEY || "",
      polygonAmoy: process.env.POLYSCAN_API_KEY || "",
    },
    customChains: [
      // optimism
      {
        network: "optimisticSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimism.etherscan.io/",
        },
      },
      // arbitrum
      {
        network: "arbitrumNova",
        chainId: 42170,
        urls: {
          apiURL: "https://api-nova.arbiscan.io/api",
          browserURL: "https://nova.arbiscan.io/",
        },
      },
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },
      // polygon
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com/",
        },
      },
    ],
  },
  networks: {
    // mainnets
    mainnet: homestead,
    homestead,
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${
        process.env.OPTIMISM_API_KEY ?? ""
      }`,
      accounts:
        process.env.OPTIMISM_PRIVATE_KEY !== undefined
          ? [process.env.OPTIMISM_PRIVATE_KEY]
          : [],
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${
        process.env.ARBITRUM_API_KEY ?? ""
      }`,
      accounts:
        process.env.ARBITRUM_PRIVATE_KEY !== undefined
          ? [process.env.ARBITRUM_PRIVATE_KEY]
          : [],
    },
    "arbitrum-nova": {
      url: `https://arbitrum-one-rpc.publicnode.com/${
        process.env.ARBITRUM_NOVA_API_KEY ?? ""
      }`,
      accounts:
        process.env.ARBITRUM_NOVA_PRIVATE_KEY !== undefined
          ? [process.env.ARBITRUM_NOVA_PRIVATE_KEY]
          : [],
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${
        process.env.POLYGON_API_KEY ?? ""
      }`,
      accounts:
        process.env.POLYGON_PRIVATE_KEY !== undefined
          ? [process.env.POLYGON_PRIVATE_KEY]
          : [],
    },
    filecoin: {
      url: `https://rpc.ankr.com/filecoin`,
      accounts:
        process.env.FILECOIN_PRIVATE_KEY !== undefined
          ? [process.env.FILECOIN_PRIVATE_KEY]
          : [],
      timeout: 60_000,
    },
    // testnets
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${
        process.env.ETHEREUM_SEPOLIA_API_KEY ?? ""
      }`,
      accounts:
        process.env.ETHEREUM_SEPOLIA_PRIVATE_KEY !== undefined
          ? [process.env.ETHEREUM_SEPOLIA_PRIVATE_KEY]
          : [],
    },
    "optimism-goerli": {
      url: `https://opt-goerli.g.alchemy.com/v2/${
        process.env.OPTIMISM_SEPOLIA_API_KEY ?? ""
      }`,
      accounts:
        process.env.OPTIMISM_SEPOLIA_PRIVATE_KEY !== undefined
          ? [process.env.OPTIMISM_SEPOLIA_PRIVATE_KEY]
          : [],
    },
    "arbitrum-sepolia": {
      url: `https://arb-sepolia.g.alchemy.com/v2/${
        process.env.ARBITRUM_SEPOLIA_API_KEY ?? ""
      }`,
      accounts:
        process.env.ARBITRUM_SEPOLIA_PRIVATE_KEY !== undefined
          ? [process.env.ARBITRUM_SEPOLIA_PRIVATE_KEY]
          : [],
    },
    "polygon-amoy": {
      url: `https://polygon-amoy.g.alchemy.com/v2/${
        process.env.POLYGON_AMOY_API_KEY ?? ""
      }`,
      accounts:
        process.env.POLYGON_AMOY_PRIVATE_KEY !== undefined
          ? [process.env.POLYGON_AMOY_PRIVATE_KEY]
          : [],
    },
    "filecoin-calibration": {
      url: `https://api.calibration.node.glif.io/rpc/v1`,
      accounts:
        process.env.FILECOIN_CALIBRATION_PRIVATE_KEY !== undefined
          ? [process.env.FILECOIN_CALIBRATION_PRIVATE_KEY]
          : [],
      timeout: 60_000,
    },
  },
  deployedContract,
};

extendEnvironment((hre) => {
  // Get contract address for user-selected network
  const contract = hre.userConfig.deployedContract;
  hre.deployedContract = contract;
});

module.exports = config;
