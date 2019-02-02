import { queryTableList,queryOrderDetail,queryOrderDetailList,confirmOrder,getOrderNo} from '@/services/order';
import {message} from 'antd';
import router from 'umi/router';

export default {
  namespace: 'query',
  state: {
    data: {},
    orderDetail:{},
    detailList:{},
    result:{},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTableList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *OrderDetail({payload},{call,put}){
      const response = yield call(queryOrderDetail, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *OrderDetailList({payload},{call,put}){
      const response = yield call(queryOrderDetailList, payload);
      yield put({
        type: 'list',
        payload: response,
      });
    },
    *ConfirmOrder({payload,callback},{call,put}){
      const response = yield call(confirmOrder, payload);
      if(response.code == 0){
        if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
        }
      }else{
        message.error(response.msg);
      }
      
    },
    *getOrderNo({payload,callback},{call}){
      const response = yield call(getOrderNo,payload);
      if(response.code == 0){
        if(callback && typeof callback === 'function'){
          callback(response);//dispath callback回调
        }
      }else{
        message.error(response.msg);
      }
    }

    // *add({ payload, callback }, { call, put }) {
    //   const response = yield call(addRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
    // *remove({ payload, callback }, { call, put }) {
    //   const response = yield call(removeRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
    // *update({ payload, callback }, { call, put }) {
    //   const response = yield call(updateRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
  },

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        data: payload,
        orderDetail:payload.orderDetail,
      };
    },
    list(state,{payload}){
      return{
        ...state,
        detailList:payload.page,
      }
    },
    submit(state,{payload}){
      return {
        ...state,
        result:payload
      }
    }
  },
};
