import * as React from 'react';
import {Text} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';
import BaseItem from './baseitem';
import IBaseItem from './ibaseitem';
import {FactoryInjection, IBusinessService, UserInfo, PUBLIC_TYPES} from 'business_core_app_react';
import * as Styles from '../../stylesheet';
import {Thumbnail} from "native-base";

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
            <Thumbnail circular style={{width: 100, height: 100}} source={{uri: imageLink}}/>
          </Col>
          
          <Col style={{justifyContent: 'center'}}>
            <Text
              style={{color: Styles.color.Text, width: '100%', textAlign: 'center'}}>
              {`${this.props.item.firstName} ${this.props.item.firstName}`}
            </Text>
          </Col>
          
          <Col size={2} style={{justifyContent: 'center'}}>
            
            <Text style={[Styles.styleSheet.label, {alignSelf: 'flex-end'}]}>
              Assigned at{'\n'}{this.businessService.toDateString(this.props.item.time)}
            </Text>
          
          </Col>
        
        </Grid>
      </BaseItem>
    );
  }
}
