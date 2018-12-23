import BasesSreen from "./basescreen";
import {Grid, Row} from "native-base";
import * as React from "react";

interface Props {
}

interface State {
  isLoading: boolean;
}

export default class QRCodeScanner extends BasesSreen<Props, State> {
  static navigationOptions = ({}) => {
    return {
      title: 'Scanning QR Code'
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    
  }
  
  componentWillMount = async (): Promise<void> => {
  }
  
  componentDidMount = async (): Promise<void> => {

  }
  
  componentWillUnmount = async (): Promise<void> => {
  }
  
  private componentDidFocus = async (): Promise<void> => {
  
  }
  
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Grid>
          <Row>
          
          </Row>
        </Grid>
      </BasesSreen>
    );
  }
}