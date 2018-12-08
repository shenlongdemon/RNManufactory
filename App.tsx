/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react'
// import {GeolocationReturnType} from 'react-native';
import Startup from './app_start/startup';
import {app} from './src/screens/screens';
// import material from './native-base-theme/variables/material';
// import {PUBLIC_TYPES, IBusinessService, FactoryInjection} from 'business_core_app_react';
import {StyleProvider } from 'native-base';
import custom from './native-base-theme/variables/custom';
import getBaseTheme from './native-base-theme/components';
import myTheme from './theme';

const baseTheme = getBaseTheme(custom);
const them = myTheme();
const theme = {
  ...baseTheme,
  ...them,
};

Startup.start();

const RootStack = app;
console.disableYellowBox = true;

export default class App extends React.Component {
  // private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  componentWillMount() {
    // this.setupLocationTracking();
  }
  
  // private setupLocationTracking(): void {
  //
  //   navigator.geolocation.getCurrentPosition(
  //     async (location: GeolocationReturnType) => {
  //       const position: Position = {
  //         coord: {
  //           latitude: location.coords.latitude,
  //           longitude: location.coords.longitude,
  //           altitude: location.coords.altitude || 0
  //         },
  //       };
  //
  //       await this.businessService.saveCurrentPosition(position);
  //     },
  //     (error) => this.setState({ error: error.message }),
  //     { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
  //   );
  //   const config: PositionOptions = {
  //     enableHighAccuracy: true,
  //     maximumAge: 1000,
  //     timeout: 20000,
  //   };
  //
  //   navigator.geolocation.watchPosition(async (location: any) => {
  //     console.log(location);
  //     const position: Position = {
  //       coord: {
  //         latitude: location.coords.latitude,
  //         longitude: location.coords.longitude,
  //         altitude: location.coords.altitude || 0
  //       },
  //     };
  //     console.log(`tracking ${JSON.stringify(position)}`);
  //     await this.businessService.saveCurrentPosition(position);
  //   },undefined, config);
  //
  // }
  
  render() {
    return(
    <StyleProvider style={theme}>
      <RootStack/>
    </StyleProvider>);
  }
}