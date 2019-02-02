import React, { Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Button, Row, Col, Icon, Card } from 'antd';
import Result from '@/components/Result';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

export default class SuccessPage extends React.Component{
  
  render(){
    const extra = (
      <Fragment>
        <div
          style={{
            fontSize: 16,
            color: 'rgba(0, 0, 0, 0.85)',
            fontWeight: '500',
            marginBottom: 20,
          }}
        >
        </div>
       
        
      </Fragment>
    );
    
    const actions = (
        <Button>
          <FormattedMessage id="app.result.success.btn-goSend" defaultMessage="View project" />
        </Button>
    
    );
    return(
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Result
            type="success"
            title={formatMessage({ id: 'app.result.success.title' })}
            description={formatMessage({ id: 'app.result.success.description' })}
            actions={actions}
            style={{ marginTop: 48, marginBottom: 16 }}
          />
        </Card>
    </PageHeaderWrapper>
    )
  }
}
  
