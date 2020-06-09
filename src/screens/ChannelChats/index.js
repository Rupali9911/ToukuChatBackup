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
import { ConfirmationModal } from '../../components/Modals';
class ChannelChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      newMessageText: '',
      conversations: [],
      translatedMessage: null,
      translatedMessageId: null,
      showConfirmationModal: false,
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

  onMessageSend = () => {
    const { newMessageText, isReply, repliedMessage } = this.state;
    if (!newMessageText) {
      return;
    }
    if (isReply) {
      let messageData = {
        friend: this.props.currentFriend.friend,
        local_id: 'c2d0eebe-cc42-41aa-8ad2-997a3d3a6355',
        message_body: newMessageText,
        msg_type: 'text',
        to_user: this.props.currentFriend.user_id,
        reply_to: repliedMessage.id,
      };
      this.props
        .sendChannelMessage(messageData)
        .then((res) => {
          this.getChannelConversations();
        })
        .catch((err) => {});
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

    this.setState({
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
    });
  };

  onReply = (messageId) => {
    const { conversations } = this.state;

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
    const {
      conversations,
      newMessageText,
      translatedMessage,
      translatedMessageId,
      orientation,
      repliedMessage,
      isReply,
    } = this.state;

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
          orientation={orientation}
          repliedMessage={repliedMessage}
          isReply={isReply}
          cancelReply={this.cancelReply}
          onDelete={(id) => this.onDeletePressed(id)}
          onMessageTranslate={(msg) => this.onMessageTranslate(msg)}
          onMessageTranslateClose={this.onMessageTranslateClose}
          translatedMessage={translatedMessage}
          translatedMessageId={translatedMessageId}
          isChannel={true}
        />
      );
    }
  }

  // To delete message
  toggleConfirmationModal = () => {
    this.setState((prevState) => ({
      showConfirmationModal: !prevState.showConfirmationModal,
    }));
  };

  onCancel = () => {
    console.log('ChannelChats -> onCancel -> onCancel');
    this.toggleConfirmationModal();
  };

  onConfirm = () => {
    console.log('ChannelChats -> onConfirm -> onConfirm');
    this.toggleConfirmationModal();
  };

  onDeletePressed = (messageId) => {
    console.log('ChannelChats -> onReply -> messageId', messageId);
    this.setState({ showConfirmationModal: true });
  };

  onMessageTranslate = (message) => {
    console.log('onMessageTranslate -> message', message);
    this.setState({
      translatedMessageId: message.id,
      translatedMessage: '1234',
    });
  };

  onMessageTranslateClose = () => {
    console.log(
      'ChannelChats -> onMessageTranslateClose -> onMessageTranslateClose'
    );
    this.setState({
      translatedMessageId: null,
      translatedMessage: null,
    });
  };

  render() {
    const { currentChannel, showConfirmationModal, orientation } = this.props;
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
        <ConfirmationModal
          visible={showConfirmationModal}
          onCancel={this.onCancel.bind(this)}
          onConfirm={this.onConfirm.bind(this)}
          orientation={orientation}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.toLeaveThisChannel')}
        />
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
