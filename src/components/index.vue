<template>
    <div id="index">
        <el-container>
            <el-header>Header</el-header>
            <el-main>
                <el-row>
                    <el-col :span="22" :offset="1">
                        <el-row>
                             <el-col :span="16" style="background:white;padding:0.6rem">
                                  <el-tabs v-model="activeName" @tab-click="handleClick">
                                    <el-tab-pane label="最新推荐" name="first">最新推荐</el-tab-pane>
                                        <el-tab-pane label="本周热门" name="second">本周热门</el-tab-pane>
                                        <el-tab-pane label="每日一博" name="third">每日一博</el-tab-pane>
                                        <el-tab-pane label="问题认领" name="fourth">问题认领</el-tab-pane>
                                    </el-tabs>
                            </el-col>
                            <el-col :span="8" style="">
                                    <div>1</div>
                                    <div>2</div>
                                    <div>3</div>
                                    <div>4</div>
                                    <div>5</div>
                                    <div>6</div>
                                    <div>7</div>
                                    <div>8</div>
                                <div>
                                    
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-main>
            <el-footer>Footer</el-footer>
        </el-container>
    </div>
</template>

<script>
export default {
    data() {
      return {
        activeName: 'second'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>

<style>
body {
    margin: 0;
     background-color: #E9EEF3;
}

.el-header, .el-footer {
    background-color: white;
    color: #333;
    text-align: center;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    margin-top: 1rem;
  }

</style>
