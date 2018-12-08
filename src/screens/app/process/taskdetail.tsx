import * as React from 'react';
import {Col, Grid, Row} from 'react-native-easy-grid';
import BaseScreen from '../../basescreen';
import {Image, ScrollView, Text, TouchableOpacity} from 'react-native';
import {
  CONSTANTS,
  DynProperty,
  DynPropertyType,
  FactoryInjection,
  IBusinessService,
  PUBLIC_TYPES,
  Task
} from 'business_core_app_react';
import {PARAMS} from "../../../common/index";
import * as Styles from "../../../stylesheet";
import ImagePicker from 'react-native-image-picker';
import * as IMAGE from "../../../assets";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';


interface Props {

}

interface State {
  item: Task;
  isLoading: boolean;
  data: any
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
      }
      else if (p.type === DynPropertyType.TEXT) {
        d[`${p.id}`] = d[`${p.id}`] || p.value;
      }
      else if (p.type === DynPropertyType.RADIO) {
        d[`${p.id}`] = d[`${p.id}`] || (p.value !== CONSTANTS.STR_EMPTY ? p.value : data[0]);
      }
      else if (p.type === DynPropertyType.COMBOBOX) {
        d[`${p.id}`] = d[`${p.id}`] || (p.value !== CONSTANTS.STR_EMPTY ? p.value : data[0]);
      }
      else if (p.type === DynPropertyType.IMAGE) {
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
  }
  
  private setCheckbox = (p: DynProperty, name: string): void => {
    let data = this.state.data;
    const value: boolean = (data[`${p.id}${name}`] || false ) as boolean;
    data[`${p.id}${name}`] = !value;
  
    let str: string[] = [];
    p.items.split(',').forEach((t: string, i: number) => {
      const isChecked: boolean = (data[`${p.id}${t}`] || false ) as boolean;
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
  
  private setCombobox = (p: DynProperty, index: number, value: string): void => {
    let data = this.state.data;
    data[`${p.id}`] = value;
    this.setState({data: data});
  };
  
  componentDidFocus = async (): Promise<void> => {
  }
  
  private genText = (p: DynProperty): any => {
    return (<Row style={Styles.styleSheet.rowControl}>
        <Grid>
          <Col>
            <Hoshi
              {...Styles.props.field}
              label={p.title}
              onChangeText={(text) => {
                this.setText(p, text)
              }}
              value={this.state.data[`${p.id}`]}
            />
          </Col>
        </Grid>
      </Row>
    )
  }
  
  private genCheckboxItem = (p: DynProperty, title: string): any => {
    return (
      <CheckBox
        containerStyle={{backgroundColor: Styles.color.Background, borderColor: Styles.color.Background}}
        title={title}
        textStyle={Styles.styleSheet.label}
        checked={(this.state.data[`${p.id}${title}`] || false) as boolean}
        onPress={() => {
          this.setCheckbox(p, title);
        }}
      />
    )
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
        <Row style={{height: (data.length + 1) * (Styles.styleSheet.rowControl)}}>
          <Grid>
            {
              label
            }
            {
              data.map((t: string) => {
                return (
                  <Row>
                    {
                      this.genCheckboxItem(p, t)
                    }
                  </Row>
                );
              })
            }
          </Grid>
        </Row>
      );
    }
    else {
      return (
        <Row style={{height: 2 * (Styles.styleSheet.rowControl)}}>
          <Grid>
            
            {label}
            <Row style={Styles.styleSheet.rowControl}>
              <Grid>
                {
                  data.map((t: string) => {
                    return (
                      <Col>
                        {
                          this.genCheckboxItem(p, t)
                        }
                      </Col>
                    );
                  })
                }
              </Grid>
            </Row>
          </Grid>
        </Row>
      )
    }
    
  }
  
  private genRadio = (p: DynProperty): any => {
    const label: any = (
      <Row style={Styles.styleSheet.rowControl}>
        <Text style={Styles.styleSheet.label}> {p.title}</Text>
      </Row>
    );
    const data: { label: string, value: number }[] = p.items.split(',').map((t: string, index: number) => {
      return {label: t, value: index}
    });
    
    return (
      <Row style={{height: (data.length > 2 ? data.length : 2) * (Styles.styleSheet.rowControl)}}>
        <Grid>
          {
            label
          }
          <Row>
            <RadioForm
              formHorizontal={data.length <= 2}
              animation={true}
            >
              {
                data.map((obj, i) => {
                  return (
                    <RadioButton labelHorizontal={true} key={i} style={{width: 200}}>
                      <RadioButtonInput
                        obj={obj}
                        index={i}
                        isSelected={this.state.data[`${p.id}`] === obj.label}
                        onPress={() => {
                          this.setRadio(p, obj.label);
                        }}
                        borderWidth={1}
                        buttonInnerColor={'#e74c3c'}
                        buttonOuterColor={'#2196f3'}
                        buttonSize={20}
                        buttonOuterSize={20}
                        buttonStyle={{}}
                        buttonWrapStyle={{marginLeft: 10}}
                      />
                      <RadioButtonLabel
                        obj={obj}
                        index={i}
                        labelHorizontal={true}
                        onPress={() => {
                          this.setRadio(p, obj.label);
                        }}
                        labelStyle={{fontSize: 20, color: '#2ecc71'}}
                        labelWrapStyle={{}}
                      />
                    </RadioButton>
                  )
                })}
            
            </RadioForm>
            
            
            {/*<RadioForm*/}
            {/*radio_props={data}*/}
            {/*initial={0}*/}
            {/*formHorizontal={data.length <= 2}*/}
            {/*labelHorizontal={true}*/}
            {/*animation={true}*/}
            {/*onPress={(value) => {}}*/}
            {/*labelColor={Styles.color.Text}*/}
            {/*style={[Styles.styleSheet.label, {width: 100}]}*/}
            {/*buttonColor={Styles.color.Text}*/}
            {/*selectedLabelColor={Styles.color.Text}*/}
            {/*/>*/}
          </Row>
        </Grid>
      </Row>
    );
  }
  
  
  private pickImage = (p: DynProperty): void => {
    const options = {
      title: p.title,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    
    ImagePicker.showImagePicker(options, (response: {
      customButton: string;
      didCancel: boolean;
      error: string;
      data: string;
      uri: string;
      origURL?: string;
      isVertical: boolean;
      width: number;
      height: number;
      fileSize: number;
      type?: string;
      fileName?: string;
      path?: string;
      latitude?: number;
      longitude?: number;
      timestamp?: string;
    }) => {
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
        let data = this.state.data;
        data[`${p.id}uri`] = response.uri;
        data[`${p.id}data`] = response.data;
        this.setState({data: data});
      }
    });
    
  }
  
  private pickFile = (p: DynProperty): void => {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()],
    },(error,res) => {
      // Android
      console.log(
        res.uri,
        res.type, // mime type
        res.fileName,
        res.fileSize
      );
      let data = this.state.data;
      data[`${p.id}uri`] = res.uri;
      data[`${p.id}data`] = res.data;
      
      this.setState({data: data});
    });
    
  }
  
  private genCombobox = (p: DynProperty): any => {
    if (p.type !== DynPropertyType.COMBOBOX) {
      return null;
    }
    const data: string[] = p.items.split(',');
    
    return (<Row style={Styles.styleSheet.rowControl}>
        <Grid>
          <Col>
            <ModalDropdown
              options={data}
              defaultValue={this.state.data[`${p.id}`]}
              textStyle={Styles.styleSheet.label}
              onSelect={(idx, value) => this.setCombobox(p, idx, value)}
            />
          </Col>
        </Grid>
      </Row>
    )
  }
  
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
    return (<Row style={{height: 100}}>
        <Text style={Styles.styleSheet.label}> {p.title}</Text>
        <TouchableOpacity style={{height: 100}} onPress={() => this.pickFile(p)}>
          <Image style={{height: 100, width: 100}} resizeMode={'contain'}
                 source={IMAGE.photo}
          />
        </TouchableOpacity>
      </Row>
    );
  }
  
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
    
    return (<Row style={{height: 100}}>
        <Text style={Styles.styleSheet.label}> {p.title}</Text>
        <TouchableOpacity style={{height: 100}} onPress={() => this.pickImage(p)}>
          <Image style={{height: 100, width: 100}} resizeMode={'contain'}
                 source={useData ? {uri: `data:image/png;base64,${data}`} : (uri === CONSTANTS.STR_EMPTY ? IMAGE.photo : {uri: uri})}
          />
        </TouchableOpacity>
      </Row>
    );
  }
  
  render() {
    const controls: any[] = this.state.item.properties.map((p: DynProperty) => {
      if (p.type === DynPropertyType.TEXT) {
        return this.genText(p);
      }
      else if (p.type === DynPropertyType.COMBOBOX) {
        return this.genCombobox(p);
      }
      else if (p.type === DynPropertyType.CHECKBOX) {
        return this.genCheckbox(p);
      }
      else if (p.type === DynPropertyType.RADIO) {
        return this.genRadio(p);
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
                  <Button title={'Save'} onPress={this.save}/>
                </Row>
                <Row style={Styles.styleSheet.rowControl}>
                
                </Row>
              </Grid>
            </Row>
            {
              controls
            }
            {
              files
            }
            
            {
              images
            }
          
          </Grid>
        </ScrollView>
      </BaseScreen>
    );
  }
}