import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation';
import { ScrollView } from 'react-native-gesture-handler';

import ChatMessageBox from '../../components/ChatMessageBox';
import { ChatHeader } from '../../components/Headers';
import { translate } from '../../redux/reducers/languageReducer';
import { globalStyles } from '../../styles';
import ChatInput from '../../components/TextInputs/ChatInput';
import { Colors, Fonts, Images, Icons } from '../../constants';
const { width, height } = Dimensions.get('window');

export default class ChannelChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.navigation.getParam('data', null),
      orientation: 'PORTRAIT',
      newMessageText: '',
      messagesArray: [
        {
          id: 1,
          message: 'Hello',
          isUser: false,
          time: '20:20',
        },
        {
          id: 2,
          message: 'HI',
          isUser: true,
          status: 'Read',
          time: '20:21',
        },
        {
          id: 3,
          message:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          isUser: false,
          time: '20:21',
        },
        {
          id: 4,
          message:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          isUser: true,
          status: 'Read',
          time: '20:25',
        },
        {
          id: 5,
          message:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          isUser: false,
          time: '20:26',
        },
        {
          id: 6,
          message:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          isUser: false,
          time: '20:27',
        },
      ],
    };
  }

  onMessageSend = () => {
    const { newMessageText, messagesArray } = this.state;
    if (!newMessageText) {
      return;
    }
    const newMessage = {
      id: messagesArray.length + 1,
      message: newMessageText,
      isUser: true,
      time: '20:27',
    };

    let newMessageArray = messagesArray;
    newMessageArray.push(newMessage);
    this.setState({
      messagesArray: newMessageArray,
      newMessageText: '',
    });
  };

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({ orientation: initial });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    console.log(
      'FriendChats -> _orientationDidChange -> orientation',
      orientation
    );
    this.setState({ orientation });
  };

  renderMessage = () => {
    const { messagesArray } = this.state;

    if (!messagesArray || !messagesArray.length) {
      return;
    }
    const msg = messagesArray.map((item, index) => {
      return (
        <ChatMessageBox
          key={item.id}
          message={item.message}
          isUser={item.isUser}
          time={item.time}
          status={item.status}
        />
      );
    });

    return (
      <Fragment>
        <View style={chatStyle.messageDateCntainer}>
          <View style={chatStyle.messageDate}>
            <Text style={chatStyle.messageDateText}>28/05</Text>
          </View>
        </View>
        {msg}
      </Fragment>
    );
  };

  handleMessage(message) {
    this.setState({ newMessageText: message });
  }

  render() {
    const { data, newMessageText } = this.state;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
        <ChatHeader
          title={data.name}
          description={
            data.total_members + ' ' + translate('pages.xchat.followers')
          }
          onBackPress={() => this.props.navigation.goBack()}
          onRightIconPress={() => alert('more')}
        />
        <KeyboardAwareScrollView
          contentContainerStyle={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
          ref={(view) => {
            this.keyboardAwareScrollView = view;
          }}
          onKeyboardDidShow={(contentWidth, contentHeight) => {
            this.scrollView.scrollToEnd();
          }}
        >
          <View
            style={[
              chatStyle.messageAreaConatiner,
              {
                paddingBottom:
                  Platform.OS === 'android'
                    ? this.state.orientation === 'PORTRAIT'
                      ? height * 0.03
                      : height * 0.05
                    : this.state.orientation === 'PORTRAIT'
                    ? height * 0.01
                    : height * 0.03,
              },
            ]}
          >
            <ScrollView
              style={{}}
              contentContainerStyle={chatStyle.messareAreaScroll}
              ref={(view) => {
                this.scrollView = view;
              }}
              onContentSizeChange={(contentWidth, contentHeight) => {
                this.scrollView.scrollToEnd();
              }}
            >
              <View style={chatStyle.messageContainer}>
                {this.renderMessage()}
              </View>
            </ScrollView>
          </View>
          <ChatInput
            onAttachmentPress={null}
            onChangeText={(message) => this.handleMessage(message)}
            onSend={this.onMessageSend}
            value={newMessageText}
            placeholder={translate('pages.xchat.enterMessage')}
          />
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}

const chatStyle = StyleSheet.create({
  messageAreaConatiner: {
    flex: 0.95,
    justifyContent: 'flex-end',
  },
  messareAreaScroll: { flexGrow: 1 },
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
