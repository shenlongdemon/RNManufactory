import * as React from 'react';
import {Text} from 'react-native';
import {Col, Grid, Icon, Row} from 'native-base';
import BaseItem from './baseitem';
import IBaseItem from './ibaseitem';
import { Bluetooth} from 'business_core_app_react';
import * as Styles from '../../stylesheet';

interface Props extends IBaseItem<Bluetooth> {

}

interface State {
}

export default class BluetoothItem extends BaseItem<Bluetooth, State> {
  
  constructor(props: Props) {
    super(props);
  }
  
  componentDidMount = (): void => {
  
  }
  
  render() {
    
    return (
      <BaseItem {...this.props} >
        <Grid style={{height: 65}}>
          <Col style={{width: 60, justifyContent: 'center'}}>
            <Icon name={'bluetooth'} style={{color: Styles.color.Icon}}/>
          </Col>
          <Col>
            <Grid>
              <Row style={{width: 60, justifyContent: 'center'}}>
                <Text style={Styles.styleSheet.label}>{this.props.item.name}</Text>
              </Row>
              <Row style={{justifyContent: 'flex-end'}}>
                <Text style={[Styles.styleSheet.identifier]}>{this.props.item.mac}</Text>
              </Row>
            </Grid>
          </Col>
        </Grid>
      </BaseItem>
    );
  }
}
