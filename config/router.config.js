export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [{
        path: '/user',
        redirect: '/user/login'
      },
      {
        path: '/user/login',
        component: './User/Login'
      },
      {
        path: '/user/forgotpassword',
        component: './User/ForgotPassword'
      },
      {
        path: '/user/register',
        component: './User/Register'
      },
      { 
        path: '/user/register-result',
        component: './User/RegisterResult'
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      // dashboard
       {
        path: '/',
        redirect: '/Dashboard/Workplace'
      },
      {
        path: '/dashboard/workplace',
        name:'workplace',
        component:'/Dashboard/Workplace'
      },
      {
        path: '/Order/MyOrder',
        name: 'MyOrder',
        component: './Order/MyOrder/MyOrder',
        routes: [{
          path: '/Order/MyOrder',
          redirect: '/Order/MyOrder/ConfimOrder?orderState=W',
        },
        {
          path: '/Order/MyOrder/ConfimOrder',
          component: './Order/MyOrder/ConfimOrder',
        },
        {
          path: '/Order/MyOrder/BackOrder',
          component: './Order/MyOrder/BackOrder',
        },
        {
          path: '/Order/MyOrder/ReceivedOrder',
          component: './Order/MyOrder/ReceivedOrder',
        },
        {
          path: '/order/myorder/completeorder',
          component: './Order/MyOrder/CompleteOrder',
        },
        {
          path: '/order/myorder/orderdetail',
          component: './Order/MyOrder/OrderDetail/OrderDetail',
        },
        {
          path: '/order/myorder/deliverdetail',
          component: './Order/MyOrder/OrderDetail/DeliverDetail',
        },
        {
          path: '/order/myorder/viewdetail',
          component: './Order/MyOrder/OrderDetail/ViewDetail',
        },
        {
          path: '/order/myorder/allorderdetail',
          component: './Order/MyOrder/OrderDetail/AllOrderDetail',
        },
      ],
 
      },
      {
        path: '/DisManage/DisManage',
        name: 'disManage',
        component: './DisManage/DisManage'
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [{
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [{
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            // authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [{
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [{
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu: true,
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            hideInMenu: true,
            component: './Result/Success',
          },
          {
            path: '/result/fail',
            name: 'fail',
            hideInMenu: true,
            component: './Result/Error'
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        hideInMenu: true,
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            hideInMenu: true,
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            hideInMenu: true,
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [{
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [{
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [{
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
