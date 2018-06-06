<template>
    <mu-flex justify-content="center" align-items="center">
        <mu-flex justify-content="center" align-items="center" >
            <mu-card style="width: 100%; max-width: 375px; margin: 0 auto;">
                <mu-card-header title=" ">
                </mu-card-header>
                <mu-card-media>
                    <vue-qr 
                        :text="qrcodeUrl" 
                        v-if="qrcodeUrl"
                        :size="200" 
                        :margin="0"
                        :colorDark="qroption.bgColor"
                    ></vue-qr>
                </mu-card-media>
                <mu-card-text>
                    请使用小程序: 群文件分享 扫描登陆
                    <!-- {{cookie}} -->
                </mu-card-text>
                <!-- <mu-card-actions>
                    <mu-button flat>Action 1</mu-button>
                    <mu-button flat>Action 2</mu-button>
                </mu-card-actions> -->
            </mu-card>
        </mu-flex>
    </mu-flex>
</template>

<style>
</style>

<script>
import {mapState} from 'vuex';
import VueQr from "vue-qr";
export default {
  name: "qrCode",
  components: { VueQr },
  data() {
    return {
      qrcodeUrl: "https://www.baidu.com",
      qroption: {
        bgColor: "#51A8DD",
        size: 500
      },
    };
  },
  mounted () {
      // TODO: 这里写ws相关.
    //   var that = this;
    //   var ws = new WebSocket("wss://asdf.zhr1999.club/api/qrCode");
    //   ws.onopen = function()
    //   {
    //      // Web Socket 已连接上，使用 send() 方法发送数据
    //      ws.send("发送数据");
    //      alert("数据发送中...");
    //   };
    //   ws.onmessage = function (evt) 
    //   { 
    //       if(evt.data != "success"){
    //           ws.close();
    //       }
    //     that.qrcodeUrl = evt.data;
    //     that.$store.state.loginStatus.cookie 
    //      var received_msg = evt.data;
    //      alert("数据已接收...");
    //   };
    //   ws.onclose = function()
    //   { 
    //      // 关闭 websocket
    //      alert("连接已关闭..."); 
    //   };
    //   console.log(this);
  },
  methods:{
    
    //   onclickit(e){
    //       console.log(e);
    //       console.log(this.$store.state.loginStatus.cookie)
    //       this.$store.state.loginStatus.cookie = "aassdff"
    //   }
  },
  computed:{
    //这里的三点叫做 : 扩展运算符
    ...mapState({
      cookie:state=>state.loginStatus.cookie
    }),
  }
};
</script>
