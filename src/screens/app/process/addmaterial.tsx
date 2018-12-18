import * as React from 'react';
import {Image, StyleSheet, TouchableOpacity, ImageStyle} from 'react-native';
import BasesSreen from "../../basescreen";
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';

import {
  FactoryInjection,
  //IBusinessService,
  PUBLIC_TYPES,
  IProcessService,
  CreateMaterialDto,
  CONSTANTS,
  Bluetooth
} from "business_core_app_react";
import {PARAMS, BluetoothItemType} from "../../../common";
import {Grid, Row, Col} from 'react-native-easy-grid';
import * as IMAGE from '../../../assets';
import * as Styles from '../../../stylesheet';
import {ROUTE} from "../../routes";
import {Button, Icon, Input, Item, Label, Text, Textarea} from "native-base";
import Utils from "../../../common/utils";
import BluetoothItem from '../../../components/listitem/bluetoothitem';
interface Props {
}

interface State {
  name: string;
  description: string;
  imageUri: string;
  bluetooth: Bluetooth | null;
  isLoading: boolean;
}

export default class AddMaterial extends BasesSreen<Props, State> {
  static navigationOptions = ({navigation}) => {
    return {
      headerRight: (
        <Button
          onPress={navigation.getParam(PARAMS.HANDLE_RIGHT_HEADER_BUTTON)}
        >
          <Text>Save</Text>
        </Button>
      ),
    };
  };
  // private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  private processService: IProcessService = FactoryInjection.get<IProcessService>(PUBLIC_TYPES.IProcessService);
  
  constructor(props: Props) {
    super(props);
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.createMaterial = this.createMaterial.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.pickBluetooth = this.pickBluetooth.bind(this);
    this.receiveBluetooth = this.receiveBluetooth.bind(this);
  
    this.state = {
      name: CONSTANTS.STR_EMPTY,
      bluetooth: null,
      description: CONSTANTS.STR_EMPTY,
      imageUri: CONSTANTS.STR_EMPTY,
      isLoading: false
    };
  }
  
  pickImage = (): void => {
    
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.images()],
    }, (error, response) => {
      if (error) {
        alert('error' + error);
        return;
      }
      console.log('Response = ', response);
      
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        
        this.setState({
          imageUri: response.uri
        });
      }
    });
  }
  
  
  
  receiveBluetooth = async (bluetooth: Bluetooth, _type: BluetoothItemType, _extraData: any | null): Promise<void> => {
    this.setState({bluetooth: bluetooth});
  };
  
  private pickBluetooth = async (): Promise<void> => {
    
    this.navigateFunc(ROUTE.APP.SHARE.BLUETOOTH, BluetoothItemType.BLUETOOTH, this.receiveBluetooth);
  }
  
  
  private async createMaterial(): Promise<void> {
    this.setState({isLoading: true});
    const res: CreateMaterialDto = await this.processService.createMaterial(
      this.state.name, this.state.description, this.state.imageUri, null
    );
    this.setState({isLoading: false});
    if (res.isSuccess) {
      this.goBack();
    }
    else {
      Utils.showErrorToast(res.message);
    }
  }
  
  componentDidMount = async (): Promise<void> => {
    const data: any = {};
    data[PARAMS.HANDLE_RIGHT_HEADER_BUTTON] = this.createMaterial;
    this.setSellNavigateParam(data);
  }
  
  private componentDidFocus = async (): Promise<void> => {
  
  }
  
  render() {
    return (
      <BasesSreen {...{...this.props, componentDidFocus: this.componentDidFocus, isLoading: this.state.isLoading}}>
        <Grid>
          <Row style={{height: 20}}></Row>
          <Row style={{height: 100}}>
            <Grid>
              <Col style={{justifyContent: 'center', flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                <Text style={Styles.styleSheet.label}>Please tap on frame to pick an image</Text>
              </Col>
              <Col style={{width: 100}}>
                <TouchableOpacity style={[styles.button, {justifyContent: 'flex-start'}]} onPress={this.pickImage}>
                  <Image resizeMode={'contain'}
                         source={this.state.imageUri === CONSTANTS.STR_EMPTY ? IMAGE.photo : {uri: this.state.imageUri}}
                         style={styles.image as ImageStyle}/>
                </TouchableOpacity>
              </Col>
            </Grid>
          </Row>
          <Row style={{height: Styles.styles.row.height}}>
            <Item inlineLabel style={{flex: 1}}>
              <Label>Name</Label>
              <Input
                value={this.state.name}
                onChangeText={(text: string) => {
                  this.setState({name: text});
                }}
              />
              <Icon style={Styles.styleSheet.icon} name='create'/>
            </Item>
          </Row>
          <Row style={{height: 20}}></Row>
          <Row style={{height: Styles.styles.row.height}}>
            <Grid>
              <Col style={{justifyContent: 'center', flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                <Text style={Styles.styleSheet.label}>
                  Select Bluetooth what will follow this material
                </Text>
              </Col>
              <Col style={{width: 50}}>
                <TouchableOpacity style={[styles.button, {justifyContent: 'flex-start'}]} onPress={this.pickBluetooth}>
                  <Image resizeMode={'contain'}
                         source={IMAGE.bluetooth}
                         style={styles.icon as ImageStyle}/>
                </TouchableOpacity>
              </Col>
            </Grid>
          </Row>
          {
            this.state.bluetooth &&
            <Row style={{height:70}}>
              <TouchableOpacity style={{flex:1, backgroundColor:Styles.color.BackgroundListItemHighlight}} onPress={() => {this.setState({bluetooth: null})}}>
                <BluetoothItem item={this.state.bluetooth} index={0} />
              </TouchableOpacity>
            </Row>
          }
          <Row style={{height: 10}}></Row>
          
          <Row style={{height: 40}}>
            <Text style={Styles.styleSheet.label}>Description</Text>
          </Row>
          <Row>
            <Textarea
              value={this.state.description}
              onChangeText={(text: string) => {
                this.setState({description: text});
              }}
              style={{borderColor: '#777777', borderWidth:1, flex: 1}}
              rowSpan={10}
              placeholder={"Please fill description"}/>
          </Row>
        </Grid>
      </BasesSreen>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 120,
    height: 120,
    alignSelf: 'center'
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center'
  },
  icon: {
    width: 50,
    height: 50,
    alignSelf: 'center'
  },
  row: {
    height: 70
  }
});