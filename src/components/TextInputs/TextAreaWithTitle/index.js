// Library imports
import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';

// StyleSheet imports
import styles from './styles';

/**
 * Text area with title component
 */
export default class TextAreaWithTitle extends Component {
  // Update references if available
  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }
  s;

  render() {
    const {
      onChangeText,
      title,
      value,
      rightTitle,
      maxLength,
      extraHeight,
      titleFontColor,
      titleFontSize,
      isBorder,
      placeholder,
    } = this.props;

    const titleContainer = {
      flex: rightTitle ? 0.5 : 1,
    };

    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <View style={titleContainer}>
            <Text
              style={[
                styles.title,
                titleFontColor && {color: titleFontColor},
                titleFontSize && {fontSize: titleFontSize},
              ]}>
              {title}
            </Text>
          </View>
          {rightTitle && (
            <View style={styles.rightTitleContainer}>
              <Text
                style={[
                  styles.rightFont,
                  titleFontSize && {fontSize: titleFontSize - 2},
                ]}>
                {rightTitle}
              </Text>
            </View>
          )}
        </View>
        <TextInput
          style={[
            styles.textBox,
            extraHeight && {height: extraHeight},
            isBorder && styles.textInputBorder,
          ]}
          multiline={true}
          numberOfLines={10}
          onChangeText={onChangeText}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder ? placeholder : ''}
        />
      </View>
    );
  }
}
