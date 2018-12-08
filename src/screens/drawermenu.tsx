import * as React from 'react';
import { ScrollView, View, Image } from 'react-native';
import * as Styles from '../stylesheet';
import * as IMAGE from '../assets';
import { Grid, Row } from 'react-native-easy-grid';
import { Button, Text, Item } from 'native-base';

interface Props {

}

interface State {

}

export default class DrawerMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  
  render() {
    return (
      <View style={{flex: 1, backgroundColor: Styles.color.Navigation.Background}}>
        <ScrollView>
          <Grid style={{flex: 1}}>
            <Row style={{height:200, justifyContent: 'center'}}>
              <Image  source={IMAGE.profile} style={{height: 150, flex: 1}} resizeMode={'contain'} />
            </Row>
            <Row style={{flex: 1, height: Styles.styles.row.height}}>
            
            </Row>
            <Row style={{flex: 1, height: Styles.styles.row.height}}>
              <Item style={{flex: 1 }}>
              <Button style={{flex: 1 }} full transparent large light>
                <Text>Main</Text>
              </Button>
              </Item>
            </Row>
          </Grid>
        </ScrollView>
      </View>
    );
  };
}

