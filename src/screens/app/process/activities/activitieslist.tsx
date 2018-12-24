import BasesSreen from "../../..//basescreen";
import {Grid, Row} from "native-base";
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
    await this.loadData();;
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
      workerId: this.workerId
    };
    const param: any = {};
    param[PARAMS.ITEM] = data;
    this.navigate(ROUTE.APP.MANUFACTORY.MATERIALS.ITEM.PROCESS.TASK.WORKERS.ACTIVITIES.ADD_ACTIVITY, data)
  };
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Grid>
          <Row>
          
          </Row>
        </Grid>
        <TouchableOpacity style={Styles.styleSheet.floatTouchable} onPress={this.clickAddActivity}>
          <Image style={{width: 70, height: 70, alignSelf: 'flex-end'}} resizeMode={'contain'} source={IMAGES.grayAdd}/>
        </TouchableOpacity>
      </BasesSreen>
    );
  }
}