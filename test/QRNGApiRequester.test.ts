import { FakeContract, smock } from '@defi-wonderland/smock';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { formatBytes32String } from 'ethers/lib/utils';
import { ethers, getUnnamedAccounts } from 'hardhat';
import { QRNG_API_REQUESTER } from '../helpers/constants';
import { IAirnodeRrpV0, QRNGApiRequester } from '../typechain-types';

interface MakeRequestParams {
  provider: string;
  type: string;
  size: number;
  fulfillmentData: string;
  expectedNumbers: BigNumber[];
}

describe(QRNG_API_REQUESTER, () => {
  let qrngApiRequester: QRNGApiRequester;
  let airnodeRrpV0: FakeContract<IAirnodeRrpV0>;

  before(async () => {
    airnodeRrpV0 = await smock.fake<IAirnodeRrpV0>('IAirnodeRrpV0');
    airnodeRrpV0.makeFullRequest.returns(() => {
      return formatBytes32String('1');
    });

    const requesterFactory = await ethers.getContractFactory(QRNG_API_REQUESTER);
    qrngApiRequester = await requesterFactory.deploy(airnodeRrpV0.address) as QRNGApiRequester;

    let [deployer] = await ethers.getSigners();
    await deployer.sendTransaction({
      to: airnodeRrpV0.address,
      value: ethers.utils.parseEther('10.0'),
    });

  });

  describe('Making requests', () => {
    const makeRequestParams: MakeRequestParams[] = [
      // TODO uncomment and provide proper values when airnode is ready
      // {
      //   provider: 'qbck',
      //   type: 'short',
      //   size: 5,
      //   fulfillmentData: '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000055df15e0000000000000000000000000000000000000000000000000000000017b38dec000000000000000000000000000000000000000000000000000000000a00d16f000000000000000000000000000000000000000000000000000000001a956b770000000000000000000000000000000000000000000000000000000035c20f26',
      //   expectedNumbers: [1, 2, 3, 4, 5]
      // },
      {
        provider: 'qnulabs',
        type: 'int',
        size: 10,
        fulfillmentData: '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000002ce01bcf0000000000000000000000000000000000000000000000000000000021d18b87000000000000000000000000000000000000000000000000000000002ea473e80000000000000000000000000000000000000000000000000000000011dfd9fb0000000000000000000000000000000000000000000000000000000035e241a600000000000000000000000000000000000000000000000000000000256030ed0000000000000000000000000000000000000000000000000000000020e9bdfb000000000000000000000000000000000000000000000000000000003917592d0000000000000000000000000000000000000000000000000000000005735cce000000000000000000000000000000000000000000000000000000000ef20897',
        expectedNumbers: [BigNumber.from(752884687), BigNumber.from(567380871), BigNumber.from(782529512), BigNumber.from(299883003), BigNumber.from(904020390), BigNumber.from(627060973), BigNumber.from(552189435), BigNumber.from(957831469), BigNumber.from(91446478), BigNumber.from(250742935)],
      },
      // TODO uncomment and provide proper values when airnode is ready
      // {
      //   provider: 'sequre',
      //   type: 'long',
      //   size: 15,
      //   fulfillmentData: '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000055df15e0000000000000000000000000000000000000000000000000000000017b38dec000000000000000000000000000000000000000000000000000000000a00d16f000000000000000000000000000000000000000000000000000000001a956b770000000000000000000000000000000000000000000000000000000035c20f26',
      //   expectedNumbers: [1, 2, 3, 4, 5]
      // },
      {
        provider: 'realrandom',
        type: 'bigint',
        size: 5,
        fulfillmentData: '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000054b442d437dd467c12c0615a802aace3f709c6061a5b4bc3be21c6af2177391f779514f1bb67e822f3441bcb069aa3b324f91060e495eb51e31ccc4db679f44eb72b9fcfb1ccea96fdc41f03222595fb9903256ac2f776ec2e6267da92d6a315bd856d568644746de48cf3db3f256017b9b32f32436d2b8e8296305d156cfe2c76b58e7bcd052715dc547b51f5ef62520e9c4c3f8a8797e48336bcf21dc2feade',
        expectedNumbers: [BigNumber.from("34043921642303356464160602563297817231037502234821250703669861055221940326903"), BigNumber.from("54873515275921118266958846133667643653568411791519197940926082122821901698283"), BigNumber.from("51892277455536133978527001990122146332560052654183697780803798156673888694619"), BigNumber.from("97852997027923351468448582506654330083615002022394115184650125770731746747079"), BigNumber.from("48554556733924955104595930520072423607860776651375157666143636129933446605534")]
      }
    ];

    makeRequestParams.forEach(params => {
      it(`Can make request with various params: ${params.provider}, ${params.type}, ${params.size}`, async () => {
        let [airnode, sponsor, sponsorWallet] = await getUnnamedAccounts();

        // make request to for random numbers
        await qrngApiRequester.makeRequest(airnode, '0x9b50a620b157676e7aac88732dbe117297e9127454d8a8575a962fc77b580569',
          sponsor, sponsorWallet, formatBytes32String(params.provider),
          formatBytes32String(params.type), params.size);

        // incoming fulfillment is in the contract
        let incomingFulfilment = await qrngApiRequester.incomingFulfillments(formatBytes32String('1'));
        expect(incomingFulfilment).true;

        // airnode fulfills the request
        await qrngApiRequester.connect(airnodeRrpV0.wallet).fulfill(formatBytes32String('1'), params.fulfillmentData);

        // request is fulfilled, random numbers are in the contract
        for (let i = 0; i < params.expectedNumbers.length; i++) {
          const fulfilledData = await qrngApiRequester.fulfilledData(formatBytes32String('1'), i);
          expect(fulfilledData).eq(params.expectedNumbers[i]);
        }
      });
    });
  });
});