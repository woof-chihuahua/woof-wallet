import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  SigningStargateClientOptions,
  GasPrice,
  calculateFee,
  AminoTypes,
  createBankAminoConverters
} from "@cosmjs/stargate";
import { Registry } from "@cosmjs/proto-signing";
import { 
  osmosisProtoRegistry, 
  osmosisAminoConverters, 
  cosmosAminoConverters, 
  cosmwasmAminoConverters, 
  ibcAminoConverters 
} from 'osmojs';
import cosmosConfig from '../cosmos.config'

import { MsgExecLegacyContent } from "cosmjs-types/cosmos/gov/v1/tx"; 
 
/* export async function selectSigner(chain) { 
  // Register the legacy content type
  const registry = new Registry(defaultRegistryTypes);
  
  registry.register("/cosmos.gov.v1.MsgExecLegacyContent", MsgExecLegacyContent); 

  // Keplr connect
  const chainId = cosmosConfig[chain].chainId;
  await window.keplr.enable(chainId);
  const offlineSigner = await window.getOfflineSignerAuto(chainId);
 
  const accounts = await offlineSigner.getAccounts();

  const client = await SigningStargateClient.connectWithSigner(
    cosmosConfig[chain].rpcURL,
    offlineSigner,
    {
      gasPrice: GasPrice.fromString(
        cosmosConfig[chain].gasPrice +
          cosmosConfig[chain].coinLookup.chainDenom
      ),
      registry: registry
    }
  );

  return { client, accounts };
} */
export async function selectSigner(chain, type) { 
  let accounts = ''
  let client = ''
  let chainId = cosmosConfig[chain].chainId;
  if (type === 'keplr') {
    // Keplr connect
    const aminoConverters = {
      ...osmosisAminoConverters,
      ...cosmosAminoConverters,
      ...cosmwasmAminoConverters,
      ...ibcAminoConverters,
    };

    const registry = new Registry([...osmosisProtoRegistry, ...defaultRegistryTypes]);
    const aminoTypes = new AminoTypes(aminoConverters);


    await window.keplr.enable(chainId);
    const offlineSigner = await window.getOfflineSignerAuto(chainId);
  
    accounts = await offlineSigner.getAccounts();

    client = await SigningStargateClient.connectWithSigner(
      cosmosConfig[chain].rpcURL,
      offlineSigner,
      {
        gasPrice: GasPrice.fromString(
          cosmosConfig[chain].gasPrice +
            cosmosConfig[chain].coinLookup.chainDenom
        ),
        registry: registry,
        aminoTypes
      }
    );
  } else if (type === 'cosmostation') {
    await window.cosmostation.providers.keplr.enable(chainId); 
    const offlineSigner =
      window.cosmostation.providers.keplr.getOfflineSigner(chainId);
 
    accounts = await offlineSigner.getAccounts();

    client = await SigningStargateClient.connectWithSigner(
      cosmosConfig[chain].rpcURL,
      offlineSigner,
      {
        gasPrice: GasPrice.fromString(
          cosmosConfig[chain].gasPrice +
            cosmosConfig[chain].coinLookup.chainDenom
        ),
      }
    );
  } else if (type === 'leap') {
    await window.leap.enable(chainId); 
    const offlineSigner =
      window.leap.getOfflineSigner(chainId);
 
    accounts = await offlineSigner.getAccounts();

    client = await SigningStargateClient.connectWithSigner(
      cosmosConfig[chain].rpcURL,
      offlineSigner,
      {
        gasPrice: GasPrice.fromString(
          cosmosConfig[chain].gasPrice +
            cosmosConfig[chain].coinLookup.chainDenom
        ),
      }
    );
  }

  return { client, accounts };
}
export async function calculFee(msg) { 
  // calcul Fee

  return { msg };
}
