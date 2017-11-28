<template>
<div class="edit">
<el-row>
        <el-col :span="22">
            <h1>{{ $store.state.show_document[index_id].title }}</h1>
            <span>{{ $store.state.show_document[index_id].tags }}</span>
            <pre>{{ $store.state.show_document[index_id].value }}</pre>
            <p>{{ $store.state.show_document[index_id].date}}</p>
        </el-col>
    </el-row>
  <el-row>
      <el-col :span="8" :offset="11">
         <el-button v-if="!star_status"  @click="get_star(1)">收藏</el-button>
         <el-button v-if="star_status" type="success" @click="get_star(2)">取消收藏</el-button>
          <el-button v-if="check_draft" type="success" @click="get_star(4)">拿出草稿箱</el-button>
      </el-col>
       <el-col :span="4">
         <el-button type="primary" @click="go_edit()">编辑</el-button>
      </el-col>
  </el-row>

  <el-row>
      <el-col :span="18" :offset="3">
      <router-view name="detail_router"></router-view>
      </el-col>
  </el-row>
</div>
    
</template>

<script>
export default {
    data(){
        return {
            blog_id:this.$route.params.blog_id,
            index_id: this.$route.params.index_id,
            star_status:"",
            check_draft:"",
            
        }
    },
    methods: {
       
        go_edit(){
            this.$store.commit("set_edit",{go_edit:this.blog_id,go_index:this.index_id});
            this.$router.push("/admin/edit");
        },
        get_star(the_type){
            var send_info = {
                type:the_type,
                blog_id:this.blog_id,
                user_id:this.$store.state.log_id
            };
            if( send_info.type==1){
                this.$http.post("http://localhost:8000/api/star_blog",JSON.stringify(send_info)).then(response=>{
                var res = JSON.parse(response.bodyText);
            if(res.flag==1){
                 //本地更新
                 this.$store.commit("change_info",{
                     type:"add_star",
                     value:res.star_blog
                 });
                 this.star_status = true;
                 //消息提示
            this.$notify({
          title: '收藏成功',
          message: '以后多看看',
          type: 'success'
        });
            } else {
                alert("收藏出错！");
            }
           
            },response=>{
                alert("收藏出错！");
            })
            } else if(send_info.type==2){
                this.$http.post("http://localhost:8000/api/star_blog",JSON.stringify(send_info)).then(response=>{
                var res = JSON.parse(response.bodyText);
            if(res.flag==1){
                 //本地更新
                 this.$store.commit("change_info",{
                     type:"del_star",
                     value:res.star_blog
                 });
                 this.star_status = false;
                 //消息提示
            this.$notify({
          title: '取消收藏成功',
          message: '以后多看看',
          type: 'success'
        });
            } else {
                alert("取消收藏出错！");
            }
           
            },response=>{
                alert("取消收藏出错！");
            })
            }else if(send_info.type==4){
                //拿出草稿箱
                this.$http.post("http://localhost:8000/api/star_blog",JSON.stringify(send_info)).then(response=>{
                var res = JSON.parse(response.bodyText);
            if(res.flag==1){
                 //本地更新
                 this.$store.commit("set_document",{
                     type:"del_draft",
                     value:res.draft_blog
                 });
                 this.check_draft = false;
                 //消息提示
            this.$notify({
          title: '拿出成功',
          message: '666',
          type: 'success'
        });
            } else {
                alert("拿出出错！");
            }
           
            },response=>{
                alert("拿出出错！");
            })
            }
            
            
            
        }
    },
     mounted(){
         //计算当前文章是否为收藏
         var get_star = this.$store.state.alldocument.star_blog;
         var the_id = this.$route.params.blog_id;
         this.star_status = false;
         for(var i=0;i<get_star.length;i++)
         {
             if(get_star[i] == the_id){
                 this.star_status = true;
             }
         }
         //检测是否为草稿
         var check = this.$store.state.show_document[this.index_id].show_status;
         
         if(check==3){
             this.check_draft = true;
         }else{
             this.check_draft = false;
         }
     }
}
</script>

<style>

</style>
