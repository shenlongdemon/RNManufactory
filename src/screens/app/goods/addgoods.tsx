import BasesSreen from "../../basescreen";
import {ActionSheet, Button, Content, Grid, Icon, Input, Item, Label, Row, Text, Textarea} from "native-base";
import * as React from "react";
import {Col} from "react-native-easy-grid";
import * as Styles from "../../../stylesheet";
import {Image, ImageStyle, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {
  Bluetooth,
  CONSTANTS,
  BaseDto,
  FactoryInjection,
  IProcessService,
  Material,
  ObjectType, PUBLIC_TYPES, Category, IBusinessService, GetCategoriesDto
} from "business_core_app_react";
import * as IMAGE from "../../../assets";
import BluetoothItem from "../../../components/listitem/bluetoothitem";
import MaterialItem from "../../../components/listitem/materialitem";
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import {ROUTE} from "../../routes";
import {PARAMS} from "../../../common";

interface Props {
}

interface State {
  name: string;
  price: number;
  description: string;
  imageUri: string;
  bluetooth: Bluetooth | null;
  isLoading: boolean;
  material: Material | null;
  category: Category | null;
  categories: Category[]
}

export default class AddGoods extends BasesSreen<Props, State> {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Make new goods',
      headerRight: (
        <Button
          onPress={navigation.getParam(PARAMS.HANDLE_RIGHT_HEADER_BUTTON)}
        >
          <Text>Save</Text>
        </Button>
      ),
    };
  };
  private processService: IProcessService = FactoryInjection.get<IProcessService>(PUBLIC_TYPES.IProcessService);
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props) {
    super(props);
    this.state = {
      bluetooth: null,
      description: CONSTANTS.STR_EMPTY,
      imageUri: CONSTANTS.STR_EMPTY,
      isLoading: false,
      name: CONSTANTS.STR_EMPTY,
      material: null,
      price: 0.0,
      category: null,
      categories: []
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.createItem = this.createItem.bind(this);
    this.pickBluetooth = this.pickBluetooth.bind(this);
    this.pickMaterial = this.pickMaterial.bind(this);
    this.receiveBluetooth = this.receiveBluetooth.bind(this);
    this.receiveMaterial = this.receiveMaterial.bind(this);
    this.showCombobox = this.showCombobox.bind(this);
    
  }
  
  componentWillMount = async (): Promise<void> => {
    await this.loadCategories();
  }
  
  componentDidMount = async (): Promise<void> => {
    const data: any = {};
    data[PARAMS.HANDLE_RIGHT_HEADER_BUTTON] = this.createItem;
    this.setSellNavigateParam(data);
  };
  
  private createItem = async (): Promise<void> => {
    this.setState({isLoading: true});
    const res: BaseDto = await this.processService.createItem(this.state.category!,
      this.state.name, this.state.price, this.state.description, this.state.imageUri, this.state.bluetooth, this.state.material
    );
    this.setState({isLoading: false});
    if (res.isSuccess) {
      this.goBack();
    }
  };
  
  componentWillUnmount = async (): Promise<void> => {
  }
  
  private componentDidFocus = async (): Promise<void> => {
  
  }
  receiveBluetooth = async (bluetooth: Bluetooth, _type: ObjectType, _extraData: any | null): Promise<void> => {
    this.setState({bluetooth: bluetooth});
  };
  
  receiveMaterial = async (material: Material, _type: ObjectType, _extraData: any | null): Promise<void> => {
    this.setState({material: material});
  };
  
  private pickBluetooth = async (): Promise<void> => {
    
    this.navigateFunc(ROUTE.APP.SHARE.BLUETOOTH, ObjectType.bluetooth, this.receiveBluetooth);
  };
  
 
  private pickMaterial = async (): Promise<void> => {
    
    this.navigateFunc(ROUTE.APP.SHARE.BLUETOOTH, ObjectType.material, this.receiveMaterial);
  };
  
  private showCombobox = (): void => {
    const data: string[] = this.state.categories.map((category: Category): string => {
      return category.value;
    });
    data.push('Cancel');
    ActionSheet.show(
      {
        options: data,
        cancelButtonIndex: data.length - 1,
        title: 'Please select category'
      },
      (buttonIndex: number) => {
        if (buttonIndex < data.length - 1) {
          this.setState({category: this.state.categories[buttonIndex]});
        }
      }
    );
  };
  
  
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
  };
  
  private loadCategories = async (): Promise<void> => {
    this.setState({isLoading: true});
    const dto: GetCategoriesDto = await this.businessService.getCategories();
    this.setState({isLoading: false, categories: dto.categories});
  };
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Content>
          <ScrollView style={{flex: 1}}>
            <Grid>
              <Row style={{height: 60}}>
                
                <Grid>
                  <Col size={1} style={{justifyContent: 'center'}}>
                    <Text style={[Styles.styleSheet.label, {alignSelf: 'center', width: '100%'}]}>Category </Text>
                  </Col>
                  <Col size={2}>
                    <Button full transparent onPress={this.showCombobox} iconRight>
                      <Text uppercase={false}
                            style={{color: Styles.color.Text}}>{this.state.category ? this.state.category.value : CONSTANTS.STR_EMPTY}</Text>
                      <Icon style={{color: Styles.color.Icon}} name={'arrow-dropdown'}/>
                    </Button>
                  </Col>
                </Grid>
              </Row>
              
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
              <Row style={{height: Styles.styles.row.height}}>
                <Item inlineLabel style={{flex: 1}}>
                  <Label>Price</Label>
                  <Input
                    value={`${this.state.price}`}
                    onChangeText={(text: string) => {
                      this.setState({price: Number(text)});
                    }}
                  />
                  <Icon style={Styles.styleSheet.icon} name='create'/>
                </Item>
              </Row>
              <Row style={{height: 20}}></Row>
              {/* LINK BLUETOOTH */}
              <Row style={{height: Styles.styles.row.height}}>
                <Grid>
                  <Col style={{justifyContent: 'center', flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                    <Text style={Styles.styleSheet.label}>
                      Select Bluetooth what will follow this material
                    </Text>
                  </Col>
                  <Col style={{width: 50}}>
                    <TouchableOpacity style={[styles.button, {justifyContent: 'flex-start'}]}
                                      onPress={this.pickBluetooth}>
                      <Image resizeMode={'contain'}
                             source={IMAGE.bluetooth}
                             style={styles.icon as ImageStyle}/>
                    </TouchableOpacity>
                  </Col>
                </Grid>
              </Row>
              {
                this.state.bluetooth &&
                <Row style={{height: 70}}>
                  <TouchableOpacity style={{flex: 1, backgroundColor: Styles.color.BackgroundListItemHighlight}}
                                    onPress={() => {
                                      this.setState({bluetooth: null})
                                    }}>
                    <BluetoothItem item={this.state.bluetooth} index={0}/>
                  </TouchableOpacity>
                </Row>
              }
              <Row style={{height: 10}}></Row>
              {/* LINK MATERIAL */}
              <Row style={{height: Styles.styles.row.height}}>
                <Grid>
                  <Col style={{justifyContent: 'center', flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                    <Text style={Styles.styleSheet.label}>
                      Select Bluetooth what will follow this material
                    </Text>
                  </Col>
                  <Col style={{width: 50}}>
                    <TouchableOpacity style={[styles.button, {justifyContent: 'flex-start'}]}
                                      onPress={this.pickMaterial}>
                      <Image resizeMode={'contain'}
                             source={IMAGE.bluetooth}
                             style={styles.icon as ImageStyle}/>
                    </TouchableOpacity>
                  </Col>
                </Grid>
              </Row>
              {
                this.state.material &&
                <Row style={{height: 70}}>
                  <TouchableOpacity style={{flex: 1, backgroundColor: Styles.color.BackgroundListItemHighlight}}
                                    onPress={() => {
                                      this.setState({material: null})
                                    }}>
                    <MaterialItem item={this.state.material} index={0}/>
                  </TouchableOpacity>
                </Row>
              }
              <Row style={{height: 40}}>
                <Text style={Styles.styleSheet.label}>Description</Text>
              </Row>
              <Row>
            <Textarea
              value={this.state.description}
              onChangeText={(text: string) => {
                this.setState({description: text});
              }}
              style={{borderColor: '#777777', borderWidth: 1, flex: 1}}
              rowSpan={10}
              placeholder={"Please fill description"}/>
              </Row>
            </Grid>
          </ScrollView>
        </Content>
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