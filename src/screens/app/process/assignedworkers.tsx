import * as React from 'react';
import { Image, RefreshControl, TouchableOpacity } from 'react-native';
import { Col, Grid, List, ListItem, Row, Text } from 'native-base';
import BaseScreen from '../../basescreen';
import * as Styles from '../../../stylesheet';
import * as IMAGES from '../../../assets';
import { PARAMS } from '../../../common';
import {
  CONSTANTS,
  IProcessService,
  FactoryInjection,
  PUBLIC_TYPES,
  ProcessDto,
  ObjectType,
  User,
  AssignWorkerDto
} from 'business_core_app_react';
import BasesSreen from '../../basescreen';
import UserItem from '../../../components/listitem/useritem';
import { ROUTE } from '../../routes';
import { ConfirmDialog } from 'react-native-simple-dialogs';

interface Props {}

interface State {
  isLoading: boolean;
  workers: User[];
  dialogVisible: boolean;
}

interface Param {
  processId: string;
  materialId: string;
}

export default class AssignedWorkers extends BaseScreen<Props, State> {
  private processService: IProcessService = FactoryInjection.get<IProcessService>(PUBLIC_TYPES.IProcessService);
  private assignUser: User | null = null;
  private processId: string = CONSTANTS.STR_EMPTY;
  private materialId: string = CONSTANTS.STR_EMPTY;
  static navigationOptions = ({}) => {
    return {
      title: 'Workers'
    };
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      workers: [],
      dialogVisible: false
    };
    const param: Param | null = this.getParam<Param>(PARAMS.ITEM, null);
    this.initParam(param!.materialId, param!.processId);

    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.clickListItem = this.clickListItem.bind(this);
    this.clickAssignWorker = this.clickAssignWorker.bind(this);
    this.assignWorker = this.assignWorker.bind(this);
  }

  initParam = (materialId: string, processId: string): void => {
    this.materialId = materialId;
    this.processId = processId;
    this.loadData();
  };

  componentDidFocus = async (): Promise<void> => {
    await this.loadData();
  };
  componentWillMount = async (): Promise<void> => {
  
  };
  componentDidMount = async (): Promise<void> => {};
  refreshData = async (): Promise<void> => {};
  clickListItem = async (item: User, _index: number): Promise<void> => {
    const data: any = {
      materialId: this.materialId,
      processId: this.processId,
      workerId: item.id
    };
    const param: any = {};
    param[PARAMS.ITEM] = data;
    this.navigate(ROUTE.APP.MANUFACTORY.MATERIALS.ITEM.PROCESS.TASK.WORKERS.ACTIVITIES.DEFAULT, param);
  };

  receive = async (data: any, type: ObjectType, _extraData: any | null): Promise<void> => {
    this.assignUser = null;
    if (type === ObjectType.user) {
      this.assignUser = data as User;
      this.setState({ dialogVisible: true });
    }
  };

  clickAssignWorker = async (): Promise<void> => {
    // open qr scan

    this.navigateFunc(ROUTE.APP.SHARE.QRCODE, ObjectType.user, this.receive);
  };

  assignWorker = async (): Promise<void> => {
    this.setState({ isLoading: true, dialogVisible: false });
    const dto: AssignWorkerDto = await this.processService.assignWorker(
      this.assignUser!.id,
      this.materialId,
      this.processId
    );
    this.setState({ isLoading: false });
    if (dto.isSuccess) {
      if (dto.user) {
        const users: User[] = this.state.workers;
        users.push(dto.user!);
        this.setState({ workers: users });
      }
    }
  };

  private loadData = async (): Promise<void> => {
    if (this.state.isLoading) {
      return;
    }
    await this.setState({ isLoading: true });
    const dto: ProcessDto = await this.processService.getProcess(this.materialId, this.processId);
    await this.setState({ isLoading: false });

    if (dto.isSuccess && dto.process) {
      await this.setState({ workers: dto.process.workers });
    }
  };

  render() {
    return (
      <BasesSreen {...{ ...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus }}>
        <Grid style={{ flex: 1 }}>
          {this.state.workers.length === 0 && (
            <Row style={{ height: Styles.styles.row.heightControl }}>
              <Text style={[Styles.styleSheet.label, { width: '100%', textAlign: 'center' }]}>
                {`No workers assigned`}
              </Text>
            </Row>
          )}
          <Row>
            <List
              style={{ flex: 1, backgroundColor: Styles.color.Background }}
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
              renderRow={(data: User, _sectionID: string | number, rowID: string | number, _rowMap?: any) => (
                <ListItem
                  onPress={() => {
                    this.clickListItem(data!, Number(rowID));
                  }}
                  key={data!.id}
                  style={{
                    paddingRight: 0,
                    paddingLeft: 0,
                    backgroundColor: Number(rowID) % 2 === 0 ? Styles.color.Background : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Grid>
                    <Col>
                      <UserItem item={data} index={Number(rowID)} onClickHandle={this.clickListItem} />
                    </Col>
                  </Grid>
                </ListItem>
              )}
            />
          </Row>
        </Grid>
        <TouchableOpacity style={Styles.styleSheet.floatTouchable} onPress={this.clickAssignWorker}>
          <Image
            style={{ width: 70, height: 70, alignSelf: 'flex-end' }}
            resizeMode={'contain'}
            source={IMAGES.grayAdd}
          />
        </TouchableOpacity>
        <ConfirmDialog
          title="Assignment"
          message={`Do you want to assign ${this.assignUser ? this.assignUser.firstName : ''} to this task ?`}
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({ dialogVisible: false })}
          positiveButton={{ title: 'YES', onPress: this.assignWorker }}
          negativeButton={{ title: 'NO', onPress: () => alert('No touched!') }}
        />
      </BasesSreen>
    );
  }
}
