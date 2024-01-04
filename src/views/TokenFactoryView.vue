<template>
  <h1
    v-if="authorised"
    class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center"
  >
    <div class="text-truncate">
      Token Factory 
      <v-btn
        icon
        @click="openDialogCreate()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </h1>  

  <v-card
    v-if="!authorised"
    flat
    title="All tokens factory"
    class="mb-12"
  >
    <template #text>
      <v-alert
        variant="outlined"
        type="warning"
        prominent
        class="mb-4"
        border="top"
      >
        You are not authorized to view this page
      </v-alert>
    </template>
  </v-card>
  <v-card
    v-if="authorised"
    flat
    title="All tokens factory"
    class="mb-12"
  >
    <template v-slot:append>
      <v-checkbox v-model="displayOnlyAdmin" label="View only my tokens" @click="onlyAdmin()"></v-checkbox>
    </template>
    
    <template #text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        single-line
        variant="outlined"
        hide-details
      />
    </template>
 
    <v-data-table
      v-if="isLoaded"
      :headers="headers"
      :items="finalTokenFatory"
      :search="search"
    > 
      <template #item.symbol="{ item }"> 
         {{ item.symbol }}
      </template> 
      <template #item.display="{ item }"> 
         {{ truncateString(item.base) }}
      </template> 
      <template #item.myToken="{ item }"> 
        <v-btn
          v-if="item.myToken > 0"
          variant="plain"
        >
          {{ millify(item.myToken / Number("1e" + item.denom_units[1]?.exponent)) }} {{ item.symbol }}
          <v-tooltip
            activator="parent"
            location="start"
          >
            {{ item.myToken / Number("1e" + item.denom_units[1]?.exponent) }} {{ item.symbol }}
          </v-tooltip>   
        </v-btn>   
        <v-btn
          v-else
          variant="plain"
        >
          0 
        </v-btn>     
        <!-- {{ millify(column.supply / Number("1e" + column.denom_units[1]?.exponent)) }} -->
      </template> 
      <template #item.supply="{ item }"> 
        <v-btn
          v-if="item.supply > 0"
          variant="plain"
        >
          <span v-if="item.denom_units[1]?.exponent">
            {{ millify(item.supply / Number("1e" + item.denom_units[1]?.exponent)) }} {{ item.symbol }}
          </span>
          <span v-else>
            {{ millify(item.supply / Number("1e" + item.denom_units[0]?.exponent)) }} 
          </span>
          <v-tooltip
            activator="parent"
            location="start"
          >
            <span v-if="item.denom_units[1]?.exponent">
              {{ item.supply / Number("1e" + item.denom_units[1]?.exponent) }} {{ item.symbol }}
            </span>
            <span v-else>
              {{ millify(item.supply / Number("1e" + item.denom_units[0]?.exponent)) }} 
            </span>
          </v-tooltip>  
        </v-btn>   
        <v-btn
          v-else
          variant="plain"
        >
          0 
        </v-btn>     
        <!-- {{ millify(column.supply / Number("1e" + column.denom_units[1]?.exponent)) }} -->
      </template> 
      <template #item.actions="{ item }">
        <v-btn
          :disabled="item.myToken > 0 ? false : true"
          class="mb-2 mt-2 me-2"
          icon
          :color="cosmosConfig[store.chain].color"
          @click="openDialog(item.myToken / Number('1e' + item.denom_units[1]?.exponent), item.symbol)"
        >
          <v-tooltip
            activator="parent"
            location="top"
          >
            Create an airdrop for {{ item.symbol }}
          </v-tooltip>  
          <v-icon>mdi-airballoon-outline</v-icon>
        </v-btn>

        <v-btn
          :disabled="item.myToken > 0 ? false : true"
          class="mb-2 mt-2 me-2"
          icon
          :color="cosmosConfig[store.chain].color"
          @click="openDialogSendToken(item)"
        >
          <v-tooltip
            activator="parent"
            location="top"
          >
            Send token {{ item.symbol }}
          </v-tooltip>      
          <v-icon>mdi-send</v-icon>
        </v-btn>



        

        <v-menu
          v-if="item.isAdmin"
          location="end"
        >
          <template #activator="{ props }">
            <v-btn
              :color="cosmosConfig[store.chain].color"
              dark
              icon
              v-bind="props"
            >
              <v-icon>mdi-security</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title>
                <v-btn
                  v-if="item.isAdmin"
                  class="mb-2 mt-2 me-2"
                  icon
                  :color="cosmosConfig[store.chain].color"
                  @click="openDialMintToken(item)"
                >
                  <v-tooltip
                    activator="parent"
                    location="top"
                  >
                    <b color="green">You are admin</b> - Mint token {{ item.symbol }}
                  </v-tooltip>  
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-btn
                  v-if="item.isAdmin"
                  class="mb-2 mt-2 me-2"
                  icon
                  :color="cosmosConfig[store.chain].color"
                  @click="openDialEditToken(item)" 
                >
                  <v-tooltip
                    activator="parent"
                    location="top"
                  >
                    <b color="green">You are admin</b> - Edit token {{ item.symbol }}
                  </v-tooltip>          
                  <v-icon>mdi-square-edit-outline</v-icon>
                </v-btn>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-btn
                  v-if="item.isAdmin"
                  class="mb-2 mt-2 me-2"
                  icon         
                  :disabled="item.supply > 0 ? false : true"  
                  :color="cosmosConfig[store.chain].color"
                  @click="openDialogBurn(item)"
                > 
                  <v-tooltip
                    activator="parent"
                    location="top"
                  >
                    <b color="green">You are admin</b> - Burn token for {{ item.symbol }}
                  </v-tooltip>          
                  <v-icon>mdi-fire</v-icon>
                </v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </v-card>
 
  <v-row justify="center">
    <v-dialog
      v-model="dialogCreate" 
      width="900"
      persistent
    >
      <v-card>
        <v-toolbar
          :color="cosmosConfig[store.chain].color"
          theme="dark" 
        >
          <template #prepend>
            <v-avatar>
              <v-img
                max-width="32"
                max-height="32"
                :src="cosmosConfig[store.chain].coinLookup.icon"
                alt="huahua"
              />
            </v-avatar>
          </template>

          <v-toolbar-title class="text-h6">
            Create a token
          </v-toolbar-title>

          <template #append>
            <v-btn
              icon="mdi-close"
              @click="dialogCreate = false"
            />
          </template>
        </v-toolbar>
        
        <v-card-text>
          <!-- <v-list lines="two">
 

      <v-list-subheader inset>Files</v-list-subheader>

      <v-list-item
        v-for="file in files"
        :key="file.title"
        :title="file.title"
        :subtitle="file.subtitle"
      >
        <template v-slot:prepend>
          <v-avatar :color="file.color">
            <v-icon color="white">{{ file.icon }}</v-icon>
          </v-avatar>
        </template>

        <template v-slot:append>
          <v-btn
            color="grey-lighten-1"
            icon="mdi-information"
            variant="text"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list> -->
          <v-stepper 
            v-model="step" 
            :items="itemsCreate" 
            hide-actions 
          >
            <template #item.1>
              <v-card flat>
                <v-form 
                  ref="formSend"
                  v-model="formCreateToken"
                > 
                  <v-alert
                    v-if="txError !== ''"
                    variant="outlined"
                    type="warning"
                    prominent
                    class="mb-4"
                    border="top"
                  >
                    {{ txError }}
                  </v-alert>
                  <h3 class="font-weight-bold mb-2">
                    Token name
 
                  </h3>
                  <v-text-field
                    v-model="createTokenName" 
                    required
                    variant="outlined" 
                    :rules="[v => !!v || 'Denom token is required']"
                  /> 
                  <FeePayer v-if="store.myFeeAllowances.length > 0" />
                  <v-btn
                    class="mt-4"
                    :color="cosmosConfig[store.chain].color" 
                    :disabled="!formCreateToken" 
                    :loading="loading"
                    size="large"
                    block
                    @click="createToken()"
                  >
                    Create token
                  </v-btn>
                </v-form>
              </v-card>
            </template>

            <template #item.2>
              <v-card flat>
                <!-- modify-metadata factory/chihuahua1x4q2vkrz4dfgd9hcw0p5m2f2nuv2uqmt9xr8k2/achihuahuawifhat BADDOG "has a hat" 6  -->
                <v-alert
                  v-if="txError !== ''"
                  variant="outlined"
                  type="warning"
                  prominent
                  class="mb-4"
                  border="top"
                >
                  {{ txError }}
                </v-alert>
                  
                <h3 class="font-weight-bold mb-2">
                  Token description
                  <v-tooltip>
                    <template #activator="{ props }"> 
                      <v-icon
                        v-bind="props"
                        icon="mdi-help-box-multiple-outline"
                      />
                    </template>
                    <span>Add the description of your token that appears onchain<br> 
                    </span>
                  </v-tooltip>
                </h3>
                <v-text-field
                  v-model="denomDescription" 
                  variant="outlined" 
                />  
                <h3 class="font-weight-bold mb-2">
                  Ticker symbol
                  <v-tooltip>
                    <template #activator="{ props }"> 
                      <v-icon
                        v-bind="props"
                        icon="mdi-help-box-multiple-outline"
                      />
                    </template>
                    <span>The toker is the name of your token usually in capital letters<br> 
                    </span>
                  </v-tooltip>
                </h3>
                <v-text-field
                  v-model="tickerSymbol"
                  variant="outlined" 
                /> 
                <h3 class="font-weight-bold mb-2">
                  Token denom
                </h3>
                <v-text-field
                  v-model="finalFactoryDenom" 
                  variant="outlined" 
                  disabled
                />    
                  
                <h3 class="font-weight-bold mb-2">
                  Token Exponent
                  <v-tooltip>
                    <template #activator="{ props }"> 
                      <v-icon
                        v-bind="props"
                        icon="mdi-help-box-multiple-outline"
                      />
                    </template>
                    <span>If you don't know what this is, keep the default value<br>
                      1 <b>huahua</b> = 1000000 <b>uhuahua</b><br>
                      Exponent = 6<br>
                    </span>
                  </v-tooltip>
                </h3>
                <v-text-field
                  v-model="denomExponent" 
                  variant="outlined" 
                />   
                <FeePayer v-if="store.myFeeAllowances.length > 0" />   
                <v-btn
                  class="mt-4"
                  :color="cosmosConfig[store.chain].color"
                  size="large"
                  :loading="loading"
                  block
                  @click="editToken()"
                >
                  Edit token
                </v-btn>          
              </v-card>
            </template>

            <template #item.3>
              <v-card flat>
                <v-alert
                  v-if="txError !== ''"
                  variant="outlined"
                  type="warning"
                  prominent
                  class="mb-4"
                  border="top"
                >
                  {{ txError }}
                </v-alert>
                <h3 class="font-weight-bold mb-2">
                  Amount of tokens to mint
                  <v-tooltip>
                    <template #activator="{ props }"> 
                      <v-icon
                        v-bind="props"
                        icon="mdi-help-box-multiple-outline"
                      />
                    </template>
                    <span>Amount of tokens to mint<br> 
                    </span>
                  </v-tooltip>
                </h3>
                <v-text-field
                  v-model="amountToMint" 
                  variant="outlined" 
                />  
                <FeePayer v-if="store.myFeeAllowances.length > 0" />
                <v-btn
                  class="mt-4"
                  :color="cosmosConfig[store.chain].color"
                  size="large"
                  block
                  :loading="loading"
                  @click="mintToken()"
                >
                  Mint your token
                </v-btn>
              </v-card>
            </template>
          </v-stepper> 
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
  <v-row justify="center">
    <v-dialog
      v-model="dialog" 
      width="900"
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
                alt="huahua"
              />
            </v-avatar>
          </template>

          <v-toolbar-title class="text-h6">
            Send airdrop
          </v-toolbar-title>

          <template #append>
            <v-btn
              icon="mdi-close"
              @click="dialog = false"
            />
          </template>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row no-gutters>
              <v-col
 
                cols="12"
                sm="6"
              >
                <v-sheet class="ma-2 pa-2">
                  <div class="text-h4 font-weight-bold mb-6 align-center text-center">      
                    Airdrop {{ slider2.toFixed(2) }}% 
                  </div>  
                  <v-slider
                    v-model="slider2" 
                    :color="cosmosConfig[store.chain].color"
                  />
                </v-sheet>
              </v-col>
              <v-col 
                cols="12"
                sm="6"
              >
                <v-sheet class="ma-2 pa-2">
                  <v-table>
                    <tbody> 
                      <tr>
                        <td>Total airdrop</td>
                        <td>
                          {{ millify(totalToSend) }}
                          <strong :style="'color:' + cosmosConfig[store.chain].color">
                            {{ denomSelected }}
                          </strong>                         
                        </td>
                      </tr>
                      <tr>
                        <td>Total address</td>
                        <td>{{ finalAddressToSend.length }}</td>
                      </tr>
                      <tr>
                        <td>Amount by address</td>
                        <td>
                          {{ millify(finalAirdropAmount) }}
                          <strong :style="'color:' + cosmosConfig[store.chain].color">
                            {{ denomSelected }}
                          </strong> 
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-sheet>
              </v-col>
            </v-row>
            <v-row>
              <!-- <v-col
                cols="12" 
              >
 
              
                <v-text-field
                  v-model="finalAirdropAmount"
                  label="Airdrop amount"
                  required
                  variant="outlined" 
                ></v-text-field>
              </v-col> --> 
              <v-col
                cols="12"
                sm="6"
                md="12"
              >
                <!-- <v-chip class="mb-4">
                All validators
              </v-chip> -->
              <v-file-input
    show-size
    counter
    multiple
    variant="outlined"
    label="File input"
  ></v-file-input>
                <v-textarea
                  v-model="addressToSend"
                  label="Address (one address by line)"
                  variant="outlined"
                />
              </v-col>
            </v-row>
            <FeePayer v-if="store.myFeeAllowances.length > 0" />
            <v-btn
              :color="cosmosConfig[store.chain].color" 
              size="large"
              class="mt-4"
              block
              disabled 
              @click="burnToken()"
            >
              Soon
              <!-- 🪂 Airdrop 🪂 -->
            </v-btn> 
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogBurn"
      width="500"
    >
      <v-toolbar
        :color="cosmosConfig[store.chain].color"
        theme="dark" 
      >
        <template #prepend>
          <v-avatar>
            <v-img
              max-width="32"
              max-height="32"
              :src="cosmosConfig[store.chain].coinLookup.icon"
              alt="huahua"
            />
          </v-avatar>
        </template>

        <v-toolbar-title class="text-h6">
          Burn token
        </v-toolbar-title>

        <template #append>
          <v-btn
            icon="mdi-close"
            @click="dialogBurn = false"
          />
        </template>
      </v-toolbar>
      <v-card>
        <v-form 
          ref="formSend"
          v-model="formBurnToken"
        > 
          <v-card-text>
            <h3 class="font-weight-bold mb-2">
              Amount of tokens to burn
              <v-tooltip>
                <template #activator="{ props }"> 
                  <v-icon
                    v-bind="props"
                    icon="mdi-help-box-multiple-outline"
                  />
                </template>
                <span>Amount of tokens to burn<br> 
                </span>
              </v-tooltip>
            </h3>
 
            <v-text-field
              v-model="amountToBurn"
              variant="outlined" 
              :rules="[
                v => !!v || 'Amount is required',
                v => v <= (canBeBurn / Number('1e' + denomSelected.denom_units[1]?.exponent)) || 'You don\'t have enough tokens',
              ]"
            >
              <template #append-inner>
                <v-chip
                  label
                  small
                  @click="getMax((canBeBurn / Number('1e' + denomSelected.denom_units[1]?.exponent)))"
                >
                  Max
                </v-chip>
              </template>        
            </v-text-field> 
            <FeePayer v-if="store.myFeeAllowances.length > 0" />
            <v-btn
              :color="cosmosConfig[store.chain].color"
              :disabled="!formBurnToken"
              :loading="loading"
              size="large"
              class="mt-4"
              block 
              @click="burnToken()"
            >
              🔥 BURN 🔥
            </v-btn>  
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogSendToken"
      width="500"
    >
      <v-toolbar
        :color="cosmosConfig[store.chain].color"
        theme="dark" 
      >
        <template #prepend>
          <v-avatar>
            <v-img
              max-width="32"
              max-height="32"
              :src="cosmosConfig[store.chain].coinLookup.icon"
              alt="huahua"
            />
          </v-avatar>
        </template>

        <v-toolbar-title class="text-h6">
          Send token
        </v-toolbar-title>

        <template #append>
          <v-btn
            icon="mdi-close"
            @click="dialogSendToken = false"
          />
        </template>
      </v-toolbar>
      <v-card>
        <v-form 
          ref="formSend"
          v-model="formBurnToken"
        > 
          <v-card-text> 
            <h3 class="font-weight-bold mb-2">
              Amount to send
              <v-tooltip>
                <template #activator="{ props }"> 
                  <v-icon
                    v-bind="props"
                    icon="mdi-help-box-multiple-outline"
                  />
                </template>
                <span>Amount to send<br> 
                </span>
              </v-tooltip>
            </h3>
            <v-text-field
              v-model="amountToSend"
              variant="outlined" 
              :rules="[
                v => !!v || 'Amount is required',
                v => v <= (denomSelected.myToken / Number('1e' + denomSelected.denom_units[1]?.exponent)) || 'You don\'t have enough tokens',
              ]"
            /> 
            <h3 class="font-weight-bold mb-2">
              Address to send
              <v-tooltip>
                <template #activator="{ props }"> 
                  <v-icon
                    v-bind="props"
                    icon="mdi-help-box-multiple-outline"
                  />
                </template>
                <span>Address to send<br> 
                </span>
              </v-tooltip>
            </h3>
            <v-text-field
              v-model="addressToSendToken"
              variant="outlined" 
              :rules="[
                v => !!v || 'Address is required',
                v => checkBech32Address(v) || 'Bad address!!',              
              ]"
            />
            <FeePayer v-if="store.myFeeAllowances.length > 0" />
            <v-btn
              :color="cosmosConfig[store.chain].color"
              :disabled="!formBurnToken"
              :loading="loading"
              size="large"
              class="mt-4"
              block 
              @click="sendToken()"
            >
              Send
            </v-btn>  
          </v-card-text>    
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogEditToken"
      width="900"
    >
      <v-toolbar
        :color="cosmosConfig[store.chain].color"
        theme="dark" 
      >
        <template #prepend>
          <v-avatar>
            <v-img
              max-width="32"
              max-height="32"
              :src="cosmosConfig[store.chain].coinLookup.icon"
              alt="huahua"
            />
          </v-avatar>
        </template>

        <v-toolbar-title class="text-h6">
          Edit token
        </v-toolbar-title>

        <template #append>
          <v-btn
            icon="mdi-close"
            @click="dialogEditToken = false"
          />
        </template>
      </v-toolbar>
      <v-card>
        <v-form 
          ref="formSend"
          v-model="formEditToken"
        > 
          <v-card-text>
            <!-- modify-metadata factory/chihuahua1x4q2vkrz4dfgd9hcw0p5m2f2nuv2uqmt9xr8k2/achihuahuawifhat BADDOG "has a hat" 6  -->
            <v-alert
              v-if="txError !== ''"
              variant="outlined"
              type="warning"
              prominent
              class="mb-4"
              border="top"
            >
              {{ txError }}
            </v-alert>
                  
            <h3 class="font-weight-bold mb-2">
              Token description
              <v-tooltip>
                <template #activator="{ props }"> 
                  <v-icon
                    v-bind="props"
                    icon="mdi-help-box-multiple-outline"
                  />
                </template>
                <span>Add the description of your token that appears onchain<br> 
                </span>
              </v-tooltip>
            </h3>
            <v-text-field
              v-model="denomDescription" 
              variant="outlined" 
            />  
            <h3 class="font-weight-bold mb-2">
              Ticker symbole
              <v-tooltip>
                <template #activator="{ props }"> 
                  <v-icon
                    v-bind="props"
                    icon="mdi-help-box-multiple-outline"
                  />
                </template>
                <span>The toker is the name of your token usually in capital letters<br> 
                </span>
              </v-tooltip>
            </h3>
            <v-text-field
              v-model="tickerSymbol"
              variant="outlined" 
            /> 
            <h3 class="font-weight-bold mb-2">
              Token denom
            </h3>
            <v-text-field
              v-model="finalFactoryDenom" 
              variant="outlined" 
              disabled
            />    
                  
            <h3 class="font-weight-bold mb-2">
              Token Exponent
              <v-tooltip>
                <template #activator="{ props }"> 
                  <v-icon
                    v-bind="props"
                    icon="mdi-help-box-multiple-outline"
                  />
                </template>
                <span>If you don't know what this is, keep the default value<br>
                  1 <b>huahua</b> = 1000000 <b>uhuahua</b><br>
                  Exponent = 6<br>
                </span>
              </v-tooltip>
            </h3>
            <v-text-field
              v-model="denomExponent" 
              variant="outlined" 
            />      
            <FeePayer v-if="store.myFeeAllowances.length > 0" />
            <v-btn
              class="mt-4"
              :color="cosmosConfig[store.chain].color"
              :loading="loading"
              size="large"
              block
              @click="editToken()"
            >
              Edit token
            </v-btn>
          </v-card-text>    
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogMintToken"
      width="500"
    >
      <v-toolbar
        :color="cosmosConfig[store.chain].color"
        theme="dark" 
      >
        <template #prepend>
          <v-avatar>
            <v-img
              max-width="32"
              max-height="32"
              :src="cosmosConfig[store.chain].coinLookup.icon"
              alt="huahua"
            />
          </v-avatar>
        </template>

        <v-toolbar-title class="text-h6">
          Mint your token
        </v-toolbar-title>

        <template #append>
          <v-btn
            icon="mdi-close"
            @click="dialogMintToken = false"
          />
        </template>
      </v-toolbar>
      <v-card>
        <v-form 
          v-model="formMintToken" 
        > 
          <v-card-text>
            <v-alert
              v-if="txError !== ''"
              variant="outlined"
              type="warning"
              prominent
              class="mb-4"
              border="top"
            >
              {{ txError }}
            </v-alert>
                  
            <h3 class="font-weight-bold mb-2">
              Amount to mint
              <v-tooltip>
                <template #activator="{ props }"> 
                  <v-icon
                    v-bind="props"
                    icon="mdi-help-box-multiple-outline"
                  />
                </template>
                <span>Amount to mint 
                </span>
              </v-tooltip>
            </h3>
            <v-text-field
              v-model="amountToMint" 
              variant="outlined" 
              :rules="[
                v => !!v || 'Amount is required',      
              ]"
            /> 
            <FeePayer v-if="store.myFeeAllowances.length > 0" />
            <v-btn
              class="mt-4"
              :color="cosmosConfig[store.chain].color"
              size="large"
              :disabled="!formMintToken"
              :loading="loading"
              block
              @click="mintToken()"
            >
              Mint token
            </v-btn>
          </v-card-text>    
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
 
<script>
  import { useAppStore } from '@/stores/app'
  import cosmosConfig from '@/cosmos.config'
  import { defaultRegistryTypes, calculateFee, GasPrice } from "@cosmjs/stargate";
  import { osmosis } from 'osmojs';
  import { selectSigner, calculFee } from "@/libs/signer";
  import {
  coin,
  coins,
} from "@cosmjs/proto-signing";
import millify from "millify";
import {bech32} from "bech32";

import FeePayer from "@/components/feePayer.vue";
 
function checkBech32Address(address) {
  try {
    bech32.decode(address);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
function checkBech32Prefix(address, chainId) {
  try {
    const { prefix } = bech32.decode(address);
    if (prefix === chainId) {
      return true;
    }
    // return prefix === cosmosConfig[store.setChainSelected].prefix;
  } catch (error) {
    return false;
  }
}
 
  export default {
    components: {
      FeePayer
    },
    setup() {
      const store = useAppStore()
      return {
        store
      }
    },
    data () {
      return {
        millify: millify,
        cosmosConfig: cosmosConfig,
        finalTokenFatory: '',
        itemsPerPage: 4,
        userTokens: [],
        dialog: false,
        dialogCreate: false,
        dialogBurn: false,
        dialogSendToken: false,
        dialogEditToken: false,
        dialogMintToken: false,
        slider2: 0,
        totalCanBeSend: 0,
        totalToSend: 0,
        finalAirdropAmount: 0,
        addressToSend: '',
        addressToSendToken: '',
        finalAddressToSend: [],
        formCreateToken: false,
        formEditToken: false,
        formBurnToken: false,
        formMintToken: false,
        denomSelected: '',
        txError: '',
        isLoaded: false,
        authorised: false,
        displayOnlyAdmin: false,
        

        createTokenName: '',
        finalFactoryDenom: '',
        gasFee: '',
        step: 2,
        itemsCreate: ['Create token', 'Config token', 'Create supply'], 
        denomDescription: '',
        denomExponent: '6',
        tickerSymbol: '',
        burnBase: '',
        mintBase: '',
        canBeBurn: '',
        amountToMint: '',
        amountToBurn: '',
        amountToSend: '',
        addressToSend: '',
        amountToMint: '',
        loading: false,

        search: '',
        headers: [
          {
            align: 'start',
            key: 'symbol',
            sortable: true,
            title: 'Ticker',
          },
          { key: 'display', title: 'Token name' },
          { key: 'myToken', title: 'My token' },
          { key: 'supply', title: 'Supply' }, 
          { key: 'actions', title: 'Actions' }, 
        ],
 
      }
    }, 
    watch: {
      addressToSend (val) {
        //console.log(val.toString().split(/(?:\r\n|\r|\n)/g))
        this.finalAddressToSend = val.toString().split(/(?:\r\n|\r|\n)/g)
        this.finalAirdropAmount = (this.totalToSend / this.finalAddressToSend.length).toFixed(2)

        if (val !== '') {
          for (const [key, value] of Object.entries(this.finalAddressToSend)) {
            let address = value   
            if (checkBech32Address(value) ) {
              console.log('prefix', cosmosConfig[this.store.chain].coinLookup.addressPrefix)
              if (checkBech32Prefix(value, cosmosConfig[this.store.chain].coinLookup.addressPrefix)) {
                 console.log('ok')
              } else {
                console.log('bad prefix') 
              }
              //console.log('ok')
            } else {
              console.log('bad address') 
            }
          }
        }
      },
      slider2 (val) {
        this.totalToSend = (this.totalCanBeSend * this.slider2 / 100).toFixed(2)
        this.finalAirdropAmount = (this.totalToSend / this.finalAddressToSend.length).toFixed(2)
      },
      createTokenName () {
        this.txError = ''
      },
    },
    async beforeMount () { 
      if (
        this.store.addrWallet === 'chihuahua1jshrvktsme0vh5z8kx6d8hgp7kp62zpxh3t2ld' || 
        this.store.addrWallet === 'chihuahua1skeqnjwmjpv50n5lak2kzj6ujz59gu4m7z545j' || 
        this.store.addrWallet === 'chihuahua13jawsn574rf3f0u5rhu7e8n6sayx5gkw3eddhp'
      ) {
        this.authorised = true
      }
      await this.store.getTokenFactory()
      this.finalTokenFatory = this.store.userTokensFactory
      this.isLoaded = true
    },
    methods: {
      async createToken () {
        this.loading = true
        let signer = await selectSigner(this.store.chain, this.store.loggedType)
        
        const foundMsgType = osmosis.tokenfactory.v1beta1.registry.find(
          (element) =>
            element[0] ===
              "/osmosis.tokenfactory.v1beta1.MsgCreateDenom"
        );   
 
        const finalMsg = {
        typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            sender: signer.accounts[0].address,
            subdenom: this.createTokenName
          }),
        }
        // Fee/Gas
        let finalFee = {}
        try {
          const gasEstimation = await signer.client.simulate(
            signer.accounts[0].address,
            [finalMsg],
            'Create token'
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
          finalFee = {
            amount: feeAmount,
            gas: usedFee.gas,
            granter: this.store.setFeePayer,
          }
          this.txError = ''
        } catch (error) {
          console.error(error); 
          this.txError = error
          this.loading = false
          return
        }

        try {
          const result = await signer.client.signAndBroadcast(signer.accounts[0].address, [finalMsg], finalFee, '')
          console.log(result) 
          this.step = 2
          this.finalFactoryDenom = 'factory/' + signer.accounts[0].address + '/' +  this.createTokenName 
          this.txError = ''

          await this.store.getTokenFactory()
          this.finalTokenFatory = this.store.userTokensFactory
          this.loading = false
        } catch (error) {
          console.error(error); 
          this.txError = error
          this.loading = false
        }
      },
      async editToken () {
        this.loading = true
        let signer = await selectSigner(this.store.chain, this.store.loggedType)      

        const foundMsgType = osmosis.tokenfactory.v1beta1.registry.find(
          (element) =>
            element[0] ===
              "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata"
        );   
 
        const finalMsg = {
        typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            sender: signer.accounts[0].address,
            metadata: {
              description: this.denomDescription,
              denomUnits: [
                {
                  denom: this.finalFactoryDenom,
                  exponent: Number(0)
                },
                {
                  denom: this.tickerSymbol,
                  exponent: Number(this.denomExponent)
                }
              ],
              base: this.finalFactoryDenom,
              display: this.finalFactoryDenom,
              name: this.finalFactoryDenom,
              symbol: this.tickerSymbol,
            }
          }),
        }
        console.log(finalMsg)
        // Fee/Gas
        let finalFee = {}
        try {
          const gasEstimation = await signer.client.simulate(
            signer.accounts[0].address,
            [finalMsg],
            'Create token'
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
          finalFee = {
            amount: feeAmount,
            gas: usedFee.gas,
            granter: this.store.setFeePayer,
          }
          this.txError = ''
        } catch (error) {
          console.error(error); 
          this.txError = error
          this.loading = false
          return
        }

        

        try {
          const result = await signer.client.signAndBroadcast(signer.accounts[0].address, [finalMsg], finalFee, '')
          console.log(result) 
          this.step = 3
          this.mintBase = this.finalFactoryDenom

          await this.store.getTokenFactory()
          this.finalTokenFatory = this.store.userTokensFactory
          this.dialogEditToken = false
          this.loading = false
        } catch (error) {
          console.error(error); 
          this.txError = error
          this.loading = false
        }
      },
      async mintToken () {
        this.txError = ''
        this.loading = true
        let signer = await selectSigner(this.store.chain, this.store.loggedType)
        const foundMsgType = osmosis.tokenfactory.v1beta1.registry.find(
          (element) =>
            element[0] ===
              "/osmosis.tokenfactory.v1beta1.MsgMint"
        );   

        const amountToMint = coin(this.amountToMint * Number("1e" + this.denomSelected.denom_units[1]?.exponent), this.finalFactoryDenom);

        const finalMsg = {
        typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({        
            sender: signer.accounts[0].address,
            amount: amountToMint,
            mintToAddress: ""
          }),
        }
        console.log(finalMsg)
        // Fee/Gas
        let finalFee = {}
        try {
          const gasEstimation = await signer.client.simulate(
            signer.accounts[0].address,
            [finalMsg],
            'Create token'
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
          finalFee = {
            amount: feeAmount,
            gas: usedFee.gas,
            granter: this.store.setFeePayer,
          }
        } catch (error) {
          console.error(error); 
          this.txError = error
          this.loading = false
          return
        }
        try {
          const result = await signer.client.signAndBroadcast(signer.accounts[0].address, [finalMsg], finalFee, '') 
          console.log(result)  
          this.txError = ''
          console.log(finalMsg)
          await this.store.getTokenFactory()
          this.finalTokenFatory = this.store.userTokensFactory
          this.dialogMintToken = false
          this.dialogCreate = false
          this.loading = false

        } catch (error) {
          console.error(error); 
          this.txError = error
          this.loading = false
        }
      },
      async burnToken () {
        this.loading = true
        this.txError = ''
        let signer = await selectSigner(this.store.chain, this.store.loggedType)
        const foundMsgType = osmosis.tokenfactory.v1beta1.registry.find(
          (element) =>
            element[0] ===
              "/osmosis.tokenfactory.v1beta1.MsgBurn"
        );    

        const amountToBurn = coin(this.amountToBurn * Number("1e" + this.denomSelected.denom_units[1]?.exponent), this.burnBase);

        const finalMsg = {
        typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({        
            sender: signer.accounts[0].address,
            burnFromAddress: signer.accounts[0].address,
            amount: amountToBurn
          }),
        } 
        // Fee/Gas
        let finalFee = {}
        try {
          const gasEstimation = await signer.client.simulate(
            signer.accounts[0].address,
            [finalMsg],
            'Burn token'
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
          finalFee = {
            amount: feeAmount,
            gas: usedFee.gas,
            granter: this.store.setFeePayer,
          }
        } catch (error) {
          console.error(error); 
          this.txError = error
          this.loading = false
          return
        }
        try {
          const result = await signer.client.signAndBroadcast(signer.accounts[0].address, [finalMsg], finalFee, '') 
          console.log(result)  
          this.txError = ''
          console.log(finalMsg)
          await this.store.getTokenFactory()
          this.finalTokenFatory = this.store.userTokensFactory
          this.dialogBurn = false
          this.loading = false

        } catch (error) {
          console.error(error); 
          this.txError = error
          this.loading = false
        }
      },
      async sendToken () {
        this.txError = ''
        this.loading = true
        let signer = await selectSigner(this.store.chain, this.store.loggedType)
        const foundMsgType = defaultRegistryTypes.find(
            (element) =>
              element[0] ===
              "/cosmos.bank.v1beta1.MsgSend"
          );  

          const amount = coins((this.amountToSend ) * Number("1e" + this.denomSelected.denom_units[1]?.exponent), this.denomSelected.base);
          const finalMsg = {
          typeUrl: foundMsgType[0],
            value: foundMsgType[1].fromPartial({
              fromAddress: signer.accounts[0].address,
              toAddress: this.addressToSendToken,
              amount: amount,
            }),
          }
        console.log(finalMsg)
        
        // Fee/Gas
        let finalFee = {}
        try {
          const gasEstimation = await signer.client.simulate(
            signer.accounts[0].address,
            [finalMsg],
            'Send token'
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
          finalFee = {
            amount: feeAmount,
            gas: usedFee.gas,
            granter: this.store.setFeePayer,
            //granter: this.store.setFeePayer,
        }
        } catch (error) {
          console.error(error); 
          this.txError = error
          this.loading = false
          return
        }
        try {
          const result = await signer.client.signAndBroadcast(signer.accounts[0].address, [finalMsg], finalFee, '') 
          console.log(result)  
          this.txError = ''
          console.log(finalMsg)
          await this.store.getTokenFactory()
          this.finalTokenFatory = this.store.userTokensFactory
          this.dialogSendToken = false
          this.loading = false

        } catch (error) {
          console.error(error); 
          this.txError = error
          this.loading = false
        }
      }, 
      async sendToken () {
        this.txError = ''
        this.loading = true
        let signer = await selectSigner(this.store.chain, this.store.loggedType)
        const foundMsgType = defaultRegistryTypes.find(
            (element) =>
              element[0] ===
              "/cosmos.bank.v1beta1.MultiSend"
          );  

          const amount = coins((this.amountToSend ) * Number("1e" + this.denomSelected.denom_units[1]?.exponent), this.denomSelected.base);
          const finalMsg = {
          typeUrl: foundMsgType[0],
            value: foundMsgType[1].fromPartial({
              fromAddress: signer.accounts[0].address,
              toAddress: this.addressToSendToken,
              amount: amount,
            }),
          }
        console.log(finalMsg)
        
        // Fee/Gas
        let finalFee = {}
        try {
          const gasEstimation = await signer.client.simulate(
            signer.accounts[0].address,
            [finalMsg],
            'Send token'
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
          finalFee = {
            amount: feeAmount,
            gas: usedFee.gas,
            granter: this.store.setFeePayer,
            //granter: this.store.setFeePayer,
          }
        } catch (error) {
          console.error(error); 
          this.txError = error
          this.loading = false
          return
        }
        /* try {
          const result = await signer.client.signAndBroadcast(signer.accounts[0].address, [finalMsg], finalFee, '') 
          console.log(result)  
          this.txError = ''
          console.log(finalMsg)
          await this.store.getTokenFactory()
          this.finalTokenFatory = this.store.userTokensFactory
          this.dialogSendToken = false
          this.loading = false

        } catch (error) {
          console.error(error); 
          this.txError = error
          this.loading = false
        } */
      }, 
      checkBech32Address (address) {
        try {
          bech32.decode(address);
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      },
      getMax(amount) {
        this.amountToBurn = amount 
      },
      openDialog (amount, chainDenom) {
        this.dialog = true
        console.log(amount)
        this.totalCanBeSend = amount 
        this.denomSelected = chainDenom
      },
      openDialogCreate () {
        this.dialogCreate = true
        this.step = 1
        this.finalFactoryDenom = ''
        this.createTokenName = ''
        this.txError = ''
      },
      onClickSeeAll () {
        this.itemsPerPage = this.itemsPerPage === 4 ? this.userTokens.length : 4
      },
      openDialEditToken (denom) {
        this.dialogEditToken = true
        this.denomDescription = denom.description
        this.tickerSymbol = denom.symbol
        this.finalFactoryDenom = denom.base
        //this.denomExponent = denom.denomUnits[1].exponent
        this.txError = ''
        this.dialogEditToken = denom.base
      },
      openDialogBurn (denom) {
        this.denomSelected = ''
        this.dialogBurn = true
        this.txError = ''
        this.burnBase = denom.base
        this.canBeBurn = denom.myToken
        this.denomSelected = denom

      },
      openDialMintToken (denom) {
        this.denomSelected = ''
        this.dialogMintToken = true
        this.txError = ''
        this.mintBase = denom.base
        this.denomSelected = denom
        this.finalFactoryDenom = denom.base
      },
      openDialogSendToken (denom) {
        this.denomSelected = ''
        this.amountToSend = ''
        this.addressToSendToken = ''
        this.dialogSendToken = true
        this.txError = ''
        this.denomSelected = denom
      },
      onlyAdmin() {
        console.log(this.displayOnlyAdmin)
        if(!this.displayOnlyAdmin) {
          this.finalTokenFatory = []
          for (const [key, value] of Object.entries(this.store.userTokensFactory)) {
            console.log(value.isAdmin)
            if (value.isAdmin) {
              this.finalTokenFatory.push(value)
            }
          }
        } else {
          this.finalTokenFatory = this.store.userTokensFactory
        }
      },

      truncateString(
        fullStr,
        strLen = 8,
        separator = "...",
        frontChars = 16,
        backChars = 8
      ) {
        if (fullStr.length <= strLen) return fullStr;

        return (
          fullStr.substr(0, frontChars) +
          separator +
          fullStr.substr(fullStr.length - backChars)
        );
      }
    },
  }
</script>