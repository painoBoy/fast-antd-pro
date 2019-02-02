import { routerRedux } from 'dva/router';
import React from 'react'
import {message ,notification} from 'antd';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { getPageQuery } from '@/utils/utils';

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

export default {
  namespace: 'login',
  state: {
    status: undefined,
    uuid:getUUID(),
  },
  effects: {
     //图片验证码
    //  *getCaptcha({ payload }, { call}) {
    //   const response =  yield call(getFakeCaptcha, payload);
    // },

    //登录
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin,payload);
      // 登陆成功
      if (response.code == '0') {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            response,
          }
        });
        

        localStorage.setItem('token',response.token);
  
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        //如果是用户登录时返回登录路径，则以用户登录路径为准
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        //重定向路由
        yield put(routerRedux.replace("/dashboard/workplace" || '/'));
      
      }else{
        yield put({
          type: 'changeLoginStatus',
          payload: {
            uuid:getUUID(),
          }
        });

        notification['error']({
          message: '登录失败',
          description:response.msg,
        });
      }
    },
   
    *changeImgCaptcha({ payload }, { call, put }){
      yield put({
        type: 'changeImg',
        payload: {
          uuid:getUUID(),
        }
      });
    },

    *logout(_, { put }) {
      localStorage.removeItem('token');
      yield put({
        type: 'changeLoginStatus',
        payload: {
          uuid:getUUID(),
          status: false,
          currentAuthority: 'guest',
        },
      });
      // reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);//不涉及权限验证
      return {
        ...state,
        uuid:payload.uuid
        // status: payload.status,
        // type: payload.type,
      };
    },
    changeImg(state,{payload}){
      return{
        ...state,
        uuid:payload.uuid
      }
    }
  },
};
