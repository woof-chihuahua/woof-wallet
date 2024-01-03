<template>
  <h1 class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center">
    <div class="text-truncate">
      Create proposal
      <v-chip
        class="ma-2"
        label
      >
        Alpha
      </v-chip>
    </div>
  </h1>   
  <v-alert
    type="info"
    title="Information"
    text="This page is under development! no action is possible"
    variant="tonal"
    class="mb-2"
  />
  <!--   <v-row no-gutters>
      <v-col>
        <v-sheet class="pa-2 ma-2">
          .v-col-auto
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet class="pa-2 ma-2">
          .v-col-auto
        </v-sheet>
      </v-col>
    </v-row> -->
    <v-row no-gutters>
            <v-col
              cols="12"
              sm="12"
              md="12"
            >
              <v-text-field
                v-model="initDeposit"
                variant="outlined"
                :label="'Initial Deposit (' + cosmosConfig[store.chain].coinLookup.viewDenom + ')'"
                required
              />
            </v-col>

            <v-col
              v-if="propType === 'Community Pool Spend Proposal'"
              cols="12"
              sm="6"
              md="6"
            >
              <v-text-field
                v-model="amountSpend"
                variant="outlined"
                label="Amount spend"
                required
              />
            </v-col>
            <v-col
              v-if="propType === 'Community Pool Spend Proposal'"
              cols="12"
              sm="6"
              md="6"
            >
              <v-text-field
                v-model="receivingAddress"
                variant="outlined"
                label="Receiving address"
                required
              />
            </v-col> 
            <v-col
              v-if="propType === 'Software Upgrade Proposal'"
              cols="12"
              sm="6"
              md="6"
            >
              <v-text-field
                v-model="upgradeName"
                variant="outlined"
                label="Upgrade Name"
                required
              />
            </v-col>
            <v-col
              v-if="propType === 'Software Upgrade Proposal'"
              cols="12"
              sm="6"
              md="6"
            >
              <v-text-field
                v-model="upgradeHeight"
                variant="outlined"
                label="Upgrade Height"
                required
              />
            </v-col>
            <v-col
              v-if="propType === 'Software Upgrade Proposal'"
              cols="12"
              sm="12"
              md="12"
            >
              <v-text-field
                v-model="upgradeInfo"
                variant="outlined"
                label="Upgrade Info"
                required
              />
            </v-col>

            <v-col
              v-if="propType === 'Parameter Change Proposal'"
              cols="12"
              sm="4"
              md="4"
            >
              <v-text-field
                v-model="amountSpend"
                variant="outlined"
                label="Subspace"
                required
              />
            </v-col>
            <v-col
              v-if="propType === 'Parameter Change Proposal'"
              cols="12"
              sm="4"
              md="4"
            >
              <v-text-field
                v-model="receivingAddress"
                variant="outlined"
                label="Key"
                required
              />
            </v-col>
            <v-col
              v-if="propType === 'Parameter Change Proposal'"
              cols="12"
              sm="4"
              md="4"
            >
              <v-text-field
                v-model="receivingAddress"
                variant="outlined"
                label="Value"
                required
              />
            </v-col>
          </v-row>
</template>
<script>
import { useAppStore } from '@/stores/app'
import cosmosConfig from '@/cosmos.config'

import MarkdownIt from "markdown-it";
import axios from "axios";

 

  export default {
    setup() {
      const store = useAppStore()
      return {
        store
      }
    },
    components: {

    },
    data: () => ({
      cosmosConfig: cosmosConfig,
      markdown: MarkdownIt(),
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      select: null,
      items: [
        "Text Proposal",
        "Community Pool Spend Proposal",
        //'Community Pool Spend Proposal With Deposit',
        "Software Upgrade Proposal",
        "Parameter Change Proposal",
      ],
      checkbox: false,
      // Form
      propType: "",
      metadataFile: "",
      propText: "",
      propTitle: "",
      proposer: "",
      amountSpend: "",
      receivingAddress: "",
      initDeposit: "10000000",
      isSend: false,
      // Upgrade part
      upgradeName: "",
      upgradeHeight: "",
      upgradeInfo: "",
      textFields: [],
      resultMd: "",
    }),
    watch: {
      propText(value) {
        if (value) {
          this.resultMd = this.markdown.render(this.propText);
        }
      },
      async metadataFile(value) {
        if (value) {
          const getPropsData = await axios(
            value
          );
          console.log(getPropsData.data)
          // this.resultMd = this.markdown.render(this.metadataFile);
        }
      },
    }, 
    methods: {
      async validate () {
        const { valid } = await this.$refs.form.validate()

        if (valid) alert('Form is valid')
      },
      add() {
        this.textFields.push({
          label1: "Subspace",
          value1: "",
          label2: "key",
          value2: "",
        });
      },

      remove(index) {
        this.textFields.splice(index, 1);
      },    
    },
  }

