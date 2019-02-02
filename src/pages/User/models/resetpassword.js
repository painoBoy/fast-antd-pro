import React from 'react';
import { resetPassword,getRestCode } from '@/services/api';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { reloadAuthorized } from '@/utils/Authorized';
export default {
  namespace: 'resetpassword',

  state: {
    status: undefined,
  },
  emailAress:{},

  effects: {

    //重置前验证邮箱是否存在
    *getCode({ payload }, { call,put}) {
      const response = yield call(getRestCode, payload);
      yield put({
        type: 'checkEmailStatus',
        payload: response 
      });
        if (response.code === 0) {
          reloadAuthorized();
              notification['success']({
              message: '提示',
              description:'发送验证码成功,请打开邮件获取验证码!',
              });
            }else{

            notification['error']({
              message: '失败',
              description:response.msg,
            }); 
          }
          return response;
    },
    
    //重置密码
    *reSet({ payload }, { call, put }) {
      const response = yield call(resetPassword, payload);
        if (response.code === 0) {
          yield put({
            type: 'resetPasswordHandle',
            payload: response,
          });
          notification['success']({
            message: '提示',
            description:'重置密码成功',
          });
          yield put(
            routerRedux.push({
              pathname: '/user/login',
              search: stringify({
                redirect: window.location.href,
              }),
            })
          );
        }else{
          notification['error']({
            message: '失败',
            description:response.msg,
          });
          return false;
        }
    },
  },

  reducers: {
    checkEmailStatus(state,{payload}){
      return {
        ...state,
        emailAress:payload
      }
    },
    resetPasswordHandle(state, { payload }) {
      // setAuthority('user');
      // reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
