import BasesSreen from "../../..//basescreen";
import {Col, Grid, List, ListItem, Row} from "native-base";
import * as React from "react";
import {PARAMS} from "../../../../common";

import {
  FactoryInjection,
  PUBLIC_TYPES,
  IProcessService,
  CONSTANTS,
  Activity,
  ActivitiesListDto, IBusinessService
} from "business_core_app_react";
import {Image, TouchableOpacity} from "react-native";
import * as Styles from "../../../../stylesheet";
import * as IMAGES from "../../../../assets";
import {ROUTE} from "../../../routes";
import ActivityItem from "../../../../components/listitem/ActivityItem";
import MapBox from '@mapbox/react-native-mapbox-gl';
import {Param as ActivityDetailParam} from "./ActivityDetail";
import {Feature, lineString as makeLineString, Point} from "@turf/helpers";
import MapBpx from '@mapbox/react-native-mapbox-gl';
import * as turf from "@turf/turf";

interface Props {
}

interface State {
  isLoading: boolean;
  activities: Activity[];
}

interface Param {
  processId: string,
  materialId: string;
  workerId: string;
}

export default class Activitieslist extends BasesSreen<Props, State> {
  static navigationOptions = ({}) => {
    return {
      title: 'Activities'
    };
  };
  private mapView: MapBpx.MapView | null = null;
  
  private materialId: string = CONSTANTS.STR_EMPTY;
  private processId: string = CONSTANTS.STR_EMPTY;
  private workerId: string = CONSTANTS.STR_EMPTY;
  
  private processService: IProcessService = FactoryInjection.get<IProcessService>(PUBLIC_TYPES.IProcessService);
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props) {
    super(props);
    const param: Param | null = this.getParam<Param>(PARAMS.ITEM, null);
    this.initParam(param!.materialId, param!.processId, param!.workerId);
    this.state = {
      isLoading: false,
      activities: []
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.clickAddActivity = this.clickAddActivity.bind(this);
    this.clickListItem = this.clickListItem.bind(this);
    
  }
  
  private initParam(materialId: string, processId: string, workerId: string) {
    this.materialId = materialId;
    this.processId = processId;
    this.workerId = workerId;
    
  }
  
  componentWillMount = async (): Promise<void> => {
  };
  
  componentDidMount = async (): Promise<void> => {
  
  };
  
  componentWillUnmount = async (): Promise<void> => {
  };
  
  private componentDidFocus = async (): Promise<void> => {
    await this.loadData();
    
  };
  
  private loadData = async (): Promise<void> => {
    this.setState({isLoading: true});
    const dto: ActivitiesListDto = await this.processService.getActivities(this.materialId, this.processId, this.workerId);
    this.setState({isLoading: false});
    if (dto.isSuccess) {
      this.setState({activities: dto.activities});
    }
    setTimeout(() => {
      this.fitMap()
    }, 3000);
    
  };
  fitMap = (): void => {
    if (!this.mapView || this.state.activities.length  < 2) {
      return;
    }
    const points: Feature<Point | null>[] = this.businessService.getActivityPoints(this.state.activities);
    
    const features = turf.featureCollection(points);
    const envelop = turf.envelope(features);
    
    const line = turf.lineString(envelop.geometry!.coordinates[0]);
    const bbox = turf.bbox(line);
    const bboxPolygon = turf.bboxPolygon(bbox);
    
    this.mapView.fitBounds(bboxPolygon.geometry!.coordinates[0][2], bboxPolygon.geometry!.coordinates[0][0], 50, 3000);
  };
  
  private clickAddActivity = async (): Promise<void> => {
    const data: any = {
      materialId: this.materialId,
      processId: this.processId,
      itemId: CONSTANTS.STR_EMPTY
    };
    const param: any = {};
    param[PARAMS.ITEM] = data;
    this.navigate(ROUTE.APP.MANUFACTORY.MATERIALS.ITEM.PROCESS.TASK.WORKERS.ACTIVITIES.ADD_ACTIVITY, param)
  };
  private clickListItem = (item: Activity, _index: number): void => {
    const data: ActivityDetailParam = {
      activityId: item.id,
      materialId: this.materialId,
      processId: this.processId,
      itemId: CONSTANTS.STR_EMPTY
    };
    const param: any = {};
    param[PARAMS.ITEM] = data;
    
    this.navigate(ROUTE.APP.MANUFACTORY.ACTIVITIES.ITEM.DEFAULT, param);
  };
  
  private renderPoints = (): any => {
    if (this.state.activities.length === 0) {
      return;
    }
    const points: Feature<Point | null>[] = this.businessService.getActivityPoints(this.state.activities);
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
    if (this.state.activities.length < 2) {
      return;
    }
    const points: Feature<Point | null>[] = this.businessService.getActivityPoints(this.state.activities);
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
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Grid>
          <Row style={{height: 300}}>
            <MapBox.MapView
              ref={(m: MapBpx.MapView) => {
                this.mapView = m;
              }}
              style={{flex: 1}}
              styleURL={MapBox.StyleURL.Dark}>
              {this.state.activities.length > 0 && this.renderPoints()}
              {this.state.activities.length > 1 && this.renderLines()}
            </MapBox.MapView>
          </Row>
          <Row>
            <List
              style={{flex: 1, backgroundColor: Styles.color.Background}}
              keyboardShouldPersistTaps={'handled'}
              swipeToOpenPercent={80}
              disableLeftSwipe={true}
              disableRightSwipe={true}
              dataArray={this.state.activities}
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
        <TouchableOpacity style={Styles.styleSheet.floatTouchable} onPress={this.clickAddActivity}>
          <Image style={{width: 70, height: 70, alignSelf: 'flex-end'}} resizeMode={'contain'} source={IMAGES.grayAdd}/>
        </TouchableOpacity>
      </BasesSreen>
    );
  }
}