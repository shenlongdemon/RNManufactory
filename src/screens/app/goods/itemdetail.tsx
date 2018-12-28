import BasesSreen from "../../basescreen";
import {Tabs, TabHeading, Tab, Icon, Text} from "native-base";
import * as React from "react";
import * as Styles from "../../../stylesheet";
import InfoItemTab from "./itemtabs/infoitemtab";
import {
  FactoryInjection,
  IBusinessService,
  Item, PUBLIC_TYPES,
  ItemDetailDto
} from "business_core_app_react";
import {PARAMS} from "../../../common";

interface Props {
}

interface State {
  isLoading: boolean;
  item: Item
}

export default class ItemDetail extends BasesSreen<Props, State> {
  static navigationOptions = ({}) => {
    return {
      title: ''
    };
  };
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props) {
    super(props);
    const item: Item | null = this.getParam<Item>(PARAMS.ITEM, null);
    this.state = {
      isLoading: false,
      item: item!
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    
  }
  
  componentWillMount = async (): Promise<void> => {
  }
  
  componentDidMount = async (): Promise<void> => {
  
  }
  
  componentWillUnmount = async (): Promise<void> => {
  }
  
  private componentDidFocus = async (): Promise<void> => {
    await this.loadData();
  }
  
  private loadData = async (): Promise<void> => {
    await this.setState({isLoading: true});
    const dto: ItemDetailDto = await this.businessService.getItem(this.state.item.id);
    await this.setState({isLoading: false});
    if (!dto.isSuccess) {
      this.goBack();
      return;
    }
    await this.setState({item: dto.item!});
  };
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        {
          this.state.item &&
          <Tabs tabBarBackgroundColor={Styles.color.Background} tabBarUnderlineStyle={{borderBottomWidth:1, borderColor:'rgba(255,255,255,0.3)'}}>
            <Tab style={{backgroundColor:Styles.color.Background}}
                 heading={<TabHeading><Icon name="information-circle"/><Text>Info</Text></TabHeading>}>
              <InfoItemTab item={this.state.item}/>
            </Tab>
            <Tab style={{backgroundColor:Styles.color.Background}} heading={<TabHeading><Icon name={'pulse'}/><Text>Maintains</Text></TabHeading>}>
            
            </Tab>
            
            <Tab style={{backgroundColor:Styles.color.Background}} heading={<TabHeading><Icon name={'attach'}/><Text>Files</Text></TabHeading>}>
            
            </Tab>
          </Tabs>}
      </BasesSreen>
    );
  }
}