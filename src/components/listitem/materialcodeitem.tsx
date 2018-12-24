import * as React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Col, Grid, Row} from 'react-native-easy-grid';
import BaseItem from './baseitem';
import IBaseItem from './ibaseitem';
import {FactoryInjection, IBusinessService, Material, PUBLIC_TYPES} from 'business_core_app_react';
import * as Styles from '../../stylesheet';
import {Icon} from "native-base";

interface Props extends IBaseItem<Material> {

}

interface State {
}

export default class MaterialCodeItem extends BaseItem<Material, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  constructor(props: Props) {
    super(props);
  }
  
  componentDidMount = (): void => {
  
  }
  
  render() {
    
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
                borderRadius:50,
              }}
            >
              <Icon name={'qrcode'} type={'FontAwesome'} style={{fontSize:40, color: Styles.color.Red}} />
            </TouchableOpacity>
          </Col>
          
          <Col size={9} style={{justifyContent:'center'}}>
            <Text style={[Styles.styleSheet.label, {marginLeft: 10, fontSize: 20}]}>
              GEN QR Code
            </Text>
          </Col>
          
          <Col size={4} >
           <Grid>
             <Row style={{justifyContent: 'flex-start', flexDirection:'row'}}>
               <Text style={{color: Styles.color.Text, fontSize: 18}}>
                 {this.businessService.toDateString(this.props.item.updatedAt)}
               </Text>
             </Row>
             <Row style={{justifyContent: 'flex-start', flexDirection:'row'}}>
               <Text style={{color: Styles.color.Text, fontSize: 18}}>
                 {this.businessService.toTimeString(this.props.item.updatedAt)}
               </Text>
             </Row>
           </Grid>
          </Col>
        
        </Grid>
      </BaseItem>
    );
  }
}
