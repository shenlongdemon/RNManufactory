import BasesSreen from "../../basescreen";
import {Icon, Tab, TabHeading, Tabs, Text} from "native-base";
import * as React from "react";
import * as Styles from "../../../stylesheet";
import InfoItemTab from "./itemtabs/infoitemtab";
import {
  CONSTANTS,
  FactoryInjection,
  IBusinessService,
  Item,
  ITEM_ACTION,
  ItemDetailDto,
  PUBLIC_TYPES
} from "business_core_app_react";
import {PARAMS} from "../../../common";
import AttachFileItemTab from "./itemtabs/AttachFileItemTab";
import HistoryItemTab from "./itemtabs/HistoryItemTab";
import {ROUTE} from "../../routes";

interface Props {
}

interface State {
  isLoading: boolean;
  item: Item | null;
  itemId: string;
}

export default class ItemDetail extends BasesSreen<Props, State> {
  static navigationOptions = ({}) => {
    return {
      title: 'Information'
    };
  };
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props) {
    super(props);
    const item: Item | null = this.getParam<Item>(PARAMS.ITEM, null);
    this.state = {
      isLoading: false,
      item: null,
      itemId: item!.id,
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.clickAddMaintain = this.clickAddMaintain.bind(this);
    this.navigateForAction = this.navigateForAction.bind(this);
  }
  
  componentWillMount = async (): Promise<void> => {
  };
  
  componentDidMount = async (): Promise<void> => {
  
  };
  
  componentWillUnmount = async (): Promise<void> => {
  };
  
  private readonly navigateForAction = async (action: ITEM_ACTION, newItem: Item): Promise<void> => {
    if (action === ITEM_ACTION.PUBLISH || action === ITEM_ACTION.CANCEL) {
      this.goBack();
    }
    else if (action === ITEM_ACTION.BUY) {
      const param: any = {};
      param[PARAMS.ITEM] = {item: newItem};
      this.navigate(ROUTE.APP.MANUFACTORY.GOODSES.PAYMENT, param)
    }
    else {
      const param: any = {};
      param[PARAMS.ITEM] = {code: newItem.code};
      this.navigate(ROUTE.APP.SHARE.QRCODEDISPLAY, param)
    }
  };
  
  private readonly componentDidFocus = async (): Promise<void> => {
    await this.loadData();
  };
  
  private loadData = async (): Promise<void> => {
    await this.setState({isLoading: true});
    const dto: ItemDetailDto = await this.businessService.getItem(this.state.itemId);
    await this.setState({isLoading: false});
    if (!dto.isSuccess) {
      this.goBack();
      return;
    }
    await this.setState({item: dto.item!});
  };
  
  private readonly clickAddMaintain = async (): Promise<void> => {
    const data: any = {
      materialId: CONSTANTS.STR_EMPTY,
      processId: CONSTANTS.STR_EMPTY,
      itemId: this.state.item!.id
    };
    const param: any = {};
    param[PARAMS.ITEM] = data;
    this.navigate(ROUTE.APP.MANUFACTORY.MATERIALS.ITEM.PROCESS.TASK.WORKERS.ACTIVITIES.ADD_ACTIVITY, param)
  };
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        {
          this.state.item &&
          <Tabs locked={true} tabBarBackgroundColor={Styles.color.Background}
                tabBarUnderlineStyle={{borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.3)'}}>
            {/*
             // @ts-ignore */}
            <Tab style={{backgroundColor: Styles.color.Background}}
                 heading={<TabHeading><Icon name="information-circle"/><Text>Info</Text></TabHeading>}>
              <InfoItemTab item={this.state.item} navigateForAction={this.navigateForAction}/>
            </Tab>
            {/*
             // @ts-ignore */}
            <Tab style={{backgroundColor: Styles.color.Background}}
                 heading={<TabHeading><Icon name={'pulse'}/><Text>Histories</Text></TabHeading>}>
              <HistoryItemTab
                navigateToActivity={(param: any) => {
                  this.navigate(ROUTE.APP.MANUFACTORY.ACTIVITIES.ITEM.DEFAULT, param);
                }}
                clickAddMaintain={this.clickAddMaintain} item={this.state.item}/>
            </Tab>
            {/*
             // @ts-ignore */}
            <Tab style={{backgroundColor: Styles.color.Background}}
                 heading={<TabHeading><Icon name={'attach'}/><Text>Files</Text></TabHeading>}>
              <AttachFileItemTab item={this.state.item}/>
            </Tab>
          </Tabs>}
      </BasesSreen>
    );
  }
}