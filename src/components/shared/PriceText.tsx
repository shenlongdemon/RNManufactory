import * as React from 'react';
import { Text, Icon, View } from 'native-base';
import { FactoryInjection, PUBLIC_TYPES, IBusinessService } from 'business_core_app_react';
interface Props {
  price: number;
  fontSize: number;
  color: string;
}

interface State {
}

export default class PriceText extends React.Component<Props, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props) {
    super(props);
   
  }
  
  render() {
    const str : string = this.businessService.formatPrice(this.props.price);
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ color: this.props.color, fontSize: this.props.fontSize }}>
          {str}
        </Text>
        <Icon style={{
          marginLeft: 0, color: this.props.color, fontSize: this.props.fontSize, justifyContent: 'center',
          alignSelf: 'center', alignContent: 'center'
        }} name='logo-usd'/>
      </View>
      
    );
    
  }
}
