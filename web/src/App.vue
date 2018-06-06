<template>
  <mu-flex direction="column" justify-content="between" id="app">
    <mu-appbar style="width: 100%;" color="primary">
      <!-- <mu-button icon slot="left">
        <mu-icon value="menu"></mu-icon>
      </mu-button> -->
      {{Title}}
      <!-- <mu-button flat slot="right">LOGIN</mu-button> -->
    </mu-appbar>
    <router-view style="width: 100%;"/>
    <mu-flex class="footer" style="width: 100%;" direction="column" align-items="center">
      <mu-flex class="footText" justify-content="center"> 版权信息 </mu-flex>
      <mu-flex class="footText" justify-content="center"> 版权信息 </mu-flex>
    </mu-flex>
  </mu-flex>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      Title: "群文件"
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
  height:100%;
}
.footer{
  border-top:1px solid gray;
  box-shadow: darkgrey 3px 0 0 0;
}
.footText{
  color: gray;
  font-size: 80%;
}
</style>
