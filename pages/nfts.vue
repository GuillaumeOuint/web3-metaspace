<template>
  <div class="lg:flex px-6 py-4" v-if="web3.addr!=''">
    <div class="m-auto max-w-auto rounded overflow-hidden shadow-lg bg-blue-900 p-4 text-white">
      <p class="text-lg">Stable Diffusion NFT ({{contracts[0].address}})</p>
      <input type="text" class="w-full mt-2 rounded-sm p-2 text-black" placeholder="Your stable diffusion prompt" v-model="prompt">
      <Button class="mt-2" @click="generate">Generate</Button>
      <div class="mt-8" v-if="sessionid!=''">
        <p class="text-lg">Session ID: {{sessionid}}</p>
        <p class="text-lg">State: {{stateMap[state]}}</p>
        <p class="text-lg">Token ID: {{tokenid}}</p>
        <p class="text-lg" v-if="tokenid!='Not generated yet'">NFT URL: <a :href="`https://testnets.opensea.io/fr/assets/mumbai/${contracts[0].address}/${tokenid}`">https://testnets.opensea.io/fr/assets/mumbai/{{contracts[0].address}}/{{tokenid}}</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import SDNFT from "@/contracts/artifacts/SDNFT.json";
export default {
  computed: {
    web3() {
      return this.$parent.web3provider
    }
  },
  mounted() {
    if(this.web3.addr=='') {
      this.$emit("onWantLogin")
    }
  },
  data() {
    return {
      contracts: [
        {address:"0x10D73117Afb20D2bd2387471b538da50C071Ddb3",abi:SDNFT.abi,instance:false}
      ],
      prompt:"",
      sessionid: "",
      state: "0",
      interval: null,
      tokenid: "Not generated yet",
      stateMap: {
        "0": "Not picked up by backend",
        "1": "In queue",
        "2": "Generating",
        "3": "Finished"
      }
    }
  },
  fetch() {
    if(this.web3.addr=='') { return }
    this.contracts.forEach((contract,i)=>{
      const Contract = new this.web3.web3.eth.Contract(contract.abi,contract.address);
      this.contracts[i].instance=Contract;
    })
  },
  methods: {
    refresh() {
      this.$fetch();
    },
    async generate() {
      let sessionid = this.uuid();
      await this.contracts[0].instance.methods.askToken(this.prompt,sessionid).send({from:this.web3.addr,value:this.web3.web3.utils.toWei("0.05","ether")})
      .on('transactionHash', (hash) => {
        this.sessionid=sessionid;
      })
      this.interval = setInterval(()=>{this.check()},1000)
    },
    uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    check() {
      this.contracts[0].instance.methods.getState(this.sessionid).call().then((state)=>{
        this.state = state;
        if(state=="3") {
          this.contracts[0].instance.methods.getFinished(this.sessionid).call().then((tokenid)=>{
            this.tokenid = tokenid;
            clearInterval(this.interval);
          })
        }
      })
    }
  },
  watch: {
    'web3.addr': {
      handler: 'refresh',
    }
  }
}
</script>