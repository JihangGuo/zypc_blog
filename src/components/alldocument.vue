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
       this.$http
      .post("http://localhost:8000/api/get_document",JSON.stringify(
        {
          get_type:"date",
          user_id: this.$store.state.log_id,
          month:this.date_value
          }
        ))
      .then(response=>{
        var res_document = JSON.parse(response.bodyText);
        this.$store.commit("swith_document", res_document);
        this.$router.push("/admin/alldocument/the_tags");
      },response=>{
        alert("網絡錯誤");
      })
      
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
