import React, { Fragment, Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Clipboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Menu, Divider } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Colors, Icons, Fonts, Images } from '../constants';
import { translate, setI18nConfig } from '../redux/reducers/languageReducer';
const { width, height } = Dimensions.get('window');
let borderRadius = 20;
export default class ChatMessageImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onCopy = (message) => {
    Clipboard.setString(message);
  };

  renderReplyMessage = (replyMessage) => {
    return (
      <View
        style={{
          backgroundColor: this.props.isUser ? '#FFDBE9' : Colors.gray,
          padding: 5,
          width: '100%',
          borderRadius: 5,
          marginBottom: 5,
        }}
      >
        <View
          style={{
            flex: 3,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text numberOfLines={2} style={{ color: Colors.gradient_1 }}>
            {replyMessage.isUser ? 'You' : replyMessage.userName}
          </Text>
        </View>
        <View
          style={{
            flex: 7,
            justifyContent: 'center',
            width: '95%',
          }}
        >
          <Text numberOfLines={2} style={{ fontFamily: Fonts.extralight }}>
            {replyMessage.message}
          </Text>
        </View>
      </View>
    );
  };

  renderMenuItem = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 0.2 }}>
          <Text>q</Text>
        </View>
        <View style={{ flex: 0.8 }}>
          <Text>vujfbkud</Text>
        </View>
      </View>
    );
  };

  render() {
    const { message, isUser, isPortrait } = this.props;
    return (
      <View
        style={[
          styles.imageContainer,
          !isUser && { marginLeft: 5, width: '90%' },
          isPortrait && { minHeight: height * 0.4, width: '85%' },
        ]}
      >
        <Image
          source={{ uri: message.url }}
          style={isPortrait ? styles.imagePortrait : styles.image}
          resizeMode={'cover'}
        />
      </View>
    );
    // ) : (
    //   <View
    //     style={[
    //       styles.imageContainer,
    //       isPortrait && { width: '85%', minHeight: height * 0.4 },
    //     ]}
    //   >
    //     <Image
    //       source={{ uri: message.url }}
    //       style={isPortrait ? styles.imagePortrait : styles.image}
    //       resizeMode={'cover'}
    //     />
    //   </View>
    // );
  }
}
const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'flex-end',
    marginVertical: 15,
    borderRadius: 10,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  imagePortrait: {
    flex: 1,
    height: null,
    width: null,
    borderRadius: 10,
  },
});
