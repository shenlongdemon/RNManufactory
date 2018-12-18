import MaterialList from "./app/process/materiallist";

const RNN = require('react-navigation');
import * as Styles from '../stylesheet';
import Loading from './loading';
import Login from './auth/login';
import SwitchFeature from './switctfeature';
//
// import UserMain from "./main/usermain";
import ManufactoryMain from './app/manufactorymain';
import AddMaterial from "./app/process/addmaterial";
import BluetoothScannerScreen from "./shared/bluetoothscanner";
import MaterialDetail from "./app/process/materialdetail";
import TaskDetailScreen from "./app/process/taskdetail";
// import GoodsScreen from "./main/goods";
// import ProcessesScreen from "./main/process/processes";
//
// import GoodsInfoScreen from "./main/itemtabs/info";
// import GoodsHistoryScreen from "./main/itemtabs/history";
// import ProcessDetail from "./main/process/processdetail";
// import AddProcess from './main/process/addprocess';
// import QRCodeScannerScreen from "./main/shared/qrcodescanner";
// import BluetoothScannerScreen from "./main/shared/bluetoothscanner";
// import TaskDetailScreen from './app/process/taskdetail';

// const goodsTab = RNN.createTabNavigator(
//   {
//     info: GoodsInfoScreen,
//     history: GoodsHistoryScreen
//   },
//   {
//     initialRouteName: 'info'
//   }
// );
//
// const userStack = RNN.createStackNavigator(
//   {
//     main: UserMain,
//   },
//   {
//     initialRouteName: 'main'
//   }
// );
//
const manufactoryStack = RNN.createStackNavigator(
  {
    main: ManufactoryMain,
    // goodses: GoodsScreen,
    materials: {
      screen: MaterialList,
      navigationOptions: {
        title: 'Processes List'
      }
    },
    materialdetail: MaterialDetail,
    taskdetail: TaskDetailScreen,
    addmaterial: AddMaterial,
    // goodsdetail: goodsTab,
    // qrscanner: QRCodeScannerScreen,
    bluetooth: {
      screen: BluetoothScannerScreen
    }
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
