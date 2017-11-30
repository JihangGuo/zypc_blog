<template>
<div id="edit">
  <h1>{{ $store.state.log_id }}</h1>
    <el-row class="edit_title">
        <el-col :span="10" :offset="4">
            <el-input v-model="gettitle" placeholder="请输入标题" suffix-icon="el-icon-edit" @change="check_blog()"></el-input>
        </el-col>
        <el-col :span="4" :offset="2">
            <el-button type="primary" @click="saveEvent(textvalue)">保存</el-button>
        </el-col>
         <el-col :span="4">
             <el-button type="info" @click="saveEvent(textvalue,2)">草稿</el-button>
        </el-col>

        <el-col :span="6" :offset="17">
          <span v-bind:style="span1">私人</span>
          <el-switch
    @change="change_status"
    v-model="choice_value">
</el-switch>
<span v-bind:style="span2">公开</span>
        </el-col>

    </el-row>
    <el-row class="edit_tag">
        <el-col :span="20" :offset="2">
            <el-tag
  :key="tag"
  v-for="tag in dynamicTags"
  closable
  :disable-transitions="false"
  @close="handleClose(tag)">
  {{tag}}
</el-tag>
<div v-if="inputVisible">
<el-autocomplete
  class="input-new-tag"
  v-model="inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm"
  
  :fetch-suggestions="querySearch"
   @select="handleSelect"
>
</el-autocomplete>
<el-button type="primary" size="small"  icon="el-icon-edit" @click="handleInputConfirm(1)"></el-button>
<el-button type="danger"  size="small" icon="el-icon-delete" @click="handleInputConfirm(0)"></el-button>
</div>

<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-col>
        
    </el-row>
    
<el-row class="edit_main">
    <el-col :span="22" :offset="1">
        <mavon-editor v-model="textvalue" :toolbars="defaultprops" />
    </el-col>
</el-row>

    <el-dialog
  title="保存成功"
  :visible.sync="dialogVisible"
  width="40%"
  :before-close="dialogClose">
  <span>保存成功，请选择继续编辑或者再写一篇</span>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="editon">继续编辑</el-button>
    <el-button @click="editagain">再写一篇</el-button>
  </span>
</el-dialog>
</div>
</template>



<script>
export default {
  name: "edit",
  data() {
    return {
      
      span1:{
        color:"black"
      },
      span2:{
        color:"#409EFF"
      },
      choice_value: false,//是否为公开
      blog_status: false,
      blog_id: false,
      dialogVisible: false,
      check_title: true,
      gettitle: "",
      textvalue: "",
      date:"",
      //img_file: {},
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      restaurants: [],
      defaultprops: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: false, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        navigation: true, // 导航目录
        alignleft: false, // 左对齐
        aligncenter: false, // 居中
        alignright: false, // 右对齐
        subfield: true, // 单双栏模式
        preview: true // 预览
      }
    };
  },
  methods: {
    change_status(){
      if(this.choice_value){
        this.span1.color = "black";
        this.span2.color = "#409EFF"
      } else {
        this.span2.color = "black"
        this.span1.color = "red";
      }
    
    },
    dialogClose(done) {
      this.$confirm("继续编辑？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    check_blog() {
      this.$http
        .post("http://localhost:8000/api/check_blog",
          JSON.stringify({
            check_title: this.gettitle,
            user_id: this.$store.state.log_id
          })
      )
        .then(
          response => {
            var get_flag = JSON.parse(response.bodyText);
            if (get_flag.flag == 1 || this.blog_status) {
              this.check_title = true;
            } else {
              this.check_title = false;
            }
          },
          response => {
            alert("检查名称错误");
          }
        );
    },
    saveEvent(textvalue,type) {
      //空值验证 this.input this.dynamicTags value
      const h = this.$createElement;
      if (this.gettitle == "") {
        this.$notify({
          title: "提示",
          message: "填一个名字噻",
          type: "warning"
        });
      } else if (!this.check_title) {
        this.$notify({
          title: "提示",
          message: "已经有一个相同的博文名字啦",
          type: "error"
        });
      } else if (this.dynamicTags == "") {
        this.$notify({
          title: "提示",
          message: "至少选一个标签噻",
          type: "warning"
        });
      } else if (textvalue == "") {
        this.$notify({
          title: "提示",
          message: "写点东西嘛",
          type: "warning"
        });
      } else {
        // show_status 代表三个状态 分别为 公开 私人 垃圾箱
        if(type==2){
          var show_status = 3;
        } else {
           if (this.choice_value)
        {
          var show_status = 1;
        } else {
          var show_status = 2;
        }
        }
       
        var blog = {
          user_id: this.$store.state.log_id,
          blog_id: this.blog_id,
          show_status: show_status,
          title: this.gettitle,
          tags: this.dynamicTags,
          value: this.textvalue,
          pic: ["/#", "/#"],
          date:this.date
        };
        this.$http
          .post("http://localhost:8000/api/edit", {
            blog: JSON.stringify(blog)
          })
          .then(
            response => {
              var get_flag = JSON.parse(response.bodyText);
              this.blog_id = get_flag.blog_id;
              if (get_flag.flag == 1) {
                //修改檢測狀態 新的
                this.check_title = false;
                this.dialogVisible = true;
                this.$store.commit("set_document", {
                  type: "add",
                  value: get_flag.res_blog
                });
              } else if (get_flag.flag == 2) {
                //修改檢測狀態 修改的
                this.check_title = true;
                this.dialogVisible = true;
                this.$store.commit("set_document", {
                  type: "edit",
                  value: blog,
                  index: get_flag.blog_id
                });
              } else {
                this.check_title = false;
              }
            },
            response => {
              alert("保存出错");
            }
          );
      }
    },
    /*暂时移除图片上传功能
    $imgAdd($file, pos) {
      this.img_file[pos] = $file;
      console.log("addImg" + $file + pos);
    },
    $imgDel($file, pos) {
      delete this.img_file[pos];
      console.log("delImg" + $file + pos);
    },*/

 

    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(type) {
      if (type == 1) {
        let inputValue = this.inputValue;
        var status = true;
        for (var i = 0; i < this.dynamicTags.length + 1; i++) {
          if (inputValue == this.dynamicTags[i]) {
            status = false;
          }
        }
        if (status) {
          this.dynamicTags.push(inputValue);
        } else {
          this.$message({
            type: "warning",
            message: "有相同的标签啦"
          });
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    editagain() {
      this.blog_status = false;
      this.blog_id = false;
      this.gettitle = "";
      this.dynamicTags = [];
      this.textvalue = "";
      this.check_title = true;
      //圖片預留
      this.dialogVisible = false;
    },
    editon() {
      this.dialogVisible = false;
      this.blog_status = true;
      this.check_title = true;
    }
  },
  mounted() {
    //获取所有标签
      this.$http.post("http://localhost:8000/api/get_tags",{
              user_id: this.$store.state.log_id,
              get_type: 0
      }).then(response=>{
        var get_info = JSON.parse(response.bodyText);
        var result_info = [];
        for(var i=0;i<get_info.length;i++)
        {
          var push_list = {
            "value":get_info[i]
          }
          result_info.push(push_list);
        }
        this.restaurants = result_info;
      },response=>{
        alert("获取失败");
      })
   

    //组件加载完毕后执行判断
    if (this.$store.state.go_edit) {
      var get_index = this.$store.state.go_index;
      this.blog_id = this.$store.state.go_edit;
      this.gettitle = this.$store.state.show_document[get_index].title;
      this.dynamicTags = this.$store.state.show_document[get_index].tags;
      this.textvalue = this.$store.state.show_document[get_index].value;
      this.date =  this.$store.state.show_document[get_index].date;
      //pic: []
      //初始化数据后进行状态变更 与继续编辑一样的效果
      this.blog_status = true;
      this.check_title = true;
    }
    if(this.$store.state.blog_text[get_index].show_status==1){
      this.show_status = true;
    }
  }
};
</script>

<style>
.edit_title,
.edit_main {
  margin: 2rem;
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

#edit {
  margin-top: 1rem;
}
</style>
