import { query as queryUsers, queryCurrent ,querySupplierInfo} from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    supplierInfo:{},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *querySupplierInfo(_,{call,put}){
      const  response = yield call(querySupplierInfo);
      if(response.code == 0){
        yield put({
          type:'saveQuerySupplierInfo',
          payload: response.workBench,
        })
      }
      
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveQuerySupplierInfo(state,action){
      return {
        ...state,
        supplierInfo: action.payload || {},
      }
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
