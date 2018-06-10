<template>
  <div style="min-height:100vh">
    <mu-flex direction="column" justify-content="between" id="app">
      <mu-appbar style="width: 100%;" color="primary">
        <mu-button icon slot="left" v-if="$store.state.loginStatus.login">
          <mu-icon @click="open = true" value="menu"></mu-icon>
        </mu-button>
        {{Title}}
        <!-- <mu-button flat slot="right">LOGIN</mu-button> -->
      </mu-appbar>
      <router-view style="width: 100%;"/>
      <mu-flex class="footer" style="width: 100%;" direction="column" align-items="center">
        <mu-flex class="footText" justify-content="center"> 版权信息 </mu-flex>
        <mu-flex class="footText" justify-content="center"> 版权信息 </mu-flex>
      </mu-flex>
    </mu-flex>
    <mu-drawer :open.sync="open">
      <mu-list>
        <mu-list-item button>
          <mu-avatar :size="80">
            <img :src="$store.state.loginStatus.avatar_url"/>
          </mu-avatar>
          <mu-list-item-title>{{$store.state.loginStatus.nick_name}}</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button>
          <mu-list-item-title>关于</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button>
          <mu-list-item-title @click="open = false">关闭</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-drawer>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      Title: "群文件",
      open: false
    }
  },
  components:{ }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height:100vh;
}
.footer{
  border-top:1px solid gray;
}
.footText{
  color: gray;
  font-size: 80%;
}
</style>
