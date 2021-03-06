import BasesSreen from "../../../basescreen";
import {ActionSheet, Button, Col, Grid, Icon, Label, List, ListItem, Row, Text, Item as NBItem} from "native-base";
import * as React from "react";
import * as Styles from "../../../../stylesheet";
import {RefreshControl} from "react-native";
import {
  Item,
  ItemListDto,
  CONSTANTS,
  IItemService,
  FactoryInjection,
  PUBLIC_TYPES,
  GetCategoriesDto, IBusinessService, Category
} from "business_core_app_react";
import GoodsItem from "../../../../components/listitem/goodsitem";

interface Props {
  onItemClick: (item: Item) => Promise<void>;
}

interface State {
  isLoading: boolean;
  items: Item[];
  categories: Category[];
  category: Category | null;
}

export default class ByCategoryTab extends React.Component<Props, State> {
  static navigationOptions = ({}) => {
    return {
      title: 'Products'
    };
  };
  private itemService: IItemService = FactoryInjection.get<IItemService>(PUBLIC_TYPES.IItemService);
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      items: [],
      categories: [],
      category: null
    };
  }
  
  componentWillMount = async (): Promise<void> => {
    await this.loadCategories();
    await this.loadData();
  };
  
  componentDidMount = async (): Promise<void> => {
  
  };
  
  componentWillUnmount = async (): Promise<void> => {
  };
  
 
  private loadData = async (): Promise<void> => {
    const categoryId: string = this.state.category ? this.state.category.id : CONSTANTS.STR_EMPTY;
    await this.setState({isLoading: true});
    const dto: ItemListDto = await this.itemService.getProducts(categoryId);
    await this.setState({isLoading: false, items: []});
    await this.setState({items: dto.items});
  };
 
  private loadCategories = async (): Promise<void> => {
    this.setState({isLoading: true});
    const dto: GetCategoriesDto = await this.businessService.getCategories();
    this.setState({isLoading: false, categories: dto.categories});
  };
  
  private showCombobox = (): void => {
    const data: string[] = this.state.categories.map((category: Category): string => {
      return category.value;
    });
    data.push('Select all');
    ActionSheet.show(
      {
        options: data,
        cancelButtonIndex: data.length - 1,
        title: 'Please select category'
      },
      async (buttonIndex: number): Promise<void> => {
        if (buttonIndex < data.length - 1) {
          await this.setState({category: this.state.categories[buttonIndex]});
        }
        else {
          await this.setState({category: null});
        }
        await this.loadData();
      }
    );
  };
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading}}>
        <Grid>
          <Row style={{height: 60, justifyContent: 'center'}}>
            <NBItem inlineLabel style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Label>Category </Label>
              <Button style={{width: '70%', marginTop: 10}} transparent onPress={this.showCombobox} iconRight>
                <Text uppercase={false}
                      style={{color: Styles.color.Text}}>{this.state.category ? this.state.category.value : 'Please select category'}</Text>
                <Icon style={{color: Styles.color.Icon}} name={'arrow-dropdown'}/>
              </Button>
            </NBItem>
          
          </Row>
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
                  onPress={async () => {
                    await this.props.onItemClick(data);
                  }}
                  key={data.id}
                  style={{
                    paddingRight: 0, paddingLeft: 0,
                    backgroundColor: Number(rowID) % 2 === 0 ? Styles.color.Background : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Grid>
                    <Col>
                      <GoodsItem item={data} index={Number(rowID)}
                                 onClickHandle={async () => {
                                   await this.props.onItemClick(data);
                                 }}/>
                    </Col>
                  </Grid>
                </ListItem>
              )}
            
            />
          </Row>
        </Grid>
      </BasesSreen>
    );
  }
}