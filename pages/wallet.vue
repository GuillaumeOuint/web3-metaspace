<template>
  <div>
    <div v-if="web3.addr!='' && web3.goodNetwork">
      <p class="font-extrabold text-3xl text-center text-white leading-tight mt-4" v-if="web3.addr != ''">Connected wallet: {{ web3.addr }}</p>
      <p class="font-extrabold text-3xl text-center text-white leading-tight mt-4" v-if="web3.balance != ''">Wallet balance: {{ web3.balance }} OTXC</p>
    </div>
    <div v-else>
      <p class="font-extrabold text-3xl text-center text-white leading-tight mt-4" v-if="web3.addr != ''">Unknown network</p>
    </div>
    <p class="font-extrabold text-xl text-center text-white leading-tight mt-4" v-if="web3.addr != ''">Transaction history</p>
    <Button :click="refresh">Refresh</Button>
    <p v-if="$fetchState.pending">Fetching transactions...</p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else-if="web3.addr!=''">
      <div v-for="transac in transactions.data" :key="transac.hash">
        <p>Type: {{transac.transactionType}}</p>
        <p>To: {{transac.to}}</p>
        <p>Hash: {{transac.hash}}</p>
      </div>
    </div>
  </div>
</template>


<script>
export default {
    data () {
      return {
        transactions:[],
      }
    },
    computed: {
      web3() {
        return this.$parent.web3provider
      }
    },
    async fetch() {
      if(this.web3.addr!='') {
        var transac = await this.$axios.get(`https://web3explorer.goinfra.info/api/accounts/${this.web3.addr}/transactions`)
        this.transactions = transac.data
      }
    },
    mounted() {
      if(this.web3.addr=='') {
        this.$emit("onWantLogin")
      }
    },
    methods: {
      refresh() {
        this.$fetch();
      }
    },
    watch: {
      'web3.addr': {
        handler: 'refresh',
      }
    }
}
</script>


