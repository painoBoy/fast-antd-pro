import request from '@/utils/request';
import { async } from 'q';
import { func } from 'prop-types';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function querySupplierInfo(){
  return request(`/cneiu-fk/supplier/workBench?params=${new Date().getTime()}`);

}