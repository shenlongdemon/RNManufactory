import {Grid, List, ListItem, Row, Col, Icon, Text} from "native-base";
import * as React from "react";
import {
  AttachFile,
  FactoryInjection,
  IBusinessService,
  Item, PUBLIC_TYPES
} from "business_core_app_react";
import * as Styles from "../../../../stylesheet";

interface Props {
  item: Item;
}

interface State {
  isLoading: boolean;
}

export default class AttachFileItemTab extends React.Component<Props, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
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
    const links: AttachFile[] = this.businessService.getAttachFiles(this.props.item);
    return (
      <Grid style={{flex: 1, backgroundColor: Styles.color.Background}}>
        <Row>
          <List
            style={{flex: 1, backgroundColor: Styles.color.Background, marginTop: 20}}
            keyboardShouldPersistTaps={'handled'}
            swipeToOpenPercent={80}
            disableLeftSwipe={true}
            disableRightSwipe={true}
            dataArray={links}
            renderRow={(link: AttachFile, _sectionID: string | number, rowID: string | number, _rowMap?: any) => (
              
              <ListItem
                onPress={() => {
                  // this.clickListItem(data!, Number(rowID));
                }}
                key={link.id}
                style={{
                  paddingRight: 0, paddingLeft: 0,
                  backgroundColor: Number(rowID) % 2 === 0 ? Styles.color.Background : 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <Grid>
                  <Col style={{width: 30}}>
                    <Icon name='attach' style={{fontSize: 22, color: Styles.color.Icon}}/>
                  </Col>
                  <Col style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text>{link.description}</Text>
                    <Text style={{fontSize: 14}}>{this.businessService.toDateTimeString(this.props.item.time)}</Text>
                  </Col>
                  <Col style={{width: 20}}>
                  
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