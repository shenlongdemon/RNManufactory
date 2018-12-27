import BasesSreen from "../../basescreen";
import {Grid, Row} from "native-base";
import * as React from "react";
import {Image, TouchableOpacity} from "react-native";
import * as Styles from "../../../stylesheet";
import * as IMAGES from "../../../assets";
import {ROUTE} from "../../routes";

interface Props {
}

interface State {
  isLoading: boolean;
}

export default class GoodsList extends BasesSreen<Props, State> {
  static navigationOptions = ({}) => {
    return {
      title: 'Your goods'
    };
  };
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
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
  
  }
  
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Grid>
          <Row>
          
          </Row>
        </Grid>
        <TouchableOpacity style={Styles.styleSheet.floatTouchable} onPress={this.clickAddGoods}>
          <Image style={{width: 70, height: 70, alignSelf: 'flex-end'}} resizeMode={'contain'} source={IMAGES.grayAdd}/>
        </TouchableOpacity>
      </BasesSreen>
    );
  }
}