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
        go_index: ""
       
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
        set_edit(state, info) {
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
        change_info(state, info) {
            //改变当前用户登录信息同级别的信息
            if (info.type == "user_pic") {
                 state.alldocument.user_pic = info.value;
            } else if (info.type == "change_some") {
                state.log_name = info.change.user_name;
                state.alldocument.user_name = info.change.user_name;
                state.alldocument.email = info.change.email;
                state.alldocument.blog_name = info.change.blog_name;
                state.alldocument.blog_intro = info.change.blog_intro;
            } else if (info.type == "add_star") {
                state.alldocument.star_blog.push(info.value);
            } else if (info.type == "del_star") {
                for (var i = 0; i < state.alldocument.star_blog.length; i++)
                {
                    if (state.alldocument.star_blog[i] == info.value) {
                        state.alldocument.star_blog.splice(i, 1);
                    }
                }    
            }
           
            }
    }
})
