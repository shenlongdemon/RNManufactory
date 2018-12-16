import * as React from 'react';
import {Grid, Row, Col, List, ListItem} from 'native-base';
import BaseScreen from '../../basescreen';
import {
  Image,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import {
  FactoryInjection,
  Material,
  PUBLIC_TYPES,
  IProcessService,
  ProcessListDto
} from 'business_core_app_react';
import ProcessItem from '../../../components/listitem/processitem';
import {PARAMS} from "../../../common";
import {ROUTE} from "../../routes";
import * as Styles from "../../../stylesheet";
import * as IMAGES from "../../../assets";

interface Props {

}

interface State {
  materials: Material[];
  isLoading: boolean;
}

export default class ProcessList extends BaseScreen<Props, State> {
  private processService: IProcessService = FactoryInjection.get<IProcessService>(PUBLIC_TYPES.IProcessService);
  
  constructor(props: Props) {
    super(props);
    this.state = {
      materials: [],
      isLoading: false
    };
    this.clickListItem = this.clickListItem.bind(this);
    this.clickAddProcess = this.clickAddProcess.bind(this);
    this.componentDidFocus = this.componentDidFocus.bind(this);
  }
  
  componentWillMount = async (): Promise<void> => {
  
  }
  
  private clickListItem = (item: Material, _index: number): void => {
    const data: any = {};
    data[PARAMS.ITEM] = item;
    
    this.navigate(ROUTE.APP.MANUFACTORY.PROCESSES.ITEM.DEFAULT, data)
  }
  
  componentDidFocus = async (): Promise<void> => {
    this.loadProcesses();
  }
  
  private loadProcesses = async (): Promise<void> => {
    this.setState({isLoading: true});
    const processListDto: ProcessListDto = await this.processService.getProcesses();
    await this.setState({materials: processListDto.materials});
    
    this.setState({isLoading: false});
  }
  
  private clickAddProcess(): void {
    this.navigate(ROUTE.APP.MANUFACTORY.PROCESSES.ADD_iTEM.DEFAULT)
  }
  
  render() {
    return (
      <BaseScreen {...{...this.props, componentDidFocus: this.componentDidFocus, isLoading: this.state.isLoading}}>
        <Grid style={{flex:1}}>
          <Row>
            <List
              style={{flex:1, backgroundColor: Styles.color.Background}}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isLoading}
                  onRefresh={async (): Promise<void> => {
                    await this.loadProcesses();
                  }}
                />
              }
              keyboardShouldPersistTaps={'handled'}
              swipeToOpenPercent={80}
              disableLeftSwipe={true}
              disableRightSwipe={true}
              dataArray={this.state.materials}
              renderRow={(data: Material, _sectionID: string | number, rowID: string | number, _rowMap?: any) => (
                
                <ListItem
                  onPress={() => {
                    this.clickListItem(data!, Number(rowID));
                  }}
                  key={data!.id}
                  style={{ paddingRight: 0,
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
        
        <TouchableOpacity style={Styles.styleSheet.floatTouchable} onPress={this.clickAddProcess}>
          <Image style={{width: 70, height: 70, alignSelf: 'flex-end'}} resizeMode={'contain'} source={IMAGES.grayAdd}/>
        </TouchableOpacity>
      </BaseScreen>
    );
  }
}