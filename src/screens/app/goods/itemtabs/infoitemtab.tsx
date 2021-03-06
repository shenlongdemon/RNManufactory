import {Card, CardItem, DeckSwiper, Grid, Row, Text, View} from "native-base";
import * as React from "react";
import {
  CodeDescriptionDto,
  CONSTANTS,
  DynProperty,
  FactoryInjection,
  IBusinessService,
  IItemService,
  Item,
  ITEM_ACTION,
  ItemAction,
  ItemActionDto,
  Process,
  PUBLIC_TYPES
} from "business_core_app_react";
import * as Styles from "../../../../stylesheet";
import {Image, ScrollView, TouchableHighlight, TouchableOpacity} from 'react-native';
import QRCode from "react-native-qrcode-svg";
import * as IMAGE from "../../../../assets";

interface Props {
  item: Item;
  navigateForAction: (action: ITEM_ACTION, newItem: Item) => void;
}


interface State {
  isLoading: boolean;
  itemAction: {
    action: ITEM_ACTION,
    text: string,
    color: string
  };
}

export default class InfoItemTab extends React.Component<Props, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  private itemService: IItemService = FactoryInjection.get<IItemService>(PUBLIC_TYPES.IItemService);
  
  constructor(props) {
    super(props);
    this.doItemAction = this.doItemAction.bind(this);
    this.showCodeDescription = this.showCodeDescription.bind(this);
  
    this.state = {
      isLoading: false,
      itemAction: {
        action: ITEM_ACTION.NONE,
        text: CONSTANTS.STR_EMPTY,
        color: '#ff'
      }
    };
    
  }
  
  componentWillMount = async (): Promise<void> => {
  };
  
  componentDidMount = async (): Promise<void> => {
    const itemAction: ItemAction = await this.businessService.getItemAction(this.props.item);
    await this.setState({itemAction});
  };
  
  componentWillUnmount = async (): Promise<void> => {
  };
  
  private doItemAction = async (): Promise<void> => {
    const action: ITEM_ACTION = this.state.itemAction.action;
    if (action === ITEM_ACTION.BUY) {
      this.props.navigateForAction(action, this.props.item!);
    }
    else {
      await this.setState({isLoading: true});
      const dto: ItemActionDto = await this.itemService.doItemAction(this.props.item.id, action);
      await this.setState({isLoading: false});
      if (dto.isSuccess && dto.item) {
        this.props.navigateForAction(action, dto.item!);
      }
    }
  };
  
  private renderProcess = (p: Process): any[] => {
    const controls: any[] = [];
    controls.push(<Row style={{height: Styles.styles.row.heightControl, flexDirection: 'row'}}>
      <Text style={{color: Styles.color.Text, fontSize: 22}}>{p.name}</Text>
    </Row>);
    const properties: any[] = p.dynProperties.map((d: DynProperty): any => {
      return (
        <Row style={{height: Styles.styles.row.heightControl, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{color: Styles.color.Text}}>{d.title}</Text>
          <Text style={{color: Styles.color.Text, width: '50%'}}>{d.value}</Text>
        </Row>
      );
    });
    controls.push.apply(controls, properties);
    return controls;
  };
  
  private renderMaterial = (): any[] => {
    const controls: any[] = [];
    
    if (this.props.item.material) {
      controls.push(<Row style={{height: Styles.styles.row.heightControl, flexDirection: 'row'}}>
        <Text style={{color: Styles.color.Text, fontSize: 24}}>{this.props.item.material.name}</Text>
      </Row>);
      this.props.item.material.processes.forEach((p: Process): void => {
        controls.push.apply(controls, this.renderProcess(p));
      });
    }
    
    return controls;
  };
  private showCodeDescription = async (code: string): Promise<void> => {
    const dto: CodeDescriptionDto = await this.businessService.getCodeDescription(code);
    alert(dto.description);
  };
  render() {
    const imageLinks: string[] = this.businessService.getImages(this.props.item);
    const updateTime: string = `${this.businessService.toDateString(this.props.item.time)} ${this.businessService.toTimeString(this.props.item.time)}`;
    return (
      <Grid style={{flex: 1, backgroundColor: Styles.color.Background}}>
        <Row style={{height: 150}}>
          <View style={{flex: 1}}>
            <DeckSwiper
              dataSource={imageLinks}
              renderItem={item =>
                <Card style={{
                  elevation: 3,
                  height: 150,
                  backgroundColor: Styles.color.Background,
                  borderColor: 'rgba(255,255,255,0.0)'
                }}>
                  <CardItem cardBody style={{backgroundColor: Styles.color.Background, borderWidth: 0}}>
                    <Image style={{
                      width: '100%',
                      height: 150,
                      resizeMode: 'contain',
                      backgroundColor: Styles.color.Background
                    }} source={{uri: item}}/>
                  </CardItem>
                </Card>
              }
            />
          </View>
        </Row>
        <Row style={{height: 30}}/>
        <Row>
          <ScrollView>
            <Grid>
              <Row style={{height: Styles.styles.row.heightControl, justifyContent: 'center', flexDirection: 'column'}}>
                <Text style={{textAlign: 'center', fontSize: 28}}>{this.props.item.name}</Text>
                <Text style={{textAlign: 'center'}}>(update at {updateTime})</Text>
              </Row>
              <Row style={{height: Styles.styles.row.heightDescription}}>
                <Text style={{marginTop: 20}}>{this.props.item.description}</Text>
              </Row>
  
              <Row style={{flexDirection: 'row', justifyContent: 'center', height: 150}}>
                <TouchableHighlight onPress={ (): void => {alert(this.props.item.id); }}>
  
                <QRCode
                  logo={IMAGE.logo}
                  logoSize={30}
                  size={100}
                  value={this.props.item.id}
                  color={'white'}
                  backgroundColor={'black'}
                />
                </TouchableHighlight>

              </Row>
              
              <Row style={{flexDirection: 'row', justifyContent: 'center', height: 300}}>
                <TouchableHighlight onPress={async (): Promise<void> => { await this.showCodeDescription(this.props.item.code)}}>
                <QRCode
                  logo={IMAGE.logo}
                  logoSize={50}
                  size={250}
                  value={this.props.item.code}
                  color={'white'}
                  backgroundColor={'black'}
                />
                </TouchableHighlight>
              </Row>
  
              {
                this.renderMaterial()
              }
              <Row style={{height: 100}}/>
            </Grid>
          </ScrollView>
          {
            this.state.itemAction.action !== ITEM_ACTION.NONE &&
            <TouchableOpacity style={[Styles.styleSheet.ItemAction, {}]} onPress={this.doItemAction}>
              <Text style={{
                borderRadius: 20,
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: this.state.itemAction.color,
                fontSize: 26
              }}>
                {this.state.itemAction.text}
              </Text>
            </TouchableOpacity>
          }
        </Row>
      </Grid>
    );
  }
}