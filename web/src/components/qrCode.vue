<template>
    <mu-flex direction="row" justify-content="center" align-items="center">
        <mu-flex justify-content="center" align-items="center" >
            <mu-card style="width: 100%; max-width: 375px; margin: 0 auto;"
                @mouseover="mosein" @mouseout="moseout"
            >
                <mu-card-header title=" ">
                </mu-card-header>
                <mu-card-media>
                    <transition name="fade">
                        <vue-qr
                            :text="qrcodeUrl" 
                            v-show="showWxQr"
                            :size="240" 
                            :margin="20"
                            :colorDark="qroption.bgColor"
                        ></vue-qr>
                    </transition>
                </mu-card-media>
                <mu-card-text>
                    <transition name="fade">
                        <div v-show="showWxQr">
                            {{TextOnShow}}
                        </div>
                    </transition>
                    <!-- {{TextOnShow}} -->
                        <!-- {{cookie}} -->
                </mu-card-text>
                <!-- <mu-card-actions>
                    <mu-button flat>Action 1</mu-button>
                    <mu-button flat>Action 2</mu-button>
                </mu-card-actions> -->
            </mu-card>
            <mu-snackbar :position="normal.position" :open.sync="normal.open">
                {{normal.message}}
                <mu-button flat slot="action" color="secondary" @click="normal.open = false">Close</mu-button>
            </mu-snackbar>
        </mu-flex>
    </mu-flex>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<script>
import {mapState} from 'vuex';
import VueQr from "vue-qr";
export default {
  name: "qrCode",
  components: { VueQr },
  data() {
    return {
      qrcodeUrl: "",
      logincode: null,
      TextOnShow:"请使用微信小程序 群文件分享 扫码登录",
      qroption: {
        bgColor: "#51A8DD",
        size: 500
      },
      normal: {
        position: 'top-end',
        message: '登录成功',
        open: false,
        timeout: 3000
      },
      showWxQr: true
    };
  },
  mounted () {
      // TODO: 这里写ws相关.
      var that = this;
      var ws = new WebSocket("wss://asdf.zhr1999.club/api/qrCode");
    //   ws.onopen = function()
    //   {
    //      // Web Socket 已连接上，使用 send() 方法发送数据
    //      ws.send("发送数据");
    //      alert("数据发送中...");
    //   };
      ws.onmessage = function (evt) 
      { 
        try{
            let rec = JSON.parse(evt.data);
            if(rec.success == "get_qrCode"){
                that.qrcodeUrl = rec.qrurl;
                that.logincode = rec.qrurl;
                that.$store.state.loginStatus.cookie = that.qrcodeUrl.split('=')[1];
            }else if(rec.success == "login_info"){
                that.$store.state.loginStatus.nick_name = rec.info.nick_name;
                that.$store.state.loginStatus.avatar_url = rec.info.avatar_url;
                that.$store.state.loginStatus.login = true;
                that.normal.open = true;
                that.normal.timer = setTimeout(() => {
                    that.normal.open = false;
                    that.$router.push('/fileList');
                }, that.normal.timeout);
                ws.close();
            }
        } catch(err){
            console.log(evt.data);
        }
      };
    //   ws.onclose = function()
    //   { 
    //      // 关闭 websocket
    //      alert("连接已关闭..."); 
    //   };
      console.log(this);
  },
  methods:{
    async mosein(e){
        this.showWxQr=false;
        await sleep(500);
        this.qrcodeUrl = "https://mp.weixin.qq.com/a/~SOWWUMMdNpOjK7djyn3l0w~~";
        this.TextOnShow = "微信扫码添加 '群文件分享' 小程序";
        this.showWxQr = true;
    },
    async moseout(e){
        this.showWxQr=false;
        await sleep(500);
        this.qrcodeUrl = this.logincode;
        this.TextOnShow = "请使用微信小程序 群文件分享 扫码登录";
        this.showWxQr = true;
    }
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
var sleep = (time)=>{
    return new Promise(rec=>{
        setTimeout(rec,time);
    })
}
</script>
