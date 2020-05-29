import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Orientation from 'react-native-orientation';
import ChatMessageBox from '../../components/ChatMessageBox';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { ChatHeader } from '../../components/Headers';
import { translate } from '../../redux/reducers/languageReducer';
import { globalStyles } from '../../styles';
import { getAvatar } from '../../utils';
import { Colors, Fonts, Images, Icons } from '../../constants';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
const { width, height } = Dimensions.get('window');

export default class FriendChats extends Component {
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
        <View style={{ alignItems: 'center', marginVertical: 15 }}>
          <View
            style={{
              backgroundColor: Colors.orange,
              paddingVertical: 4,
              paddingHorizontal: 5,
              borderRadius: 100,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontFamily: Fonts.medium,
                fontSize: 12,
              }}
            >
              28/05
            </Text>
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
          title={data.username}
          description={
            data.total_members + ' ' + translate('pages.xchat.members')
          }
          type={'friend'}
          image={getAvatar(data.profile_picture)}
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
            style={{
              flex: 0.95,
              justifyContent: 'flex-end',
              paddingBottom:
                Platform.OS === 'android'
                  ? this.state.orientation === 'PORTRAIT'
                    ? height * 0.03
                    : height * 0.07
                  : this.state.orientation === 'PORTRAIT'
                  ? height * 0.01
                  : height * 0.03,
            }}
          >
            <ScrollView
              style={{}}
              contentContainerStyle={{ flexGrow: 1 }}
              ref={(view) => {
                this.scrollView = view;
              }}
              onContentSizeChange={(contentWidth, contentHeight) => {
                this.scrollView.scrollToEnd();
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                }}
              >
                {this.renderMessage()}
              </View>
            </ScrollView>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: 50,
              backgroundColor: Colors.gradient_1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15,
              paddingTop: 5,
            }}
          >
            <TouchableOpacity
              style={{
                height: '100%',
                width: '10%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {}}
            >
              <Image
                source={Icons.icon_camera_grad}
                style={{
                  height: '80%',
                  width: '90%',
                }}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <View
              style={{
                width: '80%',
                height: '80%',
                justifyContent: 'center',
                // alignItems: 'center',
              }}
            >
              <TextInput
                style={{
                  height: '100%',
                  borderWidth: 0.2,
                  backgroundColor: Colors.white,
                  borderRadius: 10,
                  borderColor: Colors.gray,
                  paddingHorizontal: 10,
                }}
                onChangeText={(message) => this.handleMessage(message)}
                value={newMessageText}
                placeholder={translate('pages.xchat.enterMessage')}
              />
            </View>
            <TouchableOpacity
              style={{
                height: '100%',
                width: '10%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.onMessageSend();
              }}
            >
              <Image
                source={Icons.icon_send_button}
                style={{ height: '50%', width: '70%', tintColor: Colors.gray }}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({});
