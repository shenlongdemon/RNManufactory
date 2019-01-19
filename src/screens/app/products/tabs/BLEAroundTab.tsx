import BasesSreen from "../../../basescreen";
import * as React from "react";
import {Grid, Row} from "native-base";
import MapBox from '@mapbox/react-native-mapbox-gl';
import {
  Bluetooth,
  FactoryInjection,
  IBusinessService,
  TrackingBluetoothsDto,
  LOGGER,
  PUBLIC_TYPES,
  Item
} from "business_core_app_react";
import Utils from "../../../../common/utils";
import {BleError, BleManager, Device} from 'react-native-ble-plx';
import {Image, TouchableOpacity} from "react-native";
import * as Styles from "../../../../stylesheet";
import * as IMAGES from "../../../../assets";

interface Props {
}

interface State {
  isLoading: boolean
  items: Item[]
}

export default class BLEAroundTab extends BasesSreen<Props, State> {
  static navigationOptions = ({}) => {
    return {
      title: 'Products'
    };
  };
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  // private mapView: MapBox.MapView | null = null;
  private bleManager!: BleManager;
  private timeout!: any;
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      items: []
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.componentDidBlur = this.componentDidBlur.bind(this);
    
  }
  
  componentDidUpdate = async (_prevProp: Props, _prevState: State): Promise<void> => {
  
  };
  
  componentWillMount = async (): Promise<void> => {
    this.bleManager = new BleManager();
  };
  
  componentDidMount = async (): Promise<void> => {
  
  };
  
  componentWillUnmount = async (): Promise<void> => {
    this.bleManager.stopDeviceScan();
  };
  
  private componentDidFocus = async (): Promise<void> => {
    await this.startScan();
  };
  private componentDidBlur = async (): Promise<void> => {
    await this.stopScan();
  };
  
  private renderItems = (): any => {
    if (this.state.items.length === 0) {
      return;
    }
    const data = this.state.items.map((item: Item): any => {
      return (
        <MapBox.ShapeSource key={item.id} id='routeSource' shape={item.location.polygon}>
          <MapBox.LineLayer id='routeFill'  belowLayerID='originInnerCircle' />
        </MapBox.ShapeSource>
      );
    });
    return data;
  };
  
  private stopScan = async (): Promise<void> => {
    clearInterval(this.timeout);
    this.setState({isLoading: false})
    this.bleManager.stopDeviceScan();
    LOGGER.log('Stop scan');
  };
  
  private startScan = async (): Promise<void> => {
    if (this.state.isLoading) {
      return;
    }
    const currentPosition = await this.businessService.getCurrentPosition();
    await this.setState({isLoading: true, items:[]});
    const devices: Device[] = [];
    this.bleManager.startDeviceScan(null, null, async (error: BleError, device: Device): Promise<void> => {
      LOGGER.log('Scanning ...');
      if (error) {
        LOGGER.log(error);
        return;
      }
      console.log(device);
      
      const id: string = device.id;
      const index = devices.findIndex((item: Device, _index: number): boolean => {
        const deviceId: string = item.id;
        return deviceId == id;
      });
      if (index < 0) {
        devices.push(device);
        console.log(device);
      }
      else {
        devices.splice(index, 1);
        devices.splice(0, 0, device);
      }
    });
    
    this.timeout = setInterval(async (): Promise<void> => {
      const bluetooths: Bluetooth[] = Utils.mappingBLEDevices(devices, currentPosition);
      await this.loadItemsByBluetooths(bluetooths);
    }, 2000);
  };
  
  private loadItemsByBluetooths = async(bluetooths: Bluetooth[]): Promise<void> => {
    const dto: TrackingBluetoothsDto = await this.businessService.getTrackingBluetooths(bluetooths);
    if (dto.isSuccess) {
      await this.setState({items: dto.items});
    }
  };
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus, componentDidBlur: this.componentDidBlur}}>
        <Grid>
          <Row style={{height: 300}}>
            <MapBox.MapView
              // ref={(m: MapBox.MapView) => {
              //   this.mapView = m;
              // }}
              showUserLocation={true}
              style={{flex: 1}}
              styleURL={MapBox.StyleURL.Dark}>
              {this.renderItems()}
            </MapBox.MapView>
          </Row>
        </Grid>
        <TouchableOpacity style={Styles.styleSheet.floatTouchable} onPress={async (): Promise<void> => {
          await this.startScan();
        }}>
          <Image style={{width: 70, height: 70, alignSelf: 'flex-end'}} resizeMode={'contain'}
                 source={IMAGES.grayAdd}/>
        </TouchableOpacity>
      </BasesSreen>
    );
  }
}