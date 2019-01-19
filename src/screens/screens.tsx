import MaterialList from "./app/process/materiallist";

const RNN = require('react-navigation');
import * as Styles from '../stylesheet';
import Loading from './loading';
import {View} from 'native-base';
import Login from './auth/login';
import SwitchFeature from './switctfeature';

import ManufactoryMain from './app/manufactorymain';
import AddMaterial from "./app/process/addmaterial";
import BluetoothScannerScreen from "./shared/bluetoothscanner";
import MaterialDetail from "./app/process/materialdetail";
import TaskDetailScreen from "./app/process/taskdetail";
import AssignedWorkers from "./app/process/assignedworkers";
import QRCodeScannerScreen from "./shared/qrcodescanner";
import AddActivity from "./app/process/activities/addactivity";
import Activitieslist from "./app/process/activities/activitieslist";
import QRCodeDisplay from "./shared/qrcodedisplay";
import GoodsList from "./app/goods/goodslist";
import AddGoods from "./app/goods/addgoods";
import ItemDetail from "./app/goods/itemdetail";
import PaymentScreen from "./app/goods/PaymentScreen";
import ProductsScreen from "./app/products/ProductsScreen";
import ProfilesScreen from "./app/ProfilesScreen";
import {ActivityDetail} from "./app/process/activities/ActivityDetail";
import * as React from "react";

const manufactoryStack = RNN.createStackNavigator(
  {
    main: ManufactoryMain,
    goodses: GoodsList,
    addgoods: AddGoods,
    itemdetail: ItemDetail ,
    payment: PaymentScreen ,
    products: ProductsScreen ,
    profile: ProfilesScreen ,
    
    materials: {
      screen: MaterialList,
      navigationOptions: {
        title: 'Processes List'
      }
    },
    materialdetail: MaterialDetail,
    taskdetail: TaskDetailScreen,
    addmaterial: AddMaterial,
    activities: Activitieslist,
    activitydetail: ActivityDetail,
    bluetooth: {
      screen: BluetoothScannerScreen
    },
    qrcode: {
      screen: QRCodeScannerScreen
    },
    qrcodedisplay: {
      screen: QRCodeDisplay
    },
    workers: {
      screen: AssignedWorkers
    },
    addactivity: {
      screen: AddActivity,
      navigationOptions: {
        title: 'Add Activity'
      }
    },
  },
  {
    initialRouteName: 'main',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Styles.color.Navigation.Background
      },
      headerTintColor: Styles.color.Navigation.Tint,
      headerTitleStyle: {
        fontWeight: Styles.styles.Navigation.FontWeight,
        textAlign: 'center',
        alignSelf:'center',
        flex:1
      },
      headerRight: (<View />)
    }
  }
);

const switchStack = RNN.createSwitchNavigator(
  {
    switchfeature: SwitchFeature,
    // user: userStack,
    manufactory: manufactoryStack
  },
  {
    initialRouteName: 'switchfeature'
  }
);

const createStack = RNN.createSwitchNavigator(
  {
    login: Login,
    switchfeature: switchStack,
    loading: {
      screen: Loading,
      initialRouteName: 'loading',
      mode: 'modal',
      headerMode: 'none'
    }
  },
  {
    initialRouteName: 'loading'
  }
);
const app = RNN.createAppContainer(createStack);
export { app };
