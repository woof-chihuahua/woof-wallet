// Store for chihuahua app
// Dev by: @atmon3r

import { defineStore } from 'pinia'
import axios from "axios";
import Long from "long";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc"; 
import { createProtobufRpcClient, QueryClient, StargateClient } from "@cosmjs/stargate";
import cosmosConfig from '../cosmos.config'

import * as bank from "cosmjs-types/cosmos/bank/v1beta1/query"; 
import * as staking from "cosmjs-types/cosmos/staking/v1beta1/query";
import * as distrib from "cosmjs-types/cosmos/distribution/v1beta1/query";
import * as feegrant from "cosmjs-types/cosmos/feegrant/v1beta1/query";
import * as gov from "cosmjs-types/cosmos/gov/v1/query";

export const useAppStore = defineStore('data', {
  state: () => ({ 
    chain: 'mainnet',
    isLogged: false,
    loggedType: '',
    rpcClient: null,
    rpcBase: null,
    sdkVersion: '',
    ibcVersion: '',
    tokenPrice: '',
    loaded: false,
    // Wallet
    addrWallet: '',
    nameWallet: '',
    // Bank
    spendableBalances: 0,
    totalSupply: 0,
    totalSupplyPrice: 0,
    totalTokens: 0,
    fiatWalletValue: 0,
    // Staking
    totalDelegations: 0,
    totalUnbound: 0,
    poolStaking: null,
    allMyDelegations: null,
    allValidators: null,
    // Distrib
    totalMyValidators: 0,
    totalDelegationsRewards: null,
    totalRewards: 0,
    totalCommunityPool: null,
    // Fee Grant
    myFeeAllowances: null,
    myFeeGrants: null,
    formFeeGranter: null,
    // Proposals
    allProposals: null,
  }),
  actions: {
    resetData() {
      //this.isLogged = false; 
    },
    async initRpc() {      
      if(this.rpcClient) {
        this.rpcBase.disconnect();
      } 
      const client = await Tendermint37Client.connect(cosmosConfig[this.chain].rpcURL) 
      const queryClient = new QueryClient(client);
      const rpcClient = createProtobufRpcClient(queryClient);
      this.rpcClient = rpcClient
      this.rpcBase = client 
    }, 
    async getPrice() {
      const finalPrice = await axios(
        "https://api.coingecko.com/api/v3/simple/price?ids=chihuahua-token&vs_currencies=usd"  
      ); 
      this.tokenPrice = finalPrice.data['chihuahua-token'].usd.toFixed(6)
    },
    async getBankModule() {
      const queryBank = new bank.QueryClientImpl(this.rpcClient); 
      let spendableBalances = await queryBank.SpendableBalances({ address: this.addrWallet });
      let allBalances = await queryBank.AllBalances({ address: this.addrWallet });

      const found = spendableBalances.balances.find(element => element.denom === cosmosConfig[this.chain].coinLookup.chainDenom);
      // TODO: fix this
      let returnValue = ''
      if ( found?.amount > 0){
        returnValue = found?.amount / 1000000
      } else {
        returnValue = 0
      }

      let totalSupply = await queryBank.SupplyOf({ denom: cosmosConfig[this.chain].coinLookup.chainDenom }) 
      this.spendableBalances = returnValue 
      this.totalSupply = totalSupply.amount.amount 
      this.totalSupplyPrice = ((totalSupply.amount.amount / 1000000) * this.chainSelectedPrice) 
    },
    async getStakingModule() {    
      const queryStaking = new staking.QueryClientImpl(this.rpcClient);
      let getPoolStaking = await queryStaking.Pool({ });  
      let delegatorValidators = await queryStaking.DelegatorDelegations({ delegatorAddr: this.addrWallet, pagination: {
        countTotal: false,
        key: '',
        offset: Long.fromNumber(0, true),
        limit: Long.fromNumber(200, true),
        reverse: false,
      }}); 

      let total = 0;  
      let allUnbound = await queryStaking.DelegatorUnbondingDelegations({ delegatorAddr: this.addrWallet });       
      let totalUnbound = 0;

      for (let i of delegatorValidators.delegationResponses) { 
        total += Number(i.balance.amount);
      }   
      if (allUnbound.unbondingResponses.length > 0) {   
        for (let i of allUnbound.unbondingResponses) {
          for (let j of i.entries) {
            totalUnbound += Number(j.balance)
          }
        }   
      } else {
        totalUnbound = 0.00
      }
 
      this.totalDelegations = (total / 1000000).toFixed(6)
      this.totalUnbound = (totalUnbound / 1000000).toFixed(6)
      this.poolStaking = getPoolStaking.pool
      this.allMyValidators = delegatorValidators.delegationResponses
    }, 
    async getDistribModule() { 
      const queryDistrib = new distrib.QueryClientImpl(this.rpcClient);
      const queryDistribResult = await queryDistrib.DelegationTotalRewards({ delegatorAddress: this.addrWallet }); 
      const queryCommunityPool = await queryDistrib.CommunityPool({ });
      const found = queryDistribResult.total.find(element => element.denom === cosmosConfig[this.chain].coinLookup.chainDenom);
      const foundCommunityPool = queryCommunityPool.pool.find(element => element.denom === cosmosConfig[this.chain].coinLookup.chainDenom);
      let returnValue = ''
      if ( queryDistribResult.total.length > 0){
        returnValue = Number(found.amount / 1000000000000000000000000).toFixed(6)
      } else {
        returnValue = 0
      }

      this.totalMyValidators = queryDistribResult.rewards.length
      this.totalDelegationsRewards = queryDistribResult.rewards
      this.totalRewards = returnValue
      this.totalCommunityPool = Number(foundCommunityPool.amount / 1000000000000000000000000).toFixed(6)
    }, 
    async getGovModule() {    
      const queryGov = new gov.QueryClientImpl(this.rpcClient);
      

      const queryGovResult = await queryGov.Proposals({ proposalStatus: 0, voter: "", depositor: "" })
      this.allProposals = queryGovResult.proposals.reverse()
    }, 
    async getFeeGrantModule() {
      const queryFeegrant = new feegrant.QueryClientImpl(this.rpcClient)
      const queryFeegrantResult = await queryFeegrant.Allowances({ grantee: this.addrWallet })
      const queryAllowancesByGranterResult = await queryFeegrant.AllowancesByGranter({ granter: this.addrWallet })
      this.myFeeAllowances = queryFeegrantResult.allowances
      this.myFeeGrants = queryAllowancesByGranterResult.allowances

      let finalGranter = []
      for (let i = 0; i < this.myFeeAllowances.length; i++) {

        finalGranter[i] = this.myFeeAllowances[i].granter
      }
      this.formFeeGranter = finalGranter
    },
    async getAllValidators() {
      const allValidators = await axios(
        cosmosConfig[this.chain].apiURL + "/cosmos/staking/v1beta1/validators?pagination.limit=250&status=BOND_STATUS_BONDED"
      );
      for (let i = 0; i < allValidators.data.validators.length; i++) {
        allValidators.data.validators[i].moniker = allValidators.data.validators[i].description.moniker;
      }
      this.allValidators = allValidators.data.validators
    },
    async getWalletAmount() {
      let totalToken = 
        Number(this.spendableBalances) + 
        Number(this.totalDelegations) + 
        Number(this.totalUnbound) + 
        Number(this.totalRewards)

      this.totalTokens = (totalToken).toFixed(6)
      this.fiatWalletValue = totalToken * this.chainSelectedPrice
    },
    async getDelegations() {
      const getDelegations = await axios(
        cosmosConfig[this.chain].apiURL +
          "/cosmos/distribution/v1beta1/delegators/" +
          this.addrWallet +
          "/rewards"
      );
      const getUnDelegations = await axios(
        cosmosConfig[this.chain].apiURL +
          "/cosmos/staking/v1beta1/delegators/" +
          this.addrWallet +
          "/unbonding_delegations"
      );
      const getRedelegations = await axios(
        cosmosConfig[this.chain].apiURL +
          "/cosmos/staking/v1beta1/delegators/" +
          this.addrWallet +
          "/redelegations"
      );
  
      let foundMainDenom = getDelegations.data.total.find(
        (element) =>
          element.denom === cosmosConfig[this.chain].coinLookup.chainDenom
      );
      if (typeof foundMainDenom === "undefined") {
        foundMainDenom = {
          denom: cosmosConfig[this.chain].coinLookup.chainDenom,
          amount: "0",
        };
      }
      var copieRewards = [];
  
      const getValidatorInfo = await axios(
        cosmosConfig[this.chain].apiURL +
          "/cosmos/staking/v1beta1/delegations/" +
          this.addrWallet
      );
      const getValidatorMainInfo = await axios(
        cosmosConfig[this.chain].apiURL +
          "/cosmos/staking/v1beta1/validators?pagination.limit=250"
      );
  
      let totalDelegated = 0;
      let totalBonded2 = 0;
      const allValidators = await axios(
        cosmosConfig[this.chain].apiURL + "/cosmos/staking/v1beta1/validators?pagination.limit=250"
      );
      
      await allValidators.data.validators.forEach(async (item) => {
        totalBonded2 += Number(item.tokens); 
      });

      // this.allValidators = allValidators.data.validators


      let finalChainSelected = this.chain
      await getDelegations.data.rewards.forEach(function (item) {
        let foundDelegByValidator =
          getValidatorInfo.data.delegation_responses.find(
            (element) =>
              element.delegation.validator_address === item.validator_address
          );
        let foundValidatorMainInfo = getValidatorMainInfo.data.validators.find(
          (element) => element.operator_address === item.validator_address
        );
        let foundUnDelegations = getUnDelegations.data.unbonding_responses.find(
          (element) => element.validator_address === item.validator_address
        );
        let foundRedelegations =
          getRedelegations.data.redelegation_responses.find(
            (element) =>
              element.redelegation.validator_src_address ===
              item.validator_address
          );
  
        if (typeof foundUnDelegations === "undefined") {
          foundUnDelegations = {
            denom: cosmosConfig[finalChainSelected].coinLookup.chainDenom,
            amount: "0",
          };
        } else {
          let totalUnDelegations = 0;
          for (let i = 0; i < foundUnDelegations.entries.length; i++) {
            totalUnDelegations += foundUnDelegations.entries[i].balance / 1000000;
          }
          foundUnDelegations = {
            denom: cosmosConfig[finalChainSelected].coinLookup.chainDenom,
            amount: totalUnDelegations,
          };
        }
        if (typeof foundRedelegations === "undefined") {
          foundRedelegations = {
            denom: cosmosConfig[finalChainSelected].coinLookup.chainDenom,
            amount: "0",
          };
        } else {
          foundRedelegations = {
            denom: cosmosConfig[finalChainSelected].coinLookup.chainDenom,
            amount: foundRedelegations.entries[0].balance / 1000000,
          };
        }
  
        let finalRewardAmount = 0;
        if (typeof item.reward[0]?.amount === "undefined") {
          finalRewardAmount = 0;
        } else {
          finalRewardAmount = (item.reward[0].amount / 1000000).toFixed(6);
        } 

        if(foundDelegByValidator.balance.amount > 0 || 
          foundUnDelegations.amount > 0 || 
          foundRedelegations.amount > 0
        ) {

          copieRewards.push({
            validatorName: foundValidatorMainInfo?.description.moniker,
            op_address: foundDelegByValidator.delegation.validator_address,
            reward: finalRewardAmount,
            share: foundDelegByValidator.delegation.shares,
            delegated: foundDelegByValidator.balance.amount,
            unDelegations: foundUnDelegations,
            reDelegations: foundRedelegations,
            status: foundValidatorMainInfo?.status,
            commission: (foundValidatorMainInfo?.commission.commission_rates.rate * 100).toFixed(2),
            votingPower: ((foundValidatorMainInfo?.tokens / totalBonded2) * 100).toFixed(2), 
          });
        }
        totalDelegated += Number(foundDelegByValidator.balance.amount);
      });
  
      const getUnbound = await axios(
        cosmosConfig[this.chain].apiURL +
          "/cosmos/staking/v1beta1/delegators/" +
          this.addrWallet +
          "/unbonding_delegations"
      );
      let sumUnbonding = 0;
      for (let i = 0; i < getUnbound.data.unbonding_responses.length; i++) {
        let item = getUnbound.data.unbonding_responses[i];
        for (let j = 0; j < item.entries.length; j++) {
          sumUnbonding += Number(item.entries[j].balance);
        }
      }
   
      this.allMyDelegations = copieRewards
    },    
    logout() {
      this.isLogged = false
    },
    async keplrConnect() {
      await window.keplr.experimentalSuggestChain({
        chainId: cosmosConfig[this.chain].chainId,
        chainName: cosmosConfig[this.chain].name,
        rpc: cosmosConfig[this.chain].rpcURL,
        rest: cosmosConfig[this.chain].apiURL,
        bip44: {
          coinType: 118,
        },
        bech32Config: {
          bech32PrefixAccAddr: cosmosConfig[this.chain].coinLookup.addressPrefix,
          bech32PrefixAccPub: cosmosConfig[this.chain].coinLookup.addressPrefix + "pub",
          bech32PrefixValAddr: cosmosConfig[this.chain].coinLookup.addressPrefix + "valoper",
          bech32PrefixValPub: cosmosConfig[this.chain].coinLookup.addressPrefix + "valoperpub",
          bech32PrefixConsAddr: cosmosConfig[this.chain].coinLookup.addressPrefix + "valcons",
          bech32PrefixConsPub: cosmosConfig[this.chain].coinLookup.addressPrefix + "valconspub",
        },
        currencies: [
          {
            coinDenom: cosmosConfig[this.chain].coinLookup.viewDenom,
            coinMinimalDenom: cosmosConfig[this.chain].coinLookup.chainDenom,
            coinDecimals: 6,
            coinGeckoId: cosmosConfig[this.chain].coingeckoId,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: cosmosConfig[this.chain].coinLookup.viewDenom,
            coinMinimalDenom: cosmosConfig[this.chain].coinLookup.chainDenom,
            coinDecimals: 6,
            coinGeckoId: cosmosConfig[this.chain].coingeckoId,
            gasPriceStep: {
              low: 0,
              average: 0,
              high: 0,
            },
          },
        ],
        stakeCurrency: {
          coinDenom: cosmosConfig[this.chain].coinLookup.viewDenom,
          coinMinimalDenom: cosmosConfig[this.chain].coinLookup.chainDenom,
          coinDecimals: 6,
          coinGeckoId: cosmosConfig[this.chain].coingeckoId,
        },
      })

      let chainId = cosmosConfig[this.chain].chainId  
      await window.keplr.enable(chainId);
      const offlineSigner = await window.getOfflineSignerAuto(chainId);
      const accounts = await offlineSigner.getAccounts();
      const getKey = await window.keplr.getKey(chainId);
      this.addrWallet = accounts[0].address
      this.nameWallet = getKey.name
      this.isLogged = true
      this.loggedType = 'keplr'
      this.setLocalLogin(chainId, this.nameWallet, this.addrWallet, 'keplr')
    },
    async cosmoStationConnect() { 
        if (!window.cosmostation) {
          alert("Please install cosmostation extension");
        } else {
          const chainId = cosmosConfig[this.chain].chainId
       
          await window.cosmostation.providers.keplr.enable(chainId);
       
          const offlineSigner =
            window.cosmostation.providers.keplr.getOfflineSigner(chainId);
       
          const accounts = await offlineSigner.getAccounts();
          const getKey = await  window.cosmostation.providers.keplr.getKey(chainId); 

          this.addrWallet = accounts[0].address
          this.nameWallet = getKey.name
          this.logged = true
          this.loggedType = 'cosmostation'
          this.isLogged = true
          this.setLocalLogin(chainId, this.nameWallet, this.addrWallet, 'cosmostation')
        } 
        
    },
    async leapConnect() { 
      if (!window.leap) {
        alert("Please install leap extension");
      } else {
        const chainId = cosmosConfig[this.chain].chainId
     
        await window.leap.enable(chainId);

        const offlineSigner = window.leap.getOfflineSigner(chainId); 
        const accounts = await offlineSigner.getAccounts(); 
        const getKey = await window.leap.getKey(chainId); 

        this.addrWallet = accounts[0].address
        this.nameWallet = getKey.name
        this.logged = true
        this.loggedType = 'leap'
        this.isLogged = true
        this.setLocalLogin(chainId, this.nameWallet, this.addrWallet, 'leap')
      } 
      
    },
    async setLocalLogin(chainId, name, address, type) {
      let id = 0
      localStorage.setItem('account',         
        JSON.stringify({
          id: id,
          walletName: name,
          data: address,
          type: type
        }
        )
      );
    },
    setLoaded() {
      this.loaded = true
    }
  }
})
