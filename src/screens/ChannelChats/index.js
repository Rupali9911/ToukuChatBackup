import React, {Component, Fragment} from 'react';
import {ImageBackground} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';

import {ChatHeader} from '../../components/Headers';
import {globalStyles} from '../../styles';
import {Images} from '../../constants';
import ChatContainer from '../../components/ChatContainer';
import {translate} from '../../redux/reducers/languageReducer';
import {
  getChannelConversations,
  readAllChannelMessages,
} from '../../redux/reducers/channelReducer';
import {ListLoader} from '../../components/Loaders';
import NoData from '../../components/NoData';

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
    const {newMessageText, conversations, isReply, repliedMessage} = this.state;
    if (!newMessageText) {
      return;
    }
    let newMessage;
    if (isReply) {
      newMessage = {
        id: conversations ? conversations.length + 1 : 1,
        message: newMessageText,
        isUser: true,
        time: '20:27',
        repliedTo: repliedMessage,
      };
    } else {
      newMessage = {
        id: conversations ? conversations.length + 1 : 1,
        message: newMessageText,
        from_user: {
          id: this.props.userData.id,
          email: this.props.userData.email,
          username: this.props.userData.username,
          avatar: null,
          is_online: true,
          display_name: this.props.userData.username,
        },
        isUser: true,
        time: '20:27',
      };
    }

    let newMessageArray = conversations ? conversations : [];
    newMessageArray.push(newMessage);
    this.setState({
      conversations: newMessageArray,
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
    });
  };

  onReply = (messageId) => {
    console.log('ChannelChats -> onReply -> messageId', messageId);
    const {conversations} = this.state;

    const repliedMessage = conversations.find((item) => item.id === messageId);
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
    this.props
      .getChannelConversations(this.props.currentChannel.id)
      .then((res) => {
        if (res.status === true && res.conversation.length > 0) {
          this.setState({conversations: res.conversation}, () => {
            console.log(
              'Convertation 1-1-1--1-1-1-1-1-1-1-1-1-1-1--1-1-1-1-1-1-1-1-1-1-1',
              this.state.conversations,
            );
          });
          this.props.readAllChannelMessages(this.props.currentChannel.id);
        }
      });
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  handleMessage(message) {
    this.setState({newMessageText: message});
  }

  renderConversations() {
    const {channelLoading} = this.props;
    const {conversations, newMessageText} = this.state;

    if (channelLoading) {
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
    const {newMessageText, conversations} = this.state;
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
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelChats);
