<template>
  <div id="signin">
    <el-row>
      <el-col :span="10" :offset="7">
      <el-container>
      <el-header>Header</el-header>
      <el-main>
        <el-form :label-position="labelPosition" :model="signform" :rules="rules" status-icon ref="signform">

          <el-form-item label="用户名" prop="name">
            <el-input v-model="signform.name" auto-complete="off" @change="check_name()"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="signform.password" auto-complete="off" type="password"></el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="repassword">
            <el-input v-model="signform.repassword" auto-complete="off" type="password"></el-input>
          </el-form-item>

          <el-form-item label="联系邮箱" prop="email">
            <el-input v-model="signform.email" auto-complete="off" @change="check_email()"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onsubmit('signform')">注册</el-button>
            <el-button type="primary" @click="go_login">已有账号|登陆</el-button>
          </el-form-item>
        </el-form>
      </el-main>
      
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
      var check = /^[\w\u4e00-\u9fa5]{6,30}$/gi;
      var check2 = check.test(value);
      var checknum = localStorage.getItem('check');
      
        if(!check2) {
          callback(new Error('请输入六到三十个字符（十个汉字）的普通字符和中文'));
        } else if( checknum == 0 ){
          callback(new Error('名字已经有人注册了哦，换一个吧'));          
        }else{
          callback();
        }
      };

      var validpass = (rule, value, callback) => {
        var check = /^\w{6,20}$/gi;
        var check2 = check.test(value);
        if (!check2) {
          callback(new Error('请输入六到二十个合法字符的密码'));
        } else {
          if(this.signform.repassword !=='')
          {
            this.$refs.signform.validateField('repassword');
          }
          callback();
        }
      };
      var validpass2 = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请再次输入密码'));

        } else if(value!==this.signform.password){
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }

       
      };
      var validemail = (rule,value,callback)=> {
      var check_email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/gi;
      var check3 = check_email.test(value);
      var checkemail = localStorage.getItem('checkemail');
       
        if(!check3) {
          callback(new Error('请输入六到三十个字符（十个汉字）的普通字符和中文'));
        } else if( checkemail == 0 ){
          callback(new Error('邮箱已经有人注册了哦，换一个吧'));          
        }else{
          callback();
        }
      };
      return {
        loginname:'',
        labelPosition: 'right',
        signform: {
          name: '',
          password: '',
          repassword: '',
          email: ''
        },
        rules: {
          name: [
            { validator: validname, trigger: 'blur' }
          ],
          password: [
            { validator: validpass, trigger: 'blur' }
          ],
          repassword: [
            { validator: validpass2, trigger: 'blur' }
          ],
          email: [
            { validator: validemail, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      onsubmit(signform) {
         const that = this;
        this.$refs[signform].validate((valid) => {
          if (valid) {
            /*
            $.ajax({
              url:'http://localhost:8000/api/signin',
              type:'post',
              data: {
                name:this.signform.name,
                password:this.signform.repassword,
                email: this.signform.email
              },
              success: function (data) {
                var check_status = JSON.parse(data);
                localStorage.setItem('check',check_status.flag);
                //跳转到login页面进行登记
                this.signname = check_status.loginname;
                that.$router.push('/login');

              },
              error: function (textStatus) {
                alert("注册出错" + textStatus);
              }
            });*/
            this.$http.post('http://localhost:8000/api/signin',{
                name:this.signform.name,
                password:this.signform.repassword,
                email: this.signform.email
            }).then(response=>{
              //alert(response.body);
              //待优化 将姓名通过组件通信放入登录框中
              this.$router.push('/login/'+this.signform.name);
            },response=>{
              ('網絡錯誤！');
            })
          } else {
            alert('别乱填哦！');
            return false;
          }
        });
      },
      check_name(signform){
        $.ajax({
              url:'http://localhost:8000/api/check_name',
              async:false,
              type:'post',
              dataType:'json', 
              contentType: "application/json; charset=utf-8",
              data: JSON.stringify({check_name:this.signform.name}),
              success: function (data) {
                localStorage.setItem('check',data.flag);
              },
              error: function (textStatus, errorThrown) {
                alert("姓名检测出错" + textStatus + errorThrown);
              }
            });
      },
      check_email(signform){
        $.ajax({
              url:'http://localhost:8000/api/check_email',
              async:false,
              type:'post',
              dataType:'json', 
              contentType: "application/json; charset=utf-8",
              data: JSON.stringify({check_email:this.signform.email}),
              success: function (data) {
                localStorage.setItem('checkemail',data.flag);
              },
              error: function (textStatus, errorThrown) {
                alert("郵箱检测出错" + textStatus + errorThrown);
              }
            });
      },
      go_login(){
        this.$route.push('/login');
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
