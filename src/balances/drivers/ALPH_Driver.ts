import { GenericBalanceDriver } from '../GenericBalanceDriver';
import { ExplorerClient } from '@alephium/sdk';
import { GenericBalance } from '..';
import BigNumber from 'bignumber.js';
import { ALPH_UNIT } from '../../constants';

export class ALPH_Driver extends GenericBalanceDriver {
  config: any;

  createClient = async () => {
    return new ExplorerClient({
      baseUrl: this.getBalanceEndpoint()[0],
    });
  };

  getBalance = async (address: string) => {
    const cliqueClient = await this.createClient();
    const addressDetailsResp = await cliqueClient.getAddressDetails(address);

    return new GenericBalance(
      this.currency,
      new BigNumber(addressDetailsResp.data.balance)
        .dividedBy(ALPH_UNIT)
        .toNumber(),
      0,
      0,
      0,
      0,
      new BigNumber(addressDetailsResp.data.balance)
        .dividedBy(ALPH_UNIT)
        .toNumber()
    );
  };

  getBalanceEndpoint() {
    let endpoints = [];
    if (this.config.explorer) {
      if (!Array.isArray(this.config.explorer)) {
        endpoints = [this.config.explorer];
      } else {
        endpoints = this.config.explorer;
      }
      return endpoints;
    }
    throw new Error(
      this.currency + ' Balance currency endpoint is required in config'
    );
  }
}
