import {Grid, List, ListItem, Row, Col} from "native-base";
import * as React from "react";
import {
  Item,
  Transaction
} from "business_core_app_react";
import * as Styles from "../../../../stylesheet";
import TransactionItem from "../../../../components/listitem/TransactionItem";

interface Props {
  item: Item;
}

interface State {
  isLoading: boolean;
}

export default class TransactionsTab extends React.Component<Props, State> {
  
  constructor(props) {
    super(props);
    
    this.state = {
      isLoading: false
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    
  }
  
  componentWillMount = async (): Promise<void> => {
  };
  
  componentDidMount = async (): Promise<void> => {
  
  };
  
  componentWillUnmount = async (): Promise<void> => {
  };
  
  private componentDidFocus = async (): Promise<void> => {
  
  };
  
  
  render() {
    const items: Transaction[] = this.props.item.transactions.sort((a: Transaction, b: Transaction): number => {
      return b.time - a.time;
    });
    return (
      <Grid style={{flex: 1, backgroundColor: Styles.color.Background}}>
        <Row>
          <List
            style={{flex: 1, backgroundColor: Styles.color.Background, marginTop: 20}}
            keyboardShouldPersistTaps={'handled'}
            swipeToOpenPercent={80}
            disableLeftSwipe={true}
            disableRightSwipe={true}
            dataArray={items}
            renderRow={(item: Transaction, _sectionID: string | number, rowID: string | number, _rowMap?: any) => (
              
              <ListItem
                onPress={() => {
                  // this.clickListItem(data!, Number(rowID));
                }}
                key={item.time}
                style={{
                  paddingRight: 0, paddingLeft: 0,
                  backgroundColor: Number(rowID) % 2 === 0 ? Styles.color.Background : 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <Grid>
                  <Col>
                    <TransactionItem item={item} index={Number(rowID)} onClickHandle={null} />
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