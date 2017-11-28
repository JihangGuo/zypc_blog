  <template>
        <div id="app">
          <router-view></router-view>
        </div>
      </template>


  <script>
    import Vue from 'vue'
    import ElementUI from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    import App from './App.vue'


    
    
    
    
    Vue.use(ElementUI);

    export default {
      name: 'app',
      data() {
          return {}
      }
    }



  </script>

  <style>
  </style>
