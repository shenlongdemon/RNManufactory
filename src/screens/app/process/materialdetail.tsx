import * as React from 'react';
import {Grid, Row} from 'react-native-easy-grid';

import BasesSreen from "../../basescreen";
import {
  FactoryInjection,
  Material,
  PUBLIC_TYPES,
  IProcessService, MaterialDetailDto,
  Process,
  IBusinessService,
  Activity,
  User
} from 'business_core_app_react';
import {PARAMS} from "../../../common";
import {ROUTE} from "../../routes";
import * as Styles from "../../../stylesheet";
import {RefreshControl} from "react-native";
import {Col, List, ListItem, Thumbnail, View, Text} from "native-base";
import ProcessItem from "../../../components/listitem/processitem";
import MaterialCodeItem from "../../../components/listitem/materialcodeitem";
import * as Progress from 'react-native-progress';

interface Props {
}

interface State {
  material: Material;
  isLoading: boolean;
  doneProcess: number;
}

enum TemplateItemType {
  PROCESS = 1,
  MATERIAL = 2
}

interface TemplateItem {
  item: any;
  type: TemplateItemType
}

/**
 * Display list of tasks
 */
export default class MaterialDetail extends BasesSreen<Props, State> {
  private processService: IProcessService = FactoryInjection.get<IProcessService>(PUBLIC_TYPES.IProcessService);
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  static navigationOptions = ({navigation}) => {
    const material: Material | null = navigation.getParam(PARAMS.ITEM);
    const title: string = material ? material.name : '';
    return {
      title: title,
    };
  };
  
  constructor(props: Props) {
    super(props);
    this.componentDidFocus = this.componentDidFocus.bind(this);
    const item: Material | null = this.getParam<Material>(PARAMS.ITEM, null);
    item!.processes = [];
    this.state = {material: item!, isLoading: false, doneProcess: 0};
    
  }
  
  componentWillMount = async (): Promise<void> => {
  
  };
  
  
  componentDidMount = async (): Promise<void> => {
  
  };
  
  private loadData = async (): Promise<void> => {
    this.setState({doneProcess: 0.0})
    
    if (this.state.isLoading) {
      return;
    }
    this.setState({isLoading: true});
    const res: MaterialDetailDto = await this.processService.getMaterialDetail(this.state.material.id);
    this.setState({isLoading: false});
    if (res.isSuccess) {
      
      const finishInPercent: number = this.processService.calcFinishedInPercen(res.material!.processes);
      await this.setState({material: res.material!, doneProcess: finishInPercent});
    }
    else {
      this.goBack();
    }
  }
  
  private clickListItem = async (item: TemplateItem, _index: number): Promise<void> => {
    if (item.type === TemplateItemType.PROCESS) {
      const process: Process = item.item as Process;
      const isMyProcess: boolean = await this.processService.isMyProcess(this.state.material, process);
      if (!isMyProcess) {
        return;
      }
      const isOwner: boolean = await  this.processService.isOwnerMaterial(this.state.material);
      if (isOwner) {
        const param: any = {};
        param[PARAMS.ITEM] = {processId: process.id, materialId: this.state.material.id};
        this.navigate(ROUTE.APP.MANUFACTORY.MATERIALS.ITEM.PROCESS.TASK.DEFAULT, param);
      }
      else {
        const user: User = await this.businessService.getUser();
        const data: any = {
          materialId: this.state.material.id,
          processId: process.id,
          workerId: user.id
        };
        const param: any = {};
        param[PARAMS.ITEM] = data;
        this.navigate(ROUTE.APP.MANUFACTORY.MATERIALS.ITEM.PROCESS.TASK.WORKERS.ACTIVITIES.DEFAULT, param);
      }
    }
    else if (item.type === TemplateItemType.MATERIAL) {
      const material: Material = item.item as Material;
      const param: any = {};
      param[PARAMS.ITEM] = {code: material.code};
      this.navigate(ROUTE.APP.SHARE.QRCODEDISPLAY, param);
    }
  }
  
  private componentDidFocus = async (): Promise<void> => {
    await this.loadData();
  }
  
  private genTemplateItems = (): TemplateItem[] => {
    
    const list: TemplateItem[] = this.state.material.processes.map((process: Process): TemplateItem => {
      return {
        item: process,
        type: TemplateItemType.PROCESS
      };
    });
    const lastFinishProcessIndex: number = this.processService.getLastFinishProcessIndex(this.state.material.processes);
    if (list.length > 0) {
      list.splice(lastFinishProcessIndex, 0, {
        item: this.state.material,
        type: TemplateItemType.MATERIAL
      });
    }
    return list
  }
  private genListItem = (data: TemplateItem, index: number): any => {
    if (data.type === TemplateItemType.PROCESS) {
      return (<ProcessItem item={data.item as Process} index={index}/>);
    }
    else if (data.type === TemplateItemType.MATERIAL) {
      return (<MaterialCodeItem item={data.item as Material} index={index}/>);
    }
    else return (<View/>);
  }
  
  render() {
    const list: TemplateItem[] = this.genTemplateItems();
    const materialImagelink: string = this.businessService.getLink(this.state.material.imageUrl);
    const updateAt: string = `${this.businessService.toDateString(this.state.material.updatedAt)} - ${this.businessService.toTimeString(this.state.material.updatedAt)}`;
    const totalActivities: Activity[] = this.businessService.getActivities(this.state.material);
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Grid>
          <Row style={{height: 100}}>
            <Grid>
              <Col style={{flexDirection: 'row'}}>
                <View style={{height: 100, width: 60, justifyContent: 'center'}}>
                  <Thumbnail style={{width: 50, height: 50}} source={{uri: materialImagelink}}/>
                </View>
                <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                  <Text style={{color: Styles.color.Text}}>{totalActivities.length} activities</Text>
                  <Text style={{color: Styles.color.Text}}>{updateAt}</Text>
                </View>
              </Col>
              <Col style={{width: 100, justifyContent: 'center'}}>
                <Progress.Circle
                  showsText={true}
                  progress={this.state.doneProcess}
                  size={90}
                  color={Styles.color.Progress}
                  borderColor={Styles.color.Progress}
                  thickness={3}/>
              </Col>
            </Grid>
          
          
          </Row>
          <Row>
            <List
              style={{flex: 1, backgroundColor: Styles.color.Background}}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isLoading}
                  onRefresh={async (): Promise<void> => {
                    await this.loadData();
                  }}
                />
              }
              keyboardShouldPersistTaps={'handled'}
              swipeToOpenPercent={80}
              disableLeftSwipe={true}
              disableRightSwipe={true}
              dataArray={list}
              renderRow={(data: TemplateItem, _sectionID: string | number, rowID: string | number, _rowMap?: any) => (
                
                <ListItem
                  onPress={() => {
                    this.clickListItem(data!, Number(rowID));
                  }}
                  key={data.item.id}
                  style={{
                    paddingRight: 0, paddingLeft: 0, borderBottomWidth: 0,
                    backgroundColor: Number(rowID) % 2 === 0 ? Styles.color.Background : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Grid>
                    <Col>
                      {
                        this.genListItem(data, Number(rowID))
                      }
                    
                    </Col>
                  </Grid>
                </ListItem>
              )}
            
            />
          </Row>
        </Grid>
      </BasesSreen>
    );
  }
  
  
}