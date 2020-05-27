import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Fonts, Colors } from '../../constants';

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
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              flex: rightTitle ? 0.5 : 1,
            }}
          >
            <Text
              style={[
                titleFontColor && { color: titleFontColor },
                titleFontSize && { fontSize: titleFontSize },
              ]}
            >
              {title}
            </Text>
          </View>
          {rightTitle && (
            <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
              <Text style={styles.rightFont}>{rightTitle}</Text>
            </View>
          )}
        </View>
        <TextInput
          style={[
            styles.textBox,
            extraHeight && { height: extraHeight },
            isBorder && { borderWidth: 1, borderColor: Colors.orange },
          ]}
          multiline={true}
          numberOfLines={10}
          onChangeText={onChangeText}
          value={value}
          maxLength={maxLength}
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
    paddingHorizontal: 10,
  },
  rightFont: {
    fontFamily: Fonts.extralight,
  },
});
