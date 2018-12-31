import * as React from 'react';
import {Col, Grid} from 'react-native-easy-grid';
import BaseItem from './baseitem';
import IBaseItem from './ibaseitem';
import {FactoryInjection, IBusinessService, Activity, PUBLIC_TYPES} from 'business_core_app_react';
import * as Styles from '../../stylesheet';
import {Thumbnail, Text} from "native-base";

interface Props extends IBaseItem<Activity> {

}

interface State {
}

export default class ActivityItem extends BaseItem<Activity, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props: Props) {
    super(props);
  }
  
  componentDidMount = (): void => {
  
  }
  
  private formatDate(time: number): string {
    return this.businessService.toDateString(time);
  }
  
  render() {
    
    return (
      // @ts-ignore
      <BaseItem {...this.props} >
        <Grid style={{height: 100}}>
          <Col size={3} >
            <Thumbnail large circular source={{uri: this.businessService.getLink(this.props.item.userInfo.imageUrl)}} />
          </Col>
          
          <Col size={5} style={{justifyContent:'center'}}>
            <Text style={ {color: Styles.color.Text, width:'100%', fontWeight:'bold'}}>{this.props.item.title}</Text>
          </Col>
          
          <Col size={3} style={{justifyContent:'center'}}>
            
            <Text style={ {color: Styles.color.Text, width:'100%',alignSelf: 'flex-end'}}>
              Modified at{'\n'}{this.formatDate(this.props.item.time)}
            </Text>
          
          </Col>
        
        </Grid>
      </BaseItem>
    );
  }
}
