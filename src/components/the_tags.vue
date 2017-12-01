<template>
    <div class="the_tags">
       <h1 v-if="!$store.state.show_document">你又偷懒了哦,什么都没写</h1>
    <el-card v-else class="box-card" v-for="(item,index) in $store.state.show_document" :key="item.id">
    <div slot="header" class="clearfix">
    <span>{{ item.title }}</span>
    <p>{{ item.tags }}</p>
     </div>
    <div class="text item">
    {{ item.value }}
    </div>
    <el-tag v-if="item.show_status==1">公开</el-tag>
    <el-tag type="danger" v-else-if="item.show_status==2">私有</el-tag>
    

     <el-button type="primary" @click="go_detail($event)">查看详情<span style="display:none">{{item.blog_id}}+{{ index }}</span></el-button>
    </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      check_type:this.$route.params.type
    };
  },
  methods: {
    go_detail(event){
        var get_params = event.currentTarget.childNodes[2].childNodes[1].innerText.split("+");
       this.$router.push("/admin/detail/page/"+ get_params[0] +"/"+get_params[1]);
      }
  },
  mounted() {
  }

};
</script>

<style>
.box-card {
  margin: 1.5rem 0rem;
}
</style>
