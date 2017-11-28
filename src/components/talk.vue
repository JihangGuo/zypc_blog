<template>
<div>
    <el-input
    class="talk_input"
  type="textarea"
  :autosize="{ minRows: 4, maxRows: 8}"
  placeholder="请输入内容"
  v-model="talk_text">
</el-input>
<div class="talk_click">
      <img src="../assets/data/img/emoji.png" class="the_emoji" @click="the_emoji">
      <!--
      <div id="emoji_main">
            <img src="../assets/data/img/emoji/0023-20e3.png">
          </div>-->
      <img src="../assets/data/img/touch.png" class="the_touch" @click="the_touch">
      <el-button size="mini" type="primary" class="the_button" @click="push_talk">发表评论</el-button>
  </div>
  
  <div class="talk_main" v-if="talk_main.length!==0" v-for="(item,index) in talk_main" :key="item.id">
      <div class="main_top">
          <img src="../assets/data/img/qq.png" class="the_qq" @click="the_qq($event)">
          <div class="talk_pic" v-bind:style=" 'background:url('+item.talk_pic+')' "></div>
          <p>{{ item.talk_name }}</p>
          <span>{{index+1}}楼</span>
          <span>{{ item.talk_date }}</span>
        
      </div>
      <p>{{ item.talk_text }}</p>
      <el-button style="float:right;margin:0.3rem" type="danger" icon="el-icon-delete" size="mini" @click="del_talk($event)"><span style="display:none;margin:0px">{{item.talk_id}}+{{index}}</span></el-button>
        
        <div v-if="JSON.stringify(with_main[index])!=='{}'" v-for="(item,index) in with_main[index]" :key="item.id">
            <div class="main_top">
          <img src="../assets/data/img/qq.png" class="the_qq" @click="the_qq($event)">
          <div class="talk_pic" v-bind:style=" 'background:url('+with_main[index].talk_pic+')' "></div>
          <p>{{ with_main[index].talk_name }}</p>
          <span>{{ with_main[index].talk_date }}</span>
      </div>
      <p>{{ with_main[index].talk_text }}</p>
        </div>

         <el-collapse-transition>
        <div v-show="false">   
    <div style="float:left;width:100%;background:#DFE4ED;padding:0.3rem;border-radius: 0.5rem';margin:0.3rem">
         <el-input
    class="talk_input"
  type="textarea"
  :autosize="{ minRows: 2, maxRows: 4}"
  placeholder="评论一哈TA"
  v-model="talk_with">
</el-input>
<div class="talk_click">
 <img src="../assets/data/img/emoji.png" class="the_emoji" @click="the_emoji">
      <!--
      <div id="emoji_main">
            <img src="../assets/data/img/emoji/0023-20e3.png">
          </div>-->
      <img src="../assets/data/img/touch.png" class="the_touch" @click="the_touch">
      <el-button size="mini" type="primary" class="the_button" @click="push_with(item.talk_id,item.talk_user)">回复评论</el-button>
    </div>
      </div>
        </div></el-collapse-transition>
  </div>
   
      <el-dialog
  title="确定删除？"
  :visible.sync="dialogVisible"
  width="40%">
  <span>你确定要删除吗</span>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="del_no">算了</el-button>
    <el-button @click="del_yes">删除</el-button>
  </span>
</el-dialog>
</div>
    
</template>

<script>
export default {
    data(){
        return {
            talk_text:"",
            talk_main:[],
            index:this.$route.params.index_id,
            dialogVisible: false,
            get_del:"",
            talk_with:"",
            with_main:[
                [
                    {
                    "talk.name":123,
                    "talk_date":"1997-10-01",
                    "talk_text":"13123123"
                },
                 {
                    "talk.name":123,
                    "talk_date":"1997-10-01",
                    "talk_text":"13123123"
                },
                 {
                    "talk.name":123,
                    "talk_date":"1997-10-01",
                    "talk_text":"13123123"
                }
                ]
                
            ]
        }
    },
    methods:{
        handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
        del_yes(){
            var get_talk = this.get_del.split("+");
                    this.$http.post("http://localhost:8000/api/talk"
                        ,JSON.stringify({
                            talk_id:get_talk[0],
                            type:2
                        }))
                        .then(response=>{
                        var get_res = JSON.parse(response.bodyText);
                        if(get_res==1){
                            //进行页面更新                      
                        this.talk_main.splice(get_talk[1],1);
                            this.$message({
                            message: '删除评论成功',
                            type: 'success'
                        });
                        }else{
                            this.$message({
                            message: '删除失败',
                            type: 'error'
                        });
                        }
                        this.dialogVisible = false;
                    },response=>{
                        alert("删除连接错误！");
                        this.dialogVisible = false;
                    });
        },
        del_no(){
            this.dialogVisible = false;
             this.$message({
                            message: '取消成功',
                            type: 'success'
                        });
        },
        del_talk(event){
            this.dialogVisible = true;
            this.get_del = event.currentTarget.childNodes[2].childNodes[0].innerText;
        },
        the_qq(event){
            var qq_status =  event.currentTarget.parentNode.parentNode.childNodes[6];
            if(qq_status.style.display=="none"){
                qq_status.style.display="block";
            }else{
                qq_status.style.display="none";
            }
        },
        push_with(talk_id,talk_user){
            this.$http.post("http://localhost:8000/api/talk"
                        ,JSON.stringify({
                            talk_id:talk_id,
                            type:4,
                            blog_id:this.$route.params.blog_id,
                            text:this.talk_with,
                            user_id:this.$store.state.log_id,
                            talk_withwho:talk_user
                        }))
                        .then(response=>{
                        var get_res = JSON.parse(response.bodyText);
                        if(get_res.type==1){
                            //进行页面更新                      
                        var get_res_p = {  
                            talk_pic: this.$store.state.alldocument.user_pic,
                            talk_name:this.$store.state.alldocument.log_name ,
                            talk_text: this.talk_with,
                            talk_date:get_res.talk_date,
                            user_id:this.$store.state.log_id,
                            with_id:get_res.with_id
                        }
                            this.$message({
                            message: '回复成功',
                            type: 'success'
                        });
                        }else{
                            this.$message({
                            message: '回复失败',
                            type: 'error'
                        });
                        }
                        qq_status.style.display="none";
                    },response=>{
                        alert("评论提交错误！");
                       qq_status.style.display="none";
                    });
        },
        the_touch(){

        },
        the_emoji(){},
        push_talk(){
            var get_talk = this.talk_text;
            var send_info = {
                type:0,
                blog_id:this.$route.params.blog_id,
                text:get_talk,
                user_id:this.$store.state.log_id,
            }
            this.$http.post("http://localhost:8000/api/talk"
            ,JSON.stringify(send_info))
            .then(response=>{
                var get_res = JSON.parse(response.bodyText);
               
                //对本地图像进行获取处理 进行展现
            var get_res_p = {  
            talk_pic: this.$store.state.alldocument.user_pic,
            talk_name:this.$store.state.alldocument.log_name ,
            talk_text: get_res.talk_text,
            talk_date:get_res.talk_date,
            talk_id:get_res.talk_id,
            talk_user:get_res.talk_user
        }
                this.talk_main.push(get_res_p);

                //增加评论内容
                this.$message({
                message: '发表成功',
                type: 'success'
        });
        this.talk_text = "";
            },response=>{
                alert("网络连接出错");
            });
            
        },
        
    },
    mounted(){
        //获取评论信息  __评论信息实时加载 不能够使用客服端缓存信息__
         this.$http.post("http://localhost:8000/api/talk"
         ,JSON.stringify(
             {
                 type:3,
                 blog_id:this.$route.params.blog_id
             }
         ))
         .then(response=>{
                        var get_res = JSON.parse(response.bodyText);
                        this.talk_main = get_res;
         },response=>{
            alert("网络连接出错");
         });
        /*
        var talk = this.$store.state.show_document[index].talk;
        var get_talk = [];
        for( var i =0; i<talk.length;i++)
        {
            get_talk.push(talk[i].talk_user);
        }
         var send_info = {
                type:3,
                get_talk:get_talk,
            }
         this.$http.post("http://localhost:8000/api/talk"
            ,JSON.stringify(send_info))
            .then(response=>{
                
                var get_res = JSON.parse(response.bodyText);
                
                //进行评论内容填充
                var result_talk = []
                for(var i=0;i<get_res.length;i++)
                {
                    for(var a=0;a<talk.length;a++)
                    {
                        if(talk[a].talk_user = get_res[i].talk_user)
                        {
                            result_talk.push({
                                talk_date:talk[a].talk_date,
                                talk_name:get_res[i].talk_name,
                                talk_pic:get_res[i].talk_pic,
                                talk_text:talk[a].talk_text
                            });
                        }
                    }
                }
                
                 this.talk_main = result_talk;
            },response=>{
                alert("网络连接出错");
            })*/
       

    }
}
</script>

<style>
/*
#emoji_main {
    background:  rgb(209, 219, 229);
    width: 10rem;
    position: absolute;
    z-index: 999;
    display: none;
}*/

.the_button {
    float:right;
}
.talk_main p{
    text-align: left;
    margin-left:2.2rem;
}

.main_top p, .main_top span{
    margin: 0;
    position: relative;
    left:0.3rem;
}
.main_top{
    font-size: 0.8rem;
    text-align: left;
}
.talk_main {
    border-bottom: 0.01rem solid #8a8a8a;
}
.talk_pic{
    display: inline-block;
    float: left;
    width:2rem;
    height: 2rem;
    background: url("../assets/data/img/demo.jpeg");
    border-radius: 100px !important;
    background-size:2rem 2rem !important;
    background-repeat:no-repeat !important;
    background-position : center center !important;
}

.talk_input,.talk_click,.talk_main {
    display:block;
    margin-top: 0.5rem;
}
.talk_main,.talk_click {
    float:left;
    width: 100%;
}
.the_qq{
    width:1.3rem;
    float:right;
    cursor:pointer;
    position:relative;
    z-index:999;
}
.the_emoji, .the_touch {
    width:1.3rem;
    float:left;
    margin: 0.5rem;
    cursor:pointer;
}
</style>
