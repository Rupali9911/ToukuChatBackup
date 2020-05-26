import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Colors, Icons, Fonts } from '../../constants';
import { globalStyles } from '../../styles';

export default class InputWithTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  render() {
    const { onChangeText, title, value } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <TextInput
          style={styles.inputBox}
          onChangeText={onChangeText}
          value={value}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {},
  inputBox: {
    height: 35,
    borderWidth: 0.2,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderColor: Colors.gray,
    marginTop: 10,
  },
});
