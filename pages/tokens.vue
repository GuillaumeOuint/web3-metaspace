<template>
  <div>
    <div v-for="contract in contracts" :key="contract.instance._address" class="max-w-sm rounded overflow-hidden shadow-lg">
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
      <div class="px-6 pt-4 pb-2">
        <Button @click="mint(contract)">Mint token</Button>
      </div>
      <div class="px-6 pt-4 pb-2">
        <Button @click="sell(contract)">Sell token</Button>
      </div>
    </div>
  </div>
</template>


<script>
import TokenABI from "@/contracts/artifacts/OTXToken.json";
export default {
    data() {
      return {
        contracts: [
          {address:"0x39053C1E6b8220EBfA18Fe2615Ad5E4764f7a787",abi:TokenABI.abi,instance:false,data:{name:"",totalSupply:"",symbol:"",balance:"0"}}
        ]
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
      mint(contract) {
        this.$toast.show({
            type: 'info',
            title: 'Minting...',
            message: 'Mint in progress, please wait accept the transaction and wait for the network to accept your transaction',
            timeout:30,
          })
          this.$fetch();
        contract.instance.methods._mintToken().send({from:this.web3.addr,value:"1000000000000000000"}).then((event)=>{
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
        contract.instance.methods.sell(this.web3.web3.utils.toBN(1000000000000000000)).send({from:this.web3.addr}).then((event)=>{
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


