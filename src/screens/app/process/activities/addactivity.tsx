import BasesSreen from '../../..//basescreen';
import {Button, Content, Grid, Icon, Input, Item, Label, Row, Text, Textarea} from 'native-base';
import * as React from 'react';
import {Col} from 'react-native-easy-grid';
import * as Styles from '../../../../stylesheet';
import {Image, ImageStyle, StyleSheet, TouchableOpacity} from 'react-native';
import {CONSTANTS, FactoryInjection, IProcessService, PUBLIC_TYPES, BaseDto, IItemService} from 'business_core_app_react';
import * as IMAGE from '../../../../assets';
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import {FileType, PARAMS} from '../../../../common';

interface Props {
}

interface State {
  isLoading: boolean;
  title: string;
  description: string;
  imageUri: string;
  file: string;
  fileName: string;
}

interface Param {
  processId: string;
  materialId: string;
  itemId?: string | null;
}

export default class AddActivity extends BasesSreen<Props, State> {
  static navigationOptions = ({navigation}) => {
    return {
      headerRight: (
        <Button onPress={navigation.getParam(PARAMS.HANDLE_RIGHT_HEADER_BUTTON)}>
          <Text>Save</Text>
        </Button>
      )
    };
  };
  private materialId: string = CONSTANTS.STR_EMPTY;
  private processId: string = CONSTANTS.STR_EMPTY;
  private itemId: string = CONSTANTS.STR_EMPTY;
  private processService: IProcessService = FactoryInjection.get<IProcessService>(PUBLIC_TYPES.IProcessService);
  private itemService: IItemService = FactoryInjection.get<IItemService>(PUBLIC_TYPES.IItemService);
  
  constructor(props) {
    super(props);
    const param: Param | null = this.getParam<Param>(PARAMS.ITEM, null);
    this.initParam(param!.materialId, param!.processId, param!.itemId || CONSTANTS.STR_EMPTY);
    this.state = {
      isLoading: false,
      title: CONSTANTS.STR_EMPTY,
      description: CONSTANTS.STR_EMPTY,
      file: CONSTANTS.STR_EMPTY,
      fileName: CONSTANTS.STR_EMPTY,
      imageUri: CONSTANTS.STR_EMPTY
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.pickFile = this.pickFile.bind(this);
    this.save = this.save.bind(this);
  }
  
  private initParam = (materialId: string, processId: string, itemId: string): void => {
    this.materialId = materialId;
    this.processId = processId;
    this.itemId = itemId;
    
  };
  
  componentWillMount = async (): Promise<void> => {
    const data: any = {};
    data[PARAMS.HANDLE_RIGHT_HEADER_BUTTON] = this.save;
    this.setSellNavigateParam(data);
  };
  
  componentDidMount = async (): Promise<void> => {
  };
  
  componentWillUnmount = async (): Promise<void> => {
  };
  
  save = async (): Promise<void> => {
    this.setState({isLoading: true});
    let dto: BaseDto = {isSuccess: true, message: CONSTANTS.STR_EMPTY};
    
    if (this.itemId === CONSTANTS.STR_EMPTY) {
      dto = await this.processService.addActivity(
        this.materialId,
        this.processId,
        this.state.title,
        this.state.description,
        this.state.imageUri,
        this.state.file
      );
    }
    else {
      dto = await this.itemService.addMaintain(
        this.itemId,
        this.state.title,
        this.state.description,
        this.state.imageUri,
        this.state.file
      );
    }
    this.setState({isLoading: false});
    if (dto.isSuccess) {
      this.goBack();
    }
  };
  
  private componentDidFocus = async (): Promise<void> => {
  };
  
  private pickFile = async (type: FileType): Promise<void> => {
    DocumentPicker.show(
      {
        filetype: [type === FileType.FILE ? DocumentPickerUtil.pdf() : DocumentPickerUtil.images()]
      },
      (error, res) => {
        if (error) {
          return;
        }
        // Android
        console.log(
          res.uri,
          res.type, // mime type
          res.fileName,
          res.fileSize
        );
        if (type === FileType.IMAGE) {
          this.setState({imageUri: res.uri});
        } else {
          let size: number = Math.round(res.fileSize / 1024000);
          let sizeType: string = 'Mb';
          if (res.fileSize < 1024000) {
            size = Math.round(res.fileSize / 1024);
            sizeType = 'Kb';
          }
          this.setState({file: res.uri, fileName: `${res.type} - ${size} ${sizeType}`});
        }
      }
    );
  };
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Content>
          <Grid>
            <Row style={{height: 20}}/>
            <Row style={{height: 100}}>
              <Grid>
                <Col style={{justifyContent: 'center', flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                  <Text style={Styles.styleSheet.label}>Please tap on frame to pick an image</Text>
                </Col>
                <Col style={{width: 100}}>
                  <TouchableOpacity
                    style={[styles.button, {justifyContent: 'flex-start'}]}
                    onPress={async (): Promise<void> => {
                      await this.pickFile(FileType.IMAGE);
                    }}
                  >
                    <Image
                      resizeMode={'contain'}
                      source={this.state.imageUri === CONSTANTS.STR_EMPTY ? IMAGE.photo : {uri: this.state.imageUri}}
                      style={styles.image as ImageStyle}
                    />
                  </TouchableOpacity>
                </Col>
              </Grid>
            </Row>
            <Row style={{height: Styles.styles.row.height}}>
              <Item inlineLabel style={{flex: 1}}>
                <Label>Title</Label>
                <Input
                  value={this.state.title}
                  onChangeText={(text: string) => {
                    this.setState({title: text});
                  }}
                />
                <Icon style={Styles.styleSheet.icon} name="create"/>
              </Item>
            </Row>
            
            <Row style={{height: 20}}/>
            <Row style={{height: Styles.styles.row.heightControl}}>
              <Button transparent block onPress={async () => await this.pickFile(FileType.FILE)} iconRight>
                <Text uppercase={false} style={{color: Styles.color.Text}}>
                  Attach file
                </Text>
                <Text uppercase={false} style={{color: Styles.color.Text}}>
                  {this.state.fileName}
                </Text>
                <Icon style={{color: Styles.color.Icon}} name={'attach'}/>
              </Button>
              {this.state.file !== CONSTANTS.STR_EMPTY && (
                <Button transparent>
                  <Text uppercase={false} style={{color: Styles.color.Link}}>
                    Link
                  </Text>
                </Button>
              )}
            </Row>
            <Row style={{height: 20}}/>
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
                placeholder={'Please fill description'}
              />
            </Row>
            <Row style={{height: 10}}/>
          </Grid>
        </Content>
      </BasesSreen>
    );
  }
}

const
  styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
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
