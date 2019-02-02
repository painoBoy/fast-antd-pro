import { activeAccount,validateEmial,validateLoginName} from '@/services/api';
import { notification ,message } from 'antd';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';


export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *checkEmail({payload},{call}){
      const response = yield call(validateEmial, payload);
      if(response.code!=0){
        message.error(response.msg);
      }
    },
    *checkLoginName({payload},{call}){
      const response = yield call(validateLoginName, payload);
      if(response.code!=0){
        message.error(response.msg);
      }
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(activeAccount, payload);
        if (response.code == 0) {
          yield put({
            type: 'registerHandle',
            payload: response,
          });
          notification['success']({
            message: '提示',
            description:'激活成功!',
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
            message: '激活失败',
            description:response.msg,
          });
        }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
      };
    },
  },
};
