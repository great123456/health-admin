import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '住院订单' }
                },
                {
                    path: '/order',
                    component: resolve => require(['../components/page/order.vue'], resolve),
                    meta: { title: '心电图订单' }
                },
                {
                    path: '/report',
                    component: resolve => require(['../components/page/report.vue'], resolve),
                    meta: { title: '报告列表' }
                },
                {
                    path: '/fee',
                    component: resolve => require(['../components/page/fee.vue'], resolve),
                    meta: { title: '费用列表' }
                },
                {
                    // banner上传
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: 'banner管理' }
                },
                {
                    // 学校管理
                    path: '/school',
                    component: resolve => require(['../components/page/school.vue'], resolve),
                    meta: { title: '病种分类' }
                },
                {
                    // 专业管理
                    path: '/profession',
                    component: resolve => require(['../components/page/profession.vue'], resolve),
                    meta: { title: '专家团队' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve),
            meta: {title:'健康管理后台系统'}
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve),
            meta: {title:'404'}
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve),
            meta: {title:'403'}
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
