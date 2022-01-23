<template>
  <div class="bg-indigo-900 relative overflow-hidden h-screen">
    <div class="inset-0 bg-black opacity-25 absolute">
    </div>
    <header class="absolute top-0 left-0 right-0 z-20 w-100 bg-indigo-900">
      <nav class="container mx-auto px-6 md:px-12 py-4">
        <div class="flex justify-center items-center">
          <div class="flex items-center flex-wrap">
            <nuxt-link
              class="
                text-lg
                uppercase
                mx-3
                text-white
                cursor-pointer
                hover:text-gray-300
              "
              to="/"
              >Home</nuxt-link
            >
            <nuxt-link
              class="
                text-lg
                uppercase
                mx-3
                text-white
                cursor-pointer
                hover:text-gray-300
              "
              to="/about"
              >About</nuxt-link>
            <Button :click="wlogin" v-if="web3provider.addr=='' && !logged" type="button" class="py-2 px-4  bg-gradient-to-r from-green-400 to-blue-500 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ">
              Connect with Metamask
            </Button>
            <nuxt-link v-if="web3provider.addr && logged"
              class="
                text-lg
                uppercase
                mx-3
                text-white
                cursor-pointer
                hover:text-gray-300
              "
              to="/tokens"
              >Tokens</nuxt-link>
            <nuxt-link v-if="web3provider.addr && logged"
              class="
                text-lg
                uppercase
                mx-3
                text-white
                cursor-pointer
                hover:text-gray-300
              "
              to="/tokens"
              >NFTs</nuxt-link>
            <nuxt-link v-if="web3provider.addr && logged"
              class="
                text-lg
                uppercase
                mx-3
                text-white
                cursor-pointer
                hover:text-gray-300
              "
              to="/tokens"
              >Games</nuxt-link>
            <nuxt-link
              class="
                text-lg
                uppercase
                mx-3
                text-white
                cursor-pointer
                hover:text-gray-300
              "
              v-if="web3provider.addr && logged"
              to="/wallet"
              >Wallet</nuxt-link>
          </div>
        </div>
      </nav>
    </header>

    <div v-if="wantlogin||logged">
      <Metamask @onComplete="onComplete" />
    </div>
    <div class="container mx-auto px-6 md:px-12 relative z-10 flex items-center py-32 xl:py-40">
        <div class="w-full flex flex-col items-center relative z-10">
          <div class="grid grid-cols-1 divide-y divide-yellow-500">
            <div v-if="web3provider.addr && logged && !web3provider.goodNetwork">
              <p class="font-extrabold text-3xl text-center text-white leading-tight mt-4">You need to be on the OtuxChain Network</p>
              <p class="font-extrabold text-2xl text-center text-white leading-tight mt-4">
                Contact !Guillaume.O#0420 on discord for network details (RPC, ChainID,
                etc...)
              </p>
            </div>
            <div v-if="logged">
              <NuxtChild @onWantLogin="wlogin" v-if="web3provider.addr!=''"/>
            </div>
            <div v-else>
              <NuxtChild @onWantLogin="wlogin"/>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  expose: ["web3provider"],
  created() {
    if (
      window.location.protocol !== "https:" &&
      !window.location.href.includes("localhost") &&
      !window.location.href.includes("ipfs")
    )
      window.location.href = window.location.href.replace("http", "https");
  },
  computed: {
    ...mapGetters({
      logged: "metaspace/logged",
    }),
  },
  data() {
    return {
      wantlogin:false,
      web3provider: {
        goodNetwork: false,
        addr: "",
        balance: "",
        web3: {},
      },
    };
  },
  methods: {
    onComplete(data) {
      console.log("data:", data);
      if (
        data.type == "NO_LOGIN" ||
        data.type == "USER_DENIED_ACCOUNT_AUTHORIZATION" ||
        data.type == "NO_INSTALL_METAMASK"
      ) {
        this.web3provider.addr='';
        this.logout();
        return;
      }
      this.login()
      this.web3provider.addr = data.metaMaskAddress;
      if (data.netID == 1999) {
        this.web3provider.goodNetwork = true;
      } else {
          this.web3provider.goodNetwork = false;
      }
      this.web3provider.web3 = data.web3;
      data.web3.eth.getBalance(
        this.web3provider.addr,
        "latest",
        (err, datad) => {
          this.web3provider.balance = parseFloat(
            data.web3.utils.fromWei(datad, "ether")
          )
            .toFixed(4)
            .toString();
        }
      );
    },
    wlogin() {
        this.wantlogin=true;
    },
    ...mapActions({
      login: "metaspace/Login",
      logout: "metaspace/Logout",
    }),
  },
};
</script>
