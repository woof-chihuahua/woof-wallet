<template>
  <h1 class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center">
    <div class="text-truncate">
      All validators
    </div>
  </h1> 
  <v-card>
    <v-data-iterator
      :items="store.allValidators"
      :items-per-page="18"
      :search="search"
    >
      <template #header>
        <v-toolbar
          :color="cosmosConfig[store.chain].color"
          class="px-2"
        >
          <v-text-field
            v-model="search"
            clearable
            density="comfortable"
            hide-details
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            style="max-width: 300px;"
            variant="solo"
          />
        </v-toolbar>
      </template>

      <template #default="{ items }">
        <v-container
          class="pa-2 mt-4"
          fluid
        >
          <v-row dense>
            <v-col
              v-for="item in items"
              :key="item.raw.description.moniker"
              cols="auto"
              md="4"
            >
              <v-card
                class="pb-3"
                border
                flat
              >
                <v-img 
                  :src="'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/chihuahua/moniker/'+item.raw.operator_address+'.png'"
                  max-height="100"
                  cover
                  lazy-src="https://raw.githubusercontent.com/BitCannaGlobal/cosmospay-woocommerce/main/public/img/Chihuahua.png"
                />

                <v-list-item :subtitle="item.raw.operator_address">
                  <template #title>
                    <strong class="text-h6 mb-2"> 
                      <v-icon
                        :color="item.raw.status == 'BOND_STATUS_BONDED' ? 'green' : 'red'"
                        icon="mdi-circle"
                        start
                        size="18"
                      />
                      {{ item.raw.description.moniker }}</strong> 
                  </template>
                </v-list-item>
                <v-table>
                  <tbody>
                    <tr>
                      <td>Keybase</td>
                      <td>{{ item.raw.description.identity }}</td>
                    </tr>
                    <tr>
                      <td>Website</td>
                      <td>{{ item.raw.description.website }}</td>
                    </tr>
                  </tbody>
                </v-table>
                <div class="d-flex justify-space-between px-4">
                  <div class="d-flex align-center text-caption text-medium-emphasis me-1" />


                  <actionsModals 
                    type="Delegate" 
                    color="#995803"
                    :spendable-balances="store.spendableBalances"
                    :toValidatorName="item.raw.description.moniker"
                    :toValidatorAddress="item.raw.operator_address"
                  />
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template #footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-4">
          <v-btn
            :disabled="page === 1"
            icon="mdi-arrow-left"
            density="comfortable"
            variant="tonal"
            rounded
            @click="prevPage"
          />

          <div class="mx-2 text-caption">
            Page {{ page }} of {{ pageCount }}
          </div>

          <v-btn
            :disabled="page >= pageCount"
            icon="mdi-arrow-right"
            density="comfortable"
            variant="tonal"
            rounded
            @click="nextPage"
          />
        </div>
      </template>
    </v-data-iterator>
    <!--  {{ store.allValidators }} -->
  </v-card>
</template>

<script>
import { useAppStore } from '@/stores/app'
import actionsModals from '@/components/actionsModals.vue'
import cosmosConfig from '@/cosmos.config'

  export default {
    name: 'AllValidatorsView',
    components: {
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
      search: '',
      games: [
        {
          img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/4.png',
          title: 'The Sci-Fi Shooter Experience',
          subtitle: 'Dive into a futuristic world of intense battles and alien encounters.',
          advanced: false,
          duration: '8 minutes',
        },
        {
          img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/2.png',
          title: 'Epic Adventures in Open Worlds',
          subtitle: 'Embark on a journey through vast, immersive landscapes and quests.',
          advanced: true,
          duration: '10 minutes',
        },
        {
          img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/3.png',
          title: 'Surviving the Space Station Horror',
          subtitle: 'Navigate a haunted space station in this chilling survival horror game.',
          advanced: false,
          duration: '9 minutes',
        },
        {
          img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/5.png',
          title: 'Neon-Lit High-Speed Racing Thrills',
          subtitle: 'Experience adrenaline-pumping races in a futuristic, neon-soaked city.',
          advanced: true,
          duration: '12 minutes',
        },
        {
          img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/6.png',
          title: 'Retro-Style Platformer Adventures',
          subtitle: 'Jump and dash through pixelated worlds in this classic-style platformer.',
          advanced: false,
          duration: '11 minutes',
        },
        {
          img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/7.png',
          title: 'Medieval Strategic War Campaigns',
          subtitle: 'Lead armies into epic battles and conquer kingdoms in this strategic game.',
          advanced: true,
          duration: '10 minutes',
        },
        {
          img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/1.png',
          title: 'Underwater VR Exploration Adventure',
          subtitle: 'Dive deep into the ocean and discover the mysteries of the underwater world.',
          advanced: true,
          duration: '11 minutes',
        },
        {
          img: 'https://cdn.vuetifyjs.com/docs/images/graphics/games/8.png',
          title: '1920s Mystery Detective Chronicles',
          subtitle: 'Solve crimes and uncover secrets in the glamourous 1920s era.',
          advanced: false,
          duration: '9 minutes',
        },
      ],
    }),
  }
</script>
