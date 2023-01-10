import { FakeContract, smock } from '@defi-wonderland/smock';
import { expect } from 'chai';
import { formatBytes32String } from 'ethers/lib/utils';
import { ethers, getUnnamedAccounts } from 'hardhat';
import { QRNG_API_REQUESTER } from '../helpers/constants';
import { IAirnodeRrpV0, QRNGApiRequester } from '../typechain-types';

interface MakeRequestParams {
  provider: string;
  type: string;
  size: number;
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
  });

  describe('Making requests', () => {
    const makeRequestParams: MakeRequestParams[] = [
      {
        provider: 'qbck',
        type: 'short',
        size: 5
      },
      {
        provider: 'qnulabs',
        type: 'int',
        size: 10
      },
      {
        provider: 'sequre',
        type: 'long',
        size: 15
      }
    ];

    makeRequestParams.forEach(params => {
      it(`Can make request with various params: ${params.provider}, ${params.type}, ${params.size}`, async () => {
        let [airnode, sponsor, sponsorWallet] = await getUnnamedAccounts();

        await qrngApiRequester.makeRequest(airnode, '0x9b50a620b157676e7aac88732dbe117297e9127454d8a8575a962fc77b580569',
          sponsor, sponsorWallet, formatBytes32String(params.provider),
          formatBytes32String(params.type), params.size);

        let fulfilment = await qrngApiRequester.incomingFulfillments(formatBytes32String('1'));
        expect(fulfilment).true;
      });
    });

  });

  describe('Fulfilling requests', () => {
    it(`Can fulfill request with various params for uints`, async () => {

    });
  });
});