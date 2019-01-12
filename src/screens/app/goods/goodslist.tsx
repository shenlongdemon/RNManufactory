import BasesSreen from "../../basescreen";
import {Col, Grid, List, ListItem, Row} from "native-base";
import * as React from "react";
import {Image, RefreshControl, TouchableOpacity} from "react-native";
import * as Styles from "../../../stylesheet";
import * as IMAGES from "../../../assets";
import {ROUTE} from "../../routes";
import {
  FactoryInjection,
  IBusinessService,
  Item, PUBLIC_TYPES,
  ItemListDto
} from "business_core_app_react";
import GoodsItem from "../../../components/listitem/goodsitem";
import {PARAMS} from "../../../common";

interface Props {

}

interface State {
  items: Item[];
  isLoading: boolean;
}

export default class GoodsList extends BasesSreen<Props, State> {
  static navigationOptions = ({}) => {
    return {
      title: 'Your goods'
    };
  };
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      items: []
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    
  }
  
  componentWillMount = async (): Promise<void> => {
  }
  
  componentDidMount = async (): Promise<void> => {
  
  }
  
  componentWillUnmount = async (): Promise<void> => {
  }
  
  private clickAddGoods = async (): Promise<void> => {
    
    this.navigate(ROUTE.APP.MANUFACTORY.GOODSES.ADD_iTEM.DEFAULT)
    
  };
  
  private componentDidFocus = async (): Promise<void> => {
    await this.loadData();
  }
  
  private loadData = async (): Promise<void> => {
    await this.setState({isLoading: true});
    const dto: ItemListDto = await this.businessService.getItems();
    
    await this.setState({items: []});
    await this.setState({isLoading: false, items: dto.items});
  };
  private clickListItem = (item: Item, _index: number): void => {
    const data: any = {};
    data[PARAMS.ITEM] = item;
    
    this.navigate(ROUTE.APP.MANUFACTORY.GOODSES.ITEM.DEFAULT, data)
  };
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Grid>
          <Row>
            <List
              style={{flex: 1, backgroundColor: Styles.color.Background}}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isLoading}
                  onRefresh={async (): Promise<void> => {
                    await this.loadData();
                  }}
                />
              }
              keyboardShouldPersistTaps={'handled'}
              swipeToOpenPercent={80}
              disableLeftSwipe={true}
              disableRightSwipe={true}
              dataArray={this.state.items}
              renderRow={(data: Item, _sectionID: string | number, rowID: string | number, _rowMap?: any) => (
                
                <ListItem
                  onPress={() => {
                    this.clickListItem(data!, Number(rowID));
                  }}
                  key={data!.id}
                  style={{
                    paddingRight: 0, paddingLeft: 0,
                    backgroundColor: Number(rowID) % 2 === 0 ? Styles.color.Background : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Grid>
                    <Col>
                      <GoodsItem item={data} index={Number(rowID)}
                                 onClickHandle={this.clickListItem}/>
                    </Col>
                  </Grid>
                </ListItem>
              )}
            
            />
          </Row>
        </Grid>
        <TouchableOpacity style={Styles.styleSheet.floatTouchable} onPress={this.clickAddGoods}>
          <Image style={{width: 70, height: 70, alignSelf: 'flex-end'}} resizeMode={'contain'} source={IMAGES.grayAdd}/>
        </TouchableOpacity>
      </BasesSreen>
    );
  }
}