<template>
  <NuxtLayout>
    <v-app id="inspire">
      <v-app-bar 
        flat
        height="72"
      > 
        <v-avatar
          class="mx-2 mr-4"
          color="surface-variant"
          size="32"
          variant="flat"
          width="100"
        >
          <v-img
            :src="cosmosConfig[store.chain].coinLookup.icon"
            :alt="cosmosConfig[store.chain].name"
          />
        </v-avatar>

        <v-btn
          dark
          class="me-2"
          :color="cosmosConfig[store.chain].color"
          height="40"
          variant="flat"
          width="100"
          to="/"
        >
          Home
        </v-btn>

        <v-btn
          v-if="store.isLogged"
          class="me-2"
          :color="cosmosConfig[store.chain].color"
          height="40"
          variant="flat"  
        >  
          Stakings
          <v-menu activator="parent">
            <v-list>
              <v-list-item to="/all-validators">
                <v-list-item-title>All validators</v-list-item-title>
              </v-list-item>
              <v-list-item to="/staking">
                <v-list-item-title>My delegations</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> 
        </v-btn>

        <v-btn
          v-if="store.isLogged"
          class="me-2"
          :color="cosmosConfig[store.chain].color"
          height="40"
          variant="flat" 
          to="/proposals"
        >
          Proposals
        </v-btn>

        <v-btn
          v-if="store.isLogged"
          class="me-2"
          :color="cosmosConfig[store.chain].color"
          height="40"
          variant="flat" 
          to="/stats"
        >
          Chain stats
        </v-btn>

        <v-spacer />
        <v-btn
          v-if="!store.isLogged"
          class="me-2"
          :color="cosmosConfig[store.chain].color"
          height="40"
          variant="flat"
          width="120"
          @click="connectWallet"
        >
          Keplr
        </v-btn>
        <v-btn
          v-else
          class="me-2"
          :color="cosmosConfig[store.chain].color"
          height="40"
          variant="flat"
          width="120"
          @click="logout"
        >
          logout
        </v-btn>
      </v-app-bar>

      <v-footer
        app 
        height="44"
      >
        <v-row
          justify="center"
          no-gutters
        >
          v.1.0.1
          <v-icon
            color="#E6A147"
            class="ml-4 mr-4"
          >
            mdi-dog
          </v-icon> 
          Beta
        <!-- Woof corporation -->
        </v-row>
      </v-footer>

 

      <v-main>
        <v-img 
          src="https://raw.githubusercontent.com/BitCannaGlobal/cosmospay-woocommerce/main/public/img/Chihuahua.png" 
          max-height="200"
          cover
          class="bg-grey-lighten-2"
        >
          <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h3 mb-4">
              Woof Wallet
            </h1>
          </div>
        </v-img>
        <v-container class="mt-4">
          <v-row>
            <v-col
              cols="12"
              md="1"
            />

            <v-col
              v-if="store.isLogged"
              cols="12"
              md="10"
            >
              <router-view />
            </v-col>
            <v-col v-else>
              not loged
            </v-col>
            <v-col
              cols="12"
              md="1"
            />
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </NuxtLayout>
</template>
<script>


import { useAppStore } from '@/stores/app'
import cosmosConfig from '@/cosmos.config'
import { useRouter } from 'vue-router'




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
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ], 
    }),
    mounted() {
      if(!this.store.isLogged) {       
        const router = useRouter()
        router.push({ name: 'home' }) 
      }
      window.addEventListener("keplr_keystorechange", async () => {
        await this.store.keplrConnect()
        await this.store.initRpc()
        await this.store.getPrice()
        await this.store.getBankModule() 
        await this.store.getStakingModule()
        await this.store.getDistribModule()
        await this.store.getWalletAmount()
        await this.store.getFeeGrantModule()
        await this.store.getDelegations()
        await this.store.getGovModule()
        await this.store.getAllValidators()
 
      })
      setInterval(async ()=> {
        await this.store.getDistribModule()
        await this.store.getWalletAmount()
      },10000)
    },
    methods: {
      async connectWallet() { 
        await this.store.keplrConnect()
        await this.store.initRpc()
        await this.store.getPrice()
        await this.store.getBankModule() 
        await this.store.getStakingModule()
        await this.store.getDistribModule()
        await this.store.getWalletAmount()
        await this.store.getFeeGrantModule()
        await this.store.getDelegations()
        await this.store.getGovModule()
        await this.store.getAllValidators()
 

        await this.store.setLoaded()
  
      },
      async logout() { 
        await this.store.logout()      
      }
    }
}
</script>
<style>

.outline-border {
  border-top: 0px solid;

}

.outline-border:after {
  display:block;
  content: '';
  height:3px;
  background:#F0A841;
  transform: scaleX(0.0001);
  transition: transform 250ms ease-in-out;
  box-shadow: inset -40px 0px 30px -25px #e6d7c3, inset 40px 0px 30px -25px #e6d7c3;
}
.outline-border:hover:after {
  transform: scaleX(1);
}

</style>