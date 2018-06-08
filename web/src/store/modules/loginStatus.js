export default {
    state:{
        cookie:null,
        login:false,
        show:false,
        nick_name: null,
        avatar_url: null
    },
    mutations:{ // 这里的方法必须同步
        switch_dialog(state){//这里的state对应着上面这个state
            state.show = state.show?false:true;
            //你还可以在这里执行其他的操作改变state
        }
        //$store.commit('switch_dialog')
    },
    actions:{ //这里放异步操作
        switch_dialog(context){//这里的context和我们使用的$store拥有相同的对象和方法
            context.commit('switch_dialog');
            //你还可以在这里触发其他的mutations方法
        },
    },
    getters:{
        not_show(state){//这里的state对应着上面这个state
            return !state.show;
        }
    }
}