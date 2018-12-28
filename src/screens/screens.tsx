import MaterialList from "./app/process/materiallist";

const RNN = require('react-navigation');
import * as Styles from '../stylesheet';
import Loading from './loading';
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

const manufactoryStack = RNN.createStackNavigator(
  {
    main: ManufactoryMain,
    goodses: GoodsList,
    addgoods: AddGoods,
    itemdetail: ItemDetail ,
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
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        fontWeight: Styles.styles.Navigation.FontWeight,
        width: '90%'
      }
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
