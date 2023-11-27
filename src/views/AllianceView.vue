<template>
  <div> 
 
      <v-parallax
      class="pb-12"
        src="https://alliance.terra.money/Images/AllianceLogoOutline.svg"
      >
    <div class=""> 
      <h4 class="subheading"> 
        <v-sheet
        border
          class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
          elevation="4"
          height="350"
          rounded
          max-width="800"
          width="100%"
        >
          <div>
            
            <h2 class="text-h4 font-weight-black text-orange">Alliance </h2>
            
            <div class="text-h5 font-weight-medium mb-2">
              Collaborate.
              Reward.
              Grow.
            </div>
            <v-img max-height="100" src="https://alliance.terra.money/Images/AllianceLogoOutline.svg"></v-img>
            <p class="text-body-2 mb-4">
              Alliance is an open-source Cosmos SDK module that enables blockchains to form mutually beneficial relationships, similar to trade agreements between countries. Using Alliance, a chain can allow almost any token, including liquid staking tokens, stablecoins, liquidity provider tokens, and other Cosmos assets, to be staked on their chain to earn staking rewards. In turn for providing a portion of the chain’s staking rewards to stakers of these tokens, the chain can redistribute a percentage of these staked Alliance assets to native token stakers.
            </p>

            <v-btn variant="text" color="orange"><a href="https://www.terra.money/ecosystem/alliance"  target="_blank">More information</a></v-btn>
          </div>
        </v-sheet>
      </h4>
    </div>
 
    <v-timeline class="mb-12">
    <v-timeline-item 
      dot-color="primary" 
    >
      <v-card>
        <v-card-title > 
          <h2 class="font-weight-light">
            Install module
          </h2>
        </v-card-title>
        <v-card-text>
          To initiate the alliance, chihuahua must adopt the module<br /> for this, the channel must be updated.<br />
          Alliance Integration is done on proposal #53 <br /><a href="https://www.mintscan.io/chihuahua/proposals/53" target="_blank">https://www.mintscan.io/chihuahua/proposals/53</a>
        </v-card-text>
      </v-card>
    </v-timeline-item>

    <v-timeline-item   
    >
      <v-card>
        <v-card-title >
          <h2 class="me-4 font-weight-light">
            Active huahua token
          </h2> 
        </v-card-title>
        <v-card-text>
          Waiting the first Alliance token
        </v-card-text>
      </v-card>
    </v-timeline-item>

    <v-timeline-item
      size="x-small"
    >
      <v-card>
        <v-card-title > 
          <h2 class="font-weight-light">
            Enable UI
          </h2>
        </v-card-title>
        <v-card-text>
          Once the activation proposal has been submitted, <br />the staking interface will be activated on our webwallet
        </v-card-text>
      </v-card>
    </v-timeline-item>

    <v-timeline-item
      size="x-small"
    >
      <v-card>
        <v-card-title class=" justify-end">
          <h2 class="me-4 font-weight-light">
            Maintainance
          </h2> 
        </v-card-title>
        <v-card-text>
          Regular maintenance will be carried out on the backend and frontend
        </v-card-text>
      </v-card>
    </v-timeline-item>

    <v-timeline-item
      dot-color="green-lighten-1"
      fill-dot
    >
      <v-card>
        <v-card-title class="bg-green-lighten-1">
          <v-icon
            class="me-4"
            size="large"
            icon="mdi-phone-in-talk"
          ></v-icon>
          <h2 class="font-weight-light">
            Title 5
          </h2>
        </v-card-title>
        <v-card-text>
          Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit.
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
  </v-parallax>
  
  </div>
</template>
<script>
  export default {
    data: () => ({
      items: [
        {
          color: 'red-lighten-2',
          icon: 'mdi-star',
        },
        {
          color: 'purple-lighten-2',
          icon: 'mdi-book-variant',
        },
        {
          color: 'green-lighten-1',
          icon: 'mdi-airballoon',
        },
        {
          color: 'indigo-lighten-2',
          icon: 'mdi-layers-triple',
        },
      ],
    }),
  }
</script>
