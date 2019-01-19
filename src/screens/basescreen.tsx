import * as React from 'react';
import {ImageBackground, EmitterSubscription, Modal} from 'react-native';
import * as IMAGE from '../assets';
// import {Grid, Row} from 'react-native-easy-grid';
// import * as Styles from '../stylesheet';

import {PARAMS} from "../common";
import {Container, Grid, Row} from "native-base";
import {
  // BallIndicator,
  // BarIndicator,
  // DotIndicator,
  // MaterialIndicator,
  // PacmanIndicator,
  // PulseIndicator,
  // SkypeIndicator,
  UIActivityIndicator,
  //WaveIndicator,
} from 'react-native-indicators';
import * as Styles from '../stylesheet';

interface INavitation {
  setParams(data: any);
  
  navigate(route: string, data?: any);
  
  goBack();
  
  push(route: string);
}

interface Props {
  componentDidFocus?: (() => Promise<void>) | null;
  componentDidBlur?: (() => Promise<void>) | null;
  navigation?: INavitation | null;
  isLoading?: boolean;
}

export default class Basescreen<T extends Props, S> extends React.Component<Props, S> {
  private didBlurSubscription?: EmitterSubscription | null;
  private didForcusSubscription?: EmitterSubscription | null;
  
  constructor(props: T) {
    super(props);
  }
  
  setSellNavigateParam(data: any): void {
    if (this.props.navigation) {
      this.props.navigation.setParams(data);
    }
    
  }
  
  navigateFunc = (routeName: string, data: any | null = null, func: ((data: any, type: number, extraData: any | null) => Promise<void>) | null = null): void => {
    if (this.props.navigation) {
      const param: any = {};
      param[PARAMS.CALLBACK_FUNCTION] = func;
      param[PARAMS.ITEM] = data;
      this.props.navigation.navigate(routeName, param);
    }
  };
  
  navigate = (routeName: string, data: any | null = null): void => {
    if (this.props.navigation) {
      this.props.navigation.navigate(routeName, data);
    }
  };
  
  push = (routeName: string): void => {
    if (this.props.navigation) {
      this.props.navigation.push(routeName);
    }
  };
  
  goBack = (): void => {
    if (this.props.navigation) {
      this.props.navigation.goBack();
    }
  };
  componentDidMount = (): void => {
    this.extendEvents();
  };
  
  componentWillUnmount = (): void => {
    if (this.didBlurSubscription) {
      this.didBlurSubscription.remove();
    }
    if (this.didForcusSubscription) {
      this.didForcusSubscription.remove();
    }
    
  };
  
  getParam = <Q extends {}>(key: string, defaultValue: Q | null): Q | null => {
    
    let data: Q | null = null;
    if (this.props.navigation) {
      // @ts-ignore
      data = this.props.navigation.getParam(key, defaultValue);
    }
    
    return data;
  };
  
  sleep = (second: number): void => {
    const current = new Date().getTime();
    while (true) {
      if (new Date().getTime() - current > second * 1000) {
        break;
      }
    }
  };
  
  private extendEvents = (): void => {
    // @ts-ignore
    if (this.props.navigation) {
      // @ts-ignore
      this.didForcusSubscription = this.props.navigation.addListener(
        'didFocus',
        (_payload: any) => {
          if (this.props.componentDidFocus) {
            this.props.componentDidFocus();
          }
        }
      );
      
      // @ts-ignore
      this.didBlurSubscription = this.props.navigation.addListener(
        'didBlur',
        (_payload: any) => {
          if (this.props.componentDidBlur) {
            this.props.componentDidBlur();
          }
        }
      );
    }
  };
  
  render() {
    return (
      <Container>
        <ImageBackground
          source={IMAGE.background}
          style={{
            flex: 1,
            justifyContent: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          {this.props.children}
          <Modal visible={this.props.isLoading || false} transparent={true}>
            <Grid style={{flex: 1, backgroundColor: Styles.color.Background}}>
              <Row></Row>
              <Row style={{justifyContent: 'center'}}>
                <UIActivityIndicator color={Styles.color.Icon} size={70} count={12}/>
              </Row>
              <Row></Row>
            </Grid>
          </Modal>
        </ImageBackground>
      
      </Container>
    );
  }
}
