<template>
  <div>
    <div v-if="web3.addr!='' && web3.goodNetwork">
      <p class="font-extrabold text-3xl text-center text-white leading-tight mt-4 break-words" v-if="web3.addr != ''">Connected wallet: {{ web3.addr }}</p>
      <p class="font-extrabold text-3xl text-center text-white leading-tight mt-4 break-words" v-if="web3.balance != ''">Wallet balance: {{ web3.balance }} MATIC</p>
    </div>
    <div v-else>
      <p class="font-extrabold text-3xl text-center text-white leading-tight mt-4" v-if="web3.addr != ''">Unknown network</p>
    </div>
  </div>
</template>


<script>
export default {
    data () {
      return {
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


