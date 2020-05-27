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

export default class TextAreaWithTitle extends Component {
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
    const { onChangeText, title, value, rightTitle } = this.props;
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              flex: rightTitle ? 0.5 : 1,
            }}
          >
            <Text>{title}</Text>
          </View>
          {rightTitle && (
            <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
              <Text>{rightTitle}</Text>
            </View>
          )}
        </View>
        <TextInput
          style={styles.textBox}
          multiline={true}
          numberOfLines={10}
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
  textBox: {
    borderWidth: 0.2,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: 'gray',
    marginTop: 10,
    height: 100,
    textAlignVertical: 'top',
  },
});
