<template>
    <div class="recovery">
        <el-row>
            <el-col>
                <h2>这是你的草稿啦，到底还要不要！！！</h2>
            </el-col>
        </el-row>
        <router-view name="recovery_router"></router-view>
    </div>
</template>

<script>
export default {
    mounted(){
     //将目前的草稿文章放入活动文档
     this.$http.post("http://localhost:8000/api/get_document",JSON.stringify({
         get_type:"draft",
         user_id:this.$store.state.log_id
     })).then(
         response=>{
             var res_blog = JSON.parse(response.bodyText)
             this.$store.commit('swith_document',res_blog);   
         },
         response=>{
             alert("網絡連接錯誤");
         }
     );
     
    
}
}
</script>

<style>

</style>
