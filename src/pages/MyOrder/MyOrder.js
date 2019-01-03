import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, List, Avatar,Tabs,Form,Input, Button, Icon, } from 'antd';

import { Radar } from '@/components/Charts';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './MyOrder.less';
const TabPane = Tabs.TabPane;
const links = [
 
];

@connect(({ user, project, activities, chart, loading }) => ({
  currentUser: user.currentUser,
  project,
  activities,
  chart,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  projectLoading: loading.effects['project/fetchNotice'],
  activitiesLoading: loading.effects['activities/fetchList'],
}))
class MyOrder extends PureComponent {
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
  callback(index){
    console.log(index)
  }

  render() {
    const {
      currentUser,
      currentUserLoading,
      project: { notice },
      projectLoading,
      activitiesLoading,
      // chart: { radarData },
    } = this.props;

    const pageHeaderContent =
      currentUser && Object.keys(currentUser).length ? (
        <div className={styles.pageHeaderContent}>
          <div className={styles.avatar}>
            <Avatar size="large" src={currentUser.avatar} />
          </div>
          <div className={styles.content}>
            <div className={styles.contentTitle}>
            {currentUser.group}: {currentUser.name}
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
          <p>150,0000元</p>
        </div>
        <div className={styles.statItem}>
          <p>可融资额度</p>
          <p>
           100,00000元
          </p>
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
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title={false}
              bordered={false}
              // extra={<Link to="/">全部项目</Link>}
              loading={projectLoading}
              bodyStyle={{ padding: 0 }}
            >
             <Tabs defaultActiveKey="1" onChange={this.callback} size="large" style={{marginLeft:20}}>
                <TabPane tab="待确认" key="1">待确认订单</TabPane>
                <TabPane tab="待发货" key="2">待发货订单</TabPane>
                <TabPane tab="待收货" key="3">待收货订单页</TabPane>
                <TabPane tab="已完成" key="4">已完成页面</TabPane>
                <TabPane tab="发票清单" key="5">发票页</TabPane>
                <TabPane tab="待融资发票" key="6">Content of Tab Pane 3</TabPane>
             </Tabs>
            </Card>
            <Card></Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default MyOrder;
