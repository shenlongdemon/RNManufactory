import * as React from 'react';
import {View} from 'react-native';
import IBaseItem from './ibaseitem';

export default class BaseItem<TItem, S> extends React.Component<IBaseItem<TItem>, S> {
  
  constructor(props: IBaseItem<TItem>) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  
  onClick = (): void => {
    if (this.props.onClickHandle) {
      this.props.onClickHandle(this.props.item, this.props.index);
    }
  }
  
  render() {
    return (
      <View style={{flex: 1, width: '100%', height: '100%'}}>
        {this.props.children}
      </View>
    );
  }
}
