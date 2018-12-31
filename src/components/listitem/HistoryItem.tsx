import * as React from 'react';
import {Text} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';
import BaseItem from './baseitem';
import IBaseItem from './ibaseitem';
import {FactoryInjection, IBusinessService, Activity, PUBLIC_TYPES} from 'business_core_app_react';
import * as Styles from '../../stylesheet';
import {Thumbnail} from "native-base";

interface Props extends IBaseItem<Activity> {

}

interface State {
}

export default class HistoryItem extends BaseItem<Activity, State> {
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
          <Col style={{width:100}} >
            <Thumbnail style={{flex:1}} circular source={{uri: this.businessService.getLink(this.props.item.worker.imageUrl)}} />
          </Col>
          
          <Col>
            <Text style={[Styles.styleSheet.label, {marginLeft: 10}]}>{this.props.item.title}</Text>
          </Col>
          
          <Col size={2} style={{justifyContent:'center', width:100}}>
            
            <Text style={[Styles.styleSheet.label, {alignSelf: 'flex-end'}]}>
              Modified at{'\n'}{this.formatDate(this.props.item.time)}
            </Text>
          
          </Col>
        
        </Grid>
      </BaseItem>
    );
  }
}
