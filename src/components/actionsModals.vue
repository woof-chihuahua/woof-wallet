<template>
  <v-btn
    v-if="typeAction === 'Send Tokens'" 
    :color="colorProp" 
    variant="text"
    @click="openSendTokens"
  >
    {{ typeAction }}
  </v-btn> 
  <v-btn
    v-if="typeAction === 'Undel/Redelegate'" 
    :color="colorProp" 
    variant="text"
    to="/staking"
  >
    {{ typeAction }}
  </v-btn> 
  <v-btn
    v-if="typeAction === 'View Undelegates'" 
    :color="colorProp" 
    variant="text"
    to="/staking"
  >
    {{ typeAction }}
  </v-btn> 
  <v-btn
    v-if="typeAction === 'Get rewards'" 
    :color="colorProp" 
    variant="text"
    @click="openGetReward"
  >
    {{ typeAction }}
  </v-btn> 
  <v-btn
    v-if="typeAction === 'Undelegate'" 
    :color="colorProp" 
    variant="text"
    @click="openUndel"
  >
    {{ typeAction }}
  </v-btn> 
  <v-btn
    v-if="typeAction === 'Redelegate'" 
    :color="colorProp" 
    variant="text"
    @click="openRedel"
  >
    {{ typeAction }}
  </v-btn> 
  <v-btn
    v-if="typeAction === 'Cancel Undelegate'" 
    :color="colorProp" 
    variant="text"
  >
    {{ typeAction }}
  </v-btn> 
  <v-chip
    v-if="typeAction === 'Vote'" 
    class="ma-2"
    label
    color="orange"
    @click="openVote"
  >
    {{ typeAction }}
  </v-chip>
 

  <v-dialog
    v-model="dialog" 
    transition="dialog-bottom-transition"
    width="600"
  >
    <v-card>
      <v-toolbar
        :color="cosmosConfig[store.chain].color"
        theme="dark"
        class="mb-6"
      >
        <template #prepend>
          <v-avatar>
            <v-img
              max-width="32"
              max-height="32"
              :src="cosmosConfig[store.chain].coinLookup.icon"
              alt="John"
            />
          </v-avatar>
        </template>

        <v-toolbar-title class="text-h6">
          Send tokens
        </v-toolbar-title>

        <template #append>
          <v-btn
            icon="mdi-close"
            @click="dialog = false"
          />
        </template>
      </v-toolbar>


      <v-card-text>
        <v-form
          v-if="step1"
          ref="formSend"
          v-model="formSend"
        >
          <v-text-field
            v-model="sendAmount"
            :rules="[rules.required, rules.checkAmount]"
            class="mb-2"
            label="Amount to send"
            placeholder="Enter amount"
            variant="outlined"
          >
            <template #append-inner>
              <v-chip
                label
                small
                @click="getMax"
              >
                Max
              </v-chip>
            </template>
          </v-text-field>

          <v-text-field
            v-model="sendTo"
            :rules="[rules.required, rules.bech32, rules.bech32Prefix]"
            label="Address to send"
            placeholder="Enter address"
            variant="outlined"
          >
            <template #append-inner>
              <v-chip
                label
                small
                @click="setAddress"
              >
                Me
              </v-chip>
            </template>
          </v-text-field> 
        </v-form>
        <div v-if="step2">
          <v-row>
            <v-col>
              <v-sheet
                class="pa-2"
                border
              >
                <v-row>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      Fee
                    </v-sheet>
                  </v-col>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      ≈ {{ gasFee.fee / 2 }} 
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
            <v-col>
              <v-sheet
                class="pa-2"
                border
              >
                <v-row>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      Gas
                    </v-sheet>
                  </v-col>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      {{ gasFee.gas }}
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>
          <FeePayer v-if="store.myFeeAllowances.length > 0" />
        </div>
        <div
          v-if="step3"
          class="ma-8 text-center"
        >
          <v-progress-circular
            :size="100"
            :width="5"
            :color="cosmosConfig[store.chain].color"
            indeterminate
            justify="center"
          />
        </div>
        <div
          v-if="step4"
          class="ma-8 text-center"
        >
          <v-icon
            size="150"
            color="green darken-2"
          >
            mdi-check-circle-outline
          </v-icon>
          <br><br>
          {{ txResult.transactionHash }}
        </div>
      </v-card-text>
      <v-btn
        v-if="step1"
        class="text-none ml-6 mr-6 mb-4"
        :disabled="!formSend"
        :color="cosmosConfig[store.chain].color"
        size="large"
        @click="calculateSendFee()"
      >
        Check fee
      </v-btn>
      <v-btn
        v-if="step2"
        class="text-none ml-6 mr-6 mb-4 mt-6"
        :disabled="!formSend"
        :color="cosmosConfig[store.chain].color"
        size="large"
        @click="sendNow()"
      >
        Send now
      </v-btn> 
    </v-card> 
  </v-dialog>
  <v-dialog
    v-model="dialogUnRedel" 
    transition="dialog-bottom-transition"
    width="600"
  >
    <v-card>
      <v-toolbar
        :color="cosmosConfig[store.chain].color"
        theme="dark"
        class="mb-6"
      >
        <template #prepend>
          <v-avatar>
            <v-img
              max-width="32"
              max-height="32"
              :src="cosmosConfig[store.chain].coinLookup.icon"
              alt="John"
            />
          </v-avatar>
        </template>

        <v-toolbar-title class="text-h6">
          Undelegate from {{ fromValidator }}
        </v-toolbar-title>

        

        <template #append>
          <v-btn
            icon="mdi-close"
            @click="dialogUnRedel = false"
          />
        </template>
      </v-toolbar>
      <v-card-text>
        <v-form
          v-if="step1"
          ref="formSend"
          v-model="formSend"
        >
          <v-text-field
            v-model="undelegateAmountFinal"
            :rules="[rules.required, rules.checkAmountUndel]"
            class="mb-2"
            label="Amount to undelegate"
            placeholder="Enter amount"
            variant="outlined"
          >
            <template #append-inner>
              <v-chip
                label
                small
                @click="getMax"
              >
                Max
              </v-chip>
            </template>
          </v-text-field>
        </v-form>
        <div v-if="step2">
          <v-row>
            <v-col>
              <v-sheet
                class="pa-2"
                border
              >
                <v-row>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      Fee
                    </v-sheet>
                  </v-col>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      ≈ {{ gasFee.fee / 2 }}
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
            <v-col>
              <v-sheet
                class="pa-2"
                border
              >
                <v-row>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      Gas
                    </v-sheet>
                  </v-col>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      {{ gasFee.gas }}
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>
          <FeePayer v-if="store.myFeeAllowances.length > 0" />
        </div>
        <div
          v-if="step3"
          class="ma-8 text-center"
        >
          <v-progress-circular
            :size="100"
            :width="5"
            :color="cosmosConfig[store.chain].color"
            indeterminate
            justify="center"
          />
        </div>
        <div
          v-if="step4"
          class="ma-8 text-center"
        >
          <v-icon
            size="150"
            color="green darken-2"
          >
            mdi-check-circle-outline
          </v-icon>
          <br><br>
          {{ txResult.transactionHash }}
        </div>
      </v-card-text>
      <v-btn
        v-if="step1"
        class="text-none ml-6 mr-6 mb-4"
        :disabled="!formSend"
        :color="cosmosConfig[store.chain].color"
        size="large"
        @click="calculateUndelFee()"
      >
        Check fee
      </v-btn>
      <v-btn
        v-if="step2"
        class="text-none ml-6 mr-6 mb-4 mt-6"
        :disabled="!formSend"
        :color="cosmosConfig[store.chain].color"
        size="large"
        @click="UndelNow()"
      >
        Undelegate now
      </v-btn>
    </v-card>
  </v-dialog>   
  <v-dialog
    v-model="dialogRedel" 
    transition="dialog-bottom-transition"
    width="600"
  >
    <v-card>
      <v-toolbar
        :color="cosmosConfig[store.chain].color"
        theme="dark"
        class="mb-6"
      >
        <template #prepend>
          <v-avatar>
            <v-img
              max-width="32"
              max-height="32"
              :src="cosmosConfig[store.chain].coinLookup.icon"
              alt="John"
            />
          </v-avatar>
        </template>

        <v-toolbar-title class="text-h6">
          Redelegate from {{ fromValidator }}
        </v-toolbar-title>

        

        <template #append>
          <v-btn
            icon="mdi-close"
            @click="dialogRedel = false"
          />
        </template>
      </v-toolbar>
      <v-card-text>
        <v-form
          v-if="step1"
          ref="formSend"
          v-model="formSend"
        >
          <v-text-field
            v-model="undelegateAmountFinal"
            :rules="[rules.required, rules.checkAmountUndel]"
            class="mb-2"
            label="Amount to undelegate"
            placeholder="Enter amount"
            variant="outlined"
          >
            <template #append-inner>
              <v-chip
                label
                small
                @click="getMax"
              >
                Max
              </v-chip>
            </template>
          </v-text-field>
          <v-select
            v-model="addressTo"
            :rules="addressToRules"
            item-title="name"
            item-value="address"
            :items="validatorListSearch" 
            required
            variant="outlined" 
          >
            <template #prepend-item>
              <v-list-item>
                <v-list-item-content>
                  <v-text-field
                    v-model="searchTerm" 
                    placeholder="Search validator"
                    variant="outlined"
                    @input="searchVal"
                  />
                </v-list-item-content>
              </v-list-item>
              <v-divider class="mt-2" />
            </template> 
          </v-select>
        </v-form>
        <div v-if="step2">
          <v-row>
            <v-col>
              <v-sheet
                class="pa-2"
                border
              >
                <v-row>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      Fee
                    </v-sheet>
                  </v-col>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      ≈ {{ gasFee.fee / 2 }}
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
            <v-col>
              <v-sheet
                class="pa-2"
                border
              >
                <v-row>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      Gas
                    </v-sheet>
                  </v-col>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      {{ gasFee.gas }}
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>
          <FeePayer v-if="store.myFeeAllowances.length > 0" />
        </div>
        <div
          v-if="step3"
          class="ma-8 text-center"
        >
          <v-progress-circular
            :size="100"
            :width="5"
            :color="cosmosConfig[store.chain].color"
            indeterminate
            justify="center"
          />
        </div>
        <div
          v-if="step4"
          class="ma-8 text-center"
        >
          <v-icon
            size="150"
            color="green darken-2"
          >
            mdi-check-circle-outline
          </v-icon>
          <br><br>
          {{ txResult.transactionHash }}
        </div>
      </v-card-text>
      <v-btn
        v-if="step1"
        class="text-none ml-6 mr-6 mb-4"
        :disabled="!formSend"
        :color="cosmosConfig[store.chain].color"
        size="large"
        @click="calculateRedelFee()"
      >
        Check fee
      </v-btn>
      <v-btn
        v-if="step2"
        class="text-none ml-6 mr-6 mb-4 mt-6"
        :disabled="!formSend"
        :color="cosmosConfig[store.chain].color"
        size="large"
        @click="RedelNow()"
      >
        Redelegate now
      </v-btn>
    </v-card>
  </v-dialog>    
  <v-dialog
    v-model="dialogVote" 
    transition="dialog-bottom-transition"
    width="600"
  >
    <v-card>
      <v-toolbar
        :color="cosmosConfig[store.chain].color"
        theme="dark"
        class="mb-6"
      >
        <template #prepend>
          <v-avatar>
            <v-img
              max-width="32"
              max-height="32"
              :src="cosmosConfig[store.chain].coinLookup.icon" 
            />
          </v-avatar>
        </template>

        <v-toolbar-title class="text-h6">
          Vote on proposal #{{ propId }}
        </v-toolbar-title>        

        <template #append>
          <v-btn
            icon="mdi-close"
            @click="dialogVote = false"
          />
        </template>
      </v-toolbar>
      <v-card-text>
        <v-form
          v-if="step1"
          ref="formSend"
          v-model="formSend"
        >
          <v-item-group
            v-model="voteFinal"
            selected-class="bg-primary"
          >
            <v-container>
              <v-row> 
                <v-col                
                  v-for="n in votes"
                  :key="n"
                  cols="12"
                  md="6"
                > 
                  <v-item v-slot="{ toggle }"> 
                    <v-card
                      class="d-flex align-center"
                      :color="voteFinal === n.text ? 'primary' : ''"
                      dark
                      height="100"
                      @click="toggle"
                    >
                      <div
                        class="text-h3 flex-grow-1 text-center"
                      >
                        {{ n.text }}
                      </div>
                    </v-card>
                  </v-item>
                </v-col>
              </v-row>
            </v-container>
          </v-item-group>
          <v-text-field
            v-model="voteReason" 
            class="ma-4"
            label="Reason of your vote" 
            variant="outlined"
          />
        </v-form>
        <div v-if="step2">
          <v-row>
            <v-col>
              <v-sheet
                class="pa-2"
                border
              >
                <v-row>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      Fee
                    </v-sheet>
                  </v-col>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      ≈ {{ gasFee.fee / 2 }}
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
            <v-col>
              <v-sheet
                class="pa-2"
                border
              >
                <v-row>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      Gas
                    </v-sheet>
                  </v-col>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      {{ gasFee.gas }}
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>
          <FeePayer v-if="store.myFeeAllowances.length > 0" />
        </div>
        <div
          v-if="step3"
          class="ma-8 text-center"
        >
          <v-progress-circular
            :size="100"
            :width="5"
            :color="cosmosConfig[store.chain].color"
            indeterminate
            justify="center"
          />
        </div>
        <div
          v-if="step4"
          class="ma-8 text-center"
        >
          <v-icon
            size="150"
            color="green darken-2"
          >
            mdi-check-circle-outline
          </v-icon>
          <br><br>
          {{ txResult.transactionHash }}
        </div>
      </v-card-text>
      <v-btn
        v-if="step1"
        class="text-none ml-6 mr-6 mb-4"
        :disabled="voteFinal === ''"
        :color="cosmosConfig[store.chain].color"
        size="large"
        @click="calculateVoteFee()"
      >
        Vote {{ voteFinal }}
      </v-btn>
      <v-btn
        v-if="step2"
        class="text-none ml-6 mr-6 mb-4 mt-6"
        :disabled="!formSend"
        :color="cosmosConfig[store.chain].color"
        size="large"
        @click="VoteNow()"
      >
        Vote now
      </v-btn>
    </v-card>
  </v-dialog>      
  <v-dialog
    v-model="dialogGetReward" 
    transition="dialog-bottom-transition"
    width="600"
  >
    <v-card>
      <v-toolbar
        :color="cosmosConfig[store.chain].color"
        theme="dark"
        class="mb-6"
      >
        <template #prepend>
          <v-avatar>
            <v-img
              max-width="32"
              max-height="32"
              :src="cosmosConfig[store.chain].coinLookup.icon" 
            />
          </v-avatar>
        </template>

        <v-toolbar-title class="text-h6">
          Get my rewards
        </v-toolbar-title>        

        <template #append>
          <v-btn
            icon="mdi-close"
            @click="dialogGetReward = false"
          />
        </template>
      </v-toolbar>
      <v-card-text>
        <v-form
          v-if="step1"
          ref="formSend"
          v-model="formSend"
          align="center"
        >
          <h2>Soon!</h2>
        </v-form>
        <div v-if="step2">
          <v-row>
            <v-col>
              <v-sheet
                class="pa-2"
                border
              >
                <v-row>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      Fee
                    </v-sheet>
                  </v-col>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      ≈ {{ gasFee.fee / 2 }}
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
            <v-col>
              <v-sheet
                class="pa-2"
                border
              >
                <v-row>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      Gas
                    </v-sheet>
                  </v-col>
                  <v-col>
                    <v-sheet class="pa-2 ma-2">
                      {{ gasFee.gas }}
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>
          <FeePayer v-if="store.myFeeAllowances.length > 0" />
        </div>
        <div
          v-if="step3"
          class="ma-8 text-center"
        >
          <v-progress-circular
            :size="100"
            :width="5"
            :color="cosmosConfig[store.chain].color"
            indeterminate
            justify="center"
          />
        </div>
        <div
          v-if="step4"
          class="ma-8 text-center"
        >
          <v-icon
            size="150"
            color="green darken-2"
          >
            mdi-check-circle-outline
          </v-icon>
          <br><br>
          {{ txResult.transactionHash }}
        </div>
      </v-card-text>
      <!-- <v-btn
        v-if="step1"
        class="text-none ml-6 mr-6 mb-4"
        :disabled="voteFinal === ''"
        :color="cosmosConfig[store.chain].color"
        size="large"
        @click="calculateVoteFee()"
      >
        Vote {{ voteFinal }}
      </v-btn>
      <v-btn
        v-if="step2"
        class="text-none ml-6 mr-6 mb-4 mt-6"
        :disabled="!formSend"
        :color="cosmosConfig[store.chain].color"
        size="large"
        @click="VoteNow()"
      >
        Vote now
      </v-btn> 
       -->
    </v-card>
  </v-dialog>    
</template>
<script>
import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  GasPrice,
  calculateFee,
} from "@cosmjs/stargate";
import {
  coin,
  coins,
} from "@cosmjs/proto-signing";

import bech32 from "bech32";
import { selectSigner, calculFee } from "@/libs/signer";
import { useAppStore } from '@/stores/app'
import cosmosConfig from '@/cosmos.config'

import FeePayer from "@/components/feePayer.vue";

function checkBech32Address(address) {
  try {
    bech32.decode(address);
    return true;
  } catch (error) {
    return false;
  }
}
function checkBech32Prefix(address, chainId) {
  try {
    const { prefix } = bech32.decode(address);
    if (prefix === chainId) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

export default {
  name: 'App',
  components: {
    FeePayer
  },
  props: {
    type: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    spendableBalances: {
      type: String,
      required: true
    }, 
    undelegateAmount: {
      type: String,
      required: true
    },
    fromValidator: {
      type: String,
      default: '',
      required: false
    },
    fromValidatorAddr: {
      type: String,
      default: '',
      required: false
    },
    propId: {
      type: String,
      default: '',
      required: false
    },
  },
  setup() {
    const store = useAppStore()
    return {
      store
    }
  },
  data: (prop) => ({
    typeAction: prop.type,
    colorProp: prop.color,
    cosmosConfig: cosmosConfig,
    dialog: false,
    dialogUnRedel: false,
    dialogRedel: false,
    dialogVote: false,
    dialogGetReward: false,
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    rules: {
      required: value => !!value || 'Required.',
      checkAmount: value => value <= prop.spendableBalances || ' Not enough funds, you need: ' + prop.spendableBalances + ' HUAHUA',
      checkAmountUndel: value => value <= prop.undelegateAmount || ' Not enough funds, you need: ' + prop.undelegateAmount + ' HUAHUA',
      counter: value => value.length <= 20 || 'Max 20 characters',
      bech32: value => checkBech32Address(value) || 'Bad address (bech32)',
      bech32Prefix: value => checkBech32Prefix(value, 'chihuahua') || 'Bad prefix',
    },
    votes: [
      { text: 'Yes', value: 'Yes' },
      { text: 'No', value: 'No' },
      { text: 'Veto', value: 'Veto' },
      { text: 'Abstain', value: 'Abstain' },
    ],

    gasFee: 0,
    formSend: false,
    sendAmount: '',
    sendTo: '',

    undelegateAmountFinal: '',
    fromValidatorAddrFinal: prop.fromValidatorAddr,
    validatorListSearch: [],
    addressTo: '',

    voteFinal: '',
    voteReason: '',

    txResult: '',
  }),
  watch : {
    voteFinal: function (val) {
      switch (val) {
        case 0:
          this.voteFinal = 'Yes'
          break;
        case 1:
          this.voteFinal = 'No'
          break;
        case 2:
          this.voteFinal = 'Veto'
          break;
        case 3:
          this.voteFinal = 'Abstain'
          break; 
      }
    }
  },
  methods: {
    setAddress() {
      this.sendTo = this.store.addrWallet
      this.undelegateAmountFinal = this.undelegateAmount
    },
    getMax() {
      this.sendAmount = this.store.spendableBalances
      this.undelegateAmountFinal = this.undelegateAmount
    },
    // Open modals
    openSendTokens() { 
      this.dialog = true 
      this.sendAmount = ''
      this.sendTo = ''
      this.gasFee = 0
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
    },
    openUndelRedelegate() { 
      this.dialogUnRedel = true 
      this.gasFee = 0
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
    },
    openUndel() { 
      this.dialogUnRedel = true  
      this.gasFee = 0
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;

    },
    openRedel() { 
      this.dialogRedel = true  
      this.gasFee = 0
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false; 
    
      const selectValidatorList = []; 
      for (let i of this.store.allValidators) {
        selectValidatorList.push({
          'name': i.description.moniker,
          'address': i.operator_address,
        });
      }  
      
      this.validatorList = selectValidatorList;
      this.validatorListSearch = this.validatorList; 

    },
    openVote() { 
      this.dialogVote = true 
      this.gasFee = 0
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;      
    },
    openGetReward() { 
      this.dialogGetReward = true  
      this.gasFee = 0
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
    },
    searchVal() {
      if (!this.searchTerm) {
        this.validatorListSearch = this.validatorList;
      }
      this.validatorListSearch = this.validatorList.filter((val) => {        
        return val.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      });
    }, 
    // Calculate fee
    async calculateSendFee () {
      this.step1 = false;
      this.step2 = true;
      let signer = await selectSigner(this.store.chain)

      const foundMsgType = defaultRegistryTypes.find(
        (element) =>
          element[0] ===
            "/cosmos.bank.v1beta1.MsgSend"
      );

        const amount = coins(1 * 1000000, cosmosConfig[this.store.chain].coinLookup.chainDenom);
        const finalMsg = {
        typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            fromAddress: signer.accounts[0].address,
            toAddress: signer.accounts[0].address,
            amount: amount,
          }),
        }

        // Fee/Gas
        const gasEstimation = await signer.client.simulate(
          signer.accounts[0].address,
          [finalMsg],
          'Send Tokens'
        );
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.store.chain].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.store.chain].gasPrice +
              cosmosConfig[this.store.chain].coinLookup.chainDenom
          )
        );
        this.gasFee = { fee: (usedFee.amount[0].amount / 1000000), gas: usedFee.gas };
    },
    async calculateUndelFee () {
      this.step1 = false;
      this.step2 = true;
      let signer = await selectSigner(this.store.chain)

      const foundMsgType = defaultRegistryTypes.find(
        (element) =>
          element[0] ===
            "/cosmos.staking.v1beta1.MsgUndelegate"
      );     

        const amount = coin(this.undelegateAmountFinal * 1000000, cosmosConfig[this.store.chain].coinLookup.chainDenom);
        const finalMsg = {
        typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            delegatorAddress: signer.accounts[0].address,
            validatorAddress: this.fromValidatorAddrFinal,
            amount: amount,
          }),
        }

        // Fee/Gas
        const gasEstimation = await signer.client.simulate(
          signer.accounts[0].address,
          [finalMsg],
          'Undelegate'
        );
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.store.chain].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.store.chain].gasPrice +
              cosmosConfig[this.store.chain].coinLookup.chainDenom
          )
        );
        this.gasFee = { fee: (usedFee.amount[0].amount / 1000000), gas: usedFee.gas };
    },
    async calculateRedelFee () {
      this.step1 = false;
      this.step2 = true;
      let signer = await selectSigner(this.store.chain)

      const foundMsgType = defaultRegistryTypes.find(
        (element) =>
          element[0] ===
            "/cosmos.staking.v1beta1.MsgBeginRedelegate"
      );
        const amount = coin(this.undelegateAmountFinal * 1000000, cosmosConfig[this.store.chain].coinLookup.chainDenom);
        const finalMsg = {
        typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            delegatorAddress: signer.accounts[0].address,
            validatorSrcAddress: this.fromValidatorAddrFinal,
            validatorDstAddress: this.addressTo,
            amount: amount,
          }),
        }
 
        // Fee/Gas
        const gasEstimation = await signer.client.simulate(
          signer.accounts[0].address,
          [finalMsg],
          'Undelegate'
        );
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.store.chain].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.store.chain].gasPrice +
              cosmosConfig[this.store.chain].coinLookup.chainDenom
          )
        );
        this.gasFee = { fee: (usedFee.amount[0].amount / 1000000), gas: usedFee.gas }; 
    },
    async calculateVoteFee () {
      this.step1 = false;
      this.step2 = true;
      let signer = await selectSigner(this.store.chain)

      const foundMsgType = defaultRegistryTypes.find(
        (element) =>
          element[0] ===
            "/cosmos.gov.v1.MsgVote"
      );      
      let finalVote = ''
      switch (this.voteFinal) {
        case 'Yes':
        finalVote = 1
          break;
        case 'No':
          finalVote = 3
          break;
        case 'Veto':
        finalVote = 4
          break;
        case 'Abstain':
        finalVote = 2
          break;
      }
 
        const finalMsg = {
        typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            proposalId: this.propId,
            voter: signer.accounts[0].address,
            option: finalVote,
            metadata: this.voteReason,
          }),
        }
    
        // Fee/Gas
        const gasEstimation = await signer.client.simulate(
          signer.accounts[0].address,
          [finalMsg],
          'Vote'
        );
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.store.chain].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.store.chain].gasPrice +
              cosmosConfig[this.store.chain].coinLookup.chainDenom
          )
        );
        this.gasFee = { fee: (usedFee.amount[0].amount / 1000000), gas: usedFee.gas }; 
    },
    // Actions
    async sendNow() {
      this.step2 = false;
      this.step3 = true;

      if (this.formSend) {

        let signer = await selectSigner(this.store.chain)
        const foundMsgType = defaultRegistryTypes.find(
            (element) =>
              element[0] ===
              "/cosmos.bank.v1beta1.MsgSend"
          );

          const amount = coins(this.sendAmount * 1000000, cosmosConfig[this.store.chain].coinLookup.chainDenom);
          const finalMsg = {
          typeUrl: foundMsgType[0],
            value: foundMsgType[1].fromPartial({
              fromAddress: signer.accounts[0].address,
              toAddress: this.sendTo,
              amount: amount,
            }),
          }

          // Fee/Gas
          const gasEstimation = await signer.client.simulate(
            signer.accounts[0].address,
            [finalMsg],
            'Send Tokens'
          );
          const usedFee = calculateFee(
            Math.round(gasEstimation * cosmosConfig[this.store.chain].feeMultiplier),
            GasPrice.fromString(
              cosmosConfig[this.store.chain].gasPrice +
                cosmosConfig[this.store.chain].coinLookup.chainDenom
            )
          );
          this.gasFee = { fee: (usedFee.amount[0].amount / 1000000), gas: usedFee.gas };

          const feeAmount = coins(usedFee.amount[0].amount, cosmosConfig[this.store.chain].coinLookup.chainDenom);
          let finalFee = {
            amount: feeAmount,
            gas: usedFee.gas,
            payer: this.store.setFeePayer,
            //granter: this.store.setFeePayer,
          }
        try {
          const result = await signer.client.signAndBroadcast(signer.accounts[0].address, [finalMsg], finalFee, '')
          assertIsDeliverTxSuccess(result)
          console.log(result)
          this.txResult = result
          this.step3 = false;
          this.step4 = true;
        } catch (error) {
          console.error(error);
          this.step3 = false;
          this.step2 = true;
        }
      }

    },
    async UndelNow() {
      this.step2 = false;
      this.step3 = true;

      if (this.formSend) {
        let signer = await selectSigner(this.store.chain)
        const foundMsgType = defaultRegistryTypes.find(
        (element) =>
          element[0] ===
            "/cosmos.staking.v1beta1.MsgUndelegate"
      );

      

        const amount = coin(this.undelegateAmountFinal * 1000000, cosmosConfig[this.store.chain].coinLookup.chainDenom);
        const finalMsg = {
        typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            delegatorAddress: signer.accounts[0].address,
            validatorAddress: this.fromValidatorAddrFinal,
            amount: amount,
          }),
        }

        // Fee/Gas
        const gasEstimation = await signer.client.simulate(
          signer.accounts[0].address,
          [finalMsg],
          'Undelegate'
        );
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.store.chain].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.store.chain].gasPrice +
              cosmosConfig[this.store.chain].coinLookup.chainDenom
          )
        );
        this.gasFee = { fee: (usedFee.amount[0].amount / 1000000), gas: usedFee.gas };

          const feeAmount = coins(usedFee.amount[0].amount, cosmosConfig[this.store.chain].coinLookup.chainDenom);
          let finalFee = {
            amount: feeAmount,
            gas: usedFee.gas,
            granter: this.store.setFeePayer,
          }
        try {
          const result = await signer.client.signAndBroadcast(signer.accounts[0].address, [finalMsg], finalFee, '')
          assertIsDeliverTxSuccess(result)
          console.log(result)
          this.txResult = result
          this.step3 = false;
          this.step4 = true;
        } catch (error) {
          console.error(error);
          this.step3 = false;
          this.step2 = true;
        }
      }

    },
    async RedelNow() {
      this.step2 = false;
      this.step3 = true;

      if (this.formSend) {
 

        let signer = await selectSigner(this.store.chain)
        const foundMsgType = defaultRegistryTypes.find(
        (element) =>
          element[0] ===
            "/cosmos.staking.v1beta1.MsgBeginRedelegate"
      );      
        const amount = coin(this.undelegateAmountFinal * 1000000, cosmosConfig[this.store.chain].coinLookup.chainDenom);
        const finalMsg = {
        typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            delegatorAddress: signer.accounts[0].address,
            validatorSrcAddress: this.fromValidatorAddrFinal,
            validatorDstAddress: this.addressTo,
            amount: amount,
          }),
        }
 
        // Fee/Gas
        const gasEstimation = await signer.client.simulate(
          signer.accounts[0].address,
          [finalMsg],
          'Undelegate'
        );
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.store.chain].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.store.chain].gasPrice +
              cosmosConfig[this.store.chain].coinLookup.chainDenom
          )
        );
        this.gasFee = { fee: (usedFee.amount[0].amount / 1000000), gas: usedFee.gas }; 

          const feeAmount = coins(usedFee.amount[0].amount, cosmosConfig[this.store.chain].coinLookup.chainDenom);
          let finalFee = {
            amount: feeAmount,
            gas: usedFee.gas,
            granter: this.store.setFeePayer,
          }
        try {
          const result = await signer.client.signAndBroadcast(signer.accounts[0].address, [finalMsg], finalFee, '')
          assertIsDeliverTxSuccess(result)
          console.log(result)
          //this.store.getDelegations()
          this.txResult = result
          this.step3 = false;
          this.step4 = true;
        } catch (error) {
          console.error(error);
          this.step3 = false;
          this.step2 = true;
        }
      }

    },
    async VoteNow() {
      this.step2 = false;
      this.step3 = true;

      if (this.formSend) {
 

        let signer = await selectSigner(this.store.chain)
        const foundMsgType = defaultRegistryTypes.find(
        (element) =>
          element[0] ===
            "/cosmos.gov.v1.MsgVote"
      );      
      let finalVote = ''
      switch (this.voteFinal) {
        case 'Yes':
        finalVote = 1
          break;
        case 'No':
          finalVote = 3
          break;
        case 'Veto':
        finalVote = 4
          break;
        case 'Abstain':
        finalVote = 2
          break;
      }
 
        const finalMsg = {
        typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            proposalId: this.propId,
            voter: signer.accounts[0].address,
            option: finalVote,
            metadata: this.voteReason,
          }),
        }
    
        // Fee/Gas
        const gasEstimation = await signer.client.simulate(
          signer.accounts[0].address,
          [finalMsg],
          'Vote'
        );
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.store.chain].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.store.chain].gasPrice +
              cosmosConfig[this.store.chain].coinLookup.chainDenom
          )
        );
        this.gasFee = { fee: (usedFee.amount[0].amount / 1000000), gas: usedFee.gas }; 

          const feeAmount = coins(usedFee.amount[0].amount, cosmosConfig[this.store.chain].coinLookup.chainDenom);
          let finalFee = {
            amount: feeAmount,
            gas: usedFee.gas,
            granter: this.store.setFeePayer,
          }
        try {
          const result = await signer.client.signAndBroadcast(signer.accounts[0].address, [finalMsg], finalFee, '')
          assertIsDeliverTxSuccess(result)
          console.log(result)
          this.txResult = result
          this.step3 = false;
          this.step4 = true;
        } catch (error) {
          console.error(error);
          this.step3 = false;
          this.step2 = true;
        }
      }

    },
    getRewards() {
      this.$store.commit('setModal', 'getRewards')
    },

  }
}
</script>
<style>
.bg-primary {
  background-color: #E8A346 !important;
}
</style>