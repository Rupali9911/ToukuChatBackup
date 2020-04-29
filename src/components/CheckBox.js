import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../constants';

export default class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getGradientColors() {
    if (this.props.isChecked) {
      return [Colors.gradient_3, Colors.gradient_2, Colors.gradient_1];
    } else {
      return [Colors.white, Colors.white, Colors.white];
    }
  }

  render() {
    const {onCheck, isChecked} = this.props;
    return (
      <TouchableOpacity
        style={{
          width: 14,
          height: 14,
          borderRadius: 4,
          margin: 5,
        }}
        onPress={onCheck}>
        <LinearGradient
          start={{x: 0.1, y: 0.7}}
          end={{x: 0.5, y: 0.8}}
          locations={[0.1, 0.6, 1]}
          colors={this.getGradientColors()}
          style={{flex: 1, borderRadius: 4}}
        />
      </TouchableOpacity>
    );
  }
}
