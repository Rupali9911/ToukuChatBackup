import React, {Component, Fragment} from 'react';
import {ImageBackground} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';

import {ChatHeader} from '../../components/Headers';
import {translate} from '../../redux/reducers/languageReducer';
import {globalStyles} from '../../styles';
import {Images} from '../../constants';
import ChatContainer from '../../components/ChatContainer';

class ChannelChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      newMessageText: '',
      headerRightIconMenu: [
        {
          id: 1,
          title: translate('pages.xchat.channelDetails'),
          icon: 'bars',
          onPress: () => {
            this.props.navigation.navigate('ChannelInfo');
          },
        },
      ],
      isReply: false,
      repliedMessage: null,
      messagesArray: [
        {
          id: 1,
          message: 'Hello',
          isUser: false,
          userName: 'raj',
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
          userName: 'raj',
          time: '20:21',
        },
        {
          id: 4,
          message:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          isUser: true,
          status: 'Read',
          time: '20:25',
          repliedTo: {
            id: 3,
            message:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            isUser: false,
            userName: 'raj',
            time: '20:21',
          },
        },
        {
          id: 5,
          message:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          isUser: false,
          userName: 'raj',
          time: '20:26',
          repliedTo: {
            id: 2,
            message: 'HI',
            isUser: true,
            status: 'Read',
            time: '20:21',
          },
        },
        {
          id: 6,
          message:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          isUser: true,
          userName: 'raj',
          time: '20:27',
        },
      ],
    };
  }

  onMessageSend = () => {
    const {newMessageText, messagesArray} = this.state;
    if (!newMessageText) {
      return;
    }
    const newMessage = {
      id: messagesArray ? messagesArray.length + 1 : 1,
      message: newMessageText,
      isUser: true,
      time: '20:27',
    };

    let newMessageArray = messagesArray ? messagesArray : [];
    newMessageArray.push(newMessage);
    this.setState({
      messagesArray: newMessageArray,
      newMessageText: '',
    });
  };

  onMessageSend = () => {
    const {newMessageText, messagesArray, isReply, repliedMessage} = this.state;
    if (!newMessageText) {
      return;
    }
    let newMessage;
    if (isReply) {
      newMessage = {
        id: messagesArray ? messagesArray.length + 1 : 1,
        message: newMessageText,
        isUser: true,
        time: '20:27',
        repliedTo: repliedMessage,
      };
    } else {
      newMessage = {
        id: messagesArray ? messagesArray.length + 1 : 1,
        message: newMessageText,
        isUser: true,
        time: '20:27',
      };
    }

    let newMessageArray = messagesArray ? messagesArray : [];
    newMessageArray.push(newMessage);
    this.setState({
      messagesArray: newMessageArray,
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
    });
  };

  onReply = (messageId) => {
    const {messagesArray} = this.state;

    const repliedMessage = messagesArray.find((item) => item.id === messageId);
    this.setState({
      isReply: true,
      repliedMessage: repliedMessage,
    });
  };

  cancelReply = () => {
    this.setState({
      isReply: false,
      repliedMessage: null,
    });
  };

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  handleMessage(message) {
    this.setState({newMessageText: message});
  }

  render() {
    const {newMessageText} = this.state;
    const {currentChannel} = this.props;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <ChatHeader
          title={currentChannel.name}
          description={
            currentChannel.total_members +
            ' ' +
            translate('pages.xchat.followers')
          }
          onBackPress={() => this.props.navigation.goBack()}
          menuItems={this.state.headerRightIconMenu}
          navigation={this.props.navigation}
          image={currentChannel.channel_picture}
        />
        <ChatContainer
          handleMessage={(message) => this.handleMessage(message)}
          onMessageSend={this.onMessageSend}
          onMessageReply={(id) => this.onReply(id)}
          newMessageText={newMessageText}
          messages={this.state.messagesArray}
          orientation={this.state.orientation}
          repliedMessage={this.state.repliedMessage}
          isReply={this.state.isReply}
          cancelReply={this.cancelReply}
        />
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentChannel: state.channelReducer.currentChannel,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelChats);
