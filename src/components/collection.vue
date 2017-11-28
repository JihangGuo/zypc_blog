<template>
    <div class="recovery">
        <el-row>
            <el-col>
                <h2>看看大神的文章</h2>
            </el-col>
        </el-row>
        <router-view name="collection_router"></router-view>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    mounted(){
     //将目前的收藏文章放入活动文档 因为牵扯到整个数据库 需要从远程重新获取
     var send = {
         type:3,
         user_id:this.$store.state.log_id,
     }
    this.$http.post("http://localhost:8000/api/star_blog"
    ,JSON.stringify(send))
    .then(response=>{
         var res = JSON.parse(response.bodyText);
         this.$store.commit('swith_document',res);
    },response=>{
        alert("链接错误！！！");
    })
    }
}
</script>

<style>

</style>
