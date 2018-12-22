import * as React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Col, Grid, Row} from 'react-native-easy-grid';
import BaseItem from './baseitem';
import IBaseItem from './ibaseitem';
import {FactoryInjection, IBusinessService, UserInfo, ProcessStatus, PUBLIC_TYPES} from 'business_core_app_react';
import * as Styles from '../../stylesheet';
import {Icon, Thumbnail} from "native-base";

interface Props extends IBaseItem<UserInfo> {

}

interface State {
}

export default class WorkerItem extends BaseItem<UserInfo, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  constructor(props: Props) {
    super(props);
  }
  
  componentDidMount = (): void => {
  
  }
  
  render() {
    const imageLink: string = this.businessService.getLink(this.props.item.imageUrl);
    return (
      // @ts-ignore
      <BaseItem {...this.props} >
        <Grid style={{height: 100}}>
          <Col style={{width: 100}}>
            <Thumbnail style={{width: 100, height: 100}} source={{uri:imageLink}}/>
          </Col>
          <Col>
          
          </Col>
        </Grid>
      </BaseItem>
    );
  }
}
