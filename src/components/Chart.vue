<template>
  <DoughnutChart 
    :chart-data="chartData" 
    :options="chartOptions"
    :width="250"
    :height="250" 
    class="mb-8 mt-8"
  />
  <v-table>
    <tbody>
      <tr>
        <td><h3>Available</h3></td>
        <td>
          {{ millify(store.spendableBalances) }}
          <strong
            v-if="store.isLogged"
            :style="'color:' + cosmosConfig[store.chain].color"
          > {{ cosmosConfig[store.chain].coinLookup.viewDenom }}</strong>
        </td>
      </tr>
      <tr>
        <td><h3>Delegated</h3></td>
        <td>
          {{ millify(store.totalDelegations) }}
          <strong
            v-if="store.isLogged"
            :style="'color:' + cosmosConfig[store.chain].color"
          > {{ cosmosConfig[store.chain].coinLookup.viewDenom }}</strong>
        </td> 
      </tr>
      <tr>
        <td><h3>Undelegated</h3></td>
        <td>
          {{ millify(store.totalUnbound) }}
          <strong
            v-if="store.isLogged"
            :style="'color:' + cosmosConfig[store.chain].color"
          > {{ cosmosConfig[store.chain].coinLookup.viewDenom }}</strong>
        </td>
      </tr>
 

      <tr>
        <td><h3>Reward</h3></td>
        <td>
          {{ millify(store.totalRewards) }} 
          <strong
            v-if="store.isLogged"
            :style="'color:' + cosmosConfig[store.chain].color"
          > {{ cosmosConfig[store.chain].coinLookup.viewDenom }}</strong>
        </td>  
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import millify from "millify";
import { useAppStore } from '@/stores/app'
import { defineComponent } from 'vue';
import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import cosmosConfig from '@/cosmos.config'

Chart.register(...registerables);

export default defineComponent({
  name: 'HomeChart',
  components: { DoughnutChart },  
  setup() {
    const store = useAppStore()
    return { store };
  },
  data: () => ({
      cosmosConfig: cosmosConfig,
      millify: millify,
    }),
 
  computed: {
    chartData() { 
      return {
        labels: ["Available", "Delegated", "Undelegated", "Reward"],
        datasets: [
          {
            label: "Data",
            data: [
              this.store.spendableBalances,
              this.store.totalDelegations,
              this.store.totalUnbound,
              this.store.totalRewards,
            ],
            backgroundColor: ["#efc283", "#F0A841", "#c67f21", "#995803"],
          },
        ],
      };
    },   
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      };
    },
  },
});
</script>