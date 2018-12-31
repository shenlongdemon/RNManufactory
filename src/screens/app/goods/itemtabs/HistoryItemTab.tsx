import {Col, Grid, List, ListItem, Row, View} from "native-base";
import * as React from "react";
import {
  Item, Activity, IBusinessService, FactoryInjection, PUBLIC_TYPES
} from "business_core_app_react";
import * as Styles from "../../../../stylesheet";
import HistoryItem from "../../../../components/listitem/MaintainItem";
import {PARAMS} from "../../../../common";
import MapBox from '@mapbox/react-native-mapbox-gl';
import {Image, TouchableOpacity} from "react-native";
import * as IMAGES from "../../../../assets";

interface Props {
  item: Item;
}

interface State {
  isLoading: boolean;
}


export default class HistoryItemTab extends React.Component<Props, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  private activities: Activity[] = this.businessService.getAllActivities(this.props.item);
  private mapView :MapBox.MapView;
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
    this.mapView.fitBound();
  }
  private clickListItem = (item: Activity, _index: number): void => {
    const data: any = {};
    data[PARAMS.ITEM] = item;
    
    // this.navigate(ROUTE.APP.MANUFACTORY.GOODSES.ITEM.DEFAULT, data)
  }
  
  
  render() {
    return (
      <View style={{flex: 1}}>
        <Grid style={{flex: 1, backgroundColor: Styles.color.Background}}>
          <Row style={{height: 300, backgroundColor: '#ffffff'}}>
            <MapBox.MapView
              ref={(m: MapBox.MapView) => {this.mapView = m;}}
              style={{flex: 1}}
              styleURL={MapBox.StyleURL.Dark}
              centerCoordinate={[-73.970895, 40.723279]}/>
          </Row>
          <Row>
            <List
              style={{flex: 1, backgroundColor: Styles.color.Background}}
              keyboardShouldPersistTaps={'handled'}
              swipeToOpenPercent={80}
              disableLeftSwipe={true}
              disableRightSwipe={true}
              dataArray={this.activities}
              renderRow={(item: Activity, _sectionID: string | number, rowID: string | number, _rowMap?: any) => (
                
                <ListItem
                  onPress={() => {
                    this.clickListItem(item, Number(rowID));
                  }}
                  key={item.id}
                  style={{
                    paddingRight: 0, paddingLeft: 0,
                    backgroundColor: Number(rowID) % 2 === 0 ? Styles.color.Background : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Grid>
                    <Col>
                      <HistoryItem item={item} index={Number(rowID)}/>
                    </Col>
                  </Grid>
                </ListItem>
              )}
            
            />
          </Row>
        
        </Grid>
        <TouchableOpacity style={Styles.styleSheet.floatTouchable} onPress={() => {
        }}>
          <Image style={{width: 70, height: 70, alignSelf: 'flex-end'}} resizeMode={'contain'} source={IMAGES.grayAdd}/>
        </TouchableOpacity>
      </View>
    );
  }
}