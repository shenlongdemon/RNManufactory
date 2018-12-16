import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet} from "react-native";

const color = {
  Background: '#00',
  BackgroundListItemHighlight: 'rgba(255, 255, 255, 0.1)',
  Icon: '#ffffff',
  Indicator: 'rgba(255, 255, 255, 0.5)',
  Red: '#ff0000',
  Text: '#ffffff',
  TextNegative: '#000000',
  Identifier: '#138dd1',
  rtxt: {
    background: 'rgba(53, 53, 53, 0.5)'
  },
  field: {
    border: 'rgba(53, 53, 53, 0.5)'
  },
  Navigation: {
    Background: '#000000',
    Tint: '#ffffff',
  },
  Map: {
    Line: '#ffffff',
  },
  Error: {
    Message: '#ff0000',
  },
  list: {
    itemDivider: '#444444'
  }
};

const fontWeight = {
  normal: 'normal',
  bold: 'bold'
};

const styles = {
  Navigation: {
    FontWeight: fontWeight.bold,
  },
  containerControl: [
    {justifyContent: 'center'},
    {height: 60}
  ],
  row : {
    height: 70,
    heightDescription: 150,
    backgroundColor: '#0000ff'
  }
};

const styleSheet = StyleSheet.create({
  label: {
    color: color.Text
  },
  identifier: {
    color: color.Identifier
  },
  caption: {
    color: color.Text,
    fontWeight: 'bold'
  },
  floatTouchable: {
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 70,
    height: 70
  },
  rowControl: {
    flex: 1,
    height: 60,
  },
  rowThumbnail: {
    flex: 1,
    height: 100,
    marginTop:10,
    marginBottom:10
  },
  rowInput: {
    flex: 1,
    height: 60,
  },
  row: {
    height: 70
  },
  icon: {
    color: color.Icon
  }
});


const props = {
  btn: {
    borderRadius: 10,
    buttonStyle: {backgroundColor: color.Background},
    containerViewStyle: {borderColor: color.Background},
    large: true,
    textStyle: {color: color.Text},
  },
  txt: {
    iconClass: MaterialIcons,
    iconColor: color.Icon,
    inputStyle: {color: color.Text},
    labelStyle: {color: color.Text},
    style: {height: 50, backgroundColor: color.rtxt.background},
    useNativeDriver: true,
    autoCapitalize: false,
    autoCorrect: false,
    borderColor: color.field.border,
  },
  field: {
    iconClass: MaterialIcons,
    iconColor: color.Icon,
    inputStyle: {color: color.Text},
    labelStyle: {color: color.Text},
    style: {height: 50, backgroundColor: color.Background},
    borderColor: color.field.border,
    autoCapitalize: true,
    autoCorrect: false
  },
  /**
   * for Jiro
   */
  rtxt: {
    multiline: true,
    inputStyle: {color: color.Text, fontWeight: fontWeight.normal, textAlignVertical: 'top'},
    labelStyle: {color: color.Text},
    style: {backgroundColor: color.rtxt.background, flex:1},
    borderColor: color.rtxt.background,
    autoCapitalize: true,
    autoCorrect: false
  },
  errorTxt: {
    style: {color: color.Error.Message}
  }
};

export {props, color, styles, styleSheet};
