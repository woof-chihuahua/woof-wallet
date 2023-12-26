<template>
 
  <v-data-iterator
    :items="userTokens"
    :items-per-page="itemsPerPage"
  >
    <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
      <h1 class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center">
        <div class="text-truncate">
          Token Factory
        </div>

        <div class="d-flex align-center">
          <v-btn
            class="me-8"
            variant="text"
            @click="onClickSeeAll"
          >
            <span class="text-decoration-underline text-none">See all</span>
          </v-btn>

          <div class="d-inline-flex">
            <v-btn
              :disabled="page === 1"
              icon="mdi-arrow-left"
              size="small"
              variant="tonal"
              class="me-2"
              @click="prevPage"
            ></v-btn>

            <v-btn
              :disabled="page === pageCount"
              icon="mdi-arrow-right"
              size="small"
              variant="tonal"
              @click="nextPage"
            ></v-btn>
          </div>
        </div>
      </h1>
    </template>

    <template v-slot:default="{ items }">
      <v-row>
        <v-col
          v-for="(item, i) in items"
          :key="i"
          cols="12"
          sm="6"
          xl="3"
        >
          <v-sheet border rounded="lg">
            <!-- <v-img
              :gradient="`to top right, rgba(255, 255, 255, .1), rgba(${item.raw.color}, .15)`"
              :src="item.raw.src"
              cover
              height="150"
            ></v-img> -->

            <v-list-item
              :title="item.raw.symbol"
              lines="two"
              density="comfortable"
              :subtitle="item.raw.description"
            >
              <template v-slot:title>
                <strong class="text-h6">
                  {{ item.raw.symbol }}
                </strong>
              </template>
            </v-list-item>

            <v-table density="compact" class="text-caption">
              <tbody>
                <tr align="right">
                  <th>Supply:</th>

                  <td>{{ item.raw.dpi }}</td>
                </tr>

                <tr align="right">
                  <th>Your tokens:</th>

                  <td>{{ item.raw.buttons }}</td>
                </tr>

                <tr align="right">
                  <th>Weight:</th>

                  <td>{{ item.raw.weight }}</td>
                </tr>
 
              </tbody>
            </v-table>
          </v-sheet>
        </v-col>
      </v-row>
    </template>

    <template v-slot:footer="{ page, pageCount }">
      <v-footer
        color="surface-variant"
        class="justify-space-between text-body-2 mt-4"
      >
        Total mice: {{ mice.length }}

        <div>
          Page {{ page }} of {{ pageCount }}
        </div>
      </v-footer>
    </template>
  </v-data-iterator>
</template>
 
<script>
  import axios from "axios";
  import { useAppStore } from '@/stores/app'

  export default {
    data () {
      return {
        itemsPerPage: 4,
        userTokens: [],
      }
    },
    setup() {
      const store = useAppStore()
      return {
        store
      }
    }, 
    async mounted () { 
      const getAllTokens = await axios(
        "https://api.chihuahua.wtf/cosmos/bank/v1beta1/denoms_metadata"  
      );       
      const getUserTokens = await axios(
        "https://api.chihuahua.wtf/osmosis/tokenfactory/v1beta1/denoms_from_creator/" + this.store.addrWallet  
      );
      //console.log(getAllTokens.data.metadatas); 
      //console.log(getUserTokens.data); 

      // Join getAllTokens and getUserTokens
      const allTokens = await getAllTokens.data.metadatas.map(async (item) => {
        const userToken = getUserTokens.data.denoms.find(
          (userToken) => userToken.denom === item.base.denom
        );
        return {
          ...item,
          userToken,
        };
      });
        // Create for from userToken to get the supply
        for (const [key, value] of Object.entries(allTokens)) {
          let detailToken = await value
          //console.log(detailToken.base);
          let denom = await value.base;
 
            const getSupply = await axios(
              "https://api.chihuahua.wtf/cosmos/bank/v1beta1/supply/by_denom?denom=" +
              detailToken.base
            );
            // userToken.supply = await getSupply.data.amount;
            //console.log(getSupply.data.amount);
            console.log(await getSupply);
        }      
      console.log(allTokens);
      this.userTokens = allTokens;

    },
    methods: {
      onClickSeeAll () {
        this.itemsPerPage = this.itemsPerPage === 4 ? this.mice.length : 4
      },
    },
  }
</script>