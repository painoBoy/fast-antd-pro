import { stringify } from 'qs';
import request from '@/utils/request';


export async function queryTableList(params) {
  return request(`/cneiu-fk/supplier/order/list?${stringify(params)}`);
}
//订单详情
export async function queryOrderDetail(params) {
  return request(`/cneiu-fk/supplier/order/orderDetail?${stringify(params)}`);
}
//订单明细列表
export async function queryOrderDetailList(params) {
  return request(`/cneiu-fk/supplier/order/orderItems?${stringify(params)}`);
}
//订单确认
export async function confirmOrder(params) {
  return request(`/cneiu-fk/supplier/order/confirmOrder?${stringify(params)}`);
}
//生成配送单号
export async function getOrderNo(params) {
  return request(`/cneiu-fk/supplier/distributionOrderNo?${stringify(params)}`);
}
//生成配送单(发货)
export async function senGoods(params) {
  return request(`/cneiu-fk/supplier/bulidDistributionOrder${stringify(params)}`)
}



