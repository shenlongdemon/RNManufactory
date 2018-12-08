import * as React from 'react';
import {Grid, Row, Col} from 'react-native-easy-grid';
import BaseScreen from './basescreen';
import {ROUTE} from "./routes";
import {Button, Text} from "native-base";

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
          <Row size={3}></Row>
          <Row size={2}>
            <Grid>
              <Col>
                <Button large onPress={this.switchToUser}>
                  <Text>USER</Text>
                </Button>
              </Col>
              
              <Col>
                <Button large onPress={this.switchToManufactory}>
                  <Text>MANUFACTORY</Text>
                </Button>
              </Col>
            </Grid>
          </Row>
          <Row size={3}></Row>
        </Grid>
      </BaseScreen>
    );
  }
}