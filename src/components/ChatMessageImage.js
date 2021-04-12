import React, {Component} from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Colors} from '../constants';

const {width, height} = Dimensions.get('window');

export default class ChatMessageImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getGradients(isUser) {
    if (isUser) {
      return [Colors.gradient_3, Colors.gradient_2, Colors.gradient_1];
    } else {
      return [Colors.white, Colors.white, Colors.white];
    }
  }

  render() {
    const {message, isUser, isPortrait, orientation} = this.props;

    return (
      message.message_body && (
        <LinearGradient
          colors={this.getGradients(isUser)}
          style={[
            styles.imageContainer,
            !isUser && styles.isNotUser,
            isPortrait && {
              minHeight:
                orientation === 'PORTRAIT' ? height * 0.4 : height * 1.5,
            },
          ]}>
          <Image
            source={{uri: message.message_body}}
            style={isPortrait ? styles.imagePortrait : styles.image}
            resizeMode={'cover'}
          />
        </LinearGradient>
      )
    );
  }
}
const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'flex-end',
    marginBottom: 15,
    marginTop: 5,
    borderRadius: 10,
    padding: 10,
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
  isNotUser: {
    marginLeft: 5,
  },
});
