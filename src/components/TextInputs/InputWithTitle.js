import React, {Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Colors, Icons, Fonts} from '../../constants';
import {globalStyles} from '../../styles';

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
    const {
      onChangeText,
      title,
      titleStyle,
      value,
      placeholder,
      keyboardType,
    } = this.props;
    return (
      <View style={styles.container}>
        {title && (
          <Text style={titleStyle ? titleStyle : styles.title}>{title}</Text>
        )}
        <TextInput
          style={styles.inputBox}
          onChangeText={onChangeText}
          value={value}
          keyboardType={keyboardType ? keyboardType : 'default'}
          placeholder={placeholder ? placeholder : ''}
          placeholderTextColor={'grey'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontFamily: Fonts.light,
    color: Colors.textTitle_orange,
  },
  inputBox: {
    height: 35,
    borderWidth: Platform.OS === 'android' ? 0.2 : 0.5,
    backgroundColor: Colors.white,
    borderRadius: 7,
    borderColor: Colors.gray_dark,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontFamily: Fonts.light,
    fontSize: 13,
    color: Colors.black,
  },
});
