 
<template>
  <h1 class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center">
    <div class="text-truncate">
      Chihuahua statistics
    </div>
  </h1>
  <v-row>
    <v-col>
      <v-sheet
        border
        rounded="lg"
        min-height="30vh"
      >
        <h3 class="ma-2 pa-2">
          <v-icon
            :color="cosmosConfig[store.chain].color"
            icon="mdi-information-outline"
            class="mr-2"
          />           
          Chain info
        </h3>
        <v-divider />        
        <v-table>
          <tbody>
            <tr>
              <td>Total Supply</td>
              <td>
                {{ millify((store.totalSupply / 1000000)) }} 
                <strong :style="'color:' + cosmosConfig[store.chain].color">
                  {{ cosmosConfig[store.chain].coinLookup.viewDenom }}
                </strong>                
              </td>
            </tr>  
            <tr>
              <td>Bonded Tokens</td>
              <td>
                {{ millify(store.poolStaking.bondedTokens / 1000000) }} 
                <strong :style="'color:' + cosmosConfig[store.chain].color">
                  {{ cosmosConfig[store.chain].coinLookup.viewDenom }}
                </strong>                 
              </td>
            </tr>   
            <tr>
              <td>Community Pool</td> 
              <td>
                {{ millify(store.totalCommunityPool) }} 
                <strong :style="'color:' + cosmosConfig[store.chain].color">
                  {{ cosmosConfig[store.chain].coinLookup.viewDenom }}
                </strong>                 
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
    </v-col>
    <v-col>
      <v-sheet
        border
        rounded="lg"
        min-height="30vh"
      >
        <h3 class="ma-2 pa-2">
          <v-icon
            :color="cosmosConfig[store.chain].color"
            icon="mdi-information-outline"
            class="mr-2"
          />           
          Price history (30 days)
        </h3>
        <trend
          :data="tokenPrice"
          :gradient="cosmosConfig[store.chain].colorChart"
          auto-draw
          smooth
        >
        </trend> 
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import millify from "millify";
import axios from "axios";
import { useAppStore } from '@/stores/app'
import cosmosConfig from '@/cosmos.config'


export default {
    name: 'App', 
    setup() {
      const store = useAppStore()
      return {
        store
      }
    },
    data: () => ({
      cosmosConfig: cosmosConfig,
      millify: millify,
      tokenPrice: []
    }),
    async mounted() {
      const finalPrices = await axios(
        "https://api.coingecko.com/api/v3/coins/chihuahua-token/market_chart?vs_currency=usd&days=30"  
      ); 
      //let tokenPrice = []
      for (let keyPrice in finalPrices.data.prices) {
        this.tokenPrice.push(finalPrices.data.prices[keyPrice][1] * 100)
        console.log(finalPrices.data.prices[keyPrice][1])
      }
      console.log(finalPrices.data.prices);
    }

}
</script>