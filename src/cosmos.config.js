export default {
  'mainnet': {
    chainId: 'chihuahua-1',
    name: 'Chihuahua',
    slot: "chihuahua",
    desc: 'Chihuahua is the first interoperable meme coin with a POS blockchain, making it one of the most utilized chains in the Cosmos ecosystem',
    mode: 'mainnet',
    apiURL: 'https://api.chihuahua.wtf',
    rpcURL: 'https://rpc.chihuahua.wtf',
    //apiURL: 'https://rest.cosmos.directory/chihuahua',
    //rpcURL: 'https://rpc.cosmos.directory/chihuahua',
    coinLookup: {
      viewDenom: 'HUAHUA',
      chainDenom: 'uhuahua',
      addressPrefix: 'chihuahua',
      icon: `https://avatars.githubusercontent.com/u/94940349?v=4`,
      banner: "https://raw.githubusercontent.com/BitCannaGlobal/cosmospay-woocommerce/main/public/img/Chihuahua.png",
    },
    coingeckoId: 'chihuahua-token',
    feeMultiplier: 3,
    gasPrice: 4000,
    color: '#E7A246',
    colorChart: ["#efc283", "#F0A841", "#c67f21", "#995803"],
    modules: {
      feeGrant: true,
      authz: true,
      wasm: true,
      group: true,
    }
  }
}