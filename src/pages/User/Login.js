import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon,Input,Row ,Col,Form,Button,Tabs} from 'antd';
// import Login from '@/components/Login';
import styles from './Login.less';

// const { Tab, UserName, Password, Mobile, Captcha, Submit ,CaptPic} = Login;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class LoginPage extends React.PureComponent {
  constructor(props){
    super(props)
  }
  
  state = {
    type: 'account',
    autoLogin: true,
  };
  componentDidMount(){
    const { dispatch } = this.props;

    dispatch({
      type: 'login/getCaptcha',
    })
  }


  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch ,login} = this.props;
    const {uuid} = login;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'login/login',
          payload: {
            ...values,
            uuid
          },
        })
      }
    });
  };

  // handleSubmit = (err, values) => {
  //   const { type } = this.state;
  //   if (!err) {
  //     const { dispatch ,login} = this.props;
  //     const {uuid} = login;
  //     dispatch({
  //       type: 'login/login',
  //       payload: {
  //         ...values,
  //         uuid
  //       },
  //     });
  //   }
  // };

  //点击图片切换验证码
  handleChangeImg = ()=>{
    const {dispatch} =  this.props;
    dispatch({
      type: 'login/changeImgCaptcha'
    })
}


  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login,submitting,form } = this.props;
    const { type, autoLogin } = this.state;
    const { getFieldDecorator } = form;
    const { uuid } = login;
    return (
      <div className={styles.main}>
        <Tabs defaultActiveKey="1" className={styles.tabs}>
          <TabPane tab="账户密码登录" key="1">
          </TabPane>
        </Tabs>
          <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
               
              ],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" placeholder={formatMessage({ id: 'app.login.userName' })} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                size="large"
                type="password"
                placeholder={formatMessage({ id: 'app.login.password' })}
              />
            )}
          </FormItem>
          <FormItem>
          <Row>
              <Col span={13}>
              {getFieldDecorator('captcha', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.captpic.required' }),
                },
              ],
            })(
              <Input size="large"  
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder={formatMessage({ id: 'app.login.get-verification-code' })} />
            )}
              </Col>
              <Col span={10} offset={1} >
                <img onClick={this.handleChangeImg} style={{width:'100%',height:'100%',backgroundSize:'100% 100%'}} src={`http://192.168.50.131:8089/cneiu-fk/captcha.jpg?uuid=${uuid}`}  alt=''/>
              </Col>
            </Row>
          </FormItem>   
          <FormItem>
          <div>
            <Link style={{ float: 'right' }} to="/user/forgotpassword">
              <FormattedMessage id="app.login.forgot-password" />
            </Link>
            <div style={{clear:'both'}}></div>
          </div>
          <Button
              style={{width:'100%'}}
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FormattedMessage id="app.login.login" />
            </Button>
       
          <div className={styles.other}>
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="app.login.activation" />
            </Link>
          </div>

            
            {/* <Link className={styles.login} to="/User/Login">
              <FormattedMessage id="app.register.sign-in" />
            </Link> */}
          </FormItem>
        </Form>
        
      </div>
    );
  }
}

export default LoginPage;
