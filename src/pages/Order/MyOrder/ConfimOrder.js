
import React, { PureComponent,Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, List, Avatar,Tabs,Form,Input, Button, Icon, Rate,Select,Dropdown,DatePicker,Modal,message,Badge,Divider,Radio,InputNumber} from 'antd';
import { Radar } from '@/components/Charts';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import XLSX from 'xlsx';
import { getTimeDistance , printTables } from '@/utils/utils';
import { exportExcel } from 'xlsx-oc';
import styles from './MyOrder.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const statusMap = ['error'];
const status = ['资质维护'];


@Form.create()

@connect(({ query, loading }) => ({
  query,
  loading: loading.models.query,
}))

export default class ConfimOrder extends React.PureComponent{
  state = {
    rangePickerValue:getTimeDistance('all'),
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };
 
  columns = [
    {
      title: '订单号',
      dataIndex: 'strinternalno',
    },
    {
      title: '院方采购人',
      dataIndex: 'strReceiverId',
    },
    {
        title: '部门',
        dataIndex: 'desc',
      },
    {
      title: '联系人电话',
      dataIndex: 'strreceivertel',
    },
    {
      title: '接收时间',
      dataIndex: 'datereceive',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      dataIndex:'blniscert',
      render: (text, record) => (
        // <a onClick={() =>{console.log(record)}}>确认</a>
        // <Link to={{pathname:'orderdetail',query:{orderData:record}}}>确认</Link> 
        // <Link to={`orderdetail?${record.id}`}>确认</Link> 
        <div>
          {text==1 ?<Link to={`orderdetail?${record.id}`}>确认</Link> :<Badge  status={statusMap[text]} text={status[text]} />}
        </div>
          //  text== 0 ?<a onClick={() => this.handleUpdateModalVisible(true, record)}>确认</a>:<Badge status={statusMap[text]} text={status[text]} />
      ),
    },
  ];
 
  componentDidMount() {
    const { dispatch,location:{query}} = this.props;
    const { formValues } = this.state;
    // this.props.onRef(this);
    dispatch({
      type: 'query/fetch',
      payload:{formValues,orderState:query.orderState},
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, location:{query} } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    
    const params = {
      orderState:query.orderState,
      page:pagination.current,
      limit:pagination.pageSize,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sidx = `datereceive`;
      params.order =  `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'query/fetch',
      payload: params,

    });
  };

  handleFormReset = () => {
    const { form, dispatch ,location:{query} } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'query/fetch',
      payload: {
        orderState:query.orderState
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  update = (e)=>{
    const { dispatch, form, location:{query} } = this.props;
    dispatch({
      type: 'query/fetch',
      payload: {
        orderState:query.orderState,
      },
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form,location:{query} } = this.props;
    

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {receiveDates} = fieldsValue;
      const values = {
        orderState:query.orderState,
        ...fieldsValue,
        receiveDates:receiveDates?moment(receiveDates[0]).format( 'YYYY-MM-DD 00:00:00')+','+moment(receiveDates[1]).format( 'YYYY-MM-DD 23:59:59') : null,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'query/fetch',
        payload: values,
      });
    });
  };

  handleExportExcel = () => {
    //         const dataSource = [{
    //             key: '1',
    //             cs: 'title',
    //             sm: '列头显示文字',
    //             lx: 'string',
    //             mrz: '',
    //         }, {
    //             key: '2',
    //             cs: 'mm',
    //             sm: '啦啦啦啦',
    //             lx: 'string',
    //             mrz: '',
    //         }];
     
    //             var _headers = [{ k: 'cs', v: '列名' }, { k: 'sm', v: '描述' },
    //             { k: 'lx', v: '类型' }, { k: 'mrz', v: '默认值' },]
    //             exportExcel(_headers, dataSource);
     
    //         // render
    //         <Button onClick={() => exportDefaultExcel()}>导出</Button>
    const { query: { data },loading,} = this.props;
    const _headers = [{ k: 'id', v: '订单号' }, { k: 'strReceiverId', v: '院方采购人' },
            { k: 'lx', v: '部门' }, { k: 'strreceivertel', v: '联系电话' },{k:'datereceive',v:'接收时间'}]
            exportExcel(_headers, data.page.list);
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'query/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'query/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  
  handlePrintTable = ()=>{
    printTables('printTable')
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('orderNo')(<Input placeholder="请输入订单号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="供货单位">
              {getFieldDecorator('personName')(<Input placeholder="请输入联系人" />)}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col> */}
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  onChange = (date,dataString)=>{
    // alert(dataString);
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('orderNo')(<Input placeholder="请输入订单号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="供货单位">
              {getFieldDecorator('personName')(<Input placeholder="请输入供货单位" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="供货地址">
              {getFieldDecorator('personTel')(<Input placeholder='供货地址'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="联系人">
                {getFieldDecorator('personTel')(<Input placeholder='联系人'/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="联系电话">
                {getFieldDecorator('personTel')(<Input placeholder='联系电话'/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="当前状态">
                {getFieldDecorator('orderType')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="">全部</Option>
                    <Option value="HP">待审</Option>
                    <Option value="PL">正常</Option>
                    <Option value="PL">驳回</Option>
                    <Option value="PL">证书到期</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
                <FormItem label="材料类型">
                  {getFieldDecorator('orderType')(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      <Option value="">全部</Option>
                      <Option value="HP">高值耗材</Option>
                      <Option value="PL">普通耗材</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="接收时间">
                  {getFieldDecorator('receiveDates')(
                    <RangePicker style={{ width: '100%' }} 
                    onChange={this.onChange}
                    format="YYYY-MM-DD"
                    />
                  )}
                </FormItem>
              </Col>
          </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  handleRadioChange = (e)=>{
    const { dispatch, form,location:{query} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {receiveDates} = fieldsValue;
      const values = {
        orderState:query.orderState,
        ...fieldsValue,
        receiveDates:  getTimeDistance(e.target.value),
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'query/fetch',
        payload: values,
      });
    });
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      query,
      loading,
    } = this.props;

    const {data} = query;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues ,rangePickerValue} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    return (
      <div>
        <Card 
        bordered={false} 
        className={styles.containerBox}
        >
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator} >
              <Button icon="printer" type="default" onClick={this.handlePrintTable}>
                打印
              </Button>
              <Button icon="export" type="default" onClick={this.handleExportExcel}>
                导出
              </Button>
              <div className={styles.extraContent}>
                <RadioGroup defaultValue="all" onChange={this.handleRadioChange}>
                  <RadioButton value="all">全部</RadioButton>
                  <RadioButton value="today">今日</RadioButton>
                  <RadioButton value="week">本周</RadioButton>
                  <RadioButton value="month">本月</RadioButton>
                </RadioGroup>
              </div>
              {/* {selectedRows.length > 0 && ( */}
                {/* <span>
                  <Button>批量操作</Button> */}
                  {/* <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown> */}
                {/* </span> */}
              {/* {/* )} */}
            </div>
            <StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              loading={loading}
              data={data.page}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </div>
    );
  }
}