<template>
<div>
    <el-row class="all_head">
    <el-col :span="16" :offset="2">
        
  <span class="demonstration">请选择你想查看的月份</span>

        <el-date-picker
        @change="get_tabs"
        :editable="editable"
    v-model="date_value"
    type="month"
    format="yyyy年MM月"
    value-format="yyyy-MM"
    placeholder="选择月份">
  </el-date-picker>
    </el-col>
</el-row>  

<el-row>
    <el-col :span="22" :offset="1">
        <h1>{{ $store.state.log_id}}</h1>
        <router-view name="all_router"></router-view>
    </el-col>
</el-row>
</div>

</template>

<script>
import store from "../store/index";
export default {
  data() {
    return {
      date_value: "",
      editable: false
    };
  },
  methods: {
    get_tabs() {
      //初始化文章请求日期
      var res_document = [];
      var get_blog = this.$store.state.alldocument.blog_text;
      var the_date = this.date_value.split("-");
      var req_date = the_date[0] + the_date[1];
      for (var a = 0; a < get_blog.length; a++) {
        //初始化数据库文章日期
        var db_date = get_blog[a].date.split("-");
        var res_date = db_date[0] + db_date[1];
        if (res_date == req_date && get_blog[a].show_status!==3) {
          res_document.push(get_blog[a]);
        }
      }
      this.$store.commit("swith_document", res_document);
      this.$router.push("/admin/alldocument/the_tags");
    }
  },
  mounted() {
  }
};
</script>

<style>
.all_head {
  margin-top: 2rem;
}
</style>
