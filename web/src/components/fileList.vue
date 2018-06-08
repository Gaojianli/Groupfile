<template>
    <mu-container>
        <mu-flex justify-content="start" align-items="start">
            <mu-paper :z-depth="1">
                <mu-list class="left-list">
                    <mu-list-item @click="openSimpleDialog" button :ripple="false">
                        <mu-list-item-action>
                            <mu-icon value="cloud_upload"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item-title>上传新文件</mu-list-item-title>
                    </mu-list-item>
                    <mu-list-item button :ripple="false">
                        <mu-list-item-action>
                            <mu-icon value="group"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item-title>查看群组</mu-list-item-title>
                    </mu-list-item>
                </mu-list>
                <mu-divider></mu-divider>
                <mu-list v-if="loading">
                    <mu-sub-header inset>Folders</mu-sub-header>
                    <mu-list-item avatar :ripple="false">
                        <mu-list-item-title class="loading-text">加载中 请稍后..</mu-list-item-title>
                    </mu-list-item>
                </mu-list>
                <transition-group name="list-complete" tag="mu-list" v-if="!loading" class="left-list" textline="two-line">
                    <mu-sub-header key="mu-sub-header" inset>Folders</mu-sub-header>
                    <mu-list-item 
                        v-if="!file_list.empty" 
                        v-for="file in file_list.files" 
                        v-bind:key="file._id" 
                        avatar button :ripple="false"
                    >
                        <mu-list-item-action>
                            <mu-avatar>
                                <img :src="get_svg_url(file.type)"/>
                            </mu-avatar>
                        </mu-list-item-action>
                        <mu-list-item-content>
                            <mu-list-item-title>{{file.name}}</mu-list-item-title>
                            <mu-list-item-sub-title>{{file.upload_time}}</mu-list-item-sub-title>
                        </mu-list-item-content>
                        <mu-list-item-action>
                            <mu-button icon @click="download(file._id)">
                                <mu-icon value="info"></mu-icon>
                            </mu-button>
                        </mu-list-item-action>
                    </mu-list-item>
                </transition-group>
            </mu-paper>
        </mu-flex>
        <mu-dialog title="上传文件" width="360" :open.sync="openSimple">
            <div class="dropbox p-3">
                <h2 v-if="files.length===0" class="text-center">把要上传的文件拖动到这里</h2>
                    <div class="border m-2 d-inline-block p-4" style="width:15rem" v-for="file in files" :key="file.lastModified">
                        <h5 class="mt-0">{{ file.name }}</h5>
                        <div class="progress">
                            <mu-linear-progress :value="file.uploadPercentage" mode="determinate" color="#51A8DD"></mu-linear-progress>
                    </div>
                </div>
            </div>
            <mu-button slot="actions" flat color="primary" @click="closeSimpleDialog">Close</mu-button>
        </mu-dialog>
    </mu-container>
</template>


<script>
export default {
    data(){
        return{
            file_list:{
                empty: true,
                files:[]
            },
            loading:true,
            files: [],
            openSimple: false
        }
    },
    mounted(){
        console.log(this.$store.state.loginStatus.cookie);
        if(!this.$store.state.loginStatus.cookie){
            this.$router.push('/');
        }
       this.$http.post(
        "https://asdf.zhr1999.club/api/getFileList",
        {'session_cookie': this.$store.state.loginStatus.cookie},
        ).then(
            (response)=>{
                this.file_list.empty = response.data.empty;
                this.file_list.files = response.data.files;
                this.loading = false;
            },
            (error)=>{
              console.log(error);
            }
        )
    },
    methods:{
        get_svg_url(e){
            return "https://asdf.zhr1999.club/resource/icons/"+e+".svg";
        },
        uploadFile: function (file) {
            var item = {
                name: file.name,
                uploadPercentage: 0
            };
            this.files.push(item);
            var fd = new FormData();
            fd.append('session_cookie',this.$store.state.loginStatus.cookie);
            fd.append('file', file);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://asdf.zhr1999.club/api/upload', true);
            xhr.upload.addEventListener('progress', function (e) {
                item.uploadPercentage = Math.round((e.loaded * 100) / e.total);
            }, false);
            xhr.send(fd);
        },
        onDrag: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },
        onDrop: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var dt = e.dataTransfer;
            for (var i = 0; i !== dt.files.length; i++) {
            this.uploadFile(dt.files[i]);
            }
        },
        openSimpleDialog () {
            this.openSimple = true;
            setTimeout(() => {
                var dropbox = document.querySelector('.dropbox');
                dropbox.addEventListener('dragenter', this.onDrag, false);
                dropbox.addEventListener('dragover', this.onDrag, false);
                dropbox.addEventListener('drop', this.onDrop, false);
            }, 500);
        },
        closeSimpleDialog () {
            this.openSimple = false;
        },
        download(file_id){
            window.open("https://asdf.zhr1999.club/api/download?session_cookie="+this.$store.state.loginStatus.cookie+"&file_id="+file_id);
        }

    }
}
</script>

<style>
.loading-text{
    color: gray;
}
.list-complete-item {
  transition: all .5s;
  display: inline-block;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
