<template>
  <div>
    
  </div>
</template>


<script>
export default {
    computed: {
        web3() {
            console.log(this.$attrs.web3)
            return this.$attrs.web3
        }
    },
    mounted() {
      if(this.web3.addr=='') {
        this.$emit("onWantLogin")
      }
    }
}
</script>


