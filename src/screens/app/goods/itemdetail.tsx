import BasesSreen from "../../basescreen";
import {Tabs, TabHeading, Tab, Icon, Text, Header} from "native-base";
import * as React from "react";
import * as Styles from "../../../stylesheet";
import * as IMAGES from "../../../assets";
interface Props {
}

interface State {
  isLoading: boolean;
}

export default class ItemDetail extends BasesSreen<Props, State> {
  static navigationOptions = ({}) => {
    return {
      title: ''
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
  
  private componentDidFocus = async (): Promise<void> => {
  
  }
  
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Header hasTabs/>
        <Tabs style={{backgroundColor: Styles.color.Background}} >
          <Tab heading={ <TabHeading><Icon name="information-circle" /><Text>Info</Text></TabHeading>}>
          
          </Tab>
          <Tab heading={ <TabHeading><Icon name={'pulse'} /><Text>Maintains</Text></TabHeading>}>
  
          </Tab>
        </Tabs>
      </BasesSreen>
    );
  }
}