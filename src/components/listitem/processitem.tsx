import * as React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Col, Grid, Row} from 'react-native-easy-grid';
import BaseItem from './baseitem';
import IBaseItem from './ibaseitem';
import {FactoryInjection, IBusinessService, Process, ProcessStatus, PUBLIC_TYPES} from 'business_core_app_react';
import * as Styles from '../../stylesheet';
import {Icon} from "native-base";

interface Props extends IBaseItem<Process> {

}

interface State {
}

export default class ProcessItem extends BaseItem<Process, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  constructor(props: Props) {
    super(props);
  }
  
  componentDidMount = (): void => {
  
  }
  
  render() {
    const statusIcon: string = this.props.item.status === ProcessStatus.IN_PROGRESS ? 'spinner' : (
      this.props.item.status === ProcessStatus.DONE ? 'check-circle' : ''
    );
    return (
      // @ts-ignore
      <BaseItem {...this.props} >
        <Grid style={{height: 50}}>
          <Col size={2} style={{justifyContent:'center'}}>
            <TouchableOpacity
              style={{
                borderWidth:1,
                borderColor:'rgba(0,0,0,0.2)',
                alignItems:'center',
                justifyContent:'center',
                width:50,
                height:50,
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius:50,
              }}
            >
              <Icon name={'settings'} style={{fontSize:40, color: Styles.color.Icon}} />
            </TouchableOpacity>
          </Col>
          
          <Col size={7} style={{justifyContent:'center'}}>
            <Text style={[Styles.styleSheet.label, {marginLeft: 10, fontSize: 20}]}>{this.props.item.name}</Text>
          </Col>
          
          <Col size={2} style={{justifyContent:'flex-start', flexDirection:'row'}}>
            <Icon name={statusIcon} type={'FontAwesome'} style={{fontSize:25, color: Styles.color.Progress}} />
          </Col>
          
          <Col size={4} >
           <Grid>
             <Row style={{justifyContent: 'flex-start', flexDirection:'row'}}>
               <Text style={{color: Styles.color.Text, fontSize: 18}}>
                 {this.businessService.toDateString(this.props.item.updateAt)}
               </Text>
             </Row>
             <Row style={{justifyContent: 'flex-start', flexDirection:'row'}}>
               <Text style={{color: Styles.color.Text, fontSize: 18}}>
                 {this.businessService.toTimeString(this.props.item.updateAt)}
               </Text>
             </Row>
           </Grid>
          </Col>
        
        </Grid>
      </BaseItem>
    );
  }
}
