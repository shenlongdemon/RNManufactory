import * as React from 'react';
import {Grid, Row} from 'react-native-easy-grid';
import BaseScreen from './basescreen';
import {ROUTE} from "./routes";
import {Icon, View} from "native-base";
import * as Styles from '../stylesheet';

interface Props {

}

interface State {

}

export default class SwitchFeature extends BaseScreen<Props, State> {
  constructor(props: Props) {
    super(props);
    this.switchToUser = this.switchToUser.bind(this);
    this.switchToManufactory = this.switchToManufactory.bind(this);
  }
  
  private switchToUser = (): void => {
    this.navigate(ROUTE.APP.USER.DEFAULT);
  }
  
  private switchToManufactory = (): void => {
    this.navigate(ROUTE.APP.MANUFACTORY.DEFAULT);
  }
  
  render() {
    return (
      <BaseScreen {...{...this.props}}>
        <Grid>
          <Row style={{justifyContent: 'center', flexDirection: 'column'}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', height: 200}}>
              <Icon onPress={this.switchToUser}
                    style={{fontSize: 90, color: Styles.color.Icon}}
                    type={'FontAwesome'} name={'user'}/>
              <Icon onPress={this.switchToManufactory} style={{fontSize: 90, color: Styles.color.Icon}}
                    type={'FontAwesome'} name={'industry'}/>
            </View>
          </Row>
        
        </Grid>
      </BaseScreen>
    );
  }
}