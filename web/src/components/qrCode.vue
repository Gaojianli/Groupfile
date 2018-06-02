<template>
    <div>
        <qrcode
            :value="qrcodeUrl"
            v-if="qrcodeUrl"
            :options="{ foreground: '#51A8DD' }"
        ></qrcode>
        扫码页面
    </div>
</template>

<style>

</style>

<script>
import Qrcode from 'vue-qrcode'

export default {
    name: "qrCode",
    components:{ Qrcode },
    data(){
        return{
            qrcodeUrl:null,
        }
    }
}
</script>
