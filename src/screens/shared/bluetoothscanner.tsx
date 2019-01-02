import * as React from 'react';
import {Platform, RefreshControl} from 'react-native';
import {
  Bluetooth, FactoryInjection, IBusinessService, LOGGER, PUBLIC_TYPES, ObjectByCode, ObjectType, CONSTANTS,
  ListObjectsByIdsDto
} from 'business_core_app_react';
import BasesSreen from "../basescreen";
import {BleError, BleManager, Device, Characteristic, ConnectionPriority} from 'react-native-ble-plx';
import {PARAMS} from "../../common";
import Utils from '../../common/utils';
import * as Styles from "../../stylesheet";
import {Button, Grid, Icon, List, ListItem, Row} from "native-base";
import BluetoothItem from '../../components/listitem/bluetoothitem';
import MaterialItem from "../../components/listitem/materialitem";

interface Props {
}

interface State {
  devices: ObjectByCode[];
  isLoading: boolean;
}

export default class BluetoothScannerScreen extends BasesSreen<Props, State> {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Scanning bluetooth around',
      headerRight: (
        <Button onPress={navigation.getParam(PARAMS.HANDLE_RIGHT_HEADER_BUTTON)}>
          <Icon name={'sync'} style={{color: Styles.color.Icon}}/>
        </Button>
      ),
    };
  };
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  private bleManager!: BleManager;
  private timeout!: any;
  
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      isLoading: false
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.clickListItem = this.clickListItem.bind(this);
    
  }
  
  componentWillMount = async (): Promise<void> => {
    this.bleManager = new BleManager();
  };
  
  componentDidMount = async (): Promise<void> => {
    const data: any = {};
    data[PARAMS.HANDLE_RIGHT_HEADER_BUTTON] = this.startScan;
    this.setSellNavigateParam(data);
  };
  
  componentWillUnmount = async (): Promise<void> => {
    this.bleManager.stopDeviceScan();
  };
  
  private clickListItem = async (item: ObjectByCode, _index: number): Promise<void> => {
    const type: ObjectType = this.getParam<any>(PARAMS.ITEM, ObjectType.unknown) as ObjectType;
    const callbackFunc: (data: any, type: ObjectType, extraData: any | null) => Promise<void> | null = this.getParam<any>(PARAMS.CALLBACK_FUNCTION, null);
    if (callbackFunc && (type === ObjectType.unknown || type === item.type)) {
      this.goBack();
      await callbackFunc(item.item, item.type, null);
      
    }
    
  };
  
  private startScan = async (): Promise<void> => {
    
    const currentPosition = await this.businessService.getCurrentPosition();
    await this.setState({isLoading: true, devices: []});
    const devices: Device[] = [];
    this.bleManager.startDeviceScan(null, null, async (error: BleError, device: Device): Promise<void> => {
      LOGGER.log('Scanning ...');
      if (error) {
        LOGGER.log(error);
        return;
      }
      const id: string = device.id;
      const index = devices.findIndex((item: Device, _index: number): boolean => {
        const deviceId: string = item.id;
        return deviceId == id;
      });
      if (index < 0 && device.name.startsWith('The')) {
        await this.stopScan();
        devices.push(device);
        console.log(device);
        
        let serviceId: string = CONSTANTS.STR_EMPTY;
        const serviceData: any | null = device.serviceData;
        if (serviceData) {
          const keys: string[] = Object.getOwnPropertyNames(serviceData);
          if (keys.length > 0) {
            serviceId = keys[0];
          }
        }
        console.log('serviceId' + serviceId);
  
        const connectedDevice: Device = await this.bleManager.requestConnectionPriorityForDevice(device.id, ConnectionPriority.LowPower);
        console.log(connectedDevice);
        
        const services: Device = await connectedDevice.discoverAllServicesAndCharacteristics();
        console.log(services);
        
        const all: any = await this.getServicesAndCharacteristics(connectedDevice, serviceId);
        console.log(all);
        
      }
    });
    
    this.timeout = setTimeout(async (): Promise<void> => {
      await this.stopScan();
      const bluetooths: Bluetooth[] = Utils.mappingBLEDevices(devices, currentPosition);
      const list: ObjectByCode[] = bluetooths.map((ble: Bluetooth): ObjectByCode => {
        return {item: ble, type: ObjectType.bluetooth};
      });
      
      await this.setState({devices: list, isLoading: false});
      await this.loadObjectsByIds(
        bluetooths.map((bluetooth: Bluetooth): string => {
          return bluetooth.id;
        })
      );
      
    }, 8000);
    
  };
  
  private loadObjectsByIds = async (ids: string[]): Promise<void> => {
    await this.setState({isLoading: true});
    const dto: ListObjectsByIdsDto = await this.businessService.getObjectsByBluetoothIds(ids);
    await this.setState((prev: State) => (
      {
        isLoading: false,
        devices: [...dto.items, ...prev.devices]
      }
    ));
    
  };
  
  getServicesAndCharacteristics = async (device, serviceId): Promise<any> => {
    //const all: any[] = [];
    const services = await device.services();
    console.log(services);
    
    
    services.forEach(async (service: any): Promise<void> => {
      const ccss: Characteristic[] = await  device.characteristicsForService(service.uuid);
      ccss.forEach(async (characteristic: Characteristic): Promise<void> => {
        try {
          const a = await this.bleManager.readCharacteristicForDevice(device.id, serviceId, characteristic.uuid);
          console.log(a);
          console.log(atob(a.value) + a.value);
        } catch (e) {
    
        }
        try {
          const a = await device.readCharacteristicForService(serviceId, characteristic.uuid);
          console.log(a);
          console.log(atob(a.value) + a.value);
        } catch (e) {
    
        }
        try {
          const a = await this.bleManager.readCharacteristicForDevice(device.id, service.uuid, characteristic.uuid);
          console.log(a);
          console.log(atob(a.value) + a.value);
        } catch (e) {
    
        }
  
        try {
          const a = await this.bleManager.readCharacteristicForDevice(device.id, characteristic.serviceUUID, characteristic.uuid);
          console.log(a);
          console.log(atob(a.value) + a.value);
        } catch (e) {
    
        }
  
        try {
          const a = await device.readCharacteristicForService(service.uuid, characteristic.uuid);
          console.log(a);
          console.log(atob(a.value) + a.value);
        } catch (e) {
    
        }
  
        try {
          const a = await service.readCharacteristic(characteristic.uuid);
          console.log(a);
          console.log(atob(a.value) + a.value);
        } catch (e) {
    
        }
  
        try {
          const a = await characteristic.read();
          console.log(a);
          console.log(atob(a.value) + a.value);
        } catch (e) {
    
        }
      });
      
      
      
      
      const cs: Characteristic[] = await service.characteristics();
      console.log(cs);
      if (cs.length === 0) {
        return;
      }
      
      cs.forEach(async (characteristic: Characteristic): Promise<void> => {
        try {
          const a = await this.bleManager.readCharacteristicForDevice(device.id, serviceId, characteristic.uuid);
          console.log(a);
          console.log(atob(a.value) + a.value);
        } catch (e) {
    
        }
        try {
          const a = await device.readCharacteristicForService(serviceId, characteristic.uuid);
          console.log(a);
          console.log(atob(a.value) + a.value);
        } catch (e) {
    
        }
        try {
          const a = await this.bleManager.readCharacteristicForDevice(device.id, service.uuid, characteristic.uuid);
          console.log(a);
          console.log(atob(a.value) + a.value);
        } catch (e) {
    
        }
  
        try {
          const a = await this.bleManager.readCharacteristicForDevice(device.id, characteristic.serviceUUID, characteristic.uuid);
          console.log(a);
          console.log(atob(a.value) + a.value);
        } catch (e) {
    
        }
  
        try {
          const a = await device.readCharacteristicForService(service.uuid, characteristic.uuid);
          console.log(a);
          console.log(atob(a.value) + a.value);
        } catch (e) {
    
        }
  
        try {
          const a = await service.readCharacteristic(characteristic.uuid);
          console.log(a);
          console.log(atob(a.value) + a.value);
        } catch (e) {
    
        }
  
        try {
          const a = await characteristic.read();
          console.log(a);
          console.log(atob(a.value) + a.value);
        } catch (e) {
    
        }
      });
      
      
    });
    //console.log(all);
    return '';
    
  };
  
  
  private componentDidFocus = async (): Promise<void> => {
    if (Platform.OS === 'ios') {
      this.bleManager.onStateChange(async (state): Promise<void> => {
        if (state === 'PoweredOn') {
          await this.startScan();
        }
      })
    } else {
      await this.startScan()
    }
  };
  
  private stopScan = async (): Promise<void> => {
    clearInterval(this.timeout);
    this.setState({isLoading: false})
    this.bleManager.stopDeviceScan();
    LOGGER.log('Stop scan');
  };
  
  private genListItem = (data: ObjectByCode, index: number): any => {
    if (data.type === ObjectType.bluetooth) {
      return (
        <BluetoothItem item={data.item} index={index}/>
      );
    }
    else if (data.type === ObjectType.material) {
      return (
        <MaterialItem item={data.item} index={index}/>
      );
    }
    else {
      return null;
    }
  };
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Grid>
          <Row>
            <List
              style={{flex: 1, backgroundColor: Styles.color.Background}}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isLoading}
                  onRefresh={async (): Promise<void> => {
                    await this.startScan();
                  }}
                />
              }
              keyboardShouldPersistTaps={'handled'}
              swipeToOpenPercent={80}
              disableLeftSwipe={true}
              disableRightSwipe={true}
              dataArray={this.state.devices}
              renderRow={(data: ObjectByCode, _sectionID: string | number, rowID: string | number, _rowMap?: any) => (
                
                <ListItem
                  onPress={() => {
                    this.clickListItem(data, Number(rowID));
                  }}
                  key={data.item.id}
                  style={{
                    paddingRight: 0, paddingLeft: 0,
                    backgroundColor: Number(rowID) % 2 === 0 ? Styles.color.Background : Styles.color.BackgroundListItemHighlight
                  }}
                >
                  {
                    this.genListItem(data, Number(rowID))
                  }
                </ListItem>
              )}
            
            />
          </Row>
        </Grid>
      </BasesSreen>
    );
  }
}