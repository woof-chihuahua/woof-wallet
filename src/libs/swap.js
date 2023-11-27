// Source by @pyramation
// https://github.com/cosmology-finance/cosmology/blob/master/packages/cli/src/commands/swap.ts
import { OfflineSigner, GeneratedType, Registry } from "@cosmjs/proto-signing";
const { LedgerSigner } = require("@cosmjs/ledger-amino");
const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;
const { makeCosmoshubPath, makeSignDoc } = require("@cosmjs/amino");
 
import { defaultRegistryTypes, AminoTypes, assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient, GasPrice } from "@cosmjs/stargate";

/* import {
  //FEES,
  osmosis,
    //cosmosAminoConverters,
    //cosmosProtoRegistry,
    cosmwasmAminoConverters,
    cosmwasmProtoRegistry,
    ibcProtoRegistry,
    ibcAminoConverters,
    //osmosisAminoConverters,
    //osmosisProtoRegistry,
    getSigningOsmosisClient
} from 'osmojs'; */
import axios from 'axios';


const registry = new Registry(cosmosProtoRegistry);

const {
  swapExactAmountIn
} = osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;


let value = ''

async function startSwap(firstAccount, cosmosConfig) {
  let sell = 'BCNA'
  let buy = 'USDC.axl'
  let slippage = '1.5'
  // let bcnaPrice = await getPrices(['bitcanna']) 
  const bcnaPrice = await axios('https://api-osmosis.imperator.co/tokens/v2/price/BCNA')


    console.log(osmosis.gamm.v1beta1.MessageComposer)
  // Keplr part
/*   const chainId = 'osmosis-1';
  await window.keplr.enable(chainId);
  const offlineSigner = await window.getOfflineSignerAuto(chainId);
  const rpcEndpoint = 'https://osmosis-rpc.bitcanna.io'; // or another URL
   const accounts = await offlineSigner.getAccounts();
        //console.log(osmosisProtoRegistry)
        const client = await SigningStargateClient.connectWithSigner(
          rpcEndpoint,
          offlineSigner,
          { registry: new Registry(osmosisProtoRegistry), aminoTypes: new AminoTypes({ ...cosmosAminoConverters })  }
        ) */

        const interactiveTimeout = 120_000
        const accountNumbers = [0]; // HDpath
        const paths = accountNumbers.map(makeCosmoshubPath);  
        
        const ledgerTransport = await TransportNodeHid.create(interactiveTimeout, interactiveTimeout)  
        const signer = new LedgerSigner(ledgerTransport, { testModeAllowed: true, hdPaths: paths, prefix: 'osmo' });
        let accounts = await signer.getAccounts()     
        
        const client = await SigningStargateClient.connectWithSigner(
          'https://rpc-osmosis.blockapsis.com',
          signer,
          { 
            gasPrice: GasPrice.fromString(cosmosConfig.gasPrice + cosmosConfig.coinLookup.chainDenom),
            registry: new Registry([...osmosisProtoRegistry]),             
            aminoTypes: new AminoTypes({ ...osmosisAminoConverters })
          }
        ) 

        console.log(accounts)
/* 
  await axios.get('https://lcd-osmosis.blockapsis.com/cosmos/bank/v1beta1/balances/'+firstAccount)
    .then(function (response) {
      const foundBcna = response.data.balances.find(element => element.denom === 'ibc/D805F1DA50D31B96E4282C1D4181EDDFB1A44A598BFF5666F4B43E4B8BEA95A5');
      console.log(bcnaPrice)
      value = ((foundBcna.amount / 1000000) * bcnaPrice.bitcanna.usd).toFixed(3)

    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })

  const api = new OsmosisApiClient({
    url: 'https://lcd-osmosis.blockapsis.com/'
  });
  const prices = await getPricesFromCoinGecko();
  const lcdPools = await api.getPools();



  const prettyPools = makePoolsPretty(prices, lcdPools.pools);



  const accountBalances = await api.getBalances(firstAccount);

  const availableChoices = accountBalances.result.map(({ denom, amount }) => {

    if (denom !== 'ibc/BCDB35B7390806F35E716D275E1E017999F8281A81B6F128F087EF34D1DFA761') {
      const symbol = osmoDenomToSymbol(denom);
      const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
      return {
        name: `${symbol} (${displayAmount})`,
        value: symbol
      };
    }

  });

  const balances = accountBalances.result.map(({ denom, amount }) => {
    const symbol = osmoDenomToSymbol(denom);
    return {
      symbol,
      denom,
      amount
    };
  });

  const tokenInBal = accountBalances.result.find(({ denom, amount }) => {
    return osmoDenomToSymbol(denom) == 'BCNA';
  });

  // get pricing and pools info...
  const pairs = makePoolPairs(prettyPools);
  const pools = lcdPools.pools.map((pool) => prettyPool(pool));

  // Out
  const tokenInPrice = getPrice(prices, sell);
  const tokenInAmount = dollarValueToDenomUnits(prices, sell, value);
  const tokenOutPrice = getPrice(prices, buy);
  //console.log(tokenInAmount)
  const tokenOutAmount = dollarValueToDenomUnits(prices, buy, value);
  let tokenOutAmountWithSlippage = calculateAmountWithSlippage(
    tokenOutAmount,
    slippage
  );

  const tokenInValue = baseUnitsToDollarValue(prices, sell, tokenInAmount);
  let tokenOutValue = baseUnitsToDollarValue(
    prices,
    buy,
    tokenOutAmountWithSlippage
  );

  // Structure message
  const tokenIn = {
    denom: symbolToOsmoDenom(sell),
    symbol: sell,
    amount: tokenInAmount,
    displayAmount: baseUnitsToDisplayUnits(sell, tokenInAmount),
    tokenInPrice,
    tokenInValue
  };

  const tokenOut = {
    denom: symbolToOsmoDenom(buy),
    symbol: buy,
    amount: tokenOutAmountWithSlippage,
    displayAmount: baseUnitsToDisplayUnits(buy, tokenOutAmountWithSlippage),
    tokenOutPrice,
    tokenOutValue
  };

  // Route
  const routes = lookupRoutesForTrade({
    pools,
    trade: {
      sell: {
        denom: tokenIn.denom,
        amount: tokenInAmount
      },
      buy: {
        denom: tokenOut.denom,
        amount: tokenOutAmount
      },
      beliefValue: value
    },
    pairs
  }).map((tradeRoute) => {
    const {
      poolId,
      tokenOutDenom
    } = tradeRoute;

    return {
      poolId,
      tokenOutDenom
    };
  });

  // Create message
  // const fee = getOsmoFee('swapExactAmountIn');
  const fee = FEES.osmosis.swapExactAmountIn('low'); // low, medium, high
  const msg = swapExactAmountIn({
    sender: firstAccount,
    routes,
    tokenIn: {
      denom: tokenIn.denom,
      amount: noDecimals(tokenIn.amount)
    },
    tokenOutMinAmount: noDecimals(tokenOut.amount)
  });
  console.log(msg)

 const res = await client.signAndBroadcast(
  firstAccount,
  [msg],
  fee,
  ''
); */


const fee = FEES.osmosis.swapExactAmountIn('low'); // low, medium, high



const msg = swapExactAmountIn({  
  sender: firstAccount,

  routes: [ 
    {
      poolId: '1',
      tokenOutDenom: 'ibc/BCDB35B7390806F35E716D275E1E017999F8281A81B6F128F087EF34D1DFA761'
    }
  ],
  tokenIn: {

    denom: 'ibc/BCDB35B7390806F35E716D275E1E017999F8281A81B6F128F087EF34D1DFA761',
    amount: '1000000'
  },
  tokenOutMinAmount: '1000000'
});

const res = await client.signAndBroadcast(
  firstAccount,
  [msg],
  fee,
  ''
); 
  
  console.log(client)

  return res.transactionHash

}

// startSwap()
export default { startSwap }
