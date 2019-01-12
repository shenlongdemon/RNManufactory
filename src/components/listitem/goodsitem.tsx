import * as React from 'react';
import {Text} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';
import BaseItem from './baseitem';
import IBaseItem from './ibaseitem';
import {FactoryInjection, IBusinessService, Item, PUBLIC_TYPES, CONSTANTS} from 'business_core_app_react';
import * as Styles from '../../stylesheet';
import {Thumbnail} from "native-base";
import PriceText from "../shared/PriceText";

interface Props extends IBaseItem<Item> {

}

interface State {
  status: string;
}

export default class GoodsItem extends BaseItem<Item, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props: Props) {
    super(props);
    this.state = {status: CONSTANTS.STR_EMPTY};
  }
  
  componentDidMount = (): void => {
  
  };
  componentWillMount = async (): Promise<void> => {
    const action = await this.businessService.getItemAction(this.props.item);
    this.setState({status: action.status})
  };
  
  private formatDate = (time: number): string => {
    return this.businessService.toDateString(time);
  };
  
  render() {
    
    return (
      <BaseItem {...this.props} >
        <Grid style={{height: 100}}>
          
          <Col size={5} style={{justifyContent: 'center', flexDirection: 'column'}}>
            <Text style={[Styles.styleSheet.label, {marginLeft: 10}]}>{this.props.item.name}</Text>
          </Col>
          
          <Col size={3} style={{justifyContent: 'center', flexDirection: 'column'}}>
            <PriceText price={Number(this.props.item.price)} fontSize={16} color={Styles.color.Text}/>
            <Text style={[Styles.styleSheet.label, {width: '100%', textAlign: 'center'}]}>{this.state.status}</Text>
          </Col>
          <Col style={{justifyContent: 'center', width: 80}}>
            <Thumbnail source={{uri: this.businessService.getLink(this.props.item.imageUrl)}}
                       circular
                       style={{width: 80, height: 80}}/>
          </Col>
          
          <Col size={4} style={{justifyContent: 'center'}}>
            <Text style={[Styles.styleSheet.label, {alignSelf: 'flex-end', fontSize: 14}]}>
              Updated at{'\n'}{this.formatDate(this.props.item.updatedAt)}
            </Text>
          
          </Col>
        
        </Grid>
      </BaseItem>
    );
  }
}
