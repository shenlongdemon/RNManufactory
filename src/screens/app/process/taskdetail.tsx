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
  Process,
  PUBLIC_TYPES,
  UpdateProcessDto
} from 'business_core_app_react';
import {PARAMS} from '../../../common';
import {ActionSheet, Button, Content, Icon, Input, Item, Label, Text} from 'native-base';
import * as Styles from '../../../stylesheet';
// import ImagePicker from 'react-native-image-picker';
// import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import Utils from "../../../common/utils";

interface Props {
}

interface State {
  item: Process;
  materialId: string;
  isLoading: boolean;
  data: any;
}

interface Param {
  process: Process,
  materialId: string;
}

export default class TaskDetailScreen extends BaseScreen<Props, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  private processService: IProcessService = FactoryInjection.get<IProcessService>(PUBLIC_TYPES.IProcessService);
  
  constructor(props: Props) {
    super(props);
    const param: Param | null = this.getParam<Param>(PARAMS.ITEM, null);
    const d: any = {};
    param!.process.dynProperties.forEach((p: DynProperty) => {
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
    
    this.state = {
      item: param!.process,
      materialId: param!.materialId,
      isLoading: false,
      data: d
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.pickFile = this.pickFile.bind(this);
    
  }
  
  private save = async (): Promise<void> => {
    // this.setState({isLoading: true});
    const process: Process = this.buildUpProcess();
    const dto: UpdateProcessDto = await this.processService.updateProcessDynProperties(this.state.materialId, process.id, process.dynProperties);
    this.setState({isLoading: false});
    if (dto.isSuccess) {
      this.goBack();
    }
    else {
      Utils.showErrorToast(dto.message);
    }
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
  }
  
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
  
  componentDidFocus = async (): Promise<void> => {
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
  }
  
  private setCheckBox = (p: DynProperty, title: string, value: boolean): void => {
    let data = this.state.data;
    data[`${p.id}${title}`] = value;
    this.setState({data: data});
  }
  
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
            <Row style={{height: 150}}>
              <Grid>
                <Row>
                  <Button onPress={this.save}>
                    <Text>Save</Text>
                  </Button>
                </Row>
                <Row style={Styles.styleSheet.rowControl}/>
              </Grid>
            </Row>
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
