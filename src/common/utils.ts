import {Toast} from "native-base";
import {Bluetooth, Position, CONSTANTS} from 'business_core_app_react';
import {Device} from 'react-native-ble-plx';
import {Platform} from "react-native";

export default class Utils {
  static showErrorToast = (message: string): void => {
    Toast.show({
      text: message,
      buttonText: "OK",
      position: "bottom",
      type: 'danger',
      duration: 5000
    });
  }
  
  static showToast = (message: string): void => {
    Toast.show({
      text: message,
      position: "bottom"
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
      let serviceId: string = CONSTANTS.STR_EMPTY;
      const serviceData: any | null = device.serviceData;
      if (serviceData) {
        const keys: string[] = Object.getOwnPropertyNames(serviceData);
        if (keys.length > 0) {
          serviceId = keys[0];
        }
      }
      const mac: string = Platform.OS === 'ios' ? CONSTANTS.STR_EMPTY : device.id;
      const id: string = Platform.OS === 'ios' ? CONSTANTS.STR_EMPTY : serviceId;
      const proximityUUID: string = Platform.OS === 'ios' ? CONSTANTS.STR_EMPTY : CONSTANTS.STR_EMPTY;
      const blu: Bluetooth = {
        mac: mac,
        id: id,
        name: device.name || (device.localName || device.manufacturerData),
        proximityUUID: proximityUUID,
        position: {...currentPosition, distance: distance}
      };
      return blu;
    });
    return bluetooths;
  };
}