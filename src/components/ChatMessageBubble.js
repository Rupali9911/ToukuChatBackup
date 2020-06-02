import React, { Fragment, Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Menu, Divider } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { Colors, Icons, Fonts, Images } from '../constants';
import { translate, setI18nConfig } from '../redux/reducers/languageReducer';

const { width, height } = Dimensions.get('window');
let borderRadius = 20;
export default class ChatMessageBubble extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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

  render() {
    const {
      message,
      isUser,
      onMessageReply,
      onMessagePress,
      longPressMenu,
      closeMenu,
      openMenu,
      selectedMessageId,
    } = this.props;
    return (
      <Menu
        contentStyle={{
          backgroundColor: Colors.gradient_3,
          opacity: 0.9,
        }}
        visible={longPressMenu}
        onDismiss={closeMenu}
        anchor={
          !isUser ? (
            <View style={styles.talkBubble}>
              <View style={{ marginLeft: 5 }}>
                <View style={styles.talkBubbleAbsoluteLeft} />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    minHeight: 40,
                    backgroundColor: Colors.white,
                    borderRadius: borderRadius,
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}
                  onLongPress={(id) => {
                    onMessagePress(message.id);
                  }}
                >
                  {message.repliedTo &&
                    this.renderReplyMessage(message.repliedTo)}
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: Fonts.light,
                    }}
                  >
                    {message.message}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.talkBubble}>
              <View style={styles.talkBubbleAbsoluteRight} />
              <LinearGradient
                colors={[
                  Colors.gradient_3,
                  Colors.gradient_2,
                  Colors.gradient_1,
                ]}
                style={{
                  minHeight: 40,
                  borderRadius: borderRadius,
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                }}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onLongPress={() => {
                    onMessagePress(message.id);
                  }}
                  activeOpacity={0.8}
                >
                  {message.repliedTo &&
                    this.renderReplyMessage(message.repliedTo)}
                  <Text style={{ color: 'white', fontSize: 15 }}>
                    {message.message}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )
        }
      >
        <Menu.Item
          titleStyle={{ color: Colors.white }}
          icon={Icons.icon_camera}
          onPress={() => {
            closeMenu();
          }}
          title={translate('common.translate')}
        />
        <Menu.Item
          titleStyle={{ color: Colors.white }}
          icon="desktop-mac"
          onPress={() => {
            onMessageReply(selectedMessageId);
            closeMenu();
          }}
          title={translate('common.reply')}
        />
        <Menu.Item
          titleStyle={{ color: Colors.white }}
          icon="pencil"
          onPress={() => {
            closeMenu();
          }}
          title={translate('common.edit')}
        />
        <Menu.Item
          titleStyle={{ color: Colors.white }}
          icon="delete"
          onPress={() => {
            closeMenu();
          }}
          title={translate('common.delete')}
        />
        <Menu.Item
          titleStyle={{ color: Colors.white }}
          icon={() => <Image source={Icons.icon_camera} />}
          onPress={() => {
            closeMenu();
          }}
          title={translate('common.unsend')}
        />
        <Menu.Item
          titleStyle={{ color: Colors.white }}
          icon={() => <FontAwesome name={'music'} />}
          onPress={() => {
            closeMenu();
          }}
          title={translate('common.copy')}
        />
      </Menu>
    );
  }
}

const styles = StyleSheet.create({
  talkBubble: {
    justifyContent: 'flex-end',
    marginVertical: 15,
  },
  talkBubbleAbsoluteRight: {
    width: 120,
    height: 60,
    alignSelf: 'flex-end',
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderTopColor: 'transparent',
    borderTopWidth: 25,
    borderLeftWidth: 13,
    borderLeftColor: Colors.gradient_3,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
    right: -35,
    top: -65,
  },
  talkBubbleAbsoluteLeft: {
    width: 120,
    height: 60,
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderTopColor: 'transparent',
    borderTopWidth: 25,
    borderRightWidth: 13,
    borderRightColor: Colors.white,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    transform: [{ rotate: '90deg' }],
    left: -35,
    top: -65,
  },
});
