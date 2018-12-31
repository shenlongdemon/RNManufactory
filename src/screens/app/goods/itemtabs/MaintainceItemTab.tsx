import {Col, Grid, List, ListItem, Row} from "native-base";
import * as React from "react";
import {
  Item, Activity
} from "business_core_app_react";
import * as Styles from "../../../../stylesheet";
import MaintainItem from "../../../../components/listitem/MaintainItem";
import {PARAMS} from "../../../../common";

interface Props {
  item: Item;
}

interface State {
  isLoading: boolean;
}

export default class MaintainceItemTab extends React.Component<Props, State> {
  
  constructor(props) {
    super(props);
    
    this.state = {
      isLoading: false
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.clickListItem = this.clickListItem.bind(this);
    
  }
  
  componentWillMount = async (): Promise<void> => {
  }
  
  componentDidMount = async (): Promise<void> => {
  
  }
  
  componentWillUnmount = async (): Promise<void> => {
  }
  
  private componentDidFocus = async (): Promise<void> => {
  
  }
  private clickListItem = (item: Activity, _index: number): void => {
    const data: any = {};
    data[PARAMS.ITEM] = item;
    
    // this.navigate(ROUTE.APP.MANUFACTORY.GOODSES.ITEM.DEFAULT, data)
  }
  
  
  render() {
    return (
      <Grid style={{flex:1, backgroundColor: Styles.color.Background}}>
        <Row>
          <List
            style={{flex:1, backgroundColor: Styles.color.Background}}
            keyboardShouldPersistTaps={'handled'}
            swipeToOpenPercent={80}
            disableLeftSwipe={true}
            disableRightSwipe={true}
            dataArray={this.props.item.maintains}
            renderRow={(item: Activity, _sectionID: string | number, rowID: string | number, _rowMap?: any) => (
              
              <ListItem
                onPress={() => {
                  this.clickListItem(item, Number(rowID));
                }}
                key={item.id}
                style={{ paddingRight: 0,paddingLeft: 0,
                  backgroundColor: Number(rowID) % 2 === 0 ? Styles.color.Background : 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <Grid>
                  <Col>
                    <MaintainItem item={item} index={Number(rowID)}/>
                  </Col>
                </Grid>
              </ListItem>
            )}
          
          />
        </Row>
      </Grid>
    );
  }
}