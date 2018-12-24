import * as React from 'react';
import {Col, Grid, Row} from 'react-native-easy-grid';
import BaseScreen from '../../basescreen';
import {Image, ScrollView} from 'react-native';
import {
  CONSTANTS,
  DynProperty,
  DynPropertyType,
  FactoryInjection,
  IBusinessService,
  IProcessService,
  Process, ProcessStatus,
  PUBLIC_TYPES,
  UpdateProcessDto,
  ProcessDto,
  BaseDto
} from 'business_core_app_react';
import {PARAMS} from '../../../common';
import {ActionSheet, Badge, Button, Content, Icon, Input, Item, Label, Text} from 'native-base';
import * as Styles from '../../../stylesheet';
// import ImagePicker from 'react-native-image-picker';
// import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import Utils from "../../../common/utils";
import {ROUTE} from "../../routes";

interface Props {
}

interface State {
  item: Process;
  isLoading: boolean;
  data: any;
}

interface Param {
  processId: string,
  materialId: string;
}

export default class TaskDetailScreen extends BaseScreen<Props, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  private processService: IProcessService = FactoryInjection.get<IProcessService>(PUBLIC_TYPES.IProcessService);
  static navigationOptions = ({navigation}) => {
    const process: Process | null = navigation.getParam(PARAMS.ITEM);
    const title: string = process ? process.name : '';
    return {
      title: title,
      headerRight: (
        <Button onPress={navigation.getParam(PARAMS.HANDLE_RIGHT_HEADER_BUTTON)}>
          <Icon name={'save'} type={'FontAwesome'} style={{color: Styles.color.Icon, fontSize: 35}}/>
        </Button>
      ),
    };
  };
  private materialId: string = CONSTANTS.STR_EMPTY;
  private processId: string = CONSTANTS.STR_EMPTY;
  constructor(props: Props) {
    super(props);
    const param: Param | null = this.getParam<Param>(PARAMS.ITEM, null);
    this.materialId = param!.materialId;
    this.processId = param!.processId;
    const d: any = {};
    
    this.state = {
      item: {
        index: 0,
        id: CONSTANTS.STR_EMPTY,
        name: CONSTANTS.STR_EMPTY,
        code: CONSTANTS.STR_EMPTY,
        status: ProcessStatus.TODO,
        workers: [],
        activities: [],
        updateAt: 0,
        dynProperties: []
      },
      isLoading: false,
      data: d
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.pickFile = this.pickFile.bind(this);
    this.save = this.save.bind(this);
    this.workerClick = this.workerClick.bind(this);
    this.doneTask = this.doneTask.bind(this);
    this.loadProcess();
  }
  
  componentDidFocus = async (): Promise<void> => {
    await this.loadProcess();
  };
  
  componentDidMount = async (): Promise<void> => {
    const data: any = {};
    data[PARAMS.HANDLE_RIGHT_HEADER_BUTTON] = this.save;
    this.setSellNavigateParam(data);
  }
  
  private loadProcess = async (): Promise<void> => {
    if (this.state.isLoading) {
      return;
    }
    await this.setState({isLoading: true});
    const dto: ProcessDto = await this.processService.getProcess(this.materialId, this.processId);
    await this.setState({isLoading: false});
  
    if (dto.isSuccess && dto.process) {
      const d: any = {};
  
      dto.process!.dynProperties.forEach((p: DynProperty) => {
        const data: string[] = this.separateItems(p);
        if (p.type === DynPropertyType.CHECKBOX) {
          // value : Red,White
          // detail: CBK_1Red = true
          data.forEach((t: string, _i: number) => {
            d[`${p.id}${t}`] = p.value === CONSTANTS.STR_EMPTY ? false : p.value.includes(t);
          });
          d[`${p.id}`] = p.value;
        } else if (p.type === DynPropertyType.TEXT) {
          d[`${p.id}`] = d[`${p.id}`] || p.value;
        } else if (p.type === DynPropertyType.RADIO) {
          d[`${p.id}`] = d[`${p.id}`] || (p.value !== CONSTANTS.STR_EMPTY ? p.value : data[0]);
        } else if (p.type === DynPropertyType.COMBOBOX) {
          d[`${p.id}`] = d[`${p.id}`] || (p.value !== CONSTANTS.STR_EMPTY ? p.value : data[0]);
        } else if (p.type === DynPropertyType.IMAGE) {
          d[`${p.id}`] = d[`${p.id}`] || (p.value !== CONSTANTS.STR_EMPTY ? p.value : CONSTANTS.STR_EMPTY);
        }
        else if (p.type === DynPropertyType.FILE) {
          d[`${p.id}`] = d[`${p.id}`] || (p.value !== CONSTANTS.STR_EMPTY ? p.value : CONSTANTS.STR_EMPTY);
        }
      });
      await this.setState({data: d, item: dto.process!})
    }
  };
  
  private save = async (): Promise<void> => {
    this.setState({isLoading: true});
    const process: Process = this.buildUpProcess();
    const dto: UpdateProcessDto = await this.processService.updateProcessDynProperties(this.materialId, process.id, process.dynProperties);
    this.setState({isLoading: false});
    if (dto.isSuccess) {
      this.goBack();
    }
    else {
      Utils.showErrorToast(dto.message);
    }
  };
  
  
  private doneTask = async (): Promise<void> => {
    this.setState({isLoading: true});
    const dto: BaseDto = await this.processService.doneProcess(this.materialId, this.processId);
    this.setState({isLoading: false});
    if (dto.isSuccess) {
      this.goBack();
    }
  };
  
  workerClick = async (): Promise<void> => {
    const param: any = {};
    param[PARAMS.ITEM] = {
      materialId: this.materialId,
      processId: this.state.item.id
    };
    this.navigate(ROUTE.APP.MANUFACTORY.MATERIALS.ITEM.PROCESS.TASK.WORKERS.DEFAULT, param);
  };
  
  private buildUpProcess = (): Process => {
    const process: Process = this.state.item;
    
    process.dynProperties.forEach((p: DynProperty): void => {
      if (p.type === DynPropertyType.TEXT) {
        p.value = this.state.data[`${p.id}`] as string;
      }
      else if (p.type === DynPropertyType.RADIO) {
        p.value = this.state.data[`${p.id}`] as string;
      }
      else if (p.type === DynPropertyType.COMBOBOX) {
        p.value = this.state.data[`${p.id}`] as string;
      }
      else if (p.type === DynPropertyType.FILE || p.type === DynPropertyType.IMAGE) {
        p.value = this.state.data[`${p.id}`] as string;
      }
      else if (p.type === DynPropertyType.CHECKBOX) {
        p.value = CONSTANTS.STR_EMPTY;
        const array: string[] = [];
        const data: string[] = this.separateItems(p);
        data.forEach((d: string): void => {
          const selected: boolean = this.state.data[`${p.id}${d}`] as boolean;
          if (selected) {
            array.push(d);
          }
        });
        p.value = array.join(',');
      }
      
    });
    
    return process;
  };
  
  private setText = (p: DynProperty, text: string): void => {
    let data = this.state.data;
    data[`${p.id}`] = text;
    this.setState({data: data});
  };
  
  private setCombobox = (p: DynProperty, _index: number, value: string): void => {
    let data = this.state.data;
    data[`${p.id}`] = value;
    this.setState({data: data});
  };
  
  
  private genText = (p: DynProperty): any => {
    return (
      <Row style={{height: Styles.styles.row.heightControl}}>
        <Item inlineLabel style={{flex: 1}}>
          <Label>{p.title}</Label>
          <Input
            value={this.state.data[`${p.id}`]}
            onChangeText={(text: string) => {
              this.setText(p, text)
            }}
          />
          <Icon style={Styles.styleSheet.icon} name='create'/>
        </Item>
      </Row>
    );
  };
  
  private separateItems = (p: DynProperty): string[] => {
    return p.items.split(',');
  };
  
  private setCheckBox = (p: DynProperty, title: string, value: boolean): void => {
    let data = this.state.data;
    data[`${p.id}${title}`] = value;
    this.setState({data: data});
  };
  
  private genCheckboxItem = (p: DynProperty, title: string, _index: number): any => {
    const value: boolean = this.state.data[`${p.id}${title}`] as boolean;
    return (
      <Button iconLeft transparent onPress={() => this.setCheckBox(p, title, !value)}>
        <Icon name={value ? 'checkbox' : 'square'} style={{color: Styles.color.Icon}}/>
        <Text uppercase={false} style={{color: Styles.color.Text}}>{title}</Text>
      </Button>
    );
  };
  
  private genCheckbox = (p: DynProperty): any => {
    
    const data: string[] = this.separateItems(p);
    if (data.length > 2) {
      return (
        <Row style={{height: (data.length) * Styles.styles.row.heightControl}}>
          <Grid>
            <Col style={{justifyContent: 'center'}}>
              <Text style={[Styles.styleSheet.label, {alignSelf: 'center', width: '100%'}]}> {p.title}</Text>
            </Col>
            <Col style={{flexDirection: 'column'}}>
              <Grid>
                {data.map((t: string, index: number) => {
                  return <Row>{this.genCheckboxItem(p, t, index)}</Row>;
                })}
              </Grid>
            </Col>
          </Grid>
        </Row>
      );
    } else {
      return (
        <Row style={{height: Styles.styles.row.heightControl}}>
          <Grid>
            <Col style={{flexDirection: 'row'}}>
              <Text style={[Styles.styleSheet.label, {alignSelf: 'center'}]}> {p.title}</Text>
              {data.map((t: string, index: number) => {
                return this.genCheckboxItem(p, t, index);
              })}
            </Col>
          </Grid>
        </Row>
      );
    }
  };
  
  private setRadio = (p: DynProperty, title: string): void => {
    let data = this.state.data;
    data[`${p.id}`] = title;
    this.setState({data: data});
  }
  
  private genRadioItem = (p: DynProperty, title: string, _index: number): any => {
    const value: boolean = (this.state.data[`${p.id}`] as string) === title;
    return (
      <Button iconLeft transparent onPress={() => this.setRadio(p, title)}>
        <Icon name={value ? 'radio-button-on' : 'radio-button-off'} style={{color: Styles.color.Icon}}/>
        <Text uppercase={false} style={{color: Styles.color.Text}}>{title}</Text>
      </Button>
    );
  };
  
  private genRadio = (p: DynProperty): any => {
    const data: string[] = this.separateItems(p);
    if (data.length > 2) {
      return (
        <Row style={{height: (data.length) * Styles.styles.row.heightControl}}>
          <Grid>
            <Col style={{justifyContent: 'center'}}>
              <Text style={[Styles.styleSheet.label, {alignSelf: 'center', width: '100%'}]}> {p.title}</Text>
            </Col>
            <Col style={{flexDirection: 'column'}}>
              <Grid>
                {data.map((t: string, index: number) => {
                  return <Row>{this.genRadioItem(p, t, index)}</Row>;
                })}
              </Grid>
            </Col>
          </Grid>
        </Row>
      );
    } else {
      return (
        <Row style={{height: Styles.styles.row.heightControl}}>
          <Grid>
            <Col style={{flexDirection: 'row'}}>
              <Text style={[Styles.styleSheet.label, {alignSelf: 'center'}]}> {p.title}</Text>
              {data.map((t: string, index: number) => {
                return this.genRadioItem(p, t, index);
              })}
            </Col>
          </Grid>
        </Row>
      );
    }
  };
  
  private pickFile = async (p: DynProperty): Promise<void> => {
    
    DocumentPicker.show({
      filetype: [p.type === DynPropertyType.FILE ? DocumentPickerUtil.pdf() : DocumentPickerUtil.images()],
    }, (error, res) => {
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
      let data = this.state.data;
      data[`${p.id}`] = res.uri;
      let size: number = Math.round(res.fileSize / 1024000);
      let sizeType: string = 'Mb';
      if (res.fileSize < 1024000) {
        size = Math.round(res.fileSize / 1024);
        sizeType = 'Kb';
      }
      
      data[`${p.id}data`] = `${res.type} - ${size} ${sizeType}`;
      this.setState({data: data});
    });
  };
  
  private showCombobox = (p: DynProperty): void => {
    const data: string[] = p.items.split(',');
    data.push('Cancel');
    ActionSheet.show(
      {
        options: data,
        cancelButtonIndex: data.length - 1,
        title: p.title
      },
      (buttonIndex: number) => {
        if (buttonIndex < data.length - 1) {
          this.setCombobox(p, buttonIndex, data[buttonIndex]);
        }
      }
    );
  };
  
  private genCombobox = (p: DynProperty): any => {
    if (p.type !== DynPropertyType.COMBOBOX && p.type !== DynPropertyType.RADIO) {
      return null;
    }
    return (
      <Row style={{height: Styles.styles.row.heightControl}}>
        <Grid>
          <Col size={1} style={{justifyContent: 'center'}}>
            <Text style={[Styles.styleSheet.label, {alignSelf: 'center', width: '100%'}]}> {p.title}</Text>
          </Col>
          <Col size={2}>
            <Button transparent onPress={(_e) => this.showCombobox(p)} iconRight>
              <Text uppercase={false}
                    style={{color: Styles.color.Text}}>{this.state.data[`${p.id}`]}</Text>
              <Icon style={{color: Styles.color.Icon}} name={'arrow-dropdown'}/>
            </Button>
          </Col>
        </Grid>
      </Row>
    );
  };
  
  private genFile = (p: DynProperty): any => {
    if (p.type !== DynPropertyType.FILE && p.type !== DynPropertyType.IMAGE) {
      return null;
    }
    const uri: string = this.state.data[`${p.id}`] || CONSTANTS.STR_EMPTY;
    let link = uri;
    if (uri !== CONSTANTS.STR_EMPTY && !uri.startsWith('content')) {
      link = this.businessService.getLink(uri);
    }
    const height: number = p.type === DynPropertyType.IMAGE && uri !== CONSTANTS.STR_EMPTY
      ? Styles.styles.row.heightThumbnail
      : Styles.styles.row.heightControl
    const row: any = (
      <Row
        style={{height: height}}>
        <Grid>
          <Row style={{height: Styles.styles.row.heightControl}}>
            <Button transparent block onPress={async (_e) => await this.pickFile(p)} iconRight>
              <Text uppercase={false}
                    style={{color: Styles.color.Text}}>{p.title + ': '}</Text>
              <Text uppercase={false}
                    style={{color: Styles.color.Text}}>
                {
                  uri === CONSTANTS.STR_EMPTY ?
                    (p.type === DynPropertyType.FILE ? 'Pick a file ...' : 'Pick an image ...')
                    : (
                      !uri.startsWith('content') ?
                        (p.type === DynPropertyType.IMAGE ? 'Image file' : 'PDF file')
                        : this.state.data[`${p.id}data`]
                    )
                }
              </Text>
              <Icon style={{color: Styles.color.Icon}} name={p.type === DynPropertyType.FILE ? 'attach' : 'images'}/>
            </Button>
            {
              link !== CONSTANTS.STR_EMPTY && p.type === DynPropertyType.FILE
              && <Button transparent><Text uppercase={false} style={{color: Styles.color.Link}}>Link</Text></Button>
            }
          </Row>
          <Row style={{justifyContent: 'center', alignItems: 'stretch'}}>
            <Image source={{uri: link}} style={{flex: 1}} resizeMode={'contain'}/>
          </Row>
        </Grid>
      </Row>
    );
    return row;
  };
  
  render() {
    const controls: any[] = this.state.item.dynProperties.map((p: DynProperty) => {
      if (p.type === DynPropertyType.TEXT) {
        return this.genText(p);
      } else if (p.type === DynPropertyType.COMBOBOX) {
        return this.genCombobox(p);
      } else if (p.type === DynPropertyType.CHECKBOX) {
        return this.genCheckbox(p);
      } else if (p.type === DynPropertyType.RADIO) {
        return this.genRadio(p);
      }
    });
    const files: any = this.state.item.dynProperties.map((p: DynProperty) => {
      if (p.type === DynPropertyType.FILE) {
        return this.genFile(p);
      }
    });
    const images: any = this.state.item.dynProperties.map((p: DynProperty) => {
      if (p.type === DynPropertyType.IMAGE) {
        return this.genFile(p);
      }
    });
    
    return (
      <BaseScreen {...{...this.props, componentDidFocus: this.componentDidFocus, isLoading: this.state.isLoading}}>
        <Content>
          <Grid style={{flex: 1}}>
            <Row style={{height: 70}}>
              <Grid>
                <Row>
                </Row>
                <Row style={{height: Styles.styles.row.heightControl}}>
                  <Grid>
                    <Col>
                      <Button onPress={this.doneTask} iconLeft full bordered light>
                        <Icon name={'checkmark-circle'} style={{color: Styles.color.Done}}/>
                        <Text uppercase={false} style={{widht: '100%', textAlign: 'center'}}>
                          Close {this.state.item.name}
                        </Text>
                      </Button>
                    </Col>
                    <Col style={{width: 90, flexDirection: 'row', justifyContent: 'center'}}>
                      <Button onPress={this.workerClick} badge={true} style={{width: 70}}>
                        <Icon name={'person'} style={{color: Styles.color.Icon, fontSize: 50}}/>
                        {this.state.item.workers.length > 0 &&
                        <Badge style={{backgroundColor: Styles.color.Background, marginLeft: -30, marginTop: -10}}>
                          <Text style={{color: Styles.color.Text}}>{this.state.item.workers.length}</Text>
                        </Badge>}
                      </Button>
                    </Col>
                  </Grid>
                </Row>
              </Grid>
            </Row>
            <Row style={{height: 50}}></Row>
            <Row>
              <ScrollView>
                <Grid>
                  {controls}
                  {files}
                  {images}
                </Grid>
              </ScrollView>
            </Row>
          </Grid>
        </Content>
      </BaseScreen>
    );
  }
}
