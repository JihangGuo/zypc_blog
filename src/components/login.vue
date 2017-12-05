<template>
  <div id="signin">
    <el-row>
      <el-col :span="10" :offset="7">
        <el-container>
      <el-header>Header</el-header>
      <el-main>
        <el-form :label-position="labelPosition" :model="logform" status-icon ref="logform" :rules="rules">

          <el-form-item label="用户名" prop="name">
            <el-input v-model="logform.name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="logform.password" auto-complete="off" type="password" @input="input_pass"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onsubmit('logform')">登陆</el-button>
            <el-button type="primary"><router-link to="/signin">没有账号|注册</router-link></el-button>
          </el-form-item>
        </el-form>
         <el-button type="success" @click="go_oauth">智邮社区登录</el-button>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
 
  export default {
    name:'signin',
    data: function (){
      var validname = (ruke,value,callback) => {
        if(value==""){
          callback(new Error('请输入您的用户名'));
        } else{
          callback();
        }
      }

      var validpass = (ruke,value,callback) => {
        if(this.check_flag){
          callback()
        } else {
          callback(new Error('密碼錯誤'));
        }
      }
      return {
        check_flag:false,
        labelPosition: 'right',
        logform: {
          name: '',
          password:''
        },
        rules: {
          name: [
            { validator: validname, trigger: 'blur' }
          ],
          password: [
            { validator: validpass, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      go_aouth(){
        window.location.href='http://127.0.0.1:8000/api/oauth';
      },
      input_pass(){
        this.check_flag = true;
      },
      onsubmit(logform) {
        this.$refs[logform].validate((valid) => {
          const that = this;
          if (valid) {
            /*
            $.ajax({
              url:'http://localhost:8000/api/login',
              type:'post',
              data: {
                name:this.logform.name,
                password:this.logform.password
              },
              success: function (data) {
                var get_flag = JSON.parse(data);
                if ( get_flag.flag==0)
                {
                  that.check_flag = false;
                } else {
                  that.check_flag = true;
                  
                }
                alert(that.check_flag);
              },
              error: function (textStatus) {
                alert("网络错误连接错误" + textStatus);
              }
            });*/
            this.$http.post('http://localhost:8000/api/login',{
                name:this.logform.name,
                password:this.logform.password
            }).then(response=>{
              if(response.body.flag==1){
                this.check_flag = true;
                //组件修改登录状态 进入主页
                this.$refs[logform].validate((valid));
                
                this.$store.commit('swith_login',{
                    log_name:response.body.log_name,
                    log_id:response.body.log_id
                  });
                this.$router.push('/admin');

              } else{
                 this.check_flag = false;
                 this.$refs[logform].validate((valid));
              }
              
            },response=>{
              alert("error");
            })
          } else {
            return false;
          }
        });
      }
    },
    mounted(){
      if(this.$route.params.log_name){
        this.logform.name = this.$route.params.log_name;
      }
    }
  }



</script>

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    
  }
</style>
