<template>
 <div class="document">
     <el-row  :gutter="20">
         <el-col :span="12" v-for="(item,index) in $store.state.show_document" :key="item.id">
            <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h2 @click="go_detail($event)">{{ item.title }}<span style="display:none">{{item.blog_id}}+{{ index }}</span></h2>
                <span class="card_time">{{ item.date }}</span>
                <span class="card_tip">{{ item.tags }}</span>
            </div>
            <div class="text item">
                {{ item.value }}
            </div>
            </el-card>
         </el-col>
    
         
     </el-row>

     

 </div> 
</template>

<script>
export default {
    data(){
        return{

        }
    },
    methods: {
        go_detail(even){
            var get_params = event.currentTarget.childNodes[1].innerText.split("+");
            this.$router.push("/admin/detail/page/"+ get_params[0] +"/"+get_params[1]);
        }
    }

}
</script>

<style>

.el-card__header {
    border-bottom: .05rem dashed rgb(170, 170, 170);
}
.box-card {
    margin: 1em 0rem;
}

.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before, .clearfix:after {
    display: table;
    content: "";
   
  }
.clearfix {
     text-align: center;
}

.card_time {
    font-size: 12px;
    color: rgb(170, 170, 170);
}

.clearfix h2 {
    margin: 0;
    font-size: 16px;
    margin-bottom: 0.3rem;
}
  .clearfix:after {
    clear: both
  }

.card_tip {
    color: rgb(50, 211, 195);
    border: 1px solid rgb(50, 211, 195);
    border-radius: .3rem; 
    padding: .1rem .5rem;
    font-size: .5rem;
}
</style>

