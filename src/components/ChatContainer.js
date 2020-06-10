import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import ChatMessageBox from './ChatMessageBox';
import ChatInput from './TextInputs/ChatInput';
import {translate} from '../redux/reducers/languageReducer';
import {Colors, Fonts, Images, Icons} from '../constants';
import NoData from './NoData';
import {isIphoneX} from '../utils';
const {width, height} = Dimensions.get('window');

class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderMessage = (messages) => {
    if (!messages || !messages.length) {
      return (
        <NoData
          title={translate('pages.xchat.startANewConversationHere')}
          source={Images.image_conversation}
          imageColor={Colors.primary}
          imageAvailable
        />
      );
    }
    const msg = messages.map((item, index) => {
      return (
        <ChatMessageBox
          key={item.id}
          message={item}
          isUser={item.from_user.id === this.props.userData.id ? true : false}
          time={new Date(item.created)}
          // status={item.status}
          onMessageReply={(id) => this.props.onMessageReply(id)}
          orientation={this.props.orientation}
        />
      );
    });

    return (
      <Fragment>
        <View style={chatStyle.messageDateCntainer}>
          <View style={chatStyle.messageDate}>
            <Text style={chatStyle.messageDateText}>
              {moment(new Date()).format('MM/DD')}
            </Text>
          </View>
        </View>
        {msg}
      </Fragment>
    );
  };

  render() {
    const {
      orientation,
      isReply,
      messages,
      repliedMessage,
      handleMessage,
      onMessageSend,
      newMessageText,
      cancelReply,
    } = this.props;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{flex: 1}}
        showsVerticalScrollIndicator={false}
        bounces={false}
        ref={(view) => {
          this.keyboardAwareScrollView = view;
        }}
        onKeyboardDidShow={(contentWidth, contentHeight) => {
          this.scrollView.scrollToEnd();
        }}>
        <View
          style={[
            chatStyle.messageAreaConatiner,
            {
              paddingBottom:
                Platform.OS === 'android'
                  ? orientation === 'PORTRAIT'
                    ? height * 0.03
                    : height * 0.05
                  : orientation === 'PORTRAIT'
                  ? height * 0.01
                  : height * 0.03,
            },
          ]}>
          <ScrollView
            contentContainerStyle={[
              chatStyle.messareAreaScroll,
              isReply && {paddingBottom: '20%'},
            ]}
            ref={(view) => {
              this.scrollView = view;
            }}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd();
            }}>
            <View style={chatStyle.messageContainer}>
              {this.renderMessage(messages)}
            </View>
          </ScrollView>
          {isReply ? (
            <View
              style={{
                height: '12%',
                width: '100%',
                backgroundColor: '#FFDBE9',
                position: 'absolute',
                padding: 10,
                bottom: 20,
                borderTopColor: Colors.gradient_1,
                borderTopWidth: 1,
              }}>
              <View
                style={{
                  flex: 3,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{flex: 8}}>
                  <Text numberOfLines={2} style={{color: Colors.gradient_1}}>
                    {repliedMessage.isUser ? 'You' : repliedMessage.userName}
                  </Text>
                </View>
                <View style={{flex: 2, alignItems: 'flex-end'}}>
                  <TouchableOpacity
                    style={{
                      //   paddingHorizontal: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '70%',
                      width: '18%',
                      borderRadius: 100,
                      backgroundColor: Colors.gradient_1,
                    }}
                    onPress={cancelReply}>
                    <Image
                      source={Icons.icon_close}
                      style={{
                        tintColor: Colors.white,
                        height: '50%',
                        width: '100%',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flex: 7, justifyContent: 'center', width: '95%'}}>
                <Text numberOfLines={2} style={{fontFamily: Fonts.extralight}}>
                  {repliedMessage.message}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        <ChatInput
          onAttachmentPress={null}
          onChangeText={(message) => handleMessage(message)}
          onSend={onMessageSend}
          value={newMessageText}
          placeholder={translate('pages.xchat.enterMessage')}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const chatStyle = StyleSheet.create({
  messageAreaConatiner: {
    flex: 0.95,
    justifyContent: 'flex-end',
  },
  messareAreaScroll: {flexGrow: 1, paddingBottom: 20},
  messageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messageDateCntainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  messageDate: {
    backgroundColor: Colors.orange,
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRadius: 100,
  },
  messageDateText: {
    color: Colors.white,
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
});

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);
