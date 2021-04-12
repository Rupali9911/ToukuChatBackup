// Library imports
import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';

// StyleSheet imports
import styles from './styles';

/**
 * Input with title component
 */
export default class InputWithTitle extends Component {
  // Update references
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
        />
      </View>
    );
  }
}
