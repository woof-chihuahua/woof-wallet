<template>
  <main>
    <v-data-iterator
      :items="store.allProposals"
      :items-per-page="8"
    >
      <template #header="{ page, pageCount, prevPage, nextPage }">
        <h1 class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center">
          <div class="text-truncate">
            Last proposals
          </div>

          <div class="d-flex align-center">
            <div class="d-inline-flex">
              <v-btn
                :disabled="page === 1"
                icon="mdi-arrow-left"
                size="small"
                variant="tonal"
                class="me-2"
                @click="prevPage"
              />

              <v-btn
                :disabled="page === pageCount"
                icon="mdi-arrow-right"
                size="small"
                variant="tonal"
                @click="nextPage"
              />
            </div>
          </div>
        </h1>
      </template>

      <template #default="{ items }">
        <v-row>
          <v-col
            v-for="(item, i) in items"
            :key="i"
            cols="12"
            sm="6"
            xl="3"
          > 
            <v-sheet
              border
              rounded="lg"
            >
              <v-img
                :gradient="`to top right, rgba(255, 255, 255, .1), rgba(${item.raw.color}, .15)`"
                src="https://i.imgur.com/r4ih8mG.png"
                cover
                height="150"
                class="rounded-t-lg"
              />
            

              <v-list-item
                :title="item.raw.title"
                lines="two"
                density="comfortable"
              >
                <template #title>
                  <strong class="text-h6">
                    #{{ item.raw.id }} {{ item.raw.title }}
                  </strong>
                </template>
              </v-list-item>
              <v-chip
                v-if="item.raw.status == 1"
                class="ma-2"
                label
                color="white"
              >
                💰 Deposit Period
              </v-chip>
              <v-chip
                v-if="item.raw.status == 2"
                class="ma-2"
                label
                color="orange"
              >
                👀 Voting Period
              </v-chip>
 
              <actionsModals 
                v-if="item.raw.status == 2"
                type="Vote" 
                color="#efc283"  
                :prop-id="item.raw.id"
              />
              <v-chip
                v-if="item.raw.status == 3"
                color="green"
                class="ma-2"
                label
              >
                ✅ Passed
              </v-chip>
              <v-chip
                v-if="item.raw.status == 4"
                color="red"
                class="ma-2"
                label
              >
                REJECTED
              </v-chip>             
              <v-table
                density="compact"
                class="text-caption"
              > 
                <tbody>
                  <tr align="right">
                    <th>Date: </th>
                    <td>{{ moment(item.raw.submitTime.seconds, 'X').format("MMMM Do YYYY, h:mm:ss") }} </td> 
                  </tr>

                  <tr align="right">
                    <th>Yes votes:</th>

                    <td> 
                      <span
                        v-if="
                          item.raw.finalTallyResult.yesCount > 0 ||
                            item.raw.finalTallyResult.noCount > 0 ||
                            item.raw.finalTallyResult.abstainCount > 0 ||
                            item.raw.finalTallyResult.noWithVetoCount > 0
                        "
                      >
                        {{
                          (
                            (Number(item.raw.finalTallyResult.yesCount) * 100) /
                            (Number(item.raw.finalTallyResult.yesCount) +
                              Number(item.raw.finalTallyResult.noCount) +
                              Number(item.raw.finalTallyResult.abstainCount) +
                              Number(item.raw.finalTallyResult.noWithVetoCount))
                          ).toFixed(2)
                        }}
                        % 
                      </span>
                      <span v-else>0%</span>
                    </td>
                  </tr>

                  <tr align="right">
                    <th>Abstain votes:</th>

                    <td>
                      <span
                        v-if="
                          item.raw.finalTallyResult.yesCount > 0 ||
                            item.raw.finalTallyResult.no_count > 0 ||
                            item.raw.finalTallyResult.abstainCount > 0 ||
                            item.raw.finalTallyResult.noWithVetoCount > 0
                        "
                      >
                        {{
                          (
                            (Number(item.raw.finalTallyResult.abstainCount) * 100) /
                            (Number(item.raw.finalTallyResult.yesCount) +
                              Number(item.raw.finalTallyResult.noCount) +
                              Number(item.raw.finalTallyResult.abstainCount) +
                              Number(item.raw.finalTallyResult.noWithVetoCount))
                          ).toFixed(2)
                        }}
                        %  
                      </span>
                      <span
                        v-else  
                      >0%</span> 
                    </td>
                  </tr>

                  <tr align="right">
                    <th>No votes:</th>

                    <td>
                      <span
                        v-if="
                          item.raw.finalTallyResult.yesCount > 0 ||
                            item.raw.finalTallyResult.noCount > 0 ||
                            item.raw.finalTallyResult.abstainCount > 0 ||
                            item.raw.finalTallyResult.noWithVetoCount > 0
                        "
                      >
                        {{
                          (
                            (Number(item.raw.finalTallyResult.noCount) * 100) /
                            (Number(item.raw.finalTallyResult.yesCount) +
                              Number(item.raw.finalTallyResult.noCount) +
                              Number(item.raw.finalTallyResult.abstainCount) +
                              Number(item.raw.finalTallyResult.noWithVetoCount))
                          ).toFixed(2)
                        }}
                        %  
                      </span>
                      <span
                        v-else  
                      >0%</span>                    
                    </td>
                  </tr>

                  <tr align="right">
                    <th>NoWithVeto:</th>

                    <td>
                      <span
                        v-if="
                          item.raw.finalTallyResult.yesCount > 0 ||
                            item.raw.finalTallyResult.noCount > 0 ||
                            item.raw.finalTallyResult.abstainCount > 0 ||
                            item.raw.finalTallyResult.noWithVetoCount > 0
                        "
                      >
                        {{
                          (
                            (Number(item.raw.finalTallyResult.noWithVetoCount) * 100) /
                            (Number(item.raw.finalTallyResult.yesCount) +
                              Number(item.raw.finalTallyResult.noCount) +
                              Number(item.raw.finalTallyResult.abstainCount) +
                              Number(item.raw.finalTallyResult.noWithVetoCount))
                          ).toFixed(2)
                        }}
                        %  
                      </span>
                      <span
                        v-else  
                      >0%</span>                    
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </v-col>
        </v-row>
      </template>

      <!--  <template v-slot:footer="{ page, pageCount }">
      <v-footer
        color="surface-variant"
        class="justify-space-between text-body-2 mt-4"
      >
        Total proposals: {{ store.allProposals.length }}

        <div>
          Page {{ page }} of {{ pageCount }}
        </div>
      </v-footer>
    </template> -->
    </v-data-iterator>
    <!-- {{ store.allProposals }} -->
  </main>
</template>
<script> 
import dayjs from "dayjs"
import moment from "moment";
import { useAppStore } from '@/stores/app'
import cosmosConfig from '@/cosmos.config' 
import actionsModals from '@/components/actionsModals.vue'

export default {
    name: 'ProposalsView', 
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
      dayjs: dayjs,
      moment: moment
    }),
}
</script>