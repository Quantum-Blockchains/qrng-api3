import '@nomicfoundation/hardhat-chai-matchers';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-docgen';
import 'hardhat-gas-reporter';
import { HardhatUserConfig } from 'hardhat/types';
import { ETHERSCAN_API_KEY, GOERLI_PRIVATE_KEY, GOERLI_URL, REPORT_GAS } from './env';


const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.9',
    settings: {
      outputSelection: {
        '*': {
          '*': ['storageLayout']
        }
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337,
      initialBaseFeePerGas: 0
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 1337,
      initialBaseFeePerGas: 0
    },
    goerli: {
      url: GOERLI_URL,
      accounts: [GOERLI_PRIVATE_KEY],
      gasPrice: 20_000_000_000
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
      localhost: 0
    },
    Alice: {
      default: 1
    },
    Bob: {
      default: 2
    },
    Charlie: {
      default: 3
    },
    Darth: {
      default: 4
    },
    Eve: {
      default: 5
    }
  },
  docgen: {
    path: '.docs',
    clear: true
  },
  gasReporter: {
    enabled: REPORT_GAS
  },
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API_KEY
    }
  }
};

export default config;
