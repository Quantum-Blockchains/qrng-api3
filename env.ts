require('dotenv').config();

const GOERLI_URL = process.env.GOERLI_URL || '';
const GOERLI_AIRNODE_ADDRESS = process.env.GOERLI_AIRNODE_ADDRESS || '0xa0AD79D995DdeeB18a14eAef56A549A04e3Aa1Bd'
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY || '0000000000000000000000000000000000000000000000000000000000000000';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const REPORT_GAS = Boolean(process.env.REPORT_GAS) || true;

export {
  GOERLI_URL,
  GOERLI_AIRNODE_ADDRESS,
  GOERLI_PRIVATE_KEY,
  ETHERSCAN_API_KEY,
  REPORT_GAS,
};
