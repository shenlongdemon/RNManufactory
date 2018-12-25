import BaseSreen from "..//basescreen";
import {Grid, Row, Col} from "native-base";
import * as React from "react";
import {CONSTANTS, FactoryInjection, IBusinessService, PUBLIC_TYPES, CodeDescriptionDto} from 'business_core_app_react';
import {PARAMS} from "../../common";
import QRCode from 'react-native-qrcode-svg';
import * as IMAGE from '../../assets';
import {TouchableHighlight} from "react-native";

interface Props {
}

interface State {
  isLoading: boolean;
}

interface Param {
  code: string;
}

export default class QRCodeDisplay extends BaseSreen<Props, State> {
  static navigationOptions = ({}) => {
    return {
      title: 'QR Code Generator'
    };
  };
  
  private code: string = CONSTANTS.STR_EMPTY
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props) {
    super(props);
    const param: Param | null = this.getParam<Param>(PARAMS.ITEM, null);
    this.code = param ? param.code : CONSTANTS.STR_EMPTY;
    this.state = {
      isLoading: false
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    this.showCodeDescription = this.showCodeDescription.bind(this);
    
  }
  
  componentWillMount = async (): Promise<void> => {
  };
  
  componentDidMount = async (): Promise<void> => {
  
  };
  
  componentWillUnmount = async (): Promise<void> => {
  };
  
  private componentDidFocus = async (): Promise<void> => {
  
  };
  
  private showCodeDescription = async (): Promise<void> => {
    await this.setState({isLoading: true});
    const dto: CodeDescriptionDto = await this.businessService.getCodeDescription(this.code);
    await this.setState({isLoading: false});
  
    alert(dto.description);
  };
  
  render() {
    return (
      <BaseSreen {...{...this.props, isLoading: this.state.isLoading, componentDidFocus: this.componentDidFocus}}>
        <Grid>
          <Row>
            <Col style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableHighlight onPress={this.showCodeDescription}>
                <QRCode
                  logo={IMAGE.logo}
                  logoSize={80}
                  size={300}
                  value={this.code}
                  color={'white'}
                  backgroundColor={'black'}
                />
              </TouchableHighlight>
            </Col>
          </Row>
        </Grid>
      </BaseSreen>
    );
  }
}