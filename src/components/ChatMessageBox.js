import React, { Fragment, Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import ChatMessageBubble from './ChatMessageBubble';

import { Colors, Icons, Fonts, Images } from '../constants';
import RoundedImage from './RoundedImage';
import ChatMessageImage from './ChatMessageImage';
const { width, height } = Dimensions.get('window');

export default class ChatMessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      longPressMenu: false,
      selectedMessageId: null,
      isPortrait: false,
    };
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  _openMenu = () => this.setState({ longPressMenu: true });

  _closeMenu = () => this.setState({ longPressMenu: false });

  layoutChange = (event) => {
    var { x, y, width, height } = event.nativeEvent.layout;
    borderRadius = height / 2;
    if (height > 40) {
      borderRadius = height / 2;
    }
  };

  onMessagePress = (id) => {
    console.log('ChatMessageBox -> onMessagePress -> id', id);
    this.setState({ selectedMessageId: id });
    this._openMenu();
  };

  isPortrait = async (url) => {
    await Image.getSize(url, (width, height) => {
      this.setState({
        isPortrait: height > width,
      });
    });
  };
  render() {
    const { longPressMenu, selectedMessageId, isPortrait } = this.state;
    const {
      message,
      isUser,
      time,
      status,
      onMessageReply,
      orientation,
    } = this.props;
    message.msg_type === 'image' && this.isPortrait(message.message_body);
    return !isUser ? (
      <View
        style={[
          styles.container,
          {
            justifyContent: 'flex-start',
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginVertical: 5,
          }}
        >
          <RoundedImage
            source={Images.image_default_profile}
            size={50}
            resizeMode={'cover'}
          />
          <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
            {message.msg_type === 'image' ? (
              <ChatMessageImage
                message={message}
                isUser={isUser}
                isPortrait={isPortrait}
                orientation={orientation}
              />
            ) : (
              <ChatMessageBubble
                message={message}
                isUser={isUser}
                onMessageReply={onMessageReply}
                onMessagePress={(id) => this.onMessagePress(id)}
                longPressMenu={longPressMenu}
                openMenu={this._openMenu}
                closeMenu={this._closeMenu}
                selectedMessageId={selectedMessageId}
              />
            )}
            <View
              style={{
                marginHorizontal: '1.5%',
                alignItems: 'center',
                marginVertical: 15,
              }}
            >
              <Text style={styles.statusText}>{status}</Text>
              <Text
                style={styles.statusText}
              >{`${time.getHours()}:${time.getMinutes()}`}</Text>
            </View>
          </View>
        </View>
      </View>
    ) : (
      <View
        style={[
          styles.container,
          {
            alignItems: 'flex-end',
            alignSelf: 'flex-end',
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
        >
          <View
            style={{
              marginHorizontal: '1.5%',
              alignItems: 'center',
              marginVertical: 15,
            }}
          >
            <Text style={styles.statusText}>{status}</Text>
            <Text style={styles.statusText}>
              {`${time.getHours()}:${time.getMinutes()}`}
            </Text>
          </View>
          {message.msg_type === 'image' ? (
            <ChatMessageImage
              message={message}
              isUser={isUser}
              isPortrait={isPortrait}
              orientation={orientation}
            />
          ) : (
            <ChatMessageBubble
              message={message}
              isUser={isUser}
              onMessageReply={onMessageReply}
              onMessagePress={(id) => this.onMessagePress(id)}
              longPressMenu={longPressMenu}
              openMenu={this._openMenu}
              closeMenu={this._closeMenu}
              selectedMessageId={selectedMessageId}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxWidth: width * 0.65,
    paddingHorizontal: '3%',
  },
  statusText: {
    color: Colors.gradient_1,
    fontFamily: Fonts.light,
  },
});
