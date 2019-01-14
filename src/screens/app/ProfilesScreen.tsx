import BasesSreen from "../basescreen";
import {Button, Grid, Icon, Row, Thumbnail} from "native-base";
import * as React from "react";
import {
  FactoryInjection,
  IBusinessService,
  PUBLIC_TYPES,
  User,
  CONSTANTS,
  IAuthService
} from "business_core_app_react";
import * as IMAGE from "../../assets";
import QRCode from "react-native-qrcode-svg";
import {PARAMS} from "../../common";
import * as Styles from "../../stylesheet";
import {ROUTE} from "../routes";

interface Props {
}

interface State {
  isLoading: boolean;
  user: User | null;
}

export default class ProfilesScreen extends BasesSreen<Props, State> {
  
  static navigationOptions = ({navigation}) => {
    return {
      title: 'My Profile',
      headerRight: (
        <Button onPress={navigation.getParam(PARAMS.HANDLE_RIGHT_HEADER_BUTTON)}>
          <Icon name={'power'} style={{color: Styles.color.Icon, fontSize: 35}}/>
        </Button>
      ),
    };
  };
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  private authService: IAuthService = FactoryInjection.get<IAuthService>(PUBLIC_TYPES.IAuthService);
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      user: null
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    
  }
  componentDidUpdate = async (_prevProp: Props, _prevState: State): Promise<void> => {
  
  };
  componentWillMount = async (): Promise<void> => {
    this.setHeader();
  };
  
  componentDidMount = async (): Promise<void> => {
  
  };
  
  private setHeader = (): void => {
    const data: any = {};
    data[PARAMS.HANDLE_RIGHT_HEADER_BUTTON] = this.logout;
    this.setSellNavigateParam(data);
  };
  
  private logout = async () : Promise<void> => {
    await this.authService.logout();
    this.navigate(ROUTE.LOGIN)
  };
  componentWillUnmount = async (): Promise<void> => {
  };
  
  private componentDidFocus = async (): Promise<void> => {
    const user: User = await  this.businessService.getUser();
    this.setState({user});
  };
  
  render() {
    const imageLink: string = this.businessService.getLink(this.state.user ? this.state.user.imageUrl : CONSTANTS.STR_EMPTY);
    return (
      <BasesSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Grid style={{marginTop: 40}}>
          <Row style={{height: 200, flexDirection: 'row', justifyContent: 'center'}}>
            <Thumbnail style={{width: 150, height: 150}} source={{uri: imageLink}}/>
          </Row>
          <Row style={{flexDirection: 'row', justifyContent: 'center'}}>
            <QRCode
              logo={IMAGE.logo}
              logoSize={80}
              size={300}
              value={this.state.user ? this.state.user.id : 'CONSTANTS.STR_EMPTY'}
              color={'white'}
              backgroundColor={'black'}
            />
          </Row>
        </Grid>
      </BasesSreen>
    );
  }
}