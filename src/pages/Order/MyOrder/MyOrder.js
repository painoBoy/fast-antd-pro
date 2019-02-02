import React, { PureComponent,Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import { Row, Col, Card, List, Avatar,Tabs,Form,Input, Button, Icon,Rate,Select,Dropdown,DatePicker,Modal,message,Badge,Divider,Radio,InputNumber} from 'antd';

import { Radar } from '@/components/Charts';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
// import ConfimOrder from './ConfimOrder';//待确认订单
// import BackOrder from './BackOrder';//待发货订单
// import ReceivedOrder from './ReceivedOrder';//待收货订单
// import CompleteOrder from './CompleteOrder';//已完成顶订单
import styles from './MyOrder.less';


@connect(({ user, project, activities, chart, loading ,query}) => ({
  currentUser: user.currentUser,
  supplierInfo:user.supplierInfo,
  query,
  project,
  activities,
  chart,
  listLoading: loading.effects['user/querySupplierInfo'],
  currentUserLoading: loading.effects['user/querySupplierInfo'],
  projectLoading: loading.effects['project/fetchNotice'],
  activitiesLoading: loading.effects['activities/fetchList'],
}))
class MyOrder extends PureComponent {//订单页
    constructor(props){
      super(props)
      this.state = {
        StarValue:3,
        orderState:'W',
        updated:'',
      }
    }
    
  componentDidMount() {
    const { dispatch } = this.props;
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  renderActivities() {
    const {
      activities: { list },
    } = this.props;
    return list.map(item => {
      const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
        if (item[key]) {
          return (
            <a href={item[key].link} key={item[key].name}>
              {item[key].name}
            </a>
          );
        }
        return key;
      });
      return (
        <List.Item key={item.id}>
          <List.Item.Meta
            avatar={<Avatar src={item.user.avatar} />}
            title={
              <span>
                <a className={styles.username}>{item.user.name}</a>
                &nbsp;
                <span className={styles.event}>{events}</span>
              </span>
            }
            description={
              <span className={styles.datetime} title={item.updatedAt}>
                {moment(item.updatedAt).fromNow()}
              </span>
            }
          />
        </List.Item>
      );
    });
  }

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'ConfimOrder':
      this.setState({
        orderState:'W',
      })
        router.push(`${match.url}/ConfimOrder?orderState=W`);
        break;
      case 'BackOrder':
        this.setState({
          orderState:'H',
        })
        router.push(`${match.url}/BackOrder?orderState=H`);
        break;
      case 'ReceivedOrder':
        this.setState({
          orderState:'D',
        })
        router.push(`${match.url}/ReceivedOrder?orderState=D`);
        break;
      case 'CompleteOrder':
        this.setState({
          orderState:'C',
        })
        router.push(`${match.url}/CompleteOrder?orderState=C`);
        break;
      default:
        break;
    }
  };


  render() {
    const {
      children,
      supplierInfo,
      currentUser,
      match,
      location,
      listLoading,
      currentUserLoading,
      project: { notice },
      projectLoading,
      activitiesLoading,
      // chart: { radarData },
    } = this.props;
// console.log(location.pathname.replace(`${match.path}/`,''));
    const operationTabList = [
      {
        key: 'ConfimOrder',
        tab: (
          <span style={{fontSize:16}}>
            待确认 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'BackOrder',
        tab: (
          <span style={{fontSize:16}}>
            待发货 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'ReceivedOrder',
        tab: (
          <span style={{fontSize:16}}>
            待收货 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'CompleteOrder',
        tab: (
          <span style={{fontSize:16}}>
            已完成 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
    ];
  
    const pageHeaderContent =
      currentUser && Object.keys(currentUser).length ? (
        <div className={styles.pageHeaderContent}>
          <div className={styles.avatar}>
            <Avatar size="large" src={currentUser.avatar} />
          </div>
          <div className={styles.content}>
            <div className={styles.contentTitle}>
            {currentUser.group}: {supplierInfo.supplierName}
            </div>
            <div>
            管理范围:所有订单收发货融资申请
              {/* {currentUser.title} |{currentUser.group} */}
            </div>
          </div>
        </div>
      ) : null;

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>本年已开票金额</p>
          <p>{supplierInfo.kpje}元</p>
        </div>
        <div className={styles.statItem}>
          <p>可融资额度</p>
          <p>
          {supplierInfo.rzje}元
          </p>
        </div>
        <div  style={{float:"right"}}>
        <div className={styles.statItem}>
          <p>综合评分</p>
          <Rate disabled defaultValue={this.state.StarValue} value={this.state.StarValue} />
          <span className="ant-rate-text">{this.state.StarValue}星</span> 
        </div>
      </div>
      </div>
    );

    return (
      <PageHeaderWrapper
        loading={currentUserLoading}
        content={pageHeaderContent}
        extraContent={extraContent}
 
      >
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={location.pathname.replace(`${match.path}/`, '')}
              onTabChange={this.onTabChange}
            >
              {children}
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}
export default MyOrder;
