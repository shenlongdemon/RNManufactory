import * as React from 'react';
import {Grid, Row} from 'react-native-easy-grid';

import BasesSreen from "../../basescreen";
import {
  FactoryInjection,
  Material,
  PUBLIC_TYPES,
  IProcessService, MaterialDetailDto,
  Process
} from "business_core_app_react";
import {PARAMS} from "../../../common";
import {ROUTE} from "../../routes";
import Utils from "../../../common/utils";
import * as Styles from "../../../stylesheet";
import {RefreshControl} from "react-native";
import {Col, List, ListItem} from "native-base";
import ProcessItem from "../../../components/listitem/processitem";

interface Props {
}

interface State {
  material: Material;
  isLoading: boolean;
}

/**
 * Display list of tasks
 */
export default class MaterialDetail extends BasesSreen<Props, State> {
  private processService: IProcessService = FactoryInjection.get<IProcessService>(PUBLIC_TYPES.IProcessService);
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
    this.state = {material: item!, isLoading: false};
    
  }
  
  componentWillMount = async (): Promise<void> => {
    await this.loadData();
  }
  
  
  componentDidMount = async (): Promise<void> => {
  
  }
  
  private loadData = async (): Promise<void> => {
    this.setState({isLoading: true});
    const res: MaterialDetailDto = await this.processService.getMaterialDetail(this.state.material.id);
    this.setState({isLoading: false});
    if (res.isSuccess) {
      this.setState({material: res.material!});
    }
    else {
      Utils.showErrorToast(res.message);
      this.goBack();
    }
  }
  
  private clickListItem = (item: Process, _index: number): void => {
    const param: any = {};
    param[PARAMS.ITEM] = {process: item, materialId: this.state.material.id};
    this.navigate(ROUTE.APP.MANUFACTORY.MATERIALS.ITEM.PROCESS.TASK.DEFAULT, param);
  }
  
  private componentDidFocus = async (): Promise<void> => {
  
  }
  
  render() {
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Grid>
          <Row style={{height: 100}}>
          
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
              dataArray={this.state.material.processes}
              renderRow={(data: Process, _sectionID: string | number, rowID: string | number, _rowMap?: any) => (
                
                <ListItem
                  onPress={() => {
                    this.clickListItem(data!, Number(rowID));
                  }}
                  key={data!.id}
                  style={{
                    paddingRight: 0, paddingLeft: 0, borderBottomWidth: 0,
                    backgroundColor: Number(rowID) % 2 === 0 ? Styles.color.Background : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Grid>
                    <Col>
                      <ProcessItem item={data} index={Number(rowID)}
                                   onClickHandle={this.clickListItem}/>
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