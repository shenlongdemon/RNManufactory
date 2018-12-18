import * as React from 'react';
import {Col, Grid, Row} from 'react-native-easy-grid';
import BaseScreen from '../../basescreen';
import {ScrollView} from 'react-native';
import {
  CONSTANTS,
  DynProperty,
  DynPropertyType,
  FactoryInjection,
  IBusinessService,
  PUBLIC_TYPES,
  Process
} from 'business_core_app_react';
import {PARAMS} from '../../../common';
import {ActionSheet, Button, Icon, Input, Item, Label, Text, Thumbnail} from 'native-base';
import * as Styles from '../../../stylesheet';
// import ImagePicker from 'react-native-image-picker';
// import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';

interface Props {
}

interface State {
  item: Process;
  isLoading: boolean;
  data: any;
}

export default class TaskDetailScreen extends BaseScreen<Props, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props: Props) {
    super(props);
    const task: Process | null = this.getParam<Process>(PARAMS.ITEM, null);
    
    const d: any = {};
    task!.dynProperties.forEach((p: DynProperty) => {
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
        d[`${p.id}`] =
          d[`${p.id}`] ||
          (p.value !== CONSTANTS.STR_EMPTY ? this.businessService.getLinkImage(p.value) : CONSTANTS.STR_EMPTY);
      }
      else if (p.type === DynPropertyType.FILE) {
        d[`${p.id}`] = d[`${p.id}`] || (p.value !== CONSTANTS.STR_EMPTY ? this.businessService.getLinkImage(p.value) : CONSTANTS.STR_EMPTY);
      }
    });
    
    this.state = {
      item: task!,
      isLoading: false,
      data: d
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.pickFile = this.pickFile.bind(this);
    
  }
  
  private save = async (): Promise<void> => {
    alert(JSON.stringify(this.state.data));
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
  
  componentDidFocus = async (): Promise<void> => {
  };
  
  private genText = (p: DynProperty): any => {
    return (
      <Row style={Styles.styleSheet.rowInput}>
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
    
    // try {
    //   const res = await DocumentPicker.show({
    //     type: [DocumentPickerUtil.allFiles()]
    //   })
    //   alert(JSON.stringify(res));
    // }
    // catch (e) {
    //   alert('error' + e);
    //
    // }
    
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
      let size : number = Math.round(res.fileSize / 1024000);
      let sizeType : string = 'Mb';
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
            <Button transparent  onPress={(_e) => this.showCombobox(p)} iconRight>
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
    
    const row: any = (
      <Row
        style={(p.type === DynPropertyType.IMAGE && uri !== CONSTANTS.STR_EMPTY ? Styles.styleSheet.rowThumbnail : Styles.styleSheet.rowControl)}>
        <Grid>
          <Row style={Styles.styleSheet.rowControl}>
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
          </Row>
          <Row style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
            <Thumbnail square large source={{uri: uri}}/>
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
        <ScrollView>
          <Grid>
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
            {controls}
            {files}
            {images}
          </Grid>
        </ScrollView>
      </BaseScreen>
    );
  }
}
