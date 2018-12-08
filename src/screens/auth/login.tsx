import * as React from 'react';
import {IAuthService, FactoryInjection, PUBLIC_TYPES, BaseDto, CONSTANTS} from 'business_core_app_react';
import BaseScreen from '../basescreen';
import {Grid, Row, Col} from 'react-native-easy-grid';
import {Form, Item, Label, Input, Icon, Button, Text} from 'native-base';
import {ROUTE} from "../routes";
import * as Styles from '../../stylesheet';
interface Props {
}

interface State {
  phone: string;
  password: string;
  isProcessing: boolean;
}

export default class Login extends BaseScreen<Props, State> {
  private authService: IAuthService = FactoryInjection.get<IAuthService>(PUBLIC_TYPES.IAuthService);
  
  constructor(props: Props) {
    super(props);
    this.state = {
      phone: CONSTANTS.STR_EMPTY,
      password: CONSTANTS.STR_EMPTY,
      isProcessing: false
    };
    this.clickLogin = this.clickLogin.bind(this);
  }
  
  componentDidMount = async (): Promise<void> => {
  
  }
  
  private async login(): Promise<void> {
    if (this.state.isProcessing) {
      return;
    }
    this.setState({isProcessing: true});
    const baseSdo: BaseDto = await this.authService.login(this.state.phone, this.state.password);
    if (baseSdo.isSuccess) {
      this.navigate(ROUTE.SWITCHFEATURE.DEFAULT);
    }
    else {
      // alert(baseSdo.message);
      this.navigate(ROUTE.SWITCHFEATURE.DEFAULT);
    }
    this.setState({isProcessing: false});
  
  }
  
  private async clickLogin(): Promise<void> {
    await this.login();
  }
  
  render() {
    return (
      <BaseScreen {...{...this.props}}>
        <Grid>
          <Row size={2}></Row>
          <Row size={3}>
            <Grid>
              <Col size={1}></Col>
              <Col size={4}>
                <Form>
                  <Item floatingLabel>
                    <Icon style={{color: Styles.color.Icon}} name='call' />
                    <Label >Phone</Label>
                    <Input keyboardType={'phone-pad'}
                           onChangeText={(text: string) => {this.setState({phone: text})}}
                           value={this.state.phone}
                    />
                  </Item>
                  <Item floatingLabel>
                    <Icon style={{color: Styles.color.Icon}} name='key' />
                    <Label>Password</Label>
                    <Input
                           secureTextEntry={true}
                           onChangeText={(text: string) => {this.setState({password: text})}}
                           value={this.state.password}/>
                  </Item>
                  <Button full onPress={this.clickLogin} style={{marginTop: 100}}>
                    <Text>{this.state.isProcessing ? 'Logging in ...' : 'Login'}</Text>
                  </Button>
                
                </Form>
              
              </Col>
              <Col size={1}></Col>
            </Grid>
          </Row>
          <Row size={2}></Row>
        
        </Grid>
      </BaseScreen>
    );
  }
}