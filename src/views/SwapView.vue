<template>

  <div justify="center">
    
  </div>
  <v-row justify="center">
    
    <v-col
      cols="12"
      sm="6"  
    ><h1>Woof Swap</h1>
      <v-card border ref="form" class="mt-4">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="8"
              > 
                <v-text-field
                  v-model="input1"
                  label="Amount"
                  variant="outlined"
                  :hint="amountWallet1"
                  persistent-hint
                >
                  <template v-slot:append>
                    <v-fade-transition leave-absolute>
                      <v-progress-circular
                        v-if="loading"
                        size="24"
                        color="info"
                        indeterminate
                      ></v-progress-circular>

                      <v-avatar v-else>
                        <img
                        
                        width="32"
                        height="32"
                        :src="select.img"
                        alt=""
                      >
                      </v-avatar>

                    </v-fade-transition>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
                  v-model="select"
                  :items="allAssets"
                  item-title="text"
                  label="Coin"
                  required
                  variant="outlined" 
                >
 
 
                </v-select>
                              <v-col
                cols="12"
                sm="6"
                md="12"
                align-center
                class="text-center"
              >
                <v-icon
                  x-large
                >
                  mdi-swap-vertical-bold
                </v-icon>
              </v-col>
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="8"
              >
                <v-text-field
                  v-model="input2"
                  label="Amount"
                  variant="outlined"
                  :hint="amountWallet2"
                  persistent-hint
                  disabled
                >
                  <template v-slot:append>
                    <v-fade-transition leave-absolute>
                      <v-progress-circular
                        v-if="loading"
                        size="24"
                        color="info"
                        indeterminate
                      ></v-progress-circular>

                      <v-avatar v-else>
                        <img
                        
                        width="32"
                        height="32"
                        :src="select2.img"
                        alt=""
                      >
                      </v-avatar>
                    </v-fade-transition>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
                  v-model="select2"
                  :items="allAssets2"
                  item-title="text"
                  label="Coin"
                  required
                  variant="outlined"
                  @input="setSelected2(select2)"
                >
                  <template slot="item" slot-scope="data">
                    <img
                      width="24"
                      height="24"
                      :src="data.item.img"
                      alt=""
                    >
                    <span class="cb-item">{{data.item.text}}</span>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-container>
 
            <!--<v-simple-table>
              <template v-slot:default>

                <tbody>
                  <tr :class="actionIbcColor">
                    <td >Step 1</td>
                    <td>BitCanna to Osmosis</td>
                    <td>
                      <v-progress-circular
                        v-if="actionIbcColor === 'orange'"
                        indeterminate
                      ></v-progress-circular>
                      <v-icon v-if="actionIbcColor === 'green'">
                        mdi-check-bold
                      </v-icon>
                      <v-icon v-if="actionIbcColor === '#1E1E1E'">
                        mdi-clock-time-eight-outline
                      </v-icon>
                    </td>
                  </tr>
                  <tr :class="actionSwapColor">
                    <td>Step 2</td>
                    <td>BitCanna swap to UsdC</td>
                    <td>
                      <v-progress-circular
                        v-if="actionSwapColor === 'orange'"
                        indeterminate
                      ></v-progress-circular>
                      <v-icon v-if="actionSwapColor === 'green'">
                        mdi-check-bold
                      </v-icon>
                      <v-icon v-if="actionSwapColor === '#1E1E1E'">
                        mdi-clock-time-eight-outline
                      </v-icon>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>-->


        </v-card-text>
        <v-divider class="mt-12"></v-divider>
        <v-card-actions>
  

          <v-btn
            color="#E7A246" 
            block
            @click="start"
            
          >
            Submit (soon)
          </v-btn>
          <!--<v-btn
            color="primary"
            text
            @click="start2"
          >
            Submit 2
          </v-btn>-->
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script > 
import axios from 'axios'
import { useAppStore } from '@/stores/app'
import { Tendermint37Client } from "@cosmjs/tendermint-rpc"; 
import { createProtobufRpcClient, QueryClient, StargateClient } from "@cosmjs/stargate";
import * as bank from "cosmjs-types/cosmos/bank/v1beta1/query"; 
import { osmosis } from 'osmojs';

import {
  
  getSigningOsmosisClient,
  osmoDenomToSymbol,
  baseUnitsToDisplayUnits 
} from '@cosmology/core';
import { chain, assets, asset_list, testnet, testnet_assets } from '@chain-registry/osmosis';
//import swap from '@/libs/swap' 
 

import bech32 from 'bech32'
import cosmosConfig from '@/cosmos.config' 

export default {
  props: {
    cosmosConfig: {
      type: Object,
      default: () => {}
    }
  },  
  setup() {
    const store = useAppStore()
    return {
      store
    }
  },
  data: () => ({
    cosmosConfig: cosmosConfig,
    input1: '',
      input2: '',
      externalContent: '',
      allAssets: [],
      allAssets2: [{ text: 'HUAHUA', img: 'https://avatars.githubusercontent.com/u/94940349?v=4' }],
      loading: true,
      reveal: false,
      switch1: true,
      amountWallet1: '',
      amountWallet2: '',
      select: { text: 'ATOM', img: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png' },
      select2: { text: 'HUAHUA', img: 'https://avatars.githubusercontent.com/u/94940349?v=4' },
      actionIbcColor: '#1E1E1E',
      actionSwapColor: '#1E1E1E',
  }), 
  watch: {
    input1: async function (val) {
      console.log(this.cosmosConfig['mainnet'].coinLookup.viewDenom)
      const tokenPrice = await axios('https://api-osmosis.imperator.co/tokens/v2/price/' + this.select.text)
      const toPrice = await axios('https://api-osmosis.imperator.co/tokens/v2/price/' + this.cosmosConfig['mainnet'].coinLookup.viewDenom)
       
      console.log(val * tokenPrice.data.price)
      let tokenFiatAmount = (val * tokenPrice.data.price).toFixed(2)
      let toFiatAmount = (tokenFiatAmount / toPrice.data.price ).toFixed(2)
      this.amountWallet2 = 'Recevied ≈ ' + toFiatAmount + ' ' + this.cosmosConfig['mainnet'].coinLookup.viewDenom + '  ($' + (toFiatAmount * toPrice.data.price).toFixed(3) + ')'
      this.input2 = toFiatAmount
    },
    select: async function (val) {
      console.log(val)
      const foundLogo = this.allAssets.find(element => element.text === val);
      console.log(foundLogo)
      //const foundLogo = cosmosConfig.find(element => element.coinLookup.viewDenom === value);
      this.select = { text: val, img: foundLogo.img, amount: foundLogo.amount }
      this.amountWallet1 = 'Wallet value: ' + Number(foundLogo.amount).toFixed(2) + ' ' + val
 
    }
  },
  async mounted () {
    /* await this.$store.dispatch('keplr/checkLogin')
    if (!this.logged) {
      this.$router.push({path: "/login"})
      return
    }  */
    // Osmosis part

    
    const client = await Tendermint37Client.connect('https://osmosis-rpc.bitcanna.io') 
    const queryClient = new QueryClient(client);
    const rpcClient = createProtobufRpcClient(queryClient); 
    const queryBank = new bank.QueryClientImpl(rpcClient); 
    

    const decode = bech32.decode(this.store.addrWallet)
    const osmoAddr = bech32.encode('osmo', decode.words) 

    let getAllBalance = await queryBank.AllBalances({ address: osmoAddr });

    console.log(this.cosmosConfig)
    /* const { createRPCQueryClient } = osmosis.ClientFactory;
    const client = await createRPCQueryClient({ rpcEndpoint: 'https://osmosis-rpc.bitcanna.io' })
    
    const decode = bech32.decode(this.accountInfo[0].address )
    const osmoAddr = await bech32.encode('osmo', decode.words) 
    const getAllBalance = await client.cosmos.bank.v1beta1.allBalances({ address: osmoAddr }) */
 
    var allAssets = this.allAssets
    getAllBalance.balances.forEach(async item => {      
      console.log(item)
      if(!osmoDenomToSymbol(item.denom).startsWith('ibc/') 
        && !osmoDenomToSymbol(item.denom).startsWith('gamm/') 
        && osmoDenomToSymbol(item.denom) !== this.cosmosConfig['mainnet'].coinLookup.viewDenom
      ) {        
        const balance = await queryBank.Balance({ address: osmoAddr, denom: item.denom });
        // const balance = await client.cosmos.bank.v1beta1.balance({ address: osmoAddr, denom: item.denom })
        const found = asset_list.assets.find(element => element.symbol === osmoDenomToSymbol(item.denom))      
        const displayAmount = baseUnitsToDisplayUnits(osmoDenomToSymbol(item.denom), balance.balance.amount)

        let finalImg = ''
        if (osmoDenomToSymbol(item.denom) === 'OSMO')  {
          finalImg = 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.svg'
        } else { 
          finalImg = found?.logo_URIs?.png
        }
        allAssets.push({ text: osmoDenomToSymbol(item.denom), img: finalImg, amount: displayAmount });
        //console.log(found)
      }
    }); 
    // const symbol = osmoDenomToSymbol(denomTest);
    // const displayAmount = baseUnitsToDisplayUnits(symbol, balance);  
    // console.log(symbol)
 
    const foundDefault = getAllBalance.balances.find(element => element.denom === 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2');
    console.log(foundDefault)

    this.amountWallet1 = 'Wallet value: ' + (foundDefault?.amount / 1000000).toFixed(2) + ' ATOM '
    this.amountWallet2 = 'Recevied ≈ '
 
    this.select2 = { text: this.cosmosConfig['mainnet'].coinLookup.viewDenom, img: this.cosmosConfig['mainnet'].coinLookup.icon }
    this.allAssets2 = [{ text: this.cosmosConfig['mainnet'].coinLookup.viewDenom, img: this.cosmosConfig['mainnet'].coinLookup.icon }]
    this.allAssets = allAssets
    this.loading = false  
    this.loading = false
  },
  methods: {
    async start() {
      console.log('Start!') 
      const decode = bech32.decode(this.accountInfo[0].address)
      const tokenAddr = await bech32.encode('osmo', decode.words) 
      console.log(tokenAddr) 
      await swap.startSwap(tokenAddr, this.cosmosConfig)
    }, 
    async start2() {
      console.log('Start2!') 
      // Keplr connect
      const chainId = this.cosmosConfig['mainnet'].chainId;
      await window.keplr.enable(chainId);
      const offlineSigner = await window.getOfflineSignerAuto(chainId);
      let rpcEndpoint = 'https://osmosis-rpc.bitcanna.io'
      console.log(getSigningOsmosisClient({ rpcEndpoint, offlineSigner }))
    },
    setSelected(value) {
      console.log(value)
      

      //console.log(foundLogo.coinLookup.icon)
    },
    setSelected2(value) {
      const foundLogo = cosmosConfig.find(element => element.coinLookup.viewDenom === value);
      this.select2 = { text: value, img: foundLogo.coinLookup.icon }
      console.log(foundLogo.coinLookup.icon)
    }    
  }
}
</script>