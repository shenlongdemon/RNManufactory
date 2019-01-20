import BasesSreen from "../../../basescreen";
import * as React from "react";
import {Grid, Row, Thumbnail} from "native-base";
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
import {TouchableOpacity} from "react-native";
import {Feature, Polygon} from "@turf/helpers";
import * as turf from '@turf/turf'
import GoodsItem from "../../../../components/listitem/goodsitem";

interface Props {
  onItemClick: (item: Item) => Promise<void>;
}

interface State {
  items: Item[];
  item: Item | null;
  isFirstLoad: boolean;
}

export default class BLEAroundTab extends React.Component<Props, State> {
  
  static navigationOptions = ({}) => {
    return {
      title: 'Products'
    };
  };
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  private mapView: MapBox.MapView | null = null;
  private bleManager!: BleManager;
  private timeout!: any;
  
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      item: null,
      isFirstLoad: false
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.componentDidBlur = this.componentDidBlur.bind(this);
    
  }
  
  
  componentWillMount = async (): Promise<void> => {
    this.bleManager = new BleManager();
    this.startScan();
  };
  
  componentDidMount = async (): Promise<void> => {
  
  };
  
  componentWillUnmount = async (): Promise<void> => {
    this.bleManager.stopDeviceScan();
    this.stopScan();
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
      const polygon: Feature<Polygon | null> = item.location.polygon;
      const center = turf.center(polygon);
      const image: string = this.businessService.getLink(item.imageUrl);
      return (
        <MapBox.PointAnnotation
          key={item.id}
          id={item.id}
          title={item.name}
          selected={false}
          coordinate={center.geometry!.coordinates}>
          <TouchableOpacity onPress={() => {
            this.setState({item: item})
          }}>
            <Thumbnail large source={{uri: image}}/>
          </TouchableOpacity>
        </MapBox.PointAnnotation>
      );
    });
    return data;
  };
  
  private stopScan = async (): Promise<void> => {
    clearInterval(this.timeout);
    this.bleManager.stopDeviceScan();
    LOGGER.log('Stop scan');
  };
  
  private startScan = async (): Promise<void> => {
    
    const currentPosition = await this.businessService.getCurrentPosition();
    await this.setState({items: []});
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
      if (bluetooths.length > 0) {
        await this.loadItemsByBluetooths(bluetooths);
      }
    }, 2000);
  };
  
  private loadItemsByBluetooths = async (bluetooths: Bluetooth[]): Promise<void> => {
    const dto: TrackingBluetoothsDto = await this.businessService.getTrackingBluetooths(bluetooths);
    if (dto.isSuccess) {
      await this.setState({items: dto.items});
      if (!this.state.isFirstLoad && dto.items.length > 0) {
        this.setState({isFirstLoad: true});
        setTimeout(() => {
          const polygons = dto.items.map((item: Item) => {
            return item.location.polygon as Feature<Polygon | null>
          });
          const collection = turf.union(...polygons);
          const envelope = turf.envelope(collection);
          
          this.mapView.fitBounds(envelope.geometry!.coordinates[0][2], envelope.geometry!.coordinates[0][0], 50, 3000);
        }, 3000);
        
      }
    }
  };
  
  render() {
    return (
      <BasesSreen {...{
        ...this.props,
        componentDidFocus: this.componentDidFocus,
        componentDidBlur: this.componentDidBlur
      }}>
        <Grid>
          <Row>
            <MapBox.MapView
              ref={(m: MapBox.MapView) => {
                this.mapView = m;
              }}
              showUserLocation={true}
              style={{flex: 1}}
              styleURL={MapBox.StyleURL.Dark}>
              {this.renderItems()}
            </MapBox.MapView>
          </Row>
          {
            this.state.item &&
            <Row style={{height: 100}}>
              <GoodsItem item={this.state.item} key={this.state.item.id} index={0} onClickHandle={async () => {
                await this.props.onItemClick(this.state.item!)
              }}/>
            </Row>
          }
        </Grid>
      </BasesSreen>
    );
  }
}
