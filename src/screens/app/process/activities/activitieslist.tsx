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
  ActivitiesListDto
} from "business_core_app_react";
import {Image, TouchableOpacity} from "react-native";
import * as Styles from "../../../../stylesheet";
import * as IMAGES from "../../../../assets";
import {ROUTE} from "../../../routes";
import ActivityItem from "../../../../components/listitem/ActivityItem";
import MapBox from '@mapbox/react-native-mapbox-gl';

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
  
  private materialId: string = CONSTANTS.STR_EMPTY;
  private processId: string = CONSTANTS.STR_EMPTY;
  private workerId: string = CONSTANTS.STR_EMPTY;
  private mapView :MapBox.MapView;
  
  private processService: IProcessService = FactoryInjection.get<IProcessService>(PUBLIC_TYPES.IProcessService);
  
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
  }
  
  componentDidMount = async (): Promise<void> => {

  }
  
  componentWillUnmount = async (): Promise<void> => {
  }
  
  private componentDidFocus = async (): Promise<void> => {
    await this.loadData();
  }
  
  private loadData = async (): Promise<void> => {
    this.setState({isLoading: true});
    const dto: ActivitiesListDto = await this.processService.getActivities(this.materialId, this.processId, this.workerId);
    this.setState({isLoading: false});
    if (dto.isSuccess) {
      this.setState({activities: dto.activities });
    }
    
  };
  private clickAddActivity = async () : Promise<void> => {
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
    const data: any = {};
    data[PARAMS.ITEM] = item;
    
    this.navigate(ROUTE.APP.MANUFACTORY.GOODSES.ITEM.DEFAULT, data)
  };
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Grid>
          <Row style={{height: 300}}>
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