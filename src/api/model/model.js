
var mongoose = require('mongoose'); //连接单个数据库 只能连接单个db 若连接多个则使用creatConnection
mongoose.connect('mongodb://127.0.0.1:27017/blog_db');

//创建数据集合
var Userinfo = new mongoose.Schema({
    user_name: String,
    user_password: String,
    email:String,
    blog_name: String,
    blog_intro: String,
    user_intro: String,
    user_pic: String,
    user_creattime: Date,
    blog_text: Array,
    tags: Array,
    star_blog: Array,
    star_user:Array
})

mongoose.model('Userinfo', Userinfo);
