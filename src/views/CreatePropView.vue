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
  ></v-alert>
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
 
  <v-row>
    <v-col
      cols="12"
      sm="6"
    >
  <v-sheet 
    border
    rounded="lg" 
  >
  
    <v-form ref="form">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            sm="12"
          >
            <v-select
              v-model="propType"
              :items="items"
              label="Proposal type"
              required
              variant="outlined"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="propTitle"
              label="Proposal title"
              variant="outlined"
              required
            />
          </v-col>
          <!-- <v-col
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="metadataFile"
              label="Metadata file"
              variant="outlined"
              required
            />
          </v-col> -->
          <v-col
            cols="12"
            sm="12"
          >
            <v-textarea
              v-model="propText"
              variant="outlined"
              name="input-7-4"
              label="Proposal text"
              required
            /> 
          </v-col> 
          <v-col
            cols="12"
            sm="12"
          >
          
          </v-col> 
          
          
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
        
        <span 
          v-for="(i) in textFields"              
          :key="i"
        > 
          <v-row>
            <v-col
              v-if="propType === 'Parameter Change Proposal'"
              cols="12"
            >
              <v-btn
                class="error"
                @click="remove(i)"
              >
                <v-icon large> mdi-delete-forever-outline </v-icon>
              </v-btn>
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
        </span>
        
        <v-btn
          v-if="propType === 'Parameter Change Proposal'"
          @click="add"
        >
          add
        </v-btn>
      </v-container>
    </v-form>
  </v-sheet> 
 </v-col>
 <v-col       cols="12"
      sm="6"> 
  <v-sheet 
    border
    rounded="lg" 
    class="pa-6"
  > 
      <h1 class="mb-2">{{ propTitle }}
        <v-chip v-if="propType">
          {{ propType }}
        </v-chip>
      
      </h1>
      <v-divider v-if="propType || propTitle"></v-divider>
      
      <div v-html="resultMd" class="mt-4" />
 
  </v-sheet> 
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
</script>
<style>
ul,
li {
  margin-left: 40;
  padding-left: 40;
}
</style>
