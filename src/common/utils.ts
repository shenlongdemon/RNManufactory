import {Toast} from "native-base";
import {Bluetooth, Position, CONSTANTS} from 'business_core_app_react';
import {Device} from 'react-native-ble-plx';

export default class Utils {
  static showErrorToast = (message: string): void => {
    Toast.show({
      text: message,
      buttonText: "OK",
      position: "bottom",
      type: 'danger',
      duration:5000
    });
  }
  
  
  
  static getBLEBeaconDistance = (RSSI: number): number => {
    const rssi: number = RSSI;
    if (rssi == 0) {
      return -1.0; // if we cannot determine accuracy, return -1.
    }
    
    const ratio: number = rssi * 1.0 / (-60.0);
    if (ratio < 1.0) {
      return Math.pow(ratio, 10);
    }
    else {
      let accuracy: number = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
      return accuracy;
    }
  }
  
  static mappingBLEDevices = (devices: Device[], currentPosition: Position): Bluetooth[] => {
    const bluetooths: Bluetooth[] = devices.map((device: Device, _index: number) => {
      const distance: number = Utils.getBLEBeaconDistance(device.rssi || 0);
      const blu: Bluetooth = {
        mac: device.id,
        id: device.id,
        name: device.name || CONSTANTS.STR_EMPTY,
        localName: device.localName,
        proximityUUID: device.id,
        position: {...currentPosition, distance: distance}
      }
      return blu;
    });
    return bluetooths;
  };
}