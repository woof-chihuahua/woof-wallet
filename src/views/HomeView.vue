<template>
  <main>
    <h1 class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center">
      <div class="text-truncate">
        <v-avatar>
          <v-img
            :src="'./src/assets/'+ store.loggedType +'.svg'"
            alt="John"
          ></v-img>
        </v-avatar>
        Woof {{ store.nameWallet }}
      </div> 
    </h1>
    <v-row no-gutters>
      <v-col 
        cols="12"
        sm="4"
      >
        <v-sheet
          border
          min-height="65vh" 
          rounded="lg"
        >
          <Chart />
        </v-sheet>
      </v-col>
      <v-col 
        cols="12"
        sm="8"
      >
        <v-sheet
          border
          min-height="65vh"
          class="ml-4"
          rounded="lg"
        > 
          <v-img                  
            src="./header-card.png" 
            max-height="200"
            cover
            class="bg-grey-lighten-2 rounded-t-lg"
          > 
            <div class="d-flex flex-column fill-height justify-center align-center text-white">
              <h1 class="text-h3 mb-4">
                {{ millify(store.totalTokens,{
                  precision: 2
                }) }} HUAHUA
              </h1>
              <h3>${{ (store.totalTokens * store.tokenPrice).toFixed(4) }} (${{ store.tokenPrice }})</h3>
            </div>
          </v-img>
          <v-list>
            <v-list-item class="ma-4">
              <v-list-item-title><h3>My wallet</h3></v-list-item-title>
              <v-list-item-subtitle> 
                {{ store.addrWallet }} 
              </v-list-item-subtitle>                    
              <template #prepend>
                <v-avatar 
                  color="#EFECF0"
                >
                  <v-icon color="#E6A147">
                    mdi-dog
                  </v-icon>
                </v-avatar> 
              </template>
              <template #append>
                <v-btn 
                  color="grey-lighten-1"
                  icon="mdi-content-copy"
                  variant="text"
                  @click="copyAddr()"
                /> 
              </template>
              <v-snackbar
                v-model="snackbar"
                :timeout="timeout"
              >
                {{ text }}

                <template #actions>
                  <v-btn
                    color="#F0A841"
                    variant="text"
                    @click="snackbar = false"
                  >
                    Close
                  </v-btn>
                </template>
              </v-snackbar>
            </v-list-item>

            <v-list-item class="ma-4">
              <v-list-item-title><h3>Available</h3></v-list-item-title>
              <v-list-item-subtitle> 
                {{ store.spendableBalances }} 
                <strong
                  v-if="store.isLogged"
                  :style="'color:' + cosmosConfig[store.chain].color"
                > {{ cosmosConfig[store.chain].coinLookup.viewDenom }}</strong>
              </v-list-item-subtitle>                    
              <template #prepend>
                <v-avatar 
                  color="#EFECF0"
                >
                  <v-icon color="#E6A147">
                    mdi-send-circle-outline
                  </v-icon>
                </v-avatar> 
              </template>
              <template #append>
                <actionsModals 
                  type="Send Tokens" 
                  color="#efc283"
                  :spendable-balances="store.spendableBalances"
                />
              </template>
            </v-list-item>
 
            <v-list-item class="ma-4">
              <v-list-item-title><h3>Delegated</h3></v-list-item-title>
              <v-list-item-subtitle> 
                {{ store.totalDelegations }} 
                <strong
                  v-if="store.isLogged"
                  :style="'color:' + cosmosConfig[store.chain].color"
                > {{ cosmosConfig[store.chain].coinLookup.viewDenom }}</strong>
              </v-list-item-subtitle>                    
              <template #prepend>
                <v-avatar 
                  color="#EFECF0"
                >
                  <v-icon color="#F0A841">
                    mdi-upload
                  </v-icon>
                </v-avatar> 
              </template>
              <template #append>
                <actionsModals 
                  type="Undel/Redelegate" 
                  color="#F0A841" 
                />
              </template>
            </v-list-item>

            <v-list-item class="ma-4">
              <v-list-item-title><h3>Undelegated</h3></v-list-item-title>
              <v-list-item-subtitle> 
                {{ store.totalUnbound }} 
                <strong
                  v-if="store.isLogged"
                  :style="'color:' + cosmosConfig[store.chain].color"
                > {{ cosmosConfig[store.chain].coinLookup.viewDenom }}</strong>
              </v-list-item-subtitle>                    
              <template #prepend>
                <v-avatar 
                  color="#EFECF0"
                >
                  <v-icon color="#F0A841">
                    mdi-gesture-tap-button
                  </v-icon>
                </v-avatar> 
              </template>
              <template #append>
                <actionsModals 
                  type="View Undelegates" 
                  color="#c67f21" 
                />
              </template>
            </v-list-item>
 
            <v-list-item class="ma-4">
              <v-list-item-title><h3>Reward</h3></v-list-item-title>
              <v-list-item-subtitle> 
                {{ store.totalRewards }} 
                <strong
                  v-if="store.isLogged"
                  :style="'color:' + cosmosConfig[store.chain].color"
                > {{ cosmosConfig[store.chain].coinLookup.viewDenom }}</strong>
              </v-list-item-subtitle>                    
              <template #prepend>
                <v-avatar 
                  color="#EFECF0"
                >
                  <v-icon color="#F0A841">
                    mdi-download
                  </v-icon>
                </v-avatar> 
              </template>
              <template #append>
                <actionsModals 
                  type="Get rewards" 
                  color="#995803"
                  :spendable-balances="store.totalRewards"
                />
              </template>
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-col>
    </v-row> 
  </main>
</template>
<script>
import millify from "millify";
import { useAppStore } from '@/stores/app'
import cosmosConfig from '@/cosmos.config'

import Chart from '@/components/Chart.vue'
import actionsModals from '@/components/actionsModals.vue'

export default {
  name: 'App', 
  components: {
      Chart,
      actionsModals
    },
    setup() {
      const store = useAppStore()
      return {
        store
      }
    },  
    data: () => ({
      cosmosConfig: cosmosConfig,
      millify: millify,
      snackbar: false,
      text: 'Address copied!',
      timeout: 2000,
    }),  
    methods: {
      async copyAddr() {
        await navigator.clipboard.writeText(this.store.addrWallet);
        this.snackbar = true
      }
    }
  }
</script>   