import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';

import { ChatHeader } from '../../components/Headers';
import ChatContainer from '../../components/ChatContainer';
import { globalStyles } from '../../styles';
import { Images } from '../../constants';
import { ConfirmationModal } from '../../components/Modals';
import { ListLoader } from '../../components/Loaders';
import {
  translate,
  translateMessage,
} from '../../redux/reducers/languageReducer';
import {
  getPersonalConversation,
  sendPersonalMessage,
  unFriendUser,
  getUserFriends,
  editPersonalMessage,
} from '../../redux/reducers/friendReducer';
import Toast from '../../components/Toast';

class FriendChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      newMessageText: '',
      conversations: [],
      translatedMessage: null,
      translatedMessageId: null,
      showConfirmationModal: false,
      showMessageDeleteConfirmationModal: false,
      headerRightIconMenu: [
        {
          id: 1,
          title: translate('pages.xchat.unfriend'),
          icon: 'user-times',
          onPress: () => {
            this.toggleConfirmationModal();
          },
        },
        {
          id: 2,
          title: translate('pages.xchat.createGroup'),
          icon: 'users',
          onPress: () => {
            this.props.navigation.navigate('CreateFriendGroup');
          },
        },
      ],
      isReply: false,
      repliedMessage: null,
      isEdited: false,
      editMessageId: null,
      // messagesArray: [
      //   {
      //     id: 1,
      //     message: 'Hello',
      //     isUser: false,
      //     userName: 'raj',
      //     time: '20:20',
      //   },
      //   {
      //     id: 2,
      //     message: 'HI',
      //     isUser: true,
      //     status: 'Read',
      //     time: '20:21',
      //   },
      //   {
      //     id: 3,
      //     message:
      //       'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      //     isUser: false,
      //     userName: 'raj',
      //     time: '20:21',
      //   },
      //   {
      //     id: 4,
      //     message:
      //       'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      //     isUser: true,
      //     status: 'Read',
      //     time: '20:25',
      //     repliedTo: {
      //       id: 3,
      //       message:
      //         'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      //       isUser: false,
      //       userName: 'raj',
      //       time: '20:21',
      //     },
      //   },
      //   {
      //     id: 5,
      //     message:
      //       'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      //     isUser: false,
      //     userName: 'raj',
      //     time: '20:26',
      //     repliedTo: {
      //       id: 2,
      //       message: 'HI',
      //       isUser: true,
      //       status: 'Read',
      //       time: '20:21',
      //     },
      //   },
      //   {
      //     id: 6,
      //     message:
      //       'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      //     isUser: true,
      //     userName: 'raj',
      //     time: '20:27',
      //   },
      // ],
    };
  }

  onMessageSend = () => {
    const { newMessageText, isReply, repliedMessage, isEdited } = this.state;
    if (!newMessageText) {
      return;
    }

    if (isEdited) {
      this.sendEditMessage();
      return;
    }
    // let newMessage;
    if (isReply) {
      let data = {
        friend: this.props.currentFriend.friend,
        local_id: 'c2d0eebe-cc42-41aa-8ad2-997a3d3a6355',
        message_body: newMessageText,
        msg_type: 'text',
        to_user: this.props.currentFriend.user_id,
        reply_to: repliedMessage.id,
      };
      this.props
        .sendPersonalMessage(data)
        .then((res) => {
          this.getPersonalConversation();
        })
        .catch((err) => {});
    } else {
      let data = {
        friend: this.props.currentFriend.friend,
        local_id: 'c2d0eebe-cc42-41aa-8ad2-997a3d3a6355',
        message_body: newMessageText,
        msg_type: 'text',
        to_user: this.props.currentFriend.user_id,
      };
      this.props
        .sendPersonalMessage(data)
        .then((res) => {
          this.getPersonalConversation();
        })
        .catch((err) => {});
    }
    this.setState({
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
    });
  };

  sendEditMessage = () => {
    const { newMessageText, editMessageId } = this.state;

    const data = {
      message_body: newMessageText,
      friend: this.props.currentFriend.user_id,
    };
    console.log('FriendChats -> sendEditMessage -> data', data);

    this.props
      .editPersonalMessage(editMessageId, data)
      .then((res) => {
        console.log('FriendChats -> onConfirm -> res', res);
        if (res.status === true) {
          this.getPersonalConversation();
        }
      })
      .catch((err) => {});
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

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({ orientation: initial });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this.getPersonalConversation();
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  getPersonalConversation() {
    this.props
      .getPersonalConversation(this.props.currentFriend.friend)
      .then((res) => {
        if (res.status === true && res.conversation.length > 0) {
          this.setState({ conversations: res.conversation });
        }
      });
  }

  handleMessage(message) {
    this.setState({ newMessageText: message });
    if (!message.length && this.state.isEdited) {
      this.onEditClear();
    }
  }

  toggleConfirmationModal = () => {
    this.setState({ showConfirmationModal: !this.state.showConfirmationModal });
  };

  onCancel = () => {
    console.log('ChannelChats -> onCancel -> onCancel');
    this.toggleConfirmationModal();
  };

  onConfirm = () => {
    const payload = {
      channel_name: `unfriend_${this.props.currentFriend.user_id}`,
      unfriend_user_id: this.props.currentFriend.user_id,
    };
    this.props
      .unFriendUser(payload)
      .then((res) => {
        console.log('FriendChats -> onConfirm -> res', res);
        if (res.status === true) {
          Toast.show({
            title: 'Touku',
            text: translate('common.success'),
            type: 'positive',
          });
          this.props.getUserFriends();
          this.props.navigation.goBack();
        }
        this.toggleConfirmationModal();
      })
      .catch((err) => {
        console.log('FriendChats -> onConfirm -> err', err);
        Toast.show({
          title: 'Touku',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
        this.toggleConfirmationModal();
      });
  };

  // To delete message
  toggleMessageDeleteConfirmationModal = () => {
    this.setState((prevState) => ({
      showMessageDeleteConfirmationModal: !prevState.showMessageDeleteConfirmationModal,
    }));
  };

  onCancelDelete = () => {
    this.toggleMessageDeleteConfirmationModal();
  };

  onConfirmDelete = () => {
    this.toggleMessageDeleteConfirmationModal();
  };

  onDeletePressed = (messageId) => {
    console.log('ChannelChats -> onDeletePressed -> message', messageId);
    this.setState({ showMessageDeleteConfirmationModal: true });
  };

  onMessageTranslate = (message) => {
    const payload = {
      text: message.message_body,
      language: this.props.selectedLanguageItem.language_name,
    };
    this.props.translateMessage(payload).then((res) => {
      if (res.status === true) {
        this.setState({
          translatedMessageId: message.id,
          translatedMessage: res.data,
        });
      }
    });
  };

  onMessageTranslateClose = () => {
    this.setState({
      translatedMessageId: null,
      translatedMessage: null,
    });
  };

  onEdit = (message) => {
    this.setState({
      newMessageText: message.message_body,
      editMessageId: message.id,
      isEdited: true,
    });
  };

  onEditClear = () => {
    console.log('FriendChats -> onEditClear -> onEditClear');
    this.setState({
      editMessageId: null,
      isEdited: false,
    });
  };

  render() {
    const {
      conversations,
      newMessageText,
      showConfirmationModal,
      showMessageDeleteConfirmationModal,
      orientation,
      translatedMessage,
      translatedMessageId,
    } = this.state;
    const { currentFriend, chatsLoading } = this.props;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
        <ChatHeader
          title={currentFriend.username}
          description={
            currentFriend.total_members + ' ' + translate('pages.xchat.members')
          }
          type={'friend'}
          image={currentFriend.profile_picture}
          onBackPress={() => this.props.navigation.goBack()}
          menuItems={this.state.headerRightIconMenu}
        />
        {chatsLoading && conversations.length <= 0 ? (
          <ListLoader />
        ) : (
          <ChatContainer
            handleMessage={(message) => this.handleMessage(message)}
            onMessageSend={this.onMessageSend.bind(this)}
            onMessageReply={(id) => this.onReply(id)}
            newMessageText={newMessageText}
            messages={conversations}
            orientation={this.state.orientation}
            repliedMessage={this.state.repliedMessage}
            isReply={this.state.isReply}
            cancelReply={this.cancelReply}
            onDelete={(id) => this.onDeletePressed(id)}
            onMessageTranslate={(msg) => this.onMessageTranslate(msg)}
            onMessageTranslateClose={this.onMessageTranslateClose}
            onEditMessage={(msg) => this.onEdit(msg)}
            translatedMessage={translatedMessage}
            translatedMessageId={translatedMessageId}
          />
        )}
        <ConfirmationModal
          visible={showConfirmationModal}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
          orientation={orientation}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.toastr.selectedUserWillBeRemoved')}
        />

        <ConfirmationModal
          visible={showMessageDeleteConfirmationModal}
          onCancel={this.onCancelDelete.bind(this)}
          onConfirm={this.onConfirmDelete.bind(this)}
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
    currentFriend: state.friendReducer.currentFriend,
    chatsLoading: state.friendReducer.loading,
    userData: state.userReducer.userData,
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {
  getUserFriends,
  getPersonalConversation,
  sendPersonalMessage,
  translateMessage,
  unFriendUser,
  editPersonalMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendChats);
