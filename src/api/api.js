
//引入依赖模块
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
  var blog = JSON.parse(req.body.check_blog);
  var get_title = blog.check_title;

  MongoClient.connect(DB_STR, function (err, db) {
    db.collection("user").find({ "_id": ObjectId(blog.user_id), "blog_text.title": blog.check_title }).count(function (err, result) {
      if (result == 0) {
        res.send('{"flag":1}');
      } else {
        res.send('{"flag":0}');
      }
    })
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
  var form = new formidable.IncomingForm();//formidable通过IncomingForm示例来对表单进行单元控制
  form.encoding = 'utf-8',
    form.parse(req, function (err, fields, files) {
      if (check_form("name", fields.name)) {
        var find_user = {
          name: fields.name,
          password: fields.password,
        }
        //进行数据库查询
        MongoClient.connect(DB_STR, function (err, db) {
          db.collection("user").findOne({ "user_name": find_user.name }, function (err, result) {
            if (result == null) {
              //无账号
              var send_flag = {
                flag: 0
              }
              res.send(JSON.stringify(send_flag));
            } else {
              if (find_user.password == result.user_password) {
                //密码正确，跳转到个人主页
                var send_flag = {
                  log_name: find_user.name,
                  log_id: result._id,
                  flag: 1
                };
                res.send(JSON.stringify(send_flag));
              } else {
                //密码错误
                var send_flag = {
                  flag: 0
                }
                res.send(JSON.stringify(send_flag));
              }
            }
          })
        })
      } else {
        var send_flag = {
          flag: 0
        }
        res.send(JSON.stringify(send_flag));
      }

    })
});



//编辑接口
app.post('/api/edit', getjson, function (req, res) {
  var blog = JSON.parse(req.body.blog);//blog_id为隐藏

  //设置时间戳
  var the_date = new Date();
  var get_year = the_date.getFullYear();
  var get_month = the_date.getMonth() + 1;
  var get_day = the_date.getDate();
  var get_date = get_year + '-' + get_month + '-' + get_day;
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

    db.collection("user").find({ "blog_text.blog_id": blog.blog_id }).count(function (err, result) {
      if (result == 0) {
        //新文章
        console.log("新建");
        db.collection("user").find({ "blog_text.title": blog.title }).count(function (err, result) {
          //标题检测
          if (result == 0) {
            //新建博文

            //设置objectid
            var new_id = uuid();
            db.collection("user").update({ "_id": ObjectId(blog.user_id) }
              , {
                $push: {
                  "blog_text": {
                    blog_id: new_id,
                    title: blog.title,
                    tags: blog.tags,
                    pic: blog.pic,
                    value: blog.value,
                    show_status: blog.show_status,
                    date: get_date
                  }
                }
              },
              function (err, result) {

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
                    date: get_date
                  }
                }
                res.send(JSON.stringify(set_send));
              }
            );

          } else {
            res.send('{"flag":0}');
          }
        })
      } else {
        //修改文章
        db.collection("user").find({ "blog_text.title": blog.title }).count(function (err, result) {
          //标题检测
          if (result == 0 || result == 1) {
            //修改博文
            console.log("修改");
            db.collection("user").update({ "_id": ObjectId(blog.user_id), "blog_text.blog_id": blog.blog_id }
              , {
                $set: {
                  "blog_text.$.title": blog.title,
                  "blog_text.$.tags": blog.tags,
                  "blog_text.$.pic": blog.pic,
                  "blog_text.$.value": blog.value,
                  "blog_text.$.show_status": blog.show_status
                }
              }
              , function (err, result) {
                var set_send = {
                  flag: 2,
                  blog_id: blog.blog_id,
                }
                res.send(JSON.stringify(set_send));
              })
          } else {
            res.send('{"flag":0}');
          }
        })
      }
    })
  })

});


//获取用户所有资料
app.post('/api/get_all', getjson, function (req, res) {
  var get_blog = JSON.parse(req.body.message);

  MongoClient.connect(DB_STR, function (err, db) {
    db.collection("user").findOne({ "_id": ObjectId(get_blog.user_id) }, function (err, result) {
      //返回用户全部信息(除了密码)
      var new_user = result;
      new_user.user_password = "不给你看";
      res.send(JSON.stringify({ res_result: new_user }));
    })
  })
});


//标签更新模块  对用户分类进行管理 与博文分离    
app.post('/api/get_tags', getjson, function (req, res) {
  var get_user = req.body.user_id;
  var get_type = req.body.get_type;
  //检测更新类型
  if (get_type == 0) {
    //获取当前用户标签
    //每获取一次 则更新一次
    MongoClient.connect(DB_STR, function (err, db) {
      db.collection("user").findOne({ "_id": ObjectId(get_user) }, function (err, result) {
        //每获取一次 则tags更新一次
        //当前文章中已有的标签并去重
        var check_tags = [];
        for (var i = 0; i < result.blog_text.length; i++) {
          check_tags.push.apply(check_tags, result.blog_text[i].tags);
        }
        var get_array = [];
        for (var a = 0; a < check_tags.length; a++) {
          if (get_array.indexOf(check_tags[a]) == -1) {
            get_array.push(check_tags[a]);
          }
        }
        check_tags = get_array;

        //用户自定义的标签
        var self_tags = result.tags;
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
        db.collection("user").update({ "_id": ObjectId(get_user) }, {
          "$set": { "tags": new_tags }
        })
        res.send(JSON.stringify(new_tags));
      })
    })
  } else if (get_type == 1) {
    //删除tag
    var get_tag = req.body.tag;
    MongoClient.connect(DB_STR, function (err, db) {
      db.collection("user").update({ "_id": ObjectId(get_user) }, {
        "$pull": {
          "tags": get_tag
          //"blog_text.$.tags": get_tag
        }
      }, function (err, result) {
        db.collection("user").update({ "_id": ObjectId(get_user), "blog_text.tags": get_tag }, {
          "$pull": {
            "blog_text.$.tags": get_tag
          }
        },
          function (err, result) {
            console.log("sorry=" + err + result);
            db.collection("user").findOne({ "_id": ObjectId(get_user) }, function (err, result) {

              var res_info = {
                flag: 1,
                blog_text: result.blog_text,
                tags: result.tags
              }
              res.send(JSON.stringify(res_info));
            })

          })
      })

    })
  } else if (get_type == 2) {
    //增加tag
    var get_tag = req.body.tag;
    //检测重复的标签
    MongoClient.connect(DB_STR, function (err, db) {
      db.collection("user").find({ "_id": ObjectId(get_user), "tags": get_tag }).count(function (err, result) {
        if (result == 0) {
          db.collection("user").update({ "_id": ObjectId(get_user) }, {
            "$push": {
              "tags": get_tag
            }
          }
            , function (err, result) {
              res.send(JSON.stringify(1));
            })
        } else {
          res.send(JSON.stringify(0));
        }

      }
      );


    })
  } else if (get_type == 3) {
    //時時檢測
  } else { res.send(JSON.stringify(0)); }
})



//收藏、关注相关
app.post('/api/star_blog', getjson, function (req, res) {
  var user_id = req.body.user_id;
  var blog_id = req.body.blog_id;
  var type = req.body.type;
  if (type == 1) {
    //收藏
    MongoClient.connect(DB_STR, function (err, db) {
      //保存与检测并行
      db.collection("user").count({ "_id": ObjectId(user_id), "star_blog": blog_id }, function (err, result) {

        if (result == 0) {
          db.collection("user").update({ "_id": ObjectId(user_id) }, {
            "$push": {
              "star_blog": blog_id
            }
          },
            function (err, result) {
              console.log(err + result)
              db.collection("user").findOne({ "_id": ObjectId(user_id) }, function (err, result) {
                var send = {
                  flag: 1,
                  star_blog: result.star_blog
                }
                res.send(JSON.stringify(send));
              })
            })
        } else {
          res.send(JSON.stringify(0));
        }
      })

    })
  } else if (type == 2) {
    //取消收藏
    MongoClient.connect(DB_STR, function (err, db) {
      db.collection("user").update({ "_id": ObjectId(user_id), "star_blog": blog_id }, {
        "$pull": {
          "star_blog": blog_id
        }
      },
        function (err, result) {
          var send = {
            flag: 1,
            star_blog: blog_id
          }
          res.send(JSON.stringify(send));
        })
    })
  } else if (type == 3) {
    //获取所有收藏文章内容
    MongoClient.connect(DB_STR, function (err, db) {
      db.collection("user").findOne({ "_id": ObjectId(user_id) }, function (err, result) {
        var the_arr = result.star_blog;
        db.collection("user").find({ "blog_text": { "$elemMatch": { "blog_id": { "$in": the_arr } } } }, { "blog_text": 1, "_id": 0 }).toArray(function (err, result) {
          //对拿去数据进行数组格式化 获取的数据是一个二维数组一个文档查询的结果为一个数组元素
          //由于mongo返回的符合的文档 so 对返回进行筛选
          var res_blog = [];
          for (var i = 0; i < result.length; i++) {
            for (var a = 0; a < result[i].blog_text.length; a++) {
              res_blog.push(result[i].blog_text[a]);
            }
          }
          var result_blog = [];

          for (var i = 0; i < res_blog.length; i++) {
            if (the_arr.indexOf(res_blog[i].blog_id) !== -1) {
              result_blog.push(res_blog[i]);
            }
          }
          res.send(JSON.stringify(result_blog));
        })
      })
    })
  } else if (type == 4) {
    //拿出垃圾箱
    MongoClient.connect(DB_STR, function (err, db) {
      db.collection("user").update({ "_id": ObjectId(user_id), "blog_text.blog_id": blog_id }, {
        "$set": {
          "blog_text.$.show_status": 2
        }
      }, function (err, result) {
        console.log(err + result)
        var send = {
          flag: 1,
          draft_blog: blog_id
        }
        res.send(JSON.stringify(send));
      })
    })
  } else {
    res.send('{"flag":0}');
  }
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
 var d = new Date();
    var getmouth = d.getMonth() + 1;
    var get_date = d.getFullYear() + "-" + getmouth + "-" + d.getDate();
  if (type == 0) {
    //发表评论
   
    var creat_talk = {
      talk_id: uuid(),
      blog_id: blog_id,
      talk_user: user_id,
      talk_text: text,
      talk_date: get_date,
      talk_withwho:[]
    }
    MongoClient.connect(DB_STR, function (err, db) {
      db.collection("user").update({ "blog_text.blog_id": blog_id }, {
        "$push": {
          "blog_text.$.talk": creat_talk
        }
      }, true, function (err, result) {
        //根据评论获取相关信息
        res.send(JSON.stringify(creat_talk));
      })
    })
  } else if (type == 1) {
    //发表评论的评论
  } else if (type == 2) {
    //博主删除评论
    MongoClient.connect(DB_STR, function (err, db) {
      db.collection("user").update({ "blog_text.talk.talk_id": talk_id }, {
        "$pull": {
          "blog_text.$.talk": {
            "talk_id":talk_id
          }
        }
      },function (err, result) {
        res.send(JSON.stringify(1));
      })
    })
  } else if (type == 3) {
    //获取评论
    MongoClient.connect(DB_STR, function (err, db) {
      db.collection("user").find({ "blog_text.blog_id": blog_id }, { "blog_text": 1, "_id": 0 }).toArray(function (err, result) {
        var get_blog;
        for (var i = 0; i < result[0].blog_text.length; i++) {
          if (result[0].blog_text[i].blog_id == blog_id) {
            get_blog = result[0].blog_text[i].talk;
          }
        }
        var get_talk = [];
        for (var i = 0; i < get_blog.length; i++) {
          get_talk.push(get_blog[i].talk_user);
        }
        //对用户id进行bson化
        var talk_arr = [];
        for (var i = 0; i < get_talk.length; i++)
        {
          talk_arr.push(ObjectId(get_talk[i]));
        }  
        db.collection("user").find({ "_id": { "$in": talk_arr } }, { "user_name": 1, "user_pic": 1, "_id": 1 }).toArray(function (err, result) {
          //搜索结果进行合并 以对象数组形式发送
          var result_talk = []
          for (var i = 0; i < result.length; i++) {
            for (var a = 0; a < get_blog.length; a++) {
              if (get_blog[a].talk_user = result[i]._id) {
                result_talk.push({
                  talk_user:get_blog[a].talk_user,
                  talk_date: get_blog[a].talk_date,
                  talk_name: result[i].user_name,
                  talk_pic: result[i].user_pic,
                  talk_text: get_blog[a].talk_text,
                  talk_id:get_blog[a].talk_id
                });
              }
            }
          }
          res.send(JSON.stringify(result_talk));
        })
      })
    })

  } else if (type == 4) {
    //回复评论
    MongoClient.connect(DB_STR, function (err, db) {
      db.collection("user").findOne({ "blog_text.blog_id": blog_id }, { "blog_text.talk": 1, "_id": 0 },function (err, result) {
        //因为有的博客还没有初始化评论 所以进行一遍筛选
        var format_talk = [];
        for (var i = 0; i < result.blog_text.length; i++)
        {
          if (JSON.stringify(result.blog_text[i]) !== "{}")
          {
            format_talk.push(result.blog_text[i]);
          }  
        }
        //查找到增加回复的那条评论
        var get_talk;
        var get_index;
        for (var i = 0; i < format_talk.length; i++)
        {
          for (var a = 0; a < format_talk[i].talk.length; a++)
          {
            if (format_talk[i].talk[a].talk_id == talk_id) {
              get_talk = format_talk[i].talk[a];
              get_index1 = i;
              get_index2 = a;
            }
          }  
        }
        var with_id = uuid();
        get_talk.talk_withwho.push(
          {
            with_id: with_id,
            talk_text: text,
            talk_date: get_date,
            user_id: user_id,
            with_who: talk_withwho
          }
        )
        console.log(get_talk);
        //放入修改
        var get_find = "blog_text." + get_index1 + ".talk." + get_index2;
        var find = {}
        find[get_find] = get_talk
        console.log("find="+find);
        db.collection("user").update({ "blog_text.talk.talk_id": talk_id}, {
          "$set": 
            find
        }, function (err, result) {
          //通过user_id获取回复人信息
          get_res = {
              type:1,
              with_id: with_id,
              talk_date: get_date,
            }
          res.send(JSON.stringify(get_res));
          })
      })
    })
  }

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

    if (fields.type == "change_info") {
      //整合修改信息
      var change_user = {
        user_id: fields.user_id,
        blog_name: fields.blog_name,
        blog_intro: fields.blog_intro,
        email: fields.email,
        user_name: fields.user_name
      }
      MongoClient.connect(DB_STR, function (err, db) {
        db.collection("user").update({ "_id": ObjectId(change_user.user_id) }, {
          "$set": {
            "user_name": change_user.user_name,
            "email": change_user.email,
            "blog_name": change_user.blog_name,
            "blog_intro": change_user.blog_intro
          }
        },
          function (err, result) {
            res.send(JSON.stringify(change_user));
          })
      })
    } else if (fields.type == "change_pass") {
      if (fields.step == 1) {
        //检测密码正确性
        MongoClient.connect(DB_STR, function (err, db) {
          db.collection("user").findOne({ "_id": ObjectId(fields.user_id) }, function (err, result) {
            if (fields.password == result.user_password) {
              res.send('{"flag":1}');
            } else {
              res.send('{"flag":0}');
            }
          })
        })
      } else if (fields.step == 2) {
        //检测修改正确性
        MongoClient.connect(DB_STR, function (err, db) {
          db.collection("user").update({ "_id": ObjectId(fields.user_id) }, {
            "$set": {
              "user_password": fields.newpassword
            }
          }, function (err, result) {
            res.send('{"flag":1}');
          })
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
      MongoClient.connect(DB_STR, function (err, db) {
        db.collection("user").update({ "_id": ObjectId(change_user.user_id) }, {
          "$set": {
            "user_pic": change_user.user_pic
          }
        },
          function (err, result) {
            res.send(JSON.stringify(change_user));
          })
      })
    } else { }
    /*
    if (files == true) {
      //获取上传文件信息
      var get_oldpath = files.user_pic.path;
      var get_type = files.user_pic.type.replace(/.+\//g, "");
      //对文件信息进行修改整合
      var get_random = parseInt(Math.random() * 9999 + 6666);
      var get_newpath = __dirname + "../assets/data/img/" + "user_pic" + get_random + '.' + get_type;
      //移动文件
      fs.rename(get_oldpath, get_newpath, function (err) {
        if (err) {
          res.send("上传错误，请联系郭大帅" + err);
        }
      });
      var change_user = {
        user_id: fields.blog_id,
        blog_name: fields.blog_name,
        blog_intro: fields.blog_intro,
        user_intro: fields.email,
        user_name: fields.user_name,
        user_pic: get_newpath
      }
    } else {
      //整合修改信息
      var change_user = {
        user_id:fields.user_id,
        blog_name: fields.blog_name,
        blog_intro: fields.blog_intro,
        email: fields.email,
        user_name: fields.user_name
      }
      
      User.findById(change_user.user_id, function (err, user) {
        console.log(user);
        user.user_name = change_user.user_name;
        user.email = change_user.email;
        user.blog_name = change_user.blog_name;
        user.blog_intro = change_user.blog_intro;

        user.save(function (err) {
          console.log("setting status = ", err ? 'failed' : 'success');
        });
  res.send();
      })
    }*/
  });
});


//oauth验证登录
app.post('/oauth', function (req, res) {

  res.send('ok');
})

//开启服务
var server = app.listen(8000, function () { });
