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
export default class GroupChatMessageBubble extends Component {
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
                  onLongPress={(msg_id) => {
                    onMessagePress(message.msg_id);
                  }}
                >
                  {/* {message.repliedTo &&
                    this.renderReplyMessage(message.repliedTo)} */}
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: Fonts.light,
                    }}
                  >
                    {message.message_body.text}
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
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}
                  onLongPress={(msg_id) => {
                    onMessagePress(message.msg_id);
                  }}
                  activeOpacity={0.8}
                >
                  {/* {message.repliedTo &&
                    this.renderReplyMessage(message.repliedTo)} */}
                  <Text style={{ color: 'white', fontSize: 15 }}>
                    {message.message_body.text}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )
        }
      >
        <Menu.Item
          titleStyle={{ color: Colors.white }}
          icon={() => (
            <FontAwesome5 name={'language'} size={20} color={Colors.white} />
          )}
          onPress={() => {
            closeMenu();
          }}
          title={translate('common.translate')}
          titleStyle={{ marginLeft: -25, color: Colors.white }}
        />
        <Menu.Item
          titleStyle={{ color: Colors.white }}
          icon={() => (
            <FontAwesome5 name={'language'} size={20} color={Colors.white} />
          )}
          onPress={() => {
            onMessageReply(selectedMessageId);
            closeMenu();
          }}
          title={translate('common.reply')}
          titleStyle={{ marginLeft: -25, color: Colors.white }}
        />
        <Menu.Item
          titleStyle={{ color: Colors.white }}
          icon={() => (
            <FontAwesome5 name={'pencil-alt'} size={20} color={Colors.white} />
          )}
          onPress={() => {
            closeMenu();
          }}
          title={translate('common.edit')}
          titleStyle={{ marginLeft: -25, color: Colors.white }}
        />
        <Menu.Item
          titleStyle={{ color: Colors.white }}
          icon={() => (
            <FontAwesome name={'trash'} size={20} color={Colors.white} />
          )}
          onPress={() => {
            closeMenu();
          }}
          title={translate('common.delete')}
          titleStyle={{ marginLeft: -25, color: Colors.white }}
        />
        <Menu.Item
          titleStyle={{ color: Colors.white }}
          icon={() => (
            <FontAwesome5
              name={'minus-circle'}
              size={20}
              color={Colors.white}
            />
          )}
          onPress={() => {
            closeMenu();
          }}
          title={translate('common.unsend')}
          titleStyle={{ marginLeft: -25, color: Colors.white }}
        />
        <Menu.Item
          titleStyle={{ color: Colors.white }}
          icon={() => (
            <FontAwesome5 name={'copy'} size={20} color={Colors.white} />
          )}
          onPress={() => {
            this.onCopy(message.message_body);
            closeMenu();
          }}
          title={translate('common.copy')}
          titleStyle={{ marginLeft: -25, color: Colors.white }}
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
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderTopColor: 'transparent',
    borderTopWidth: 12.5,
    borderLeftWidth: 6.5,
    borderLeftColor: Colors.gradient_3,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
    right: -5,
    top: -15,
  },
  talkBubbleAbsoluteLeft: {
    width: 30,
    height: 30,
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderTopColor: 'transparent',
    borderTopWidth: 12.5,
    borderRightWidth: 6.5,
    borderRightColor: Colors.white,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    transform: [{ rotate: '90deg' }],
    left: -5,
    top: -15,
  },
});
