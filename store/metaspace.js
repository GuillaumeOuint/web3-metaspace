export default {
  state() {
    return {
      version: 'v1alpha',
      logged: false

    }
  },
  mutations: {
    setLogged(state,value) {
      state.logged=value
      localStorage.setItem('store', JSON.stringify(state));
    },
    initialiseStore(state) {
			if(localStorage.getItem('store')) {
        let store = JSON.parse(localStorage.getItem('store'));
    
        // Check the version stored against current. If different, don't
        // load the cached version
        if(store.version != state.version) {
          localStorage.setItem('store', JSON.stringify(state));
        } else {
          this.replaceState(
            Object.assign(state, store)
          );
        }
      } else {
        localStorage.setItem('store', JSON.stringify(state));
      }
		}
  },
  actions: {
    async Login({commit}) {
      commit('setLogged', true)
    },
    async Logout({commit}) {
      commit('setLogged',false)
    }
  },
  getters: {
    logged(state) {
      return state.logged
    }
  }
}