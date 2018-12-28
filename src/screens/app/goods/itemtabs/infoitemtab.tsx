import {Grid, Row, Text} from "native-base";
import * as React from "react";
import {
  Item
} from "business_core_app_react";
import * as Styles from "../../../../stylesheet";

interface Props {
  item: Item;
}

interface State {
  isLoading: boolean;
}

export default class InfoItemTab extends React.Component<Props, State> {
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
      <Grid style={{flex:1, backgroundColor: Styles.color.Background}}>
        <Row>
          <Text style={{color: Styles.color.Done}}>{this.props.item.name}</Text>
        </Row>
      </Grid>
    );
  }
}