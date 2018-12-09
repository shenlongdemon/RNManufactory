import * as React from 'react';
import {Col, Grid, Row} from 'react-native-easy-grid';
import BaseScreen from '../../basescreen';
import {Image, ScrollView, TouchableOpacity} from 'react-native';
import {
  CONSTANTS,
  DynProperty,
  DynPropertyType,
  FactoryInjection,
  IBusinessService,
  PUBLIC_TYPES,
  Task
} from 'business_core_app_react';
import {PARAMS} from '../../../common/index';
import {Button, Text, Icon, ActionSheet, Item, Input, Label} from 'native-base';
import * as Styles from '../../../stylesheet';
// import ImagePicker from 'react-native-image-picker';
import * as IMAGE from '../../../assets';
// import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
// import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';

interface Props {
}

interface State {
  item: Task;
  isLoading: boolean;
  data: any;
}

export default class TaskDetailScreen extends BaseScreen<Props, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props: Props) {
    super(props);
    const task: Task | null = this.getParam<Task>(PARAMS.ITEM, null);
    
    const d: any = {};
    task!.properties.forEach((p: DynProperty) => {
      const data: string[] = p.items.split(',');
      if (p.type === DynPropertyType.CHECKBOX) {
        data.forEach((t: string, i: number) => {
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
        d[`${p.id}uri`] =
          d[`${p.id}uri`] ||
          (p.value !== CONSTANTS.STR_EMPTY ? this.businessService.getLinkImage(p.value) : CONSTANTS.STR_EMPTY);
      }
      else if (p.type === DynPropertyType.FILE) {
        d[`${p.id}uri`] = d[`${p.id}uri`] || (p.value !== CONSTANTS.STR_EMPTY ? this.businessService.getLinkImage(p.value) : CONSTANTS.STR_EMPTY);
      }
    });
    
    this.state = {
      item: task!,
      isLoading: false,
      data: d
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.pickImage = this.pickImage.bind(this);
  }
  
  private save = async (): Promise<void> => {
    alert(JSON.stringify(this.state.data));
  };
  
  private setCheckbox = (p: DynProperty, name: string): void => {
    let data = this.state.data;
    const value: boolean = (data[`${p.id}${name}`] || false) as boolean;
    data[`${p.id}${name}`] = !value;
    
    let str: string[] = [];
    p.items.split(',').forEach((t: string, _index: number) => {
      const isChecked: boolean = (data[`${p.id}${t}`] || false) as boolean;
      if (isChecked) {
        str.push(t);
      }
    });
    
    data[`${p.id}`] = str.join(', ');
    
    this.setState({data: data});
  };
  
  private setRadio = (p: DynProperty, label: string): void => {
    let data = this.state.data;
    data[`${p.id}`] = label;
    this.setState({data: data});
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
        <Item floatingLabel style={{flex: 1}}>
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
  
  private genCheckboxItem = (p: DynProperty, title: string): any => {
    return null;
  };
  
  private genCheckbox = (p: DynProperty): any => {
    const label: any = (
      <Row style={Styles.styleSheet.rowControl}>
        <Text style={Styles.styleSheet.label}> {p.title}</Text>
      </Row>
    );
    const data: string[] = p.items.split(',');
    if (data.length > 2) {
      return (
        <Row style={{height: (data.length + 1) * Styles.styleSheet.rowControl}}>
          <Grid>
            {label}
            {data.map((t: string) => {
              return <Row>{this.genCheckboxItem(p, t)}</Row>;
            })}
          </Grid>
        </Row>
      );
    } else {
      return (
        <Row style={{height: 2 * Styles.styleSheet.rowControl}}>
          <Grid>
            {label}
            <Row style={Styles.styleSheet.rowControl}>
              <Grid>
                {data.map((t: string) => {
                  return <Col>{this.genCheckboxItem(p, t)}</Col>;
                })}
              </Grid>
            </Row>
          </Grid>
        </Row>
      );
    }
  };
  
  private pickImage = (p: DynProperty): void => {
  }
  private pickFile = (p: DynProperty): void => {
    // DocumentPicker.show({
    //   filetype: [DocumentPickerUtil.allFiles()],
    // },(error,res) => {
    //   // Android
    //   console.log(
    //     res.uri,
    //     res.type, // mime type
    //     res.fileName,
    //     res.fileSize
    //   );
    //   let data = this.state.data;
    //   data[`${p.id}uri`] = res.uri;
    //   data[`${p.id}data`] = res.data;
    //
    //   this.setState({data: data});
    // });
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
      <Row style={Styles.styleSheet.rowControl}>
        
        <Button transparent block onPress={(_e) => this.showCombobox(p)} iconRight>
          <Text uppercase={false}
                style={{color: Styles.color.Text}}>{p.title + ': '}</Text>
          <Text uppercase={false}
                style={{color: Styles.color.Text}}>{this.state.data[`${p.id}`]}</Text>
          <Icon style={{color: Styles.color.Icon}} name={'arrow-dropdown'}/>
        </Button>
      
      </Row>
    );
  };
  
  private genFile = (p: DynProperty): any => {
    if (p.type !== DynPropertyType.FILE) {
      return null;
    }
    let useData: boolean = false;
    const data: any = this.state.data[`${p.id}data`];
    let uri: string = this.state.data[`${p.id}uri`] || CONSTANTS.STR_EMPTY;
    if (uri !== CONSTANTS.STR_EMPTY && !uri.startsWith('http')) {
      uri = CONSTANTS.STR_EMPTY;
      useData = true;
    }
    return (
      <Row style={Styles.styleSheet.rowControl}>
        <Button transparent block onPress={(_e) => this.pickFile(p)} iconRight>
          <Text uppercase={false}
                style={{color: Styles.color.Text}}>{p.title + ': '}</Text>
          <Text uppercase={false}
                style={{color: Styles.color.Text}}>
            {this.state.data[`${p.id}uri`] === CONSTANTS.STR_EMPTY ? 'Pick a file ...' : this.state.data[`${p.id}uri`]}</Text>
          <Icon style={{color: Styles.color.Icon}} name={'attach'}/>
        </Button>
      </Row>
    );
  };
  
  private genImages = (p: DynProperty): any => {
    if (p.type !== DynPropertyType.IMAGE) {
      return null;
    }
    let useData: boolean = false;
    const data: any = this.state.data[`${p.id}data`];
    let uri: string = this.state.data[`${p.id}uri`] || CONSTANTS.STR_EMPTY;
    if (uri !== CONSTANTS.STR_EMPTY && !uri.startsWith('http')) {
      uri = CONSTANTS.STR_EMPTY;
      useData = true;
    }
    
    return (
      
      <Row style={{height: 100}}>
        
        <Text style={Styles.styleSheet.label}> {p.title}</Text>
        <TouchableOpacity style={{height: 100}} onPress={() => this.pickImage(p)}>
          <Image
            style={{height: 100, width: 100}}
            resizeMode={'contain'}
            source={
              useData
                ? {uri: `data:image/png;base64,${data}`}
                : uri === CONSTANTS.STR_EMPTY
                ? IMAGE.photo
                : {uri: uri}
            }
          />
        </TouchableOpacity>
      </Row>
    );
  };
  
  render() {
    const controls: any[] = this.state.item.properties.map((p: DynProperty) => {
      if (p.type === DynPropertyType.TEXT) {
        return this.genText(p);
      } else if (p.type === DynPropertyType.COMBOBOX) {
        return this.genCombobox(p);
      } else if (p.type === DynPropertyType.CHECKBOX) {
        return this.genCheckbox(p);
      } else if (p.type === DynPropertyType.RADIO) {
        return this.genCombobox(p);
      }
    });
    
    const files: any = this.state.item.properties.map((p: DynProperty) => {
      if (p.type === DynPropertyType.FILE) {
        return this.genFile(p);
      }
    });
    const images: any = this.state.item.properties.map((p: DynProperty) => {
      if (p.type === DynPropertyType.IMAGE) {
        return this.genImages(p);
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
