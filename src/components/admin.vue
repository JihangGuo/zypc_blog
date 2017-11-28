<template>
<div id="admin">
<el-container>
  <el-aside>
     
    <el-row type="flex" justify="center">
        <el-col span="20" id="user_pic" v-bind:style="pic_style"></el-col>
    </el-row>
    <el-row type="flex" justify="center">
        <el-col span="20" class="user_name">{{ $store.state.alldocument.user_name }}</el-col>
    </el-row>
    <el-row type="flex" justify="center">
          <el-col span="20" class="user_intro">{{ $store.state.alldocument.blog_intro }}</el-col>
    </el-row>
    <el-row type="flex" justify="center" class="user_bar">
          <el-col span="6">
              <router-link to="/admin/edit"><i class="el-icon-edit"></i></router-link><p>123</p>
        </el-col>
          <el-col span="6" style="border-left:0.1rem solid #E9EEF3;border-right:0.1rem solid #E9EEF3">
              <router-link to="/admin/recovery/document"><i class="el-icon-delete"></i></router-link><p>123</p>
        </el-col>
          <el-col span="6">
              <router-link to="/admin/collection/document"><i class="el-icon-star-off"></i></router-link><p>123</p>
              </el-col>
    </el-row>
    <el-row type="flex" justify="center">
          <el-col span="16" class="user_left"><router-link to="/admin/alldocument">全部文章</router-link></el-col>
    </el-row>
    <el-row type="flex" justify="center">
          <el-col span="16" class="user_left"><router-link to="/admin/tag">分类管理</router-link></el-col>
    </el-row>
    <el-row type="flex" justify="center">
          <el-col span="16" class="user_left"><router-link to="/admin/setting">个人设置</router-link></el-col>
    </el-row>
    
  </el-aside>
  <el-main>
      <el-row type="flex">
        <el-col class="main_title">
            <span>路径显现设置</span>
        </el-col>
     </el-row>
     <el-row type="flex" >
        <el-col class="main_text" justify="center">
            <router-view name="admin_router"></router-view>
        </el-col>
     </el-row>
    
  </el-main>
</el-container>
</div>
</template>

<script>
export default {
    data(){
        return{
            pic_style:{
                background: "",                
            },
        }
    },
    mounted(){

          //加载全部文档 后期对上面的获取进行优化
    this.$http
      .post("http://localhost:8000/api/get_all", {
        message: JSON.stringify({
          user_id: this.$store.state.log_id
        })
      })
      .then(
        response => {
          var get_document = JSON.parse(response.bodyText);
          this.$store.commit("swith_all", get_document.res_result);
         this.pic_style.background = "url("+this.$store.state.alldocument.user_pic+")";
       },
        response => {
          ("读取全部信息错误！");
        }
      );
    },
    computed:{
        get_pic(){
                this.pic_style.background = "url("+this.$store.state.alldocument.user_pic+")";
        }
    },
    watch:{
        get_pic(newvalue){
            console.log(newvalue);
        }
    }
}

</script>


<style>
#admin {
    margin-top: 1.2rem;
}
.main_title {
    margin: 0;
    font-size: 1rem;
    border-bottom:0.05rem solid  rgb(209, 219, 229);
    text-align: left;
}
.main_title span{
    padding: 0.1rem 0.2rem;
    border-bottom: 0.1rem rgb(65, 184, 131) solid;
}
.user_left {
    line-height: 5rem;
    border-bottom:0.01rem solid #f4f4f4; 
}
.user_bar {
    margin-top: 1.5rem;
    line-height: 0rem;
}
* {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
.user_intro {
    line-height: 1.2rem;
    word-wrap: break-word;
}

.user_name {
    border-bottom:0.01rem solid #E9EEF3; 
    line-height: 1.2rem;
    word-wrap: break-word;

}
#user_pic {
    margin-top: 0.6rem; 
    width: 10rem;
    height: 10rem;
    border-radius: 100px !important;
    background-size:10rem 10rem !important;
    background-repeat:no-repeat !important;
    background-position : center center !important;
}

body { 
    background:  #f4f4f4;   
}
.el-aside {
    background-color: white;
    color: #333;
    text-align: center;
    line-height: 200px;
    margin: 0rem 1rem;
    overflow: hidden;
    
  }
  
  .el-main {
    color: #333;
    padding: 0.2rem;
    overflow: hidden;
    background: white;
  }
</style>

