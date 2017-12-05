# zypc_blog


## 使用框架及组件
1. express
2. PM2: 日志，启动，热监听node文件

## 使用模块
1.  body-parse: 解析http中的各项数据
2.  cookie-parser: 解析cookie工具
> 3. formidable : 专用于处理表单上传，功能强大
> 关于文件上传：entype(表单上传格式) multiple（多文件上传）
> 在此模块中，表单数据以键值对形式保存于回调函数parse 的fields与files中   __并且可自动解析JSON数据到fields中__
> form可进行初始化设置，为 encoding uploadDir keepExtensions maxFieldsSize hash(文件哈希检验) multiples(多文件上传,启用时files将为一个数组)
> 其中，文件的返回属性有 size type name path lastModifiedDate
> 在大型文件上传中，可使用on进行不同文件上传事件的监听，来打造上传进度条
4. crypto加密模块
5. cors跨域请求模块（非简单请求时使用，可全局可局部）

## 开发备注
1. 使用了node + express + mongodb + vue + vue-cli + webpack + element-ui + vuex + vue-resource(与后台进行服务连接)
2. 使用过程：全局安装node与vue-cli，使用vue-cli脚手架搭建项目结构
3. 注意点：vue与element-ui结合——————vue-router与node结合（路由接口作用）——————vue-cli与webpack结合————node与mongodb结合
4. 我单独从外部引入了jquery(需要配置webpack以及启用)来方便的使用ajax，实际上vue提供了这种前后端交互的组件————vue-resource（已更改/__後期對jquery進行清除__）

首先 node模块使用分为两个方法 app.use激活或者中间价启用

5. 关于vue组件间通信必须得了解透彻（props）    ---如何能灵活了解如何使用mavonEditor

6. 现阶段对mongodb使用的看法：能够一次性获取用户的全部数据，对于用户的某个内容不用再去单独建立连接获取，在单页应用中具有很大的优势

## upload
1.  根据mongo数据库内置id来表示唯一数据
2. 部分插件使用了localstroge来进行存储检查标记，待改善
3.  edit栏目改进(支持本地上传上传图片以及自动保存)
4. 对ajax json传输部分进行冗余优化
5.  对数据库进行操作大部分是自己写的代码，应该充分使用数据库给出的已有的方法
6. 进行文档数据获取的大更改，初始化时一次性加载全部数据，后台api数据只开放文档读取接口与文档更新接口
7. __对后台交互作升级 每一次向后台的提交为ajax，拿取数据为本地__
8. 实现数据都从vuex里拿取

9. 自己实现了一个emoji表情选择的全套解决方案（emojione）
## 遇到的問題
1. 關於ajax跨域
2. 關於外部js與css引入
3. 關於與服務器端通信
4. 關於組建閒通信模塊
5. 關於密碼的保護
6. 關於多賬戶登陸
7. mongoose查询空值问题
8. vue-resource异步加载问题与 methods方法注册问题
9. __我擦 撞鬼了 vue属性自动与store更新了__
10. 还是得熟悉掌握vue响应式原理，理解watch与computed（与methods区别）的运用
> computed中直接放入改变变量 则档次变量变化时，会自动执行该函数
> [相关链接]https://cn.vuejs.org/v2/guide/computed.html#计算属性
11. Vue对当前点击事件的处理

12.  oauth连接登入(登入密码的设置)   上传图片     大厅与客人浏览

__13.__ 一定注意mongodb的_id的object类型 查询的时候用到_id很坑的 

14. JSON对循环引用对象的问题：不能够字符化，可以使用node内置的util模块的util.inspec()

15. __惨痛的教训！！！__:新老数据库对比 
    + 新数据库 ![新数据库](http://oqi1qtyq6.bkt.clouddn.com/%E7%BE%A4%E5%8D%9A%E7%B3%BB%E7%BB%9F%E6%95%B0%E6%8D%AE%E5%BA%93%E7%BB%93%E6%9E%84.png)


    + 老数据库 ![老数据库](http://oqi1qtyq6.bkt.clouddn.com/%E7%BE%A4%E5%8D%9A%E7%B3%BB%E7%BB%9F%E6%95%B0%E6%8D%AE%E5%BA%93%E7%BB%93%E6%9E%84%EF%BC%88%E5%A4%87%E4%BB%BD%EF%BC%89.png)


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

