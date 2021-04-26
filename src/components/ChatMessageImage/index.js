import React, {Component} from 'react';
import {Dimensions, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../constants';
import styles from './styles';

const {height} = Dimensions.get('window');

export default class ChatMessageImage extends Component {
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
