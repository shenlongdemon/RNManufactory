import {Card, CardItem, DeckSwiper, Grid, Row, Text, View} from "native-base";
import * as React from "react";
import {
  DynProperty,
  FactoryInjection,
  IBusinessService,
  Item,
  Process,
  PUBLIC_TYPES
} from "business_core_app_react";
import * as Styles from "../../../../stylesheet";
import {Image, ScrollView} from 'react-native';

interface Props {
  item: Item;
}


interface State {
  isLoading: boolean;
}

export default class InfoItemTab extends React.Component<Props, State> {
  private businessService: IBusinessService = FactoryInjection.get<IBusinessService>(PUBLIC_TYPES.IBusinessService);
  
  constructor(props) {
    super(props);
    
    this.state = {
      isLoading: false
    };
    this.componentDidFocus = this.componentDidFocus.bind(this);
    
  }
  
  componentWillMount = async (): Promise<void> => {
  };
  
  componentDidMount = async (): Promise<void> => {
  
  };
  
  componentWillUnmount = async (): Promise<void> => {
  };
  
  private componentDidFocus = async (): Promise<void> => {
  
  };
  
  private renderProcess = (p: Process): any[] => {
    const controls: any[] = [];
    controls.push(<Row style={{height: Styles.styles.row.heightControl, flexDirection: 'row'}}>
      <Text style={{color: Styles.color.Text, fontSize: 22}}>{p.name}</Text>
    </Row>);
    const properties: any[] = p.dynProperties.map((d: DynProperty): any => {
      return (
        <Row style={{height: Styles.styles.row.heightControl, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{color: Styles.color.Text}}>{d.title}</Text>
          <Text style={{color: Styles.color.Text, width: '50%'}}>{d.value}</Text>
        </Row>
      );
    });
    controls.push.apply(controls, properties);
    return controls;
  };
  
  private renderMaterial = (): any[] => {
    const controls: any[] = [];
    
    if (this.props.item.material) {
      controls.push(<Row style={{height: Styles.styles.row.heightControl, flexDirection: 'row'}}>
        <Text style={{color: Styles.color.Text, fontSize: 24}}>{this.props.item.material.name}</Text>
      </Row>);
      this.props.item.material.processes.forEach((p: Process): void => {
        controls.push.apply(controls, this.renderProcess(p));
      });
    }
    
    return controls;
  };
  
  render() {
    const imageLinks: string [] = this.businessService.getImages(this.props.item);
    const updateTime: string = `${this.businessService.toDateString(this.props.item.time)} ${this.businessService.toTimeString(this.props.item.time)}`;
    return (
      <Grid style={{flex: 1, backgroundColor: Styles.color.Background}}>
        <Row style={{height: 150}}>
          <View style={{flex: 1}}>
            <DeckSwiper
              dataSource={imageLinks}
              renderItem={item =>
                <Card style={{
                  elevation: 3,
                  height: 150,
                  backgroundColor: Styles.color.Background,
                  borderColor: 'rgba(255,255,255,0.0)'
                }}>
                  <CardItem cardBody style={{backgroundColor: Styles.color.Background, borderWidth: 0}}>
                    <Image style={{
                      width: '100%',
                      height: 150,
                      resizeMode: 'contain',
                      backgroundColor: Styles.color.Background
                    }} source={{uri:item}}/>
                  </CardItem>
                </Card>
              }
            />
          </View>
        </Row>
        <Row style={{height:30}}></Row>
        <Row>
          <ScrollView>
            <Grid>
              <Row style={{height: Styles.styles.row.heightControl, justifyContent: 'center', flexDirection: 'column'}}>
                <Text style={{textAlign: 'center', fontSize: 28}}>{this.props.item.name}</Text>
                <Text style={{textAlign: 'center'}}>(update at {updateTime})</Text>
              </Row>
              <Row style={{height: Styles.styles.row.heightDescription}}>
                <Text style={{marginTop: 20}}>{this.props.item.description}</Text>
              
              </Row>
              {
                this.renderMaterial()
              }
            </Grid>
          </ScrollView>
        </Row>
      </Grid>
    );
  }
}