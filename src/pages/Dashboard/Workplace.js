import React, { PureComponent,Suspense } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, List, Avatar,Rate,Steps} from 'antd';

import { Radar } from '@/components/Charts';
import EditableLinkGroup from '@/components/EditableLinkGroup';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PageLoading from '@/components/PageLoading';
import { getTimeDistance } from '@/utils/utils';
const SalesCard = React.lazy(() => import('./SalesCard'));
const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
import styles from './Workplace.less';

const Step = Steps.Step;

@connect(({ user, project, activities, chart, loading }) => ({
  supplierInfo:user.supplierInfo,
  currentUser: user.currentUser,
  project,
  activities,
  chart,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  projectLoading: loading.effects['project/fetchNotice'],
  activitiesLoading: loading.effects['activities/fetchList'],
}))
class Workplace extends React.PureComponent {
  
   state = {
    StarValue:3,
    rangePickerValue: getTimeDistance('year'),
  }
  componentDidMount() {

    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type:'user/querySupplierInfo',
    });
    dispatch({
      type: 'project/fetchNotice',
    });
    dispatch({
      type: 'activities/fetchList',
    });
    dispatch({
      type: 'chart/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

    //获取柱状图数据
  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  
  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  handleChange = (value)=>{
    this.setState({
        StarValue:value
    })
  }

  render() {
    const {
      supplierInfo,
      currentUser,
      currentUserLoading,
      project: { notice },
      projectLoading,
      activitiesLoading,
      chart,
      loading
    } = this.props;
    const {visitData,salesData} = chart;
    const { rangePickerValue, salesType, currentTabKey } = this.state;

    const pageHeaderContent =
      currentUser && Object.keys(currentUser).length ? (
        <div className={styles.pageHeaderContent}>
          <div className={styles.avatar}>
            <Avatar size="large" src={currentUser.avatar} />
          </div>
          <div className={styles.content}>
            <div className={styles.contentTitle}>
              供应商超级库管员：
              {supplierInfo.supplierName}
            </div>
            <div>
              {currentUser.title} |{currentUser.group}
            </div>
          </div>
        </div>
      ) : null;

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>本年已开金额</p>
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
          <Rate disabled defaultValue={this.state.StarValue} value={this.state.StarValue} onChange={this.handleChange}/>
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
              className={styles.projectList}
              style={{ marginBottom: 24}}
              title="首次建议操作流程"
              bordered={false}
              extra={<Link to="/">查看帮助</Link>}
              loading={projectLoading}
              bodyStyle={{ padding: 0 }}
            >
              <Steps current={0} style={{padding:'22px'}}>
                <Step style={{cursor:'pointer'}} title="导入产品列表" description="This is a description." />
                <Step title="产品对码" description="This is a description." />
                <Step title="添加厂商供应商证件" description="This is a description." />
                <Step title="添加物品注册证" description="This is a description." />
                <Step title="确认订单发货" description="This is a description." />
              </Steps>
            </Card>
            <Suspense fallback={<PageLoading />}>
              <IntroduceRow loading={loading} visitData={visitData} />
            </Suspense>
            <Suspense fallback={null}>
              <SalesCard
                rangePickerValue={rangePickerValue}
                salesData={salesData}
                isActive={this.isActive}
                handleRangePickerChange={this.handleRangePickerChange}
                loading={loading}
                selectDate={this.selectDate}
              />
            </Suspense>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
