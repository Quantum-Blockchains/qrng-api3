import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { GOERLI_AIRNODE_ADDRESS } from '../env';
import { QRNG_API_REQUESTER_WITH_PARAMS } from '../helpers/constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  await deploy(QRNG_API_REQUESTER_WITH_PARAMS, {
    from: deployer,
    log: true,
    args: [GOERLI_AIRNODE_ADDRESS],
    autoMine: true
  });
};
export default func;
func.tags = ['qrng-api', 'local', 'test', 'goerli'];
