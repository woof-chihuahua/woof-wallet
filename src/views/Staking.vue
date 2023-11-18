<template>
  <main> 
    <h1 class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center">
          <div class="text-truncate">
            My stakings
          </div> 
        </h1>
    <div v-if="!store.allMyDelegations.length">No delegation</div>
    <div v-else>
    <v-data-iterator
      :items="store.allMyDelegations"
      item-value="op_address"
      items-per-page="100"
    >
      <template #default="{ items, isExpanded, toggleExpand }">
        <!--  {{ items  }}  -->
        <v-row>
          <v-col
            v-for="item in items"
            :key="item.raw.op_address"
            cols="12"
            sm="12"
            md="6"
          >
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon
                  :color="item.raw.status == 'BOND_STATUS_BONDED' ? 'green' : 'red'"
                  icon="mdi-circle"
                  start
                  size="18"
                />

                <h4>{{ item.raw.validatorName }}</h4>
              </v-card-title>

              <v-card-text>
                {{ item.raw.description }}
              </v-card-text>

              <div class="px-4">
                <v-switch
                  :model-value="isExpanded(item)"
                  :label="`${isExpanded(item) ? 'Hide' : 'Show'} delegation details`"
                  density="compact"
                  inset
                  @click="() => toggleExpand(item)"
                />
              </div>

              <v-divider />

              <v-expand-transition>
                <div v-if="isExpanded(item)">
                  <v-list
                    density="compact"
                    :lines="true"
                  >
                    <v-list-item>                    
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-sheet class="mt-2">
                            Delegations: {{ item.raw.delegated / 1000000 }} {{ cosmosConfig[store.chain].coinLookup.viewDenom }}  
                          </v-sheet>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-sheet v-if="item.raw.delegated > 0">
                            <actionsModals 
                              type="Undelegate" 
                              color="#efc283" 
                              :undelegate-amount="item.raw.delegated / 1000000"
                              :from-validator="item.raw.validatorName"
                              :from-validator-addr="item.raw.op_address"
                            />
                            <actionsModals 
                              type="Redelegate" 
                              color="#efc283" 
                              :undelegate-amount="item.raw.delegated / 1000000"
                              :from-validator="item.raw.validatorName"
                              :from-validator-addr="item.raw.op_address"
                            />
                          </v-sheet>
                        </v-col>
                      </v-row>
                    </v-list-item>
                    <v-list-item>                    
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-sheet class="mt-2">
                            Undelegate: {{ item.raw.unDelegations.amount }} {{ cosmosConfig[store.chain].coinLookup.viewDenom }}  
                          </v-sheet>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <!-- <v-sheet v-if="item.raw.unDelegations.amount > 0">
                            <actionsModals 
                              type="Cancel Undelegate"
                              color="#efc283" 
                            />
                          </v-sheet> -->
                        </v-col>
                      </v-row>
                    </v-list-item>
                    <v-list-item :title="`Redelegate: ${item.raw.reDelegations.amount}  ${cosmosConfig[store.chain].coinLookup.viewDenom}`" /> 
                  </v-list>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
    <!-- {{ store.allMyDelegations }} -->
    </div>
  </main>
</template>
<script>
 
import { useAppStore } from '@/stores/app'
import cosmosConfig from '@/cosmos.config'
import actionsModals from '@/components/actionsModals.vue'

export default {
    name: 'App', 
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
    })
}
</script>