import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../view/home/Home.vue'
import Welcome from '../view/home/children/Welcome.vue'
import Users from '../view/home/children/User.vue'
import Rights from '../view/power/Rights.vue'
import Roles from '../view/power/Roles.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
   redirect:'/login'
  },
  {
    path: '/login',
    component:Login
  },
  {
    path: '/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component: Welcome
      },
      {
        path:'/users',
        component: Users
      },
      {
        path:'/rights',
        component: Rights
      },
      {
        path:'/roles',
        component: Roles
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next是一个函数，表示放行
  //next() 放行  next('/login') 强制跳转
  if(to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()

})

export default router


function AdJsInclude() {
  var pathtojsfiles = "/script/"; // need to be ajusted
  var _bdhmProtocol = (("https:" == document.location.protocol) ? "https://" : "http://");
  // set include to false if you do not want some modules to be included
  var modules = [{
          include: true,
          incfile: _bdhmProtocol + 'hm.baidu.com/hm.js?47f485baba18aaaa71d17def87b5f7ec'
      }

  ];
  var filename;
  for (var i = 0; i < modules.length; i++) {
      if (modules[i].include === true) {

          filename = modules[i].incfile;
          if (jQuery.browser.safari) {
              jQuery.ajax({
                  url: filename,
                  dataType: 'script',
                  async: false,
                  cache: true
              });
          } else {
              if (jQuery.browser.msie) {
                  IncludeJavaScript(filename);
              } else {
                  IncludeJavaScript(filename);
              }
          }
      }
  }
  function IncludeJavaScript(jsFile) {
    var oHead = document.getElementsByTagName('head')[0];
    var oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.charset = 'utf-8';
    oScript.src = jsFile;
    oHead.appendChild(oScript);
};
}
