import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}
//获取图片验证码
export async function getFakeCaptcha(params) {
  return request(`/cneiu-fk/captcha.jpg?${stringify(params)}`);
}
//登陆请求
export async function fakeAccountLogin(params) {
  return request('/cneiu-fk/sys/login', {
    method: 'POST',
    body: params,
  });
}
//激活账号 -> 邮箱验证
export async function validateEmial(params) {
  return request(`/cneiu-fk/sys/account/valid?${stringify(params)}`);
}

//激活账号 -> 用户名是否存在
export async function validateLoginName(params) {
  return request(`/cneiu-fk/sys/account/checkLoginName?${stringify(params)}`);
}

//激活账号
export async function activeAccount(params) {
  return request('/cneiu-fk/sys/account/active', {
    method: 'POST',
    body: params,
  });
}

//找回密码
export async function resetPassword(params) {
  return request('/cneiu-fk/sys/account/restPassWord', {
    method: 'POST',
    body: params,
  });
}

//找回密码 -> 获取邮箱验证
export async function getRestCode(params) {
  return request(`/cneiu-fk/sys/account/getRestCode?${stringify(params)}`);
}

export async function queryNotices() {
  return request('/api/notices');
}

