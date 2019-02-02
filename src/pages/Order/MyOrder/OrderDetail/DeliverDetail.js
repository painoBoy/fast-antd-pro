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
  Form,
  Input,
} from 'antd';
import classNames from 'classnames';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './OrderDetail.less';
import Link from 'umi/link';
import SuccessPage from '../../../Result/Success'
import TableForm from '../../../Forms/TableForm'
const { Step } = Steps;
const FormItem = Form.Item;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  }

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} is required.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}



const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;



const operationTabList = [
  {
    key: 'detail',
    tab: '订单明细',
  },
  {
    key: 'other',
    tab: '其他资料',
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
  status === 'other' ? (
    <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
      {dot}
    </Popover>
  ) : (
    dot
  );



@connect(({ query, loading }) => ({
  query,
  loading: loading.effects['query/OrderDetail'],
}))
class DeliverDetail extends Component {
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
    const orderId =search.split('?')[1].split('&&')[0];
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
      content: '是否发货当前订单？',
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
    const orderId =search.split('?')[1].split('&&')[0];
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
      const orderId =search.split('?')[1].split('&')[0];
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
    const { query, loading,children,match, location:{search}} = this.props;
    const orderNo = search.split('?')[1].split('&&')[1]
    const {orderDetail,detailList} = query;
    const columns = [
      {
        title: '物品编码',
        dataIndex: 'itemBm',
        key: 'itemBm',
      },
      {
        title: '物品名称',
        dataIndex: 'itemName',
        key: 'itemName',
        width:130,
      },
      {
        title: '生产厂家',
        dataIndex: 'itemManufacturer',
        key: 'itemManufacturer',
      },
      {
        title: '有效期',
        dataIndex: 'dateValid',
        key: 'dateValid',
        editable:true,
      },
      {
        title:'灭菌日期',
        dataIndex:'dateSterilization',
        key:'dateSterilization',
        editable: true,
      },
      {
        title: '配送数',
        dataIndex: 'numSendNum',
        key: 'numSendNum',
        editable: true,
      },
      {
        title: '实送数',
        dataIndex: 'ActDeliveryNum',
        key: 'ActDeliveryNum',
      },
      {
        title: '未配送数',
        dataIndex: 'notDeliveryNum',
        key: 'notDeliveryNum',
      },
      {
        title: '采购数量',
        dataIndex: 'numPurchaseNum',
        key: 'numPurchaseNum',
      },
      {
        title: '计量单位',
        dataIndex: 'itemUnit',
        key: 'itemUnit',
      },
      {
        title: '批号',
        dataIndex: 'strBatchNo',
        key: 'strBatchNo',
        editable: true,
      },
      {
        title: '操作',
        width:110,
        dataIndex:'intbatch',
        render: (text, record) => (
          <div>
            <a>复制</a>
            <Divider type="vertical" />
            <a>删除</a>
    
          </div>
            //  text== 0 ?<a onClick={() => this.handleUpdateModalVisible(true, record)}>确认</a>:<Badge status={statusMap[text]} text={status[text]} />
        ),
      },
    ];

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    // const columns = this.columns.map((col) => {
    //   if (!col.editable) {
    //     return col;
    //   }
    //   return {
    //     ...col,
    //     onCell: record => ({
    //       record,
    //       inputType: col.dataIndex === 'age' ? 'number' : 'text',
    //       dataIndex: col.dataIndex,
    //       title: col.title,
    //       editing: this.isEditing(record),
    //     }),
    //   };
    // });

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
              <Button style={{position:'absolute',right:140}} onClick={()=> router.goBack()}>返回</Button>   
              <Button  style={{position:'absolute',right:40}} type="primary" onClick={this.handleConfirmClick}>确认发货</Button>
        </Fragment>
      );
      
      const extra = (
        <Row>
          <Col xs={24} sm={12}>
            <div className={styles.textSecondary}>状态</div>
            <div className={styles.heading}>{orderDetail.strstatus=='H'?'待发货':''}</div>
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
            <Fragment>
                <div style={{marginBottom:20}}>
                    <Button icon="printer" type="default" onClick={this.handlePrintTable}>
                        打印配送单
                    </Button>
                    <Button icon="printer" style={{marginLeft:15}} type="default" onClick={this.handleExportExcel}>
                        打印高值条码
                    </Button>
                </div>
              
                <Table
                    components={components}
                    loading={loading}
                    dataSource={detailList.list}
                    columns={columns}
                    pagination={paginationProps}
                    loading={this.state.loading}  //设置loading属性
                    rowClassName="editable-row"
                    onChange={this.handleTableChange}
                    />
            </Fragment>
                
       
        ),
        other: (
         <TableForm />
        ),
      };
      return (
        <PageHeaderWrapper
          title={`配送单号：${orderNo}`}
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

export default DeliverDetail;
