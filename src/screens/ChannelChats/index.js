import React, { Component, Fragment } from 'react';
import { ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';

import { ChatHeader } from '../../components/Headers';
import { globalStyles } from '../../styles';
import { Images } from '../../constants';
import ChatContainer from '../../components/ChatContainer';
import { translate } from '../../redux/reducers/languageReducer';
import {
  getChannelConversations,
  readAllChannelMessages,
  sendChannelMessage,
} from '../../redux/reducers/channelReducer';
import { ListLoader } from '../../components/Loaders';

class ChannelChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      newMessageText: '',
      conversations: [],
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
    };
  }

  // onMessageSend = () => {
  //   const {newMessageText, conversations} = this.state;
  //   if (!newMessageText) {
  //     return;
  //   }
  //   const newMessage = {
  //     id: conversations ? conversations.length + 1 : 1,
  //     message: newMessageText,
  //     isUser: true,
  //     time: '20:27',
  //   };

  //   let newMessageArray = conversations ? conversations : [];
  //   newMessageArray.push(newMessage);
  //   this.setState({
  //     conversations: newMessageArray,
  //     newMessageText: '',
  //   });
  // };

  onMessageSend = () => {
    const {
      newMessageText,
      conversations,
      isReply,
      repliedMessage,
    } = this.state;
    if (!newMessageText) {
      return;
    }
    // let newMessage;
    if (isReply) {
      console.log(
        'ChannelChats -> onMessageSend -> repliedMessage',
        repliedMessage
      );
      // newMessage = {
      //   id: conversations ? conversations.length + 1 : 1,
      //   message: newMessageText,
      //   isUser: true,
      //   time: '20:27',
      //   repliedTo: repliedMessage,
      // };
    } else {
      let messageData = {
        channel: this.props.currentChannel.id,
        local_id: '45da06d9-0bc6-4031-b9ba-2cfff1e72013',
        message_body: newMessageText,
        msg_type: 'text',
      };
      this.props
        .sendChannelMessage(messageData)
        .then((res) => {
          this.getChannelConversations();
        })
        .catch((err) => {});
    }

    // let newMessageArray = conversations ? conversations : [];
    // newMessageArray.push(newMessage);
    this.setState({
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
    });
  };

  onReply = (messageId) => {
    console.log('ChannelChats -> onReply -> messageId', messageId);
    const { conversations } = this.state;

    const repliedMessage = conversations.find((item) => item.id === messageId);
    this.setState(
      {
        isReply: true,
        repliedMessage: repliedMessage,
      },
      () => {
        console.log(
          'ChannelChats -> onReply -> repliedMessage',
          this.state.repliedMessage
        );
      }
    );
  };

  cancelReply = () => {
    this.setState({
      isReply: false,
      repliedMessage: null,
    });
  };

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({ orientation: initial });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this.getChannelConversations();
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  getChannelConversations() {
    this.props
      .getChannelConversations(this.props.currentChannel.id)
      .then((res) => {
        if (res.status === true && res.conversation.length > 0) {
          this.setState({ conversations: res.conversation });
          this.props.readAllChannelMessages(this.props.currentChannel.id);
        }
      });
  }

  handleMessage(message) {
    this.setState({ newMessageText: message });
  }

  renderConversations() {
    const { channelLoading } = this.props;
    const { conversations, newMessageText } = this.state;

    if (channelLoading && conversations.length <= 0) {
      return <ListLoader />;
    } else {
      return (
        <ChatContainer
          handleMessage={(message) => this.handleMessage(message)}
          onMessageSend={this.onMessageSend.bind(this)}
          onMessageReply={(id) => this.onReply(id)}
          newMessageText={newMessageText}
          // messages={this.state.conversations}
          messages={conversations}
          orientation={this.state.orientation}
          repliedMessage={this.state.repliedMessage}
          isReply={this.state.isReply}
          cancelReply={this.cancelReply}
        />
      );
    }
  }

  render() {
    const { currentChannel } = this.props;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
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
        {this.renderConversations()}
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentChannel: state.channelReducer.currentChannel,
    channelLoading: state.channelReducer.loading,
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {
  getChannelConversations,
  readAllChannelMessages,
  sendChannelMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelChats);
