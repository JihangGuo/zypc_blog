<template>
<div id="main">
    <el-container>
        <el-aside width="200px">
         <div class="left_head"></div> 
         <div class="the_pic"></div>
         <p>name</p>
         <p>intro</p>
         <p>主页</p>
         <p>文章分类</p>
         <p>留言板</p>
         <p>关于我</p>
         <span>智邮社区</span><span>github</span>
        </el-aside>
        <el-main>
          <router-view name="main-router"></router-view>
        </el-main>
    </el-container>
</div>  
</template>

<script>
export default {

}
</script>

<style>
.the_pic {
  height:5rem;
  width: 5rem;
  border-radius: 300px;
  border:5px solid #fff;
  overflow: hidden;
  position: relative;
  bottom:2.5rem;
  margin: 0 auto;
  background: url('/static/data/img/user_pic6720.jpeg');
   background-size:5rem 5rem !important;
    background-repeat:no-repeat !important;
    background-position : center center !important;
}
.left_head {
  background: #4d4d4d;
  height: 7rem;
}
body{
    background: #D3DCE6;
    margin: 0;
}
  .el-aside {
    background-color: white;
    color: #333;
    text-align: center;
    
    margin-right: 1rem;
  }
  
  .el-main {
    margin: 1.5rem 1rem 0 0;
    background-color: white;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
</style>
