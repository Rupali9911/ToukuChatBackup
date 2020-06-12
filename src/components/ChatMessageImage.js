import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { Colors } from '../constants';

const { width, height } = Dimensions.get('window');

export default class ChatMessageImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { message, isUser, isPortrait, orientation } = this.props;

    return (
      message.message_body && (
        <View
          style={[
            styles.imageContainer,
            !isUser && { marginLeft: 5 },
            isPortrait && {
              minHeight:
                orientation === 'PORTRAIT' ? height * 0.4 : height * 1.5,
            },
          ]}
        >
          <Image
            source={{ uri: message.message_body }}
            style={isPortrait ? styles.imagePortrait : styles.image}
            resizeMode={'cover'}
          />
        </View>
      )
    );
  }
}
const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'flex-end',
    marginVertical: 15,
    borderRadius: 10,
    width: width * 0.65,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  imagePortrait: {
    flex: 1,
    height: null,
    width: null,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
});
