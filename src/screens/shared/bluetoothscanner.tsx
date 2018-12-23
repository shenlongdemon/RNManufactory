import * as React from 'react';
import {Platform, RefreshControl} from 'react-native';
import {Bluetooth, FactoryInjection, IBusinessService, LOGGER, PUBLIC_TYPES} from 'business_core_app_react';
import BasesSreen from "../basescreen";
import {BleError, BleManager, Device} from 'react-native-ble-plx';
import {BluetoothItemType, PARAMS} from "../../common";
import Utils from '../../common/utils';
import * as Styles from "../../stylesheet";
import {Button, Grid, Icon, List, ListItem, Row} from "native-base";
import BluetoothItem from '../../components/listitem/bluetoothitem';

interface Props {
}

interface State {
  devices: BluetoothData[];
  isLoading: boolean;
}

interface BluetoothData {
  item: any;
  type: BluetoothItemType
}

export default class BluetoothScannerScreen extends BasesSreen<Props, State> {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Scanning bluetooth around',
      headerRight: (
        <Button onPress={navigation.getParam(PARAMS.HANDLE_RIGHT_HEADER_BUTTON)}>
          <Icon name={'sync' } style={{color: Styles.color.Icon }}/>
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
  }
  
  componentDidMount = async (): Promise<void> => {
    const data: any = {};
    data[PARAMS.HANDLE_RIGHT_HEADER_BUTTON] = this.startScan;
    this.setSellNavigateParam(data);
  }
  
  componentWillUnmount = async (): Promise<void> => {
    this.bleManager.stopDeviceScan();
  }
  
  private clickListItem = async (item: BluetoothData, _index: number): Promise<void> => {
    const type: BluetoothItemType = this.getParam<any>(PARAMS.ITEM, BluetoothItemType.ALL) as BluetoothItemType;
    const callbackFunc: (data: any, type: BluetoothItemType, extraData: any | null) => Promise<void> | null = this.getParam<any>(PARAMS.CALLBACK_FUNCTION, null);
    if (callbackFunc && (type === BluetoothItemType.ALL || type === item.type)) {
      await callbackFunc(item.item, item.type, null);
      this.goBack();
    }
    
  }
  
  private startScan = async (): Promise<void> => {
    
    const currentPosition = await this.businessService.getCurrentPosition();
    this.setState({isLoading: true});
    const devices: Device[] = [];
    this.bleManager.startDeviceScan(null, null, (error: BleError, device: Device) => {
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
      if (index < 0) {
        devices.push(device);
        console.log(device);
      }
    });
    
    this.timeout = setTimeout(async (): Promise<void> => {
      await this.stopScan();
      const bluetooths: Bluetooth[] = Utils.mappingBLEDevices(devices, currentPosition);
      const list: BluetoothData[] = bluetooths.map((ble: Bluetooth): BluetoothData => {
        return {item: ble, type: BluetoothItemType.BLUETOOTH};
      });
      this.setState({devices: list, isLoading: false});
    }, 8000);
    
  }
  
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
  }
  
  private stopScan = async (): Promise<void> => {
    clearInterval(this.timeout);
    this.setState({isLoading: false})
    this.bleManager.stopDeviceScan();
    LOGGER.log('Stop scan');
  }
  
  private genListItem = (data: BluetoothData, index: number): any => {
    if (data.type === BluetoothItemType.BLUETOOTH) {
      return (
        <BluetoothItem item={data.item} index={index}/>
      );
    }
    else {
      return null;
    }
  }
  
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
              renderRow={(data: BluetoothData, _sectionID: string | number, rowID: string | number, _rowMap?: any) => (
                
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