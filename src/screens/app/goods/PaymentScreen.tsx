import BasesSreen from "../../basescreen";
import {Button, Grid, Icon, Row, Text} from "native-base";
import * as React from "react";
import * as Styles from "../../../stylesheet";
import {FactoryInjection, IItemService, Item, ITEM_ACTION, ItemActionDto, PUBLIC_TYPES} from "business_core_app_react";
import {PARAMS} from "../../../common";
import {ROUTE} from "../../routes";

interface Props {
}

interface State {
  isLoading: boolean;
}

export default class PaymentScreen extends BasesSreen<Props, State> {
  static navigationOptions = ({}) => {
    return {
      title: 'Scanning QR Code'
    };
  };
  private itemService: IItemService = FactoryInjection.get<IItemService>(PUBLIC_TYPES.IItemService);
  
  private item: Item;
  
  constructor(props) {
    super(props);
    const param: { item: Item } | null = this.getParam<any>(PARAMS.ITEM, null);
    this.item = param!.item;
    this.state = {
      isLoading: false,
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.payment = this.payment.bind(this);
    
  }
  
  componentDidUpdate = async (_prevProp: Props, _prevState: State): Promise<void> => {
  
  };
  
  componentWillMount = async (): Promise<void> => {
  };
  
  componentDidMount = async (): Promise<void> => {
  
  };
  
  componentWillUnmount = async (): Promise<void> => {
  };
  
  private componentDidFocus = async (): Promise<void> => {
  
  };
  private payment = async (): Promise<void> => {
    await this.setState({isLoading: true});
    const dto: ItemActionDto = await this.itemService.doItemAction(this.item.id, ITEM_ACTION.BUY);
    await this.setState({isLoading: false});
    if (dto.isSuccess) {
      this.navigate(ROUTE.APP.MANUFACTORY.GOODSES.DEFAULT);
    }
  };
  
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Grid>
          <Row/>
          <Row style={{height: Styles.styles.row.heightControl, flexDirection: 'row', justifyContent: 'center'}}>
            <Button iconLeft onPress={this.payment}>
              <Icon name={'cash'}/>
              <Text>Payment</Text>
            </Button>
          </Row>
        </Grid>
      </BasesSreen>
    );
  }
}