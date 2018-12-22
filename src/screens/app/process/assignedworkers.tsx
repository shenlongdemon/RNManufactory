import * as React from 'react';
import {Image, RefreshControl, TouchableOpacity} from 'react-native';
import {Col, Grid, List, ListItem, Row} from 'native-base';
import BaseScreen from '../../basescreen';
import * as Styles from '../../../stylesheet';
import * as IMAGES from '../../../assets';
import {PARAMS} from '../../../common';
import {
  UserInfo,
  IProcessService, FactoryInjection, PUBLIC_TYPES, MaterialDetailDto, Process
} from 'business_core_app_react';
import BasesSreen from "../../basescreen";
import WorkerItem from "../../../components/listitem/workeritem";

interface Props {
}

interface State {
  isLoading: boolean;
  workers: UserInfo[];
}

interface Param {
  processId: string,
  materialId: string;
}

export default class AssignedWorkers extends BaseScreen<Props, State> {
  
  private processService: IProcessService = FactoryInjection.get<IProcessService>(PUBLIC_TYPES.IProcessService);
  
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      workers: []
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.clickListItem = this.clickListItem.bind(this);
    this.clickAssignWorker = this.clickAssignWorker.bind(this);
  }
  
  componentDidFocus = async (): Promise<void> => {
  
  }
  componentWillMount = async (): Promise<void> => {
    await this.loadData();
  }
  componentDidMount = async (): Promise<void> => {
  
  }
  refreshData = async () : Promise<void> => {
  
  }
  clickListItem = async (_item: UserInfo, _index: number) : Promise<void> => {
  
  }
  clickAssignWorker = async () : Promise<void> => {
    
  }
  
  private loadData = async (): Promise<void> => {
    const param: Param | null = this.getParam<Param>(PARAMS.ITEM, null);
    const dto: MaterialDetailDto = await this.processService.getMaterialDetail(param!.materialId)
    if (dto.isSuccess && dto.material) {
      const process: Process | undefined | null =
        dto.material.processes.find((p: Process): boolean => {
          return p.id === param!.processId
        });
      if (process) {
        this.setState({workers: process.workers});
      }
    }
  };
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Grid style={{flex: 1}}>
          <Row>
            <List
              style={{flex: 1, backgroundColor: Styles.color.Background}}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isLoading}
                  onRefresh={async (): Promise<void> => {
                    await this.refreshData();
                  }}
                />
              }
              keyboardShouldPersistTaps={'handled'}
              swipeToOpenPercent={80}
              disableLeftSwipe={true}
              disableRightSwipe={true}
              dataArray={this.state.workers}
              renderRow={(data: UserInfo, _sectionID: string | number, rowID: string | number, _rowMap?: any) => (
                
                <ListItem
                  onPress={() => {
                    this.clickListItem(data!, Number(rowID));
                  }}
                  key={data!.id}
                  style={{
                    paddingRight: 0, paddingLeft: 0,
                    backgroundColor: Number(rowID) % 2 === 0 ? Styles.color.Background : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Grid>
                    <Col>
                      <WorkerItem item={data} index={Number(rowID)}
                                    onClickHandle={this.clickListItem}/>
                    </Col>
                  </Grid>
                </ListItem>
              )}
            />
          </Row>
        </Grid>
        <TouchableOpacity style={Styles.styleSheet.floatTouchable} onPress={this.clickAssignWorker}>
          <Image style={{width: 70, height: 70, alignSelf: 'flex-end'}} resizeMode={'contain'} source={IMAGES.grayAdd}/>
        </TouchableOpacity>
      </BasesSreen>
    );
  }
}
