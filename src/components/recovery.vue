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
     var all_blog = this.$store.state.alldocument.blog_text;
     var res = [];
     for (var i=0;i<all_blog.length;i++)
     {
         if( all_blog[i].show_status==3){
             res.push(all_blog[i]);
         }
     }
    this.$store.commit('swith_document',res);   
}
}
</script>

<style>

</style>
