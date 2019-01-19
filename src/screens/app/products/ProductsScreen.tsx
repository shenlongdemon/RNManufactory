import BasesSreen from '../../basescreen';
import {
  Icon,
  Text,
  Tabs,
  ScrollableTab,
  Tab,
  TabHeading
} from 'native-base';
import * as React from 'react';
import * as Styles from '../../../stylesheet';
import ByCategoryTab from './tabs/ByCategoryTab';
import BLEAroundTab from './tabs/BLEAroundTab';

interface Props {}

interface State {

}

export default class ProductsScreen extends BasesSreen<Props, State> {
  static navigationOptions = ({}) => {
    return {
      title: 'Products'
    };
  };
  constructor(props) {
    super(props);
    this.componentDidFocus = this.componentDidFocus.bind(this);
  }


  componentWillMount = async (): Promise<void> => {
  
  };

  componentDidMount = async (): Promise<void> => {};

  componentWillUnmount = async (): Promise<void> => {};

  private componentDidFocus = async (): Promise<void> => {};


  render() {
    return (
      <BasesSreen {...{ ...this.props, componentDidFocus: this.componentDidFocus }}>
        {
          <Tabs
            locked={true}
            renderTabBar={() => <ScrollableTab />}
            tabBarBackgroundColor={Styles.color.Background}
            tabBarUnderlineStyle={{ borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}
          >
            {/*
             // @ts-ignore */}
            <Tab
              style={{ backgroundColor: Styles.color.Background }}
              heading={
                <TabHeading>
                  <Icon name="information-circle" />
                  <Text>By Categories</Text>
                </TabHeading>
              }
            >
              <ByCategoryTab />
            </Tab>
            {/*
             // @ts-ignore */}
            <Tab
              style={{ backgroundColor: Styles.color.Background }}
              heading={
                <TabHeading>
                  <Icon name={'bluetooth'} />
                  <Text>BLE Around</Text>
                </TabHeading>
              }
            >
              <BLEAroundTab />
            </Tab>
          </Tabs>
        }
      </BasesSreen>
    );
  }
}
