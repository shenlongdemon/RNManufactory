import BasesSreen from "../../../basescreen";
import {Grid, Row, Text, Thumbnail} from "native-base";
import {
  Activity,
  GetActivityDto,
  FactoryInjection,
  IBusinessService,
  PUBLIC_TYPES
} from "business_core_app_react";
import * as React from "react";
import {PARAMS} from "../../../../common";
import {ScrollView} from "react-native";
import * as Styles from "../../../../stylesheet";
import MapBpx from '@mapbox/react-native-mapbox-gl';// import * as Styles from "../stylesheet";

interface Props {
}

interface State {
  activity: Activity | null;
  isLoading: boolean;
}

export interface Param {
  activityId: string;
  itemId: string;
  materialId: string;
  processId: string;
}

export class ActivityDetail extends BasesSreen<Props, State> {
  static navigationOptions = ({}) => {
    return {
      title: 'Information'
    };
  };
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activity: null
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    const param: Param | null = this.getParam<Param>(PARAMS.ITEM, null);
    if (param) {
      this.loadData(param!.activityId, param!.itemId, param!.materialId, param!.processId);
    }
  }
  
  componentDidUpdate = async (_prevProp: Props, _prevState: State): Promise<void> => {
  
  };
  componentWillMount = async (): Promise<void> => {
  };
  
  componentDidMount = async (): Promise<void> => {
  
  };
  
  componentWillUnmount = async (): Promise<void> => {
  };
  
  private componentDidFocus = async (): Promise<void> => {
  
  };
  private loadData = async (activityId: string, itemId: string, materialId: string, processId: string): Promise<void> => {
    await this.setState({isLoading: true});
    const dto: GetActivityDto = await this.businessService.getActivity(activityId, itemId, materialId, processId);
    await this.setState({isLoading: false, activity: dto.activity});
  };
  private renderPoint = (): any => {
    if (!this.state.activity) {
      return null;
    }
    const point = this.businessService.getActivityPoint(this.state.activity);
    
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
  };
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        {
          this.state.activity &&
          <Grid style={{flex: 1, backgroundColor: Styles.color.Background}}>
            <Row style={{height: 300}}>
              <MapBpx.MapView
                style={{flex: 1}}
                styleURL={MapBpx.StyleURL.Dark}
              >
                {this.renderPoint()}
              </MapBpx.MapView>
            </Row>
            <Row>
              <ScrollView>
                <Grid>
                  <Row style={{height: 100, justifyContent: 'space-evenly', flexDirection: 'row'}}>
                    <Text style={{height: 100, lineHeight: 100}}>{this.state.activity.title}</Text>
                    <Thumbnail style={{width: 100, height: 100}} circular
                               source={{uri: this.businessService.getLink(this.state.activity.image)}}/>
                  </Row>
                  <Row style={{height: Styles.styles.row.heightControl}}>
                    <Text style={{
                      height: Styles.styles.row.heightControl,
                      lineHeight: Styles.styles.row.heightControl,
                      width: '100%',
                      textAlign: 'center'
                    }}>{this.businessService.toDateTimeString(this.state.activity.time)}</Text>
                  </Row>
                  <Row style={{height: Styles.styles.row.heightDescription}}>
                    <Text style={{flex: 1}}>{this.state.activity.description}</Text>
                  </Row>
                  <Row style={{height: Styles.styles.row.heightDescription}}>

                  </Row>
                </Grid>
              </ScrollView>
            </Row>

          </Grid>
        }
      </BasesSreen>
    );
  }
}