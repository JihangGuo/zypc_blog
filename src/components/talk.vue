<template>
<div>

     <div class="talk_main"  v-for="(item,index) in talk_main" :key="item.id">
      <div class="main_top">
          <img src="../assets/data/img/qq.png" class="the_qq" @click="the_qq(item.talk_user,item.talk_name)">
          <div class="talk_pic" v-bind:style=" 'background:url('+item.talk_pic+')' "></div>
          <p>{{ item.talk_name }}</p>
          <span>{{index+1}}楼</span>
          <span>{{ item.talk_date }}</span>
      </div>
      <span v-if="item.talk_withwho.length!==0" id="with_people" v-for="touch in item.talk_withwho">@<router-link to="/">{{ touch }}</router-link></span><span>{{ item.talk_text }}</span>
      <el-button style="float:right;margin:0.3rem" type="danger" icon="el-icon-delete" size="mini" @click="del_talk($event)"><span style="display:none;margin:0px">{{item.talk_id}}+{{index}}</span></el-button>
  </div>

<el-tag
  v-for="tag in with_tags"
  :key="tag"
  closable
  @close="del_tag(tag)">
  {{tag}}
</el-tag>
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
  data() {
    return {
      talk_text: "",
      talk_main: [],
      index: this.$route.params.index_id,
      dialogVisible: false,
      get_del: "",
      with_tags: [],
      real_tags:[],
      name_tags:[]
    };
  },
  methods: {
      del_tag(tag){
          this.with_tags.splice(this.with_tags.indexOf(tag), 1);
      },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    del_yes() {
      var get_talk = this.get_del.split("+");
      this.$http
        .post(
          "http://localhost:8000/api/talk",
          JSON.stringify({
            talk_id: get_talk[0],
            type: 2
          })
        )
        .then(
          response => {
            var get_res = JSON.parse(response.bodyText);
            if (get_res == 1) {
              //进行页面更新
              this.talk_main.splice(get_talk[1], 1);
              this.$message({
                message: "删除评论成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "删除失败",
                type: "error"
              });
            }
            this.dialogVisible = false;
          },
          response => {
            alert("删除连接错误！");
            this.dialogVisible = false;
          }
        );
    },
    del_no() {
      this.dialogVisible = false;
      this.$message({
        message: "取消成功",
        type: "success"
      });
    },
    del_talk(event) {
      this.dialogVisible = true;
      this.get_del = event.currentTarget.childNodes[2].childNodes[0].innerText;
    },
    the_qq(talk_user,talk_name) {
        var the_talk = talk_name;
        if(this.with_tags.indexOf(the_talk) == -1 ){  
            this.with_tags.push(the_talk);
            this.real_tags.push(talk_user);
            this.name_tags.push(talk_name);
        }else{
        this.$message({
              message: "已经@过啦",
              type: "success"
            });
        }
       
      

    },
    the_touch() {},
    the_emoji() {},
    push_talk() {
      var get_talk = this.talk_text;
      var send_info = {
        type: 0,
        blog_id: this.$route.params.blog_id,
        text: get_talk,
        user_id: this.$store.state.log_id,
        talk_withwho: this.real_tags
      };
      this.$http
        .post("http://localhost:8000/api/talk", JSON.stringify(send_info))
        .then(
          response => {
            var get_res = JSON.parse(response.bodyText);
            //对本地图像进行获取处理 进行展现
            var get_with = this.name_tags;
            var get_res_p = {
              talk_pic: this.$store.state.alldocument.user_pic,
              talk_name: this.$store.state.alldocument.user_name,
              talk_text: get_res.talk_text,
              talk_date: get_res.talk_date,
              talk_id: get_res.talk_id,
              talk_user: get_res.talk_user,
              talk_withwho:get_with
            };
            this.talk_main.push(get_res_p);
            //增加评论内容
            this.$message({
              message: "发表成功",
              type: "success"
            });
            this.name_tags=[];
             this.with_tags=[];
            this.real_tags=[];
            this.talk_text = "";
          },
          response => {
            alert("网络连接出错");
          }
        );
    }
  },

  mounted() {
    //获取评论信息  __评论信息实时加载 不能够使用客服端缓存信息__
    this.$http
      .post(
        "http://localhost:8000/api/talk",
        JSON.stringify({
          type: 1,
          blog_id: this.$route.params.blog_id
        })
      )
      .then(
        response => {
          var get_res = JSON.parse(response.bodyText);
          this.talk_main = get_res;
        },
        response => {
          alert("网络连接出错");
        }
      );
  }
};
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
#with_people{
    background: darkgray;
}

.the_button {
  float: right;
}
.talk_main p {
  text-align: left;
  margin-left: 2.2rem;
}

.main_top p,
.main_top span {
  margin: 0;
  position: relative;
  left: 0.3rem;
}
.main_top {
  font-size: 0.8rem;
  text-align: left;
}
.talk_main {
  border-bottom: 0.01rem solid #8a8a8a;
}
.talk_pic {
  display: inline-block;
  float: left;
  width: 2rem;
  height: 2rem;
  background: url("../assets/data/img/demo.jpeg");
  border-radius: 100px !important;
  background-size: 2rem 2rem !important;
  background-repeat: no-repeat !important;
  background-position: center center !important;
}

.talk_input,
.talk_click,
.talk_main {
  display: block;
  margin-top: 0.5rem;
}
.talk_main,
.talk_click {
  float: left;
  width: 100%;
}
.the_qq {
  width: 1.3rem;
  float: right;
  cursor: pointer;
  position: relative;
  z-index: 999;
}
.the_emoji,
.the_touch {
  width: 1.3rem;
  float: left;
  margin: 0.5rem;
  cursor: pointer;
}
</style>
