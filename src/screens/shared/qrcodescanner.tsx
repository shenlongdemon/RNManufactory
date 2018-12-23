import BasesSreen from "../basescreen";
import {Grid, Row, View} from "native-base";
import * as React from "react";
import QRCodeScanner from 'react-native-qrcode-scanner';
import Utils from "../../common/utils";
import {
  CONSTANTS,
  FactoryInjection,
  IBusinessService,
  Material,
  ObjectByCode,
  ObjectByCodeDto,
  ObjectType,
  PUBLIC_TYPES,
  UserInfo
} from 'business_core_app_react';
import MaterialItem from "../../components/listitem/materialitem";
import UserItem from "../../components/listitem/useritem";
import {BluetoothItemType, PARAMS} from "../../common";

interface Props {
}

interface State {
  isProcess: boolean;
  object: ObjectByCode | null
}

export default class QRCodeScannerScreen extends BasesSreen<Props, State> {
  static navigationOptions = ({}) => {
    return {
      title: 'Scanning QR Code'
    };
  };
  private scanner!: QRCodeScanner;
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  private filterType: ObjectType = ObjectType.unknown;
  
  constructor(props) {
    super(props);
    this.filterType = this.getParam<ObjectType>(PARAMS.ITEM, ObjectType.unknown) as ObjectType;
    
    this.state = {
      isProcess: false,
      object: null
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    
  }
  
  componentWillMount = async (): Promise<void> => {
  }
  
  async onSuccess(e) {
    Utils.showToast(e.data);
    if (!this.state.isProcess && e && e.data !== CONSTANTS.STR_EMPTY) {
      this.setState({isProcess: true, object: null});
      const res: ObjectByCodeDto = await this.businessService.getObjectByCode(e.data);
      this.setState({isProcess: false});
      if (res.isSuccess && res.item && (this.filterType === ObjectType.unknown || res.item.type === this.filterType)) {
        this.setState({object: res.item});
      }
      
    }
    
    setTimeout(() => {
      this.scanner.reactivate();
    }, 2000);
  }
  
  componentDidMount = async (): Promise<void> => {
  
  }
  
  componentWillUnmount = async (): Promise<void> => {
  
  }
  
  private componentDidFocus = async (): Promise<void> => {
  
  }
  
  private clickListItem = async (item: any, _index: number): Promise<void> => {
    const callbackFunc: (data: any, type: ObjectType, extraData: any | null) => Promise<void> | null = this.getParam<any>(PARAMS.CALLBACK_FUNCTION, null);
    if (callbackFunc && (this.filterType === ObjectType.unknown || this.filterType === item.type)) {
      await callbackFunc(item.item, item.type, null);
      this.goBack();
    }
    
  }
  
  private renderObject = (): any => {
    let control: any = (<View/>);
    if (this.state.object) {
      if (this.state.object.type === ObjectType.material) {
        control = (
          <MaterialItem onClickHandle={this.clickListItem} item={this.state.object.item as Material} index={0}/>
        );
      }
      else if (this.state.object.type === ObjectType.user) {
        control = (
          <UserItem onClickHandle={this.clickListItem} item={this.state.object.item as UserInfo} index={0}/>
        );
      }
    }
    return control;
  }
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isProcess, componentDidFocus: this.componentDidFocus}}>
        <Grid>
          <Row>
            <QRCodeScanner
              ref={(node) => {
                this.scanner = node
              }}
              onRead={this.onSuccess}
            />
          </Row>
          {
            this.state.object &&
            <Row style={{height: 100}}>
              {
                this.renderObject()
              }
            </Row>
          }
        </Grid>
      </BasesSreen>
    );
  }
}