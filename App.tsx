/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react'
import Startup from './app_start/startup';
import {app} from './src/screens/screens';
import {Position, IBusinessService, FactoryInjection, PUBLIC_TYPES} from 'business_core_app_react';
import {StyleProvider, Root} from 'native-base';
import custom from './native-base-theme/variables/custom';
import getBaseTheme from './native-base-theme/components';
import myTheme from './theme';
import {GeolocationReturnType} from "react-native";

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
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  componentWillMount() {
    this.setupLocationTracking();
  }
  
  private setupLocationTracking(): void {
    
    navigator.geolocation.getCurrentPosition(
      async (location: GeolocationReturnType) => {
        const position: Position = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: location.coords.altitude || 0,
          distance: location.coords.accuracy
        };
        
        await this.businessService.saveCurrentPosition(position);
      },
      (error) => this.setState({error: error.message}),
      {enableHighAccuracy: false, timeout: 200000, maximumAge: 1000},
    );
    const config: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 20000,
    };

    navigator.geolocation.watchPosition(async (location: any) => {
      console.log(location);
      const position: Position = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude || 0,
        distance: location.coords.accuracy
      };
      console.log(`tracking ${JSON.stringify(position)}`);
      await this.businessService.saveCurrentPosition(position);
    }, undefined, config);
    
  }
  
  render() {
    return (
      <Root>
        <StyleProvider style={theme}>
          <RootStack/>
        </StyleProvider>
      </Root>);
  }
}