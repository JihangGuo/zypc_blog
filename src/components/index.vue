<template>
    <div id="index">
        <el-container>
            <el-header>
                <el-input placeholder="请输入内容" v-model="find_info">
                <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-header>
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
                                <div>
                                    <div>Linux</div>
                                </div>
                                    <div>1</div>
                                    <div>2</div>
                                    <div>3</div>
                                    <div>4</div>
                                    <div>5</div>
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
        activeName: 'second',
        find_info:''
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab.name)
      }
    }
  };
</script>

<style>
body {
    margin: 0;
     background-color: #eaeaea;
}

.el-header, .el-footer {
    background-color: white;
    color: #333;
    text-align: center;
  }

  .el-main {
    background-color: #eaeaea;
    color: #333;
    text-align: center;
    margin-top: 1rem;
  }

</style>
