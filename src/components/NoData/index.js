import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {globalStyles} from '../../styles';
import {Colors} from '../../constants';

export default class NoData extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {title} = this.props;
    return (
      <View
        style={{padding: 15, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={[globalStyles.smallRegularText, {color: Colors.black}]}>
          {title}
        </Text>
      </View>
    );
  }
}
