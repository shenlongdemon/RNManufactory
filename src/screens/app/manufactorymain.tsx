import * as React from 'react';
import {Animated, Easing, Image, ImageBackground, ImageStyle, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Col, Grid, Row} from 'native-base';
import BaseScreen from '../basescreen';
import * as Styles from '../../stylesheet';
import {ROUTE} from '../routes';
import * as IMAGES from '../../assets';
import {PARAMS} from '../../common';
import {
  Bluetooth,
  Material, ObjectType, Item
} from 'business_core_app_react';

interface Props {
}

interface State {
}

export default class ManufactoryMain extends BaseScreen<Props, State> {
  private animatedValue: Animated.Value;
  
  constructor(props: Props) {
    super(props);
    this.animatedValue = new Animated.Value(0)
    
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.gotoGoods = this.gotoGoods.bind(this);
    this.gotoProcesses = this.gotoProcesses.bind(this);
    this.scanQRCode = this.scanQRCode.bind(this);
    this.gotoBluetooth = this.gotoBluetooth.bind(this);
    this.gotoSearch = this.gotoSearch.bind(this);
    this.receive = this.receive.bind(this);
  }
  
  componentDidMount = async (): Promise<void> => {
  
  
  }
  
  
  receive = async (data: any, type: ObjectType, _extraData: any | null): Promise<void> => {
    setTimeout(() => {
      if (type === ObjectType.bluetooth) {
        const bluetooth: Bluetooth = data as Bluetooth;
        alert(bluetooth.id);
      } else if (type === ObjectType.material) {
        const item: Material = data as Material;
        const d: any = {};
        d[PARAMS.ITEM] = item;
        
        this.navigate(ROUTE.APP.MANUFACTORY.MATERIALS.ITEM.DEFAULT, d)
      }
      else if (type === ObjectType.item) {
        const item: Item = data as Item;
        const d: any = {};
        d[PARAMS.ITEM] = item;
        
        this.navigate(ROUTE.APP.MANUFACTORY.GOODSES.ITEM.DEFAULT, d)
      }
    }, 2000);
    
  };
  
  private gotoBluetooth = async (): Promise<void> => {
    this.animate(0.87, () => {
      this.navigateFunc(ROUTE.APP.MANUFACTORY.BLUETOOTH, ObjectType.unknown, this.receive);
    });
  };
  private gotoGoods = async (): Promise<void> => {
    this.animate(0.62, () => {
      this.navigate(ROUTE.APP.MANUFACTORY.GOODSES.DEFAULT);
    });
    
  };
  
  private gotoSearch = async (): Promise<void> => {
    this.animate(0.5, () => {
      this.navigate(ROUTE.APP.MANUFACTORY.PRODUCTS.DEFAULT);
    });
    
  };
  private gotoProcesses = async (): Promise<void> => {
    this.animate(0, () => {
      this.navigate(ROUTE.APP.MANUFACTORY.MATERIALS.DEFAULT);
    });
  };
  private scanQRCode = async (): Promise<void> => {
    this.animate(0.12, () => {
      this.navigateFunc(ROUTE.APP.MANUFACTORY.SCANQRCODE, ObjectType.unknown, this.receive);
    });
    
  };
  private gotoProfile = async (): Promise<void> => {
    this.animate(0.37, () => {
      this.navigate(ROUTE.APP.MANUFACTORY.PROFILE.DEFAULT);
    });
    
  };
  componentDidFocus = async (): Promise<void> => {
  
  };
  
  animate = (degree: number, callback: () => void): void => {
    Animated.timing(
      this.animatedValue,
      {
        toValue: degree,
        duration: 700,
        easing: Easing.linear,
        useNativeDriver: true
      }
    ).start(callback);
  }
  
  render() {
    const spin = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    return (
      <BaseScreen {...{...this.props, componentDidFocus: this.componentDidFocus}}>
        <Grid style={{flex: 1}}>
          <Row size={1.7}>
            <Col size={1} style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity style={[styles.button, {justifyContent: 'flex-end'}]} onPress={this.gotoBluetooth}>
                <Image style={styles.image as ImageStyle} resizeMode={'contain'} source={IMAGES.iconBluetooth}/>
                <Text style={[Styles.styleSheet.caption, {alignSelf: 'center'}]}>BLUETOOTH</Text>
              </TouchableOpacity>
            </Col>
            <Col size={2} style={{justifyContent: 'center'}}>
              {/* --------------- PROCESSES --------------- */}
              <TouchableOpacity style={styles.button} onPress={this.gotoProcesses}>
                <Image style={styles.image as ImageStyle} resizeMode={'contain'} source={IMAGES.icoProjects}/>
                <Text style={[Styles.styleSheet.caption, {alignSelf: 'center'}]}>PROCESSES</Text>
              </TouchableOpacity>
            </Col>
            <Col size={1} style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity style={[styles.button, {justifyContent: 'flex-end'}]} onPress={this.scanQRCode}>
                <Image style={styles.image as ImageStyle} resizeMode={'contain'} source={IMAGES.icoQRcode}/>
                <Text style={[Styles.styleSheet.caption, {alignSelf: 'center'}]}>QRCODE</Text>
              </TouchableOpacity>
            </Col>
          </Row>
          
          <Row style={{height: 200}}>
            <Grid>
              <Col size={1}/>
              <Col size={2} style={{justifyContent: 'center'}}>
                <ImageBackground source={IMAGES.icoCircle} style={{height: 200, width: 200, alignSelf: 'center'}}>
                  <Animated.Image
                    resizeMode={'contain'}
                    source={IMAGES.icoCircleRoatate}
                    style={{transform: [{rotate: spin}], height: 200, width: 200, alignSelf: 'center'}}
                  />
                </ImageBackground>
              </Col>
              <Col size={1}/>
            </Grid>
          </Row>
          
          <Row size={2}>
            <Col size={1} style={{justifyContent: 'flex-start'}}>
              <TouchableOpacity style={[styles.button, {justifyContent: 'flex-start'}]} onPress={this.gotoGoods}>
                <Image style={styles.image as ImageStyle} resizeMode={'contain'} source={IMAGES.icoGoods}/>
                <Text style={[Styles.styleSheet.caption, {alignSelf: 'center'}]}>GOODS</Text>
              </TouchableOpacity>
            </Col>
            <Col size={2} style={{justifyContent: 'center'}}>
              {/* --------------- PROCESSES --------------- */}
              <TouchableOpacity style={styles.button} onPress={this.gotoSearch}>
                <Image style={styles.image as ImageStyle} resizeMode={'contain'} source={IMAGES.icoSearch}/>
                <Text style={[Styles.styleSheet.caption, {alignSelf: 'center'}]}>SEARCH</Text>
              </TouchableOpacity>
            </Col>
            
            <Col size={1} style={{justifyContent: 'flex-start'}}>
              <TouchableOpacity style={[styles.button, {justifyContent: 'flex-start'}]} onPress={this.gotoProfile}>
                <Image style={styles.image as ImageStyle} resizeMode={'contain'} source={IMAGES.icoProfile}/>
                <Text style={[Styles.styleSheet.caption, {alignSelf: 'center'}]}>PROFILE</Text>
              </TouchableOpacity>
            </Col>
          </Row>
          
          <Row style={{height: 100}}/>
        </Grid>
      </BaseScreen>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: 90,
    height: 90,
    alignSelf: 'center'
  },
  image: {
    width: 70,
    height: 70,
    alignSelf: 'center'
  }
});
