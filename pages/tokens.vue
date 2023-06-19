<template>
  <div class="lg:flex">
    <div v-for="contract in contracts" :key="contract.instance._address" class="m-auto not-first:mt-2 not-first:ml-2 w-full max-w-auto lg:w-sm lg:max-w-sm rounded overflow-hidden shadow-lg bg-blue-900">
      <button @click="contracts.push(contract)">+</button>
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2 text-white">{{contract.data.name}}</div>
        <p class="text-white text-base">
          Total supply: {{contract.data.totalSupply}} {{contract.data.symbol}}
        </p>
        <p class="text-white text-base">
          You own: {{contract.data.balance}} {{contract.data.symbol}}
        </p>
        <p class="text-gray-300 text-xs">
          Address: {{ contract.address }}
        </p>
      </div>
      <div class="px-6 pt-4 pb-5 flex center-items">
        <div class="custom-number-input h-10 w-full">
          <label for="custom-input-number" class="w-full text-white text-sm font-semibold">Mint/Sell
          </label>
          <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
            <button @mousedown="md(contract,'-')" @mouseup="mu" class=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
              <span class="m-auto text-2xl font-thin">−</span>
            </button>
            <div class="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none">
              {{contract.amount}}
            </div>
            <button @mousedown="md(contract,'+')" @mouseup="mu" class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
              <span class="m-auto text-2xl font-thin">+</span>
            </button>
            <button v-for="amount, i in amounts" :key="i" @click="()=>{contract.amount=amount}" class="ml-2 text-center w-40 bg-gray-300 rounded-md font-semibold text-md hover:text-black focus:text-black text-gray-700">
              {{amount}}
            </button>
          </div>
        </div>
      </div>
      <div class="px-6 pt-4 pb-2">
        <Button @click="mint(contract)">Mint token</Button>
      </div>
      <div class="px-6 pt-4 mb-4 pb-2">
        <Button @click="sell(contract)">Sell token</Button>
      </div>
    </div>
    <div v-if="contracts.length==0" class="flex text-white">
      <p class="m-auto">No tokens found</p>
    </div>
  </div>
</template>


<script>
import OTXToken from "@/contracts/artifacts/OTXToken.json";
export default {
    data() {
      return {
        contracts: [
          // {address:"0x39053C1E6b8220EBfA18Fe2615Ad5E4764f7a787",amount:1,abi:OTXToken.abi,instance:false,data:{name:"",totalSupply:"",symbol:"",balance:"0"}}
        ],
        interval: null,
        amounts: [250,500,5000]
      }
    },
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
    methods: {
      md(contract,sign) {
        this.incdec(contract,sign);
        var i = 200;
        this.interval = setInterval(()=>{this.intertime(contract,sign,i,0)},i)
      },
      intertime(contract,sign,i,count) {
        this.incdec(contract,sign);
        if(count%30==0&&i>5){
          i-=5;
          clearInterval(this.interval);
          this.interval = setInterval(()=>{this.intertime(contract,sign,i,count)},i)
        } else {
          count++;
        }
        console.log(i,count,count%30)
      },
      mu() {
        clearInterval(this.interval);
      },
      incdec(contract,sign) {
        if(sign=="+")
        {
          contract.amount++
        } else {
          if(contract.amount>1)contract.amount--
        }
      },
      mint(contract) {
        this.$toast.show({
            type: 'info',
            title: 'Minting...',
            message: 'Mint in progress, please accept the transaction and wait for the network to accept your transaction',
            timeout:30,
          })
          this.$fetch();
        contract.instance.methods._mintToken().send({from:this.web3.addr,value:`${contract.amount}000000000000000000`}).then((event)=>{
          console.log(event)
          this.$toast.show({
            type: (event.success)? 'danger':'success',
            title: (event.success)? 'Failure':'Success',
            message: (event.success)? 'Failed to mint':'Successful mint',
            timeout: 5
          })
          this.$fetch();
        }).catch((event)=>{
          this.$toast.show({
            type: 'denied',
            title: 'Something went wrong with MetaMask',
            message: '('+event.code+') '+event.message,
            timeout: 10
          })
        })
      },
      sell(contract) {
        this.$toast.show({
            type: 'info',
            title: 'Burning/Sell...',
            message: 'Burn/sell in progress, please wait accept the transaction and wait for the network to accept your transaction',
            timeout:30,
          })
          this.$fetch();
        contract.instance.methods.sell(this.web3.web3.utils.toBN(`${contract.amount}000000000000000000`)).send({from:this.web3.addr}).then((event)=>{
          console.log(event)
          this.$toast.show({
            type: (event.success)? 'danger':'success',
            title: (event.success)? 'Failure':'Success',
            message: (event.success)? 'Failed to burn':'Successful burn',
            timeout: 5
          })
          this.$fetch();
        }).catch((event)=>{
          this.$toast.show({
            type: 'denied',
            title: 'Something went wrong with MetaMask',
            message: '('+event.code+') '+event.message,
            timeout: 10
          })
        })
      }
    },
    fetch() {
      if(this.web3.addr=='') { return }
      this.contracts.forEach((contract,i)=>{
        const Contract = new this.web3.web3.eth.Contract(contract.abi,contract.address);
        Contract.methods.name().call().then((name)=>{
          this.contracts[i].data.name=name;
        })
        Contract.methods.totalSupply().call().then((totalSupply)=>{
          this.contracts[i].data.totalSupply=this.web3.web3.utils.fromWei(totalSupply);
        })
        Contract.methods.symbol().call().then((symbol)=>{
          this.contracts[i].data.symbol=symbol;
        })
        Contract.methods.balanceOf(this.web3.addr).call().then((balance)=>{
          this.contracts[i].data.balance=this.web3.web3.utils.fromWei(balance);;
        })
        this.contracts[i].instance=Contract;
      })
    }
}
</script>


