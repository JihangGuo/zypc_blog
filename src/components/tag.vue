<template>
 <div>
     <el-row class="tab_title">
         <el-col>
              <el-tag
  :key="tag"
  v-for="tag in dynamicTags"
  closable
  :disable-transitions="false"
  @close="handleClose(tag)">
  <el-button type="text" @click="go_tags(tag)">{{ tag }}</el-button>
</el-tag>


<el-input
  class="input-new-tag"
  v-if="inputVisible"
  v-model="inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm"
  @blur="handleInputConfirm"
>
</el-input>


<el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加新标签</el-button>
         </el-col>
     </el-row>


     <el-row>
       显示该标签下的文章内容
     </el-row>
     <el-row>
       <el-col :span="20" :offset="2">
         
         <router-view name="tag_router"></router-view>
       </el-col>
     </el-row>
    
 
 </div> 
</template>

<script>
export default {
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: ""
    };
  },
  methods: {
    sure_del(tag) {
      this.$confirm("操作将删除此标签，该标签下的文章将无该标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("http://localhost:8000/api/get_tags", {
              user_id: this.$store.state.log_id,
              get_type: 1,
              tag: tag
            })
            .then(
              response => {
                var get = JSON.parse(response.bodyText);
                if (get.flag == 1) {
                  //进行标签删除更新
                  this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  //对本地标签进行更新与文章进行更新
                  this.$store.commit("swith_tags", {
                    type: "del",
                    value: tag
                  });
               this.$store.commit("set_document", {
                    type: "updata",
                    value: get.blog_text
                  });
                } else {
                  alert("删除失败");
                }
              },
              response => {
                alert("網絡連接錯誤");
              }
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    handleClose(tag) {
      this.sure_del(tag);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      //进行标签增加更新
      this.$http
        .post("http://localhost:8000/api/get_tags", {
          user_id: this.$store.state.log_id,
          get_type: 2,
          tag: this.inputValue
        })
        .then(
          response => {
            var get_flag = JSON.parse(response.bodyText);
            if (get_flag == 1) {
              //进行标签添加更新
              let inputValue = this.inputValue;
              if (inputValue) {
                this.dynamicTags.push(inputValue);
              }
              
              this.$store.commit("swith_tags", {
                type: "add",
                value: inputValue
              });
            } else {
              this.$message({
                type: "warning",
                message: "已經有這個標簽啦"
              });
            }
            this.inputVisible = false;
            this.inputValue = "";
          },
          response => {
            alert("网络错误");
          }
        );
    },

    go_tags(tag) {
      //进行标签文章筛选 本来想使用js contains方法(判断一个元素是否包含另一个元素) 但是firefox不支持 gg
      var get_blog = this.$store.state.alldocument.blog_text;
      var res_document = [];      
      for (var i = 0; i < get_blog.length; i++) {
          for (var a = 0; a < get_blog[i].tags.length; a++) 
          {
            
           
            if (get_blog[i].tags[a] == tag && get_blog[i].show_status!==3) {
               
            res_document.push(get_blog[i]);
          }
          }
      }
      this.$store.commit("swith_document", res_document);
      this.$router.push("/admin/tag/the_tags/");
    }
  },
  mounted() {
    //获取当前用户全部标签
    this.$http
      .post("http://localhost:8000/api/get_tags", {
        user_id: this.$store.state.log_id,
        get_type: 0
      })
      .then(
        response => {
          var get_flag = JSON.parse(response.bodyText);
          this.dynamicTags = get_flag;
          this.$store.commit("swith_tags", {
            type: "reget",
            value: get_flag
          });
        },
        response => {
          alert("获取用户标签错误");
        }
      );
  }
};
</script>

<style>
.tab_title {
  margin-top: 2rem;
  text-align: center;
}

.el-tag + .el-tag {
  margin: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

