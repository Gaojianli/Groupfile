import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);

import loginStatus from './modules/loginStatus'

export default new vuex.Store({
    modules:{
        loginStatus: loginStatus
    },
    state:{
        
    }
})