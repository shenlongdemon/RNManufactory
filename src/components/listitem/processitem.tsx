import * as React from 'react';
import {Image, Text} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';
import * as IMAGE from '../../assets';
import BaseItem from './baseitem';
import IBaseItem from './ibaseitem';
import {Process} from 'business_core_app_react';
import * as Styles from '../../stylesheet';

interface Props extends IBaseItem<Process> {

}

interface State {
}

export default class ProcessItem extends BaseItem<Process, State> {
  
  constructor(props: Props) {
    super(props);
  }
  
  componentDidMount = (): void => {
  
  }
  
  render() {
    
    return (
      // @ts-ignore
      <BaseItem {...this.props} >
        <Grid style={{height: 100}}>
          <Col size={1} style={{justifyContent:'center'}}>
            <Image source={IMAGE.materialIcon} style={{width: 40, height: 40}}/>
          </Col>
          
          <Col size={5} style={{justifyContent:'center'}}>
            <Text style={[Styles.styleSheet.label, {marginLeft: 10}]}>{this.props.item.name}</Text>
          </Col>
          
          <Col size={2} style={{justifyContent:'center'}}>
            {/*<Thumbnail source={{uri: this.businessService.getLinkImage(this.props.item.imageUrl)}} style={{width: 80, height: 80}}/>*/}
          </Col>
          
          <Col size={2} style={{justifyContent:'center'}}>
            
            <Text style={[Styles.styleSheet.label, {alignSelf: 'flex-end'}]}>
              {/*Modified at{'\n'}{this.formatDate(this.props.item.updatedAt)}*/}
            </Text>
          
          </Col>
        
        </Grid>
      </BaseItem>
    );
  }
}
