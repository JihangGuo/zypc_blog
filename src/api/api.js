
//引入依赖模块
var OAuth2 = require('oauth').OAuth2;
var fs = require('fs');
var express = require('express');
var app = express();
var formidable = require('formidable');
var crypto = require('crypto');
var bodyparser = require('body-parser');
var cors = require('cors');
var uuid = require('uuid/v1');
var MongoClient = require('mongodb').MongoClient; //连接单个数据库 只能连接单个db 若连接多个则使用creatConnection
var ObjectId = require('mongodb').ObjectId;//妈个鸡 就是这个鸡儿东西卡了老子好久哦   _id不是字符串 是bson对象 js想要根据_id进行查询需要进行相应的转换
// newObjectId = ObjectId()   new ObjectId().str
var DB_STR = 'mongodb://127.0.0.1:27017/blog_db';
//设置在node运行期间一直打开
MongoClient.connect(DB_STR, function (err, db) {
  console.log("mongo连接成功！");
})


//设置静态文件目录
app.use(express.static('public'));

app.use(cors())
//构造接收parser中间件
var getjson = bodyparser.json();



//创建表单验证组件 检测类型( name,password,title,tag,x_text,text,date,touch_wx,email) 结果为 true or false
function check_form(data_type, check_text) {
  if (data_type == "name") {
    var name_re = /^[\w\u4e00-\u9fa5]{6,30}$/gi;//六到三十个字符（十个汉字）的普通字符与中文
    var check_result = name_re.test(check_text);
  } else if (data_type == "password") {
    var password_re = /^[\w]{6,20}$/gi;//六到二十个字符与英文 _密码
    var check_result = password_re.test(check_text);
  } else if (data_type == "title") {
    var title_re = /^[\w\u4e00-\u9fa5]{1,30}$/gi;//一到三十个字符（十个汉字）的标题
    var check_result = title_re.test(check_text);
  } else if (data_type == "tag") {
    var tag_re = /^[\w\u4e00-\u9fa5]{1,18}$/gi;//一到十八个字符（六个汉字）的标签
    var check_result = name_re.test(check_text);
  } else if (data_type == "x_text") {
    var x_text_re = /^[.\S\s]{1,75}$/gi;//一到七十五个字符（二十五个汉字）的简介
    var check_result = x_text_re.test(check_text);
  } else if (data_type == "text") {
    var text_re = /^[.\S\s]{1,66666}$/gi;//正文
    var check_result = text_re.test(check_text);
  } else if (data_type == "date") {
    var date_re = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}$/gi;//匹配时间格式 yyyy-mm-dd-hh-mm
    var check_result = date_re.test(check_text);
  } else if (data_type == "touch_wx") {
    var touch_wx_re = /^[\w\u4e00-\u9fa5]{6,30}$/gi;//联系微信
    var check_result = touch_wx_re.test(check_text);
  } else if (data_type == "email") {
    var email_re = /^.+@.+\..+$/gi;//联系邮箱
    var check_result = email_re.test(check_text);
  } else {
    var check_result = false;
  }

  return check_result;
}

//创建加密代码 __加密模塊有待驗證__
function getsha1(str, secret) {
  var buf = crypto.randomBytes(16);
  secret = buf.toString('hex'); //密钥加密
  var Signture = crypto.createHmac('sha1', secret);
  Signture.update(str);
  var mistr = Signture.digest().toString('base64');
  return mistr;
}

//时间戳格式转换
function date_parse(type,value) {
  if (type == "get_stamp") {
    //前端字符转时间戳 格式为 2017-11-11 11:11:11
    return new Date().getTime();
  } else if (type=="parse_stamp") {
    return new Date(value).getTime();
  }else if (type == "get_more") {
    //时间戳转详细格式 2017-11-11 11:11:11
    return new Date(value).toLocalString();
  } else if (type=="get_less") {
    //时间戳转大概格式 2017-11-11
    return new Date(value).toLocalString().replace(/\d{1,2}:\d{1,2}:\d{1,2}$/,'');
  }
}


//注册检测重名判断
app.post('/api/check_name', getjson, function (req, res) {
  //bodyparser接收json
  var get_name = req.body.check_name;
  //查询数据库
  MongoClient.connect(DB_STR, function (err, db) {
    db.collection("user").find({ "user_name": get_name }).count(function (err, result) {
      if (result !== 0) {
        var check = { "flag": 0 };
      } else {
        var check = { "flag": 1 };
      }
      var get_check = JSON.stringify(check);
      res.send(get_check);
    });

  })

});


//注册检测邮箱判断
app.post('/api/check_email', getjson, function (req, res) {


  //bodyparser接收json
  var get_email = req.body.check_email;

  //查询数据库
  MongoClient.connect(DB_STR, function (err, db) {
    db.collection("user").find({ "email": get_email }).count(function (err, result) {

      if (result !== 0) {
        //已被注册
        var check = { "flag": 0 };
      } else {
        var check = { "flag": 1 };
      }
      var get_check = JSON.stringify(check);
      res.send(get_check);
    })
  })
});


//博文名稱檢測
app.post('/api/check_blog', getjson, function (req, res) {
  //通过个人id进行博文数据查询
  var get_id = req.body.user_id;
  var get_title = req.body.check_title;
  MongoClient.connect(DB_STR, function (err, db) {
    var connect_db = async () => {
      var get_user = await db.collection("user").find({ "_id": ObjectId(get_id) }, { "blog_text": 1, "_id": 0 }).toArray();
      var check_title = await db.collection("blog_text").find({ "blog_id": { "$in": get_user[0].blog_text }, "title": get_title }).count();
      if (check_title == 0) {
        res.send('{"flag":1}');
      } else {
        res.send('{"flag":0}');
      }
    }
    connect_db();
  })
});


//注册（后期接入zypc_oauth）
app.post('/api/signin', function (req, res) {
  var form = new formidable.IncomingForm();//formidable通过IncomingForm示例来对表单进行单元控制
  form.encoding = 'utf-8';
  form.parse(req, function (err, fields, files) {
    //进行查询操作不能出现同一用户名以及邮箱

    MongoClient.connect(DB_STR, function (err, db) {
      db.collection("user").find({ "user_name": fields.name, "email": fields.email }).count(function (err, result) {
        if (result !== 0) {
          res.send('{"flag":0}');
        } else {
          if (check_form("name", fields.name) && check_form("name", fields.password) && check_form("email", fields.email)) {
            var sign_name = fields.name;
            var sign_password = fields.password;
            var sign_email = fields.email;
            //进行数据库存储并返回正确
            //实例化
            var new_user = {
              user_name: sign_name,
              user_password: sign_password,
              email: sign_email,
              tags: [],
              star_user: [],
              star_blog: [],
              blog_text: []
            }
            //存入数据库 
            db.collection("user").insert(new_user, function (err, result) {
              if (err) {
                console.log("插入出现错误 = " + err)
              }
              console.log(result);
            })
            //跳转到首页
            var send_name = {
              flag: 1,
              loginname: sign_name
            }
            res.send(JSON.stringify(send_name));
          } else {
            //返回错误
            res.send('{"flag":0}');
          }
        }
      })
    })
  })
});


//登录
app.post('/api/login', function (req, res) {
  MongoClient.connect(DB_STR, function (err, db) {
    var form = new formidable.IncomingForm();//formidable通过IncomingForm示例来对表单进行单元控制
    form.encoding = 'utf-8';
    
    var get_name = form.parse(req, async function (err, fields, files) {
      var check_user = await db.collection("user").count({ "user_name": fields.name,"user_password":fields.password });
      if (check_user == 1) {
        var get_info = await db.collection("user").find({ "user_name": fields.name }).toArray();
        var send_flag = {
          log_name: get_info[0].user_name,
          log_id: get_info[0]._id,
          flag: 1
        };
        res.send(JSON.stringify(send_flag))
      } else {
        res.send(JSON.stringify({flag:0}));
      }
    });
  });    
});  


//编辑接口
app.post('/api/edit', getjson, function (req, res) {
  var blog = JSON.parse(req.body.blog);//blog_id为隐藏


  //博客数据模板
  /*
  var set_blog = {
    //blog_id:uuid(),
    title: blog.title,
    tags: blog.tags,
    pic: blog.pic,
    value: blog.value,
    //date: get_date,
    show_status: blog.show_status
    //talk: []
  }*/
  //判断编辑状态与重名检测

  MongoClient.connect(DB_STR, function (err, db) {
    var connect_db = async () => {
      var check_count = await db.collection("user").find({ "blog_text": blog.blog_id }).count();
      var check_title = await db.collection("blog_text").find({ "title": blog.title }).count();
      console.log(check_count);
      console.log(check_title);
      if (check_count == 0 && check_title == 0) {
        //新文章
        console.log("新建");
        //设置objectid
        var new_id = uuid();
        //创建一个时间对象 方便查询
        var reset_date = new Date();
        var get_date = {
          year: reset_date.getFullYear(),
          month: reset_date.getMonth()+1,
          day: reset_date.getDate(),
          hours: reset_date.getHours(),
          minutes: reset_date.getMinutes(),
          secs: reset_date.getSeconds()
        };
        var creat_bloginuser = await db.collection("user").update({ "_id": ObjectId(blog.user_id) }, {
          "$push": {
            "blog_text": new_id
          }
        });
        var creat_blog = await db.collection("blog_text").insert(
          {
            blog_id: new_id,
            title: blog.title,
            tags: blog.tags,
            pic: blog.pic,
            value: blog.value,
            show_status: blog.show_status,
            date: get_date,
            talk: []
          });
        var set_send = {
          flag: 1,
          blog_id: new_id,
          res_blog: {
            blog_id: new_id,
            title: blog.title,
            tags: blog.tags,
            pic: blog.pic,
            value: blog.value,
            show_status: blog.show_status,
            date: get_date,
            talk: []
          }
        }
        res.send(JSON.stringify(set_send));
      } else if (check_count == 1 && check_title < 2) {
        //修改文章
        console.log("修改");
        var change_blog = await db.collection("blog_text").update({ "blog_id": blog.blog_id }
          , {
            $set: {
              "title": blog.title,
              "tags": blog.tags,
              "pic": blog.pic,
              "value": blog.value,
              "show_status": blog.show_status
            }
          });
        var set_send = {
          flag: 2,
          blog_id: blog.blog_id,
        }
        res.send(JSON.stringify(set_send));

      } else {
        res.send(JSON.stringify({ "flag": 0 }));
      }
    }
    connect_db();
  })

});


//获取用户所有资料
app.post('/api/get_all', getjson, function (req, res) {
  var get_id = req.body.user_id;
  MongoClient.connect(DB_STR, function (err, db) {
    db.collection("user").find({ "_id": ObjectId(get_id) }, { "user_password": 0 ,"blog_text":0,"tags":0}).toArray(function (err, result) {
      //用户信息传递
      res.send(JSON.stringify(result[0]));
    });
  })
});


//获取博客文章相关
app.post('/api/get_document', getjson, function (req, res) {
  var get_type = req.body.get_type;
  var blog_id = req.body.blog_id;
  var month = req.body.month;
  var tags = req.body.tags;
  var star = req.body.star;
  var single = req.body.single;
  var user_id = req.body.user_id;
  MongoClient.connect(DB_STR, function (err, db) {
    var connect_db = async () => {
      if (get_type == "one") {
   //精确获取 
        var get_one = await db.collection("blog_text").find({ "blog_id": blog_id }).toArray();
        res.send(JSON.stringify(get_one[0].blog_text));
  } else if (get_type == "date") {
  //月份获取
        //日期按照年月日来进行分割      
        var parse_date = month.split('-');
        var get_blog = await db.collection("user").find({ "_id": ObjectId(user_id) }, { "blog_text": 1, "_id": 0 }).toArray();
         var get_month = await db.collection("blog_text").find({ "date.year": Number(parse_date[0]), "date.month": Number(parse_date[1]), "blog_id": { "$in": get_blog[0].blog_text } }, { "_id": 0 }).toArray();
        res.send(JSON.stringify(get_month));
  } else if (get_type == "tags") {
    //标签类型获取
        var get_blog = await db.collection("user").find({ "_id": ObjectId(user_id) }, { "_id": 0, "blog_text": 1 }).toArray();    
        var get_tags = await db.collection("blog_text").find({ "blog_id": { "$in": get_blog[0].blog_text }, "tags": tags }, {"_id":0}).toArray();
      res.send(JSON.stringify(get_tags));
  } else if (get_type == "draft") {
    //垃圾箱获取
        var get_user = await db.collection("user").find({"_id":ObjectId(user_id)}).toArray();
        var get_draft = await db.collection("blog_text").find({ "blog_id": { "$in": get_user[0].blog_id }, "show_status": 3 }, {"_id":0}).toArray();
        res.send(JSON.stringify(get_draft));
  } else if (get_type == "star") {
    //收藏获取
        var get_star = await db.collection("blog_text").find({ "blog_id": { "$in": star } }, {"_id":0}).toArray();
        res.send(JSON.stringify(get_star));    
  } else if (get_type == "single") {
    //用户获取全部
        var get_single = await db.collection("blog_text").find({ "blog_id": { "$in": single } }, {"_id":0}).toArray();
        res.send(JSON.stringify(get_single));    
  }
    }
    connect_db();
   
  });
  

});

//标签更新模块  对用户分类进行管理 与博文分离    
app.post('/api/get_tags', getjson, function (req, res) {
  var get_user = req.body.user_id;
  var get_type = req.body.get_type;
  //检测更新类型
  MongoClient.connect(DB_STR, function (err, db) {
    var db_connect = async () => {
      if (get_type == 0) {
        //获取当前用户标签
        //每获取一次 则更新一次
        var get_usertags = await db.collection("user").findOne({ "_id": ObjectId(get_user) }, { "tags": 1, "_id": 0 });
        var get_blogtags = await db.collection("blog_text").find({}, { "tags": 1, "_id": 0 }).toArray();
        //每获取一次 则tags更新一次
        //当前文章中已有的标签并去重
        var check_tags = [];
        for (var i = 0; i < get_blogtags.length; i++) {
          check_tags.push.apply(check_tags, get_blogtags[i].tags);
        }

        var get_array = [];
        for (var a = 0; a < check_tags.length; a++) {
          if (get_array.indexOf(check_tags[a]) == -1) {
            get_array.push(check_tags[a]);
          }
        }
        check_tags = get_array;

        //用户自定义的标签
        var self_tags = get_usertags.tags;
        //两类标签去重
        for (var x = 0; x < check_tags.length; x++) {
          for (var y = 0; y < self_tags.length; y++) {
            if (check_tags[x] == self_tags[y]) {
              self_tags.splice(y, 1);
            }
          }
        }
        //合并输出
        var new_tags = check_tags.concat(self_tags);
        //保存当前标签状态到数据库
        var save_tags = await db.collection("user").update({ "_id": ObjectId(get_user) }, {
          "$set": { "tags": new_tags }
        });
        res.send(JSON.stringify(new_tags));


      } else if (get_type == 1) {
        //删除tag
        var get_tag = req.body.tag;

        var del_usertags = await db.collection("user").update({ "_id": ObjectId(get_user) }, {
          "$pull": {
            "tags": get_tag
          }
        });
        var del_blogtags = await db.collection("blog_text").update({ "tags": get_tag }, {
          "$pull": {
            "tags": get_tag
          }
        });
        var get_tags = await db.collection("user").find({}, { "tags": 1, "_id": 0, "blog_text": 1 }).toArray();
        var get_blog = await db.collection("blog_text").find({}).toArray();
        //找出该用户下的博客
        console.log(get_tags + get_tags[0] + get_tags.blog_text + get_tags[0].blog_text);
        var res_blog = [];
        for (var i = 0; i < get_tags[0].blog_text.length; i++) {
          for (var a = 0; a < get_blog.length; a++) {
            if (get_tags[0].blog_text[i] == get_blog[a].blog_id) {
              res_blog.push(get_blog[a]);
            }
          }
        }
        var res_info = {
          flag: 1,
          blog_text: res_blog,
          tags: get_tags[0].tags
        }
        res.send(JSON.stringify(res_info));

      } else if (get_type == 2) {
        //增加tag
        var get_tag = req.body.tag;
        //检测重复的标签
        var check_tags = await db.collection("user").find({ "_id": ObjectId(get_user), "tags": get_tag }).count();
        if (check_tags == 0) {
          var ok = await db.collection("user").update({ "_id": ObjectId(get_user) }, {
            "$push": {
              "tags": get_tag
            }
          })
          res.send(JSON.stringify(1));
        } else {
          res.send(JSON.stringify(0));
        }
      } else if (get_type == 3) {
        //時時檢測
      } else { res.send(JSON.stringify(0)); }
    }
    db_connect();
  })
})


//收藏、关注相关
app.post('/api/star_blog', getjson, function (req, res) {
  var user_id = req.body.user_id;
  var blog_id = req.body.blog_id;
  var type = req.body.type;
  var get_star = req.body.get_star;

  MongoClient.connect(DB_STR, function (err, db) {
    var connect_db = async () => {
      if (type == 1) {
        //收藏
        //保存与检测并行
        var check_star = await db.collection("user").count({ "_id": ObjectId(user_id), "star_blog": blog_id });
        console.log(check_star)
        if (check_star == 0) {
          var star_blog = await db.collection("user").update({ "_id": ObjectId(user_id) }, {
            "$push": {
              "star_blog": blog_id
            }
          });
          var res_star = await db.collection("user").find({ "_id": ObjectId(user_id) }, { "star_blog": 1, "_id": 0 }).toArray();
          var get_blog = await db.collection("blog_text").find({ "blog_id": { "$in": res_star[0].star_blog } }).toArray();
          var send = {
            flag: 1,
          }
          res.send(JSON.stringify(send));
        } else {
          res.send(JSON.stringify(0));
        }

      } else if (type == 2) {
        //取消收藏
        var cancel_star = await db.collection("user").update({ "_id": ObjectId(user_id) }, {
          "$pull": {
            "star_blog": blog_id
          }
        });
        var send = {
          flag: 1,
        };
        res.send(JSON.stringify(send));

      } else if (type == 3) {
        //获取所有收藏文章内容
        var find_blog = await db.collection("blog_text").find({ "blog_id": { "$in": get_star } }).toArray();
        res.send(JSON.stringify(find_blog));
      } else if (type == 4) {
        //拿出垃圾箱
        var out_draft = await db.collection("blog_text").update({ "blog_id": user_id }, {
          "$set": {
            "show_status": 2
          }
        });
        var send = {
          flag: 1,
        }
        res.send(JSON.stringify(send));
      } else {
        res.send('{"flag":00}');
      }
    }
    connect_db();
  })
})


//评论相关
app.post('/api/talk', getjson, function (req, res) {
  var type = req.body.type;
  var blog_id = req.body.blog_id;
  var user_id = req.body.user_id;
  var text = req.body.text;
  var talk_withwho = req.body.talk_withwho;
  var talk_id = req.body.talk_id;
  //获取评论人信息用

  var get_blog = req.body.get_blog;
  var reset_date = new Date();
  var get_date = {
    year: reset_date.getFullYear(),
    month: reset_date.getMonth()+1,
    day: reset_date.getDate(),
    hours: reset_date.getHours(),
    minutes: reset_date.getMinutes(),
    secs: reset_date.getSeconds()
  };
  MongoClient.connect(DB_STR, function (err, db) {
    var connect_db = async () => {
      if (type == 0) {
        //发表评论
        var creat_talk = {
          talk_id: uuid(),
          blog_id: blog_id,
          talk_user: user_id,
          talk_text: text,
          talk_date: get_date,
          talk_withwho: talk_withwho,
        }
        var add_talk = await db.collection("blog_text").update({ "blog_id": blog_id }, {
          "$push": {
            "talk": creat_talk
          }
        }, true);
        //根据评论获取相关信息
        res.send(JSON.stringify(creat_talk));
      } else if (type == 1) {
        //获取评论
        var req_talk = await db.collection("blog_text").find({ "blog_id": blog_id }, { "talk": 1, "_id": 0 }).toArray();
        //获取所有评论人员信息
        var get_result = [];
        for (var i = 0; i < req_talk[0].talk.length; i++)
        {
          console.log(i);
          var get_info = await db.collection("user").find({ "_id": ObjectId(req_talk[0].talk[i].talk_user) }, { "_id": 0, "user_name": 1, "user_pic": 1 }).toArray();
          console.log("ok" + req_talk[0].talk[i].talk_withwho.length);         
          if (req_talk[0].talk[i].talk_withwho.length == 0) {
            get_result.push({
              blog_id: req_talk[0].talk[i].blog_id,
              talk_date: req_talk[0].talk[i].talk_date,
              talk_id: req_talk[0].talk[i].talk_id,
              talk_text: req_talk[0].talk[i].talk_text,
              talk_name: get_info[0].user_name,
              talk_pic: get_info[0].user_pic,
              talk_withwho: []
            });
          } else {
             var merge_talk = [];
            for (var a = 0; a < req_talk[0].talk[i].talk_withwho.length; a++) {
              var get_with = await db.collection("user").find({ "_id": ObjectId(req_talk[0].talk[i].talk_withwho[a]) }, { "_id": 0, "user_name": 1 }).toArray();
              merge_talk.push({
                                    user_id: req_talk[0].talk[i].talk_withwho[a],
                                    user_name: get_with[a].user_name
                                  });
            }
           get_result.push({
                                  blog_id: req_talk[0].talk[i].blog_id,
                                  talk_date: req_talk[0].talk[i].talk_date,
                                  talk_id: req_talk[0].talk[i].talk_id,
                                  talk_text: req_talk[0].talk[i].talk_text,
                                  talk_name:get_info[0].user_name,
                                  talk_pic:get_info[0].user_pic,
                                  talk_withwho: merge_talk
                                });
            
          }
        }  
        res.send(JSON.stringify(get_result));
      }else if (type == 2) {
        //博主删除评论
        var del_talk = await db.collection("blog_text").update({ "talk.talk_id": talk_id }, {
          "$pull": {
            "talk": {
              "talk_id": talk_id
            }
          }
        });
        res.send(JSON.stringify(1));

      } 
    }
    connect_db();
  })
})

//修改个人信息（用户名，用户简介，博客简介，用户头像）
app.post('/api/setting', function (req, res) {
  var form = new formidable.IncomingForm();//formidable通过IncomingForm示例来对表单进行单元控制
  form.encoding = 'utf-8',
    form.uploadDir = __dirname + "/../assets/data/upload";//上传文件的保存路径
  form.keepExtensions = true;//保存扩展名
  form.maxFieldsSize = 10 * 1024 * 1024;//上传文件的最大大小
  form.multiples = false;

  form.parse(req, function (err, fields, files) {
    MongoClient.connect(DB_STR, function (err, db) {
      var connect_db = async () => {
        if (fields.type == "change_info") {
          //整合修改信息
          var change_user = {
            user_id: fields.user_id,
            blog_name: fields.blog_name,
            blog_intro: fields.blog_intro,
            email: fields.email,
            user_name: fields.user_name
          }

          var change_info = await db.collection("user").update({ "_id": ObjectId(change_user.user_id) }, {
            "$set": {
              "user_name": change_user.user_name,
              "email": change_user.email,
              "blog_name": change_user.blog_name,
              "blog_intro": change_user.blog_intro
            }
          });
          res.send(JSON.stringify(change_user));

        } else if (fields.type == "change_pass") {
          if (fields.step == 1) {
            //检测密码正确性
            db.collection("user").findOne({ "_id": ObjectId(fields.user_id) }, function (err, result) {
              if (fields.password == result.user_password) {
                res.send('{"flag":1}');
              } else {
                res.send('{"flag":0}');
              }
            })

          } else if (fields.step == 2) {
            //检测修改正确性

            db.collection("user").update({ "_id": ObjectId(fields.user_id) }, {
              "$set": {
                "user_password": fields.newpassword
              }
            }, function (err, result) {
              res.send('{"flag":1}');
            })
          } else {
            res.send('{"flag":0}');
          }

        } else if (fields.type == "change_img") {
          //获取上传文件信息
          var get_oldpath = files.file.path;
          var get_type = files.file.type.replace(/.+\//g, "");
          //对文件信息进行修改整合
          var get_random = parseInt(Math.random() * 9999 + 6666);
          var get_newpath = "/static/data/img/" + "user_pic" + get_random + '.' + get_type;
          //移动文件  注意对文件进行移动所作的处理
          fs.rename(get_oldpath, __dirname + "/../.." + get_newpath, function (err) {
            if (err) {
              console.log("上传错误" + err);
            }
          });
          var change_user = {
            user_id: fields.user_id,
            user_pic: get_newpath
          }
          //將用戶數據保存到數據庫
          db.collection("user").update({ "_id": ObjectId(change_user.user_id) }, {
            "$set": {
              "user_pic": change_user.user_pic
            }
          },
            function (err, result) {
              res.send(JSON.stringify(change_user));
            })
        } else {
          res.send(JSON.stringify({ "flag": 0 }));
        }
      }
      connect_db();
    });
  });
});


var clientid = "8f4afb51d5cf5f1000f1afab96bf38904ce5131ffcaa51a41e5105719b30b907";
var secret = "e84cdc258372b3ad5bed07d3fa2274d57fef8803f591c6396bf29f937d67b505";
  var oauth = new OAuth2(
	clientid,
	secret,
	'https://zypc.xupt.edu.cn/',
  null, 'oauth/token', null);
//oauth验证登录
app.get('/api/oauth', function (req, res) {
  console.log("开始oauth");
  oauth.getOAuthAccessToken("123", {'grant_type':'authorization_code','redirect_uri':'https://zypc.xupt.edu.cn'}, function(e, access_token) {
				console.log("Permitting access from"+access_token);
				console.log("the_key"+access_token+e)
				if(e != null|| access_token == undefined) {
          console.log("失败");
				} else {
					oauth.get('https://zypc.xupt.edu.cn/oauth/userinfo', access_token, function(e, data) {
						console.log("成功"+data);
					});
				}
			});
  res.send('ok');
})

//开启服务
var server = app.listen(8000, function () { });
