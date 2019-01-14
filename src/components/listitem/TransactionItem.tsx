import * as React from 'react';
import BaseItem from './baseitem';
import IBaseItem from './ibaseitem';
import {
  FactoryInjection,
  IBusinessService,
  PUBLIC_TYPES,
  Transaction
} from 'business_core_app_react';
import {Thumbnail, Col, Grid, Text} from "native-base";

interface Props extends IBaseItem<Transaction> {

}

interface State {
}

export default class TransactionItem extends BaseItem<Transaction, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props: Props) {
    super(props);
  }
  
  componentDidMount = (): void => {
  
  };
  
  render() {
    const imageLink: string = this.businessService.getLink(this.props.item.imageUrl);
    const action: string = this.businessService.getTransactionAction(this.props.item);
    return (
      // @ts-ignore
      <BaseItem {...this.props} >
        <Grid style={{height: 100}}>
          <Col>
            <Text style={{fontSize: 20, marginBottom: 10, width: '100%'}}>
              {`${this.props.item.firstName} ${this.props.item.firstName}`}
            </Text>
            <Text style={{fontSize: 14, width: '100%'}}>
              {`${action} on ${this.businessService.toDateString(this.props.item.time)}  at  ${this.businessService.toTimeString(this.props.item.time)}`}
            </Text>
            <Text style={{fontSize: 16, width: '100%'}}>
              {`Address: ${this.props.item.state}, ${this.props.item.country}`}
            </Text>
          </Col>
          
        
          <Col style={{width: 70}}>
            <Thumbnail circular large source={{uri: imageLink}}/>
          </Col>
          <Col style={{width: 30}}>
          </Col>
        </Grid>
      </BaseItem>
    );
  }
}
