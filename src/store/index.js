import vue from 'vue'
import vuex from 'vuex'

vue.use(vuex);

export default new vuex.Store({
    state: {
        log_status:false,
        log_name: '未登录',
        log_id: '未登录',
        alldocument: [],
        show_document:[],
        go_edit: false,
        go_index: "",
        star_blog:""
    },
    mutations: {
        swith_login(state, info) {
            state.log_status = state.log_status ? false : true;//登录状态切换
            if (!state.log_status) {
                state.log_name = '未登录';
                state.log_id = '未登录';
            } else {
                state.log_name = info.log_name;
                state.log_id = info.log_id;
            }
            
        },
        swith_all(state, info) {
            if (info.length==0) {
                state.alldocument = false;
            } else {
                state.alldocument = info;
            }
        },
        set_edit(state,info) {
            state.go_edit = info.go_edit;
            state.go_index = info.go_index;
        },
        swith_document(state, info) {
            if (info.length == 0) {
                state.show_document = false;
            } else {
                state.show_document = info;
            }
        },
        set_document(state,info) {
            if (info.type == "add") {
                state.alldocument.blog_text.push(info.value);
            } else if (info.type == "edit") {
                for (var i = 0; i < state.alldocument.blog_text.length; i++)
                {
                    if (info.index == state.alldocument.blog_text[i].blog_id)
                    {
                        state.alldocument.blog_text[i] = info.value;
                    }    
                }    
                
            } else if (info.type == "del") {
                alert("还未构建");
            } else if (info.type == "del_draft") {
                for (var i = 0; i < state.alldocument.blog_text.length; i++)
                {
                    if (info.value == state.alldocument.blog_text[i].blog_id)
                    {
                        state.alldocument.blog_text[i].show_status = 1;
                    }    
                }    
            } else if (info.type == "updata") {
                state.alldocument.blog_text = info.value;
            }
        },
        
        swith_tags(state, info) {
            if (info.type == "reget") {
                state.alldocument.tags = info.value;
            } else if (info.type == "add") {
                console.log(state.alldocument.tags);
                //state.alldocument.tags.push(info.value);
                console.log(state.alldocument.tags);
            } else if (info.type == "del") {
                for (var i = 0; i < state.alldocument.tags.length; i++)
                {
                    if (state.alldocument.tags[i] == info.value)
                    {
                         state.alldocument.tags.splice(i,1);
                    }    
                }    
               
            }else{}
        },
        change_info(state, info) {
            //改变当前用户登录信息同级别的信息
            if (info.type == "user_pic")
            {
                 state.alldocument.user_pic = info.value;
            } else if (info.type =="add_star"){
                state.star_blog = info.value;
            } else if (info.type == "del_star") {
                for (var i = 0; i < state.star_blog.length; i++)
                {
                    if (state.star_blog[i] == info.value) {
                        state.star_blog.splice(i, 1);   
                    }
                }    
            }
           
            }
    }
})
