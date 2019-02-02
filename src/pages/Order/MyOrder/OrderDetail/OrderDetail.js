import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import router from 'umi/router';
import { getQueryString } from '@/utils/utils';
import {
  Spin,
  Button,
  Menu,
  Dropdown,
  Icon,
  Row,
  Col,
  Steps,
  Card,
  Popover,
  Badge,
  Modal,
  Table,
  Tooltip,
  Divider,
} from 'antd';
import classNames from 'classnames';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './OrderDetail.less';
import Link from 'umi/link';
import SuccessPage from '../../../Result/Success'
const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

const operationTabList = [
  {
    key: 'detail',
    tab: '订单明细',
  },
  {
    key: 'progress',
    tab: '进度',
  },
];

const desc1 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    <Fragment>
      曲丽丽
      <Icon type="dingding-o" style={{ marginLeft: 8 }} />
    </Fragment>
    <div>2016-12-12 12:32</div>
  </div>
);

const desc2 = (
  <div className={styles.stepDescription}>
    <Fragment>
      周毛毛
      <Icon type="dingding-o" style={{ color: '#00A0E9', marginLeft: 8 }} />
    </Fragment>
    <div>
      <a href="">催一下</a>
    </div>
  </div>
);

const popoverContent = (
  <div style={{ width: 160 }}>
    吴加号
    <span className={styles.textSecondary} style={{ float: 'right' }}>
      <Badge status="default" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>未响应</span>} />
    </span>
    <div className={styles.textSecondary} style={{ marginTop: 4 }}>
      耗时：2小时25分钟
    </div>
  </div>
);

const customDot = (dot, { status }) =>
  status === 'process' ? (
    <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
      {dot}
    </Popover>
  ) : (
    dot
  );

const columns = [
  {
    title: '序号',
    dataIndex:'sNum',
    key:'sNum',
    render:(text,record,index)=>`${index+1}`
  },
  {
    title: '物品编码',
    dataIndex: 'itemBm',
    key: 'itemBm',
  },
  {
    title: '物品名称',
    dataIndex: 'itemName',
    key: 'itemName',
  },
  {
    title: '品牌',
    dataIndex: 'itemBrand',
    key: 'itemBrand',
  },
  {
    title: '规格',
    dataIndex: 'itemSpecification',
    key: 'itemSpecification',
  },
  {
    title: '型号',
    dataIndex: 'itemModel',
    key: 'itemModel',
  },
  {
    title: '数量',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '计量单位',
    dataIndex: 'itemUnit',
    key: 'itemUnit',
  },
  {
    title: '价格（元）',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '生产厂家',
    dataIndex: 'itemManufacturer',
    key: 'itemManufacturer',
  },
  {
    title: '操作',
    dataIndex: 'type',
    key: 'type',
  },
];

@connect(({ query, loading }) => ({
  query,
  loading: loading.effects['query/OrderDetail'],
}))
class OrderDetail extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading:true,
      operationkey: 'detail',
      stepDirection: 'horizontal',
    };
  }

 

  componentDidMount() {
    const { dispatch ,location:{search}} = this.props;
    const orderId =search.split('?')[1];
    if(orderId){
      dispatch({
        type: 'query/OrderDetail',
        payload:{
          orderId,
        }
      });
      dispatch({
        type: 'query/OrderDetailList',
        payload:{
          orderId,
        }
      }).then(()=>{
        this.setState({
          loading:false,
        })
      });
    }

   
    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentDidUpdate() {
    const {query:{result}} = this.props;
    if(result.code == 0){
      Modal.success({
        title:'提示',
        content:'订单确认成功！'
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  handleConfirmClick = ()=>{
    Modal.confirm({
      title: '提示',
      content: '是否确认当前订单？',
      cancelText:"取消",
      okText : "确认",
      onOk:()=>{this.handleConfirm()},
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  handleConfirm =()=>{
    const { dispatch ,location:{search}} = this.props;
    const orderId =search.split('?')[1];
    if(orderId){
        dispatch({
          type: 'query/ConfirmOrder',
          payload:{
            orderId,
          },
          callback:(res)=>{
            if(res){
              Modal.success({
                title:'确认成功',
                content:'确认订单成功,该订单状态更新为已确认待发货状态',
                okText:"立即发货",
                onOk(){
                  
                }
              })
            }
          }
        })

    }
  }

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  handleTableChange = (pagination) => {
      this.setState({
        loading:true
      })
      const { dispatch ,query:{detailList} ,location:{search}} =this.props;
      const orderId =search.split('?')[1];
      const queryInfo  = {
        orderId,
        page:pagination.current,
        limit:pagination.pageSize,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      }
      console.log(queryInfo);
      dispatch({
        type: 'query/OrderDetailList',
        payload:queryInfo,
      }).then(()=>{
        this.setState({
          loading:false
        })
      });
  };

  render() {
    const { stepDirection, operationkey } = this.state;
    const { query, loading,children,match, location } = this.props;
    const {orderDetail,detailList} = query;

    if(!orderDetail){
      return(
        <Spin></Spin>
      )
    }else{
      const pagination = {
        pageSize:detailList.pageSize,
        current:detailList.currPage,
        total:detailList.totalCount
      };

      const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize:detailList.pageSize,
        current:detailList.currPage,
        total:detailList.totalCount,
        showTotal: ()=>{  //设置显示一共几条数据
          return <span style={{position:'absolute',left:0,fontSize:13}}>{'共 ' + detailList.totalCount + ' 条记录 第'+detailList.currPage+'/'+detailList.totalPage+' 页'} </span>; 
        }
      };
      const action = (
        <Fragment>
              <Button style={{position:'absolute',right:120}} onClick={()=> router.goBack()}>返回</Button>   
              <Button  style={{position:'absolute',right:40}} type="primary" onClick={this.handleConfirmClick}>确认</Button>
        </Fragment>
      );
      
      const extra = (
        <Row>
          <Col xs={24} sm={12}>
            <div className={styles.textSecondary}>状态</div>
            <div className={styles.heading}>{orderDetail.strstatus=='W'?'待确认':''}</div>
          </Col>
          <Col xs={24} sm={12}>
            <div className={styles.textSecondary}>订单金额</div>
            <div className={styles.heading}>¥ 568.08</div>
          </Col>
        </Row>
      );
      
      const description = (
        <DescriptionList className={styles.headerList} size="small" col="2">
          <Description term="供货单位">重庆市测试医院数据</Description>
          <Description term="供货地址">重庆市渝中测试地址</Description>
          <Description term="收货单位">{orderDetail.strreceiverid}</Description>
          <Description term="收货地址">
           测试收货地址
          </Description>
          <Description term="收货人">{orderDetail.strreceiverid}</Description>
          <Description term="接收日期">{orderDetail.datereceive}</Description>
          <Description term="最迟确认日期"></Description>
          <Description term="最迟发货日期"></Description>
        </DescriptionList>
      );
  
      const contentList = {
        detail: (
          <Table
            loading={loading}
            dataSource={detailList.list}
            columns={columns}
            pagination={paginationProps}
            loading={this.state.loading}  //设置loading属性
            
            onChange={this.handleTableChange}
            />
        ),
        progress: (
          <Card title="流程进度" style={{ marginBottom: 24 }} bordered={false}>
            <Steps direction={stepDirection} progressDot={customDot} current={parseInt(orderDetail.strprogress)}>
              <Step title="待确认" description={desc1} />
              <Step title="待发货"  />
              <Step title="待收货" />
            </Steps>
          </Card>
        ),
      };
      return (
        <PageHeaderWrapper
          title={`订单号：${orderDetail.strinternalno}`}
          logo={
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
          }
          action={action}
          content={description}
          extraContent={extra}
          tabList={operationTabList}
          onTabChange={this.onOperationTabChange}
        >
        <Card bordered={false}>
          {/* {children} */}
          {contentList[operationkey]}
        </Card>
          {/* <Card title="用户近半年来电记录" style={{ marginBottom: 24 }} bordered={false}>
            <div className={styles.noData}>
              <Icon type="frown-o" />
              暂无数据
            </div>
          </Card> */}
          {/* <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            onTabChange={this.onOperationTabChange}
          >
            {contentList[operationkey]}
          </Card> */}
        </PageHeaderWrapper>
      );
    };
    

  
  }
}

export default OrderDetail;
