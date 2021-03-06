import {Col, Grid, List, ListItem, Row, View} from "native-base";
import * as React from "react";
import {
  Item, Activity, IBusinessService, FactoryInjection, PUBLIC_TYPES, CONSTANTS
} from "business_core_app_react";
import * as Styles from "../../../../stylesheet";
import ActivityItem from "../../../../components/listitem/ActivityItem";
import {PARAMS} from "../../../../common";
import {Image, TouchableOpacity} from "react-native";
import * as IMAGES from "../../../../assets";
import * as turf from '@turf/turf';
import {Feature, lineString as makeLineString, Point} from '@turf/helpers';
import MapBpx from '@mapbox/react-native-mapbox-gl';
import {Param as ActivityDetailParam} from "../../process/activities/ActivityDetail";


interface Props {
  item: Item;
  clickAddMaintain: () => Promise<void>;
  navigateToActivity: (param: any) => void;
}

interface State {
  isLoading: boolean;
  lineOnMap: any | null;
  isMine: boolean;
}


export default class HistoryItemTab extends React.Component<Props, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  private mapView: MapBpx.MapView | null = null;
  
  constructor(props) {
    super(props);
    
    this.state = {
      isLoading: false,
      lineOnMap: null,
      isMine: false
    };
    this.clickListItem = this.clickListItem.bind(this);
  }
  
  componentWillMount = async (): Promise<void> => {
  };
  
  componentDidMount = async (): Promise<void> => {
    setTimeout(() => {
      this.fitMap()
    }, 3000);
    const isMine: boolean = await this.businessService.isMyItem(this.props.item);
    this.setState({isMine});
  };
  
  componentWillUnmount = async (): Promise<void> => {
  };
  
  
  private clickListItem = (item: Activity, _index: number): void => {
    const data: ActivityDetailParam = {
      activityId: item.id,
      materialId: CONSTANTS.STR_EMPTY,
      processId:  CONSTANTS.STR_EMPTY,
      itemId: this.props.item.id
    };
    const param: any = {};
    param[PARAMS.ITEM] = data;
  
    this.props.navigateToActivity(param);
    
  };
  
  fitMap = (): void => {
    
    const points = this.businessService.getActivitiesPositions(this.props.item);
    if (!this.mapView || points.length < 2) {
      return;
    }
    const features = turf.featureCollection(points);
    const envelop = turf.envelope(features);
    
    const line = turf.lineString(envelop.geometry!.coordinates[0]);
    const bbox = turf.bbox(line);
    const bboxPolygon = turf.bboxPolygon(bbox);
    
    this.mapView.fitBounds(bboxPolygon.geometry!.coordinates[0][2], bboxPolygon.geometry!.coordinates[0][0], 50, 3000);
  };
  
  private renderPoints = (): any => {
    const points: Feature<Point | null>[] = this.businessService.getActivitiesPositions(this.props.item);
    if (points.length === 0) {
      return null;
    }
    return points.map((point: Feature<Point | null>): any => {
      return (
        <MapBpx.PointAnnotation
          key={point.id}
          id={point.id}
          title={point.properties!['title']}
          selected={false}
          coordinate={point.geometry!.coordinates}>
          
          <MapBpx.Callout title={point.properties!['title']}/>
        </MapBpx.PointAnnotation>
      );
    });
  };
  private renderLines = (): any => {
    const points = this.businessService.getActivitiesPositions(this.props.item);
    if (points.length < 2) {
      return null;
    }
    return (
      <MapBpx.ShapeSource id="routeSource" shape={makeLineString(points.map((point: Feature<Point | null>): number[] => {
        return point.geometry!.coordinates
      }))}>
        <MapBpx.LineLayer
          id="routeFill"
          style={{
            lineColor: 'white',
            lineWidth: 2,
            lineOpacity: 0.84
          }}
        />
      </MapBpx.ShapeSource>
    );
  };
  
  render() {
    const activities: Activity[] = this.businessService.getAllActivities(this.props.item);
    
    return (
      <View style={{flex: 1}}>
        <Grid style={{flex: 1, backgroundColor: Styles.color.Background}}>
          <Row style={{height: 300}}>
            <MapBpx.MapView
              ref={(m: MapBpx.MapView) => {
                this.mapView = m;
              }}
              style={{flex: 1}}
              styleURL={MapBpx.StyleURL.Dark}
            >
              {this.renderPoints()}
              {this.renderLines()}
            </MapBpx.MapView>
          </Row>
          <Row>
            <List
              style={{flex: 1, backgroundColor: Styles.color.Background}}
              keyboardShouldPersistTaps={'handled'}
              swipeToOpenPercent={80}
              disableLeftSwipe={true}
              disableRightSwipe={true}
              dataArray={activities}
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
                      <ActivityItem item={item} index={Number(rowID)}/>
                    </Col>
                  </Grid>
                </ListItem>
              )}
            
            />
          </Row>
        
        </Grid>
        { this.state.isMine && <TouchableOpacity style={Styles.styleSheet.floatTouchable} onPress={this.props.clickAddMaintain}>
          <Image style={{width: 70, height: 70, alignSelf: 'flex-end'}} resizeMode={'contain'} source={IMAGES.grayAdd}/>
        </TouchableOpacity>}
      </View>
    );
  }
}