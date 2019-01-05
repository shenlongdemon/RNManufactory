import * as React from 'react';
import {Image, Text} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';
import * as IMAGE from '../../assets';
import BaseItem from './baseitem';
import IBaseItem from './ibaseitem';
import {FactoryInjection, IBusinessService, Item, PUBLIC_TYPES} from 'business_core_app_react';
import * as Styles from '../../stylesheet';
import {Thumbnail} from "native-base";

interface Props extends IBaseItem<Item> {

}

interface State {
}

export default class GoodsItem extends BaseItem<Item, State> {
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
      <BaseItem {...this.props} >
        <Grid style={{height: 100}}>
          <Col size={1} style={{justifyContent:'center'}}>
            <Image source={IMAGE.materialIcon} style={{width: 40, height: 40}}/>
          </Col>
          
          <Col size={5} style={{justifyContent:'center'}}>
            <Text style={[Styles.styleSheet.label, {width:'100%', textAlign:'center'}]}>{this.props.item.name}</Text>
          </Col>
          
          <Col size={3} style={{justifyContent:'center'}}>
            <Text style={[Styles.styleSheet.label, {marginLeft: 10}]}>{`${this.props.item.price}`}</Text>
          </Col>
          <Col style={{justifyContent:'center', width:80}}>
            <Thumbnail source={{uri: this.businessService.getLink(this.props.item.imageUrl)}} style={{width: 80, height: 80}}/>
          </Col>
          
          <Col size={4} style={{justifyContent:'center'}}>
            
            <Text style={[Styles.styleSheet.label, {alignSelf: 'flex-end'}]}>
              Modified at{'\n'}{this.formatDate(this.props.item.time)}
            </Text>
          
          </Col>
        
        </Grid>
      </BaseItem>
    );
  }
}
