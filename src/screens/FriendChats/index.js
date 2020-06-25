import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import moment from 'moment';

import { ChatHeader } from '../../components/Headers';
import ChatContainer from '../../components/ChatContainer';
import { globalStyles } from '../../styles';
import { Images, SocketEvents } from '../../constants';
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
  markFriendMsgsRead,
  unSendPersonalMessage,
  deletePersonalMessage,
} from '../../redux/reducers/friendReducer';
import Toast from '../../components/Toast';
import { eventService } from '../../utils';
import SingleSocket from '../../helpers/SingleSocket';
import ImagePicker from 'react-native-image-picker';

class FriendChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      newMessageText: '',
      conversations: [],
      selectedMessageId: null,
      translatedMessage: null,
      translatedMessageId: null,
      showConfirmationModal: false,
      showMessageDeleteConfirmationModal: false,
      showMessageUnSendConfirmationModal: false,
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
    };

    this.SingleSocket = new SingleSocket();
  }

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({ orientation: initial });

    this.events = eventService.getMessage().subscribe((message) => {
      this.checkEventTypes(message);
    });
  }

  componentWillUnmount() {
    this.events.unsubscribe();
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this.getPersonalConversation();

    this.SingleSocket.create({ user_id: this.props.userData.id });

    // alert(JSON.stringify(this.props.userData));
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  onMessageSend = () => {
    const { newMessageText, isReply, repliedMessage, isEdited } = this.state;
    const { currentFriend, userData } = this.props;
    const id = Math.floor(Math.random() * 90000) + 10000;
    console.log('ChannelChats -> onMessageSend -> id', id, userData.id);
    let sendmsgdata = {
      id: id,
      thumbnail: null,
      from_user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        avatar: userData.avatar,
        is_online: true,
        display_name: userData.display_name,
      },
      to_user: {
        id: currentFriend.user_id,
        email: null,
        username: currentFriend.username,
        avatar: currentFriend.avatar,
        is_online: currentFriend.is_online,
        display_name: currentFriend.display_name,
      },
      message_body: newMessageText,
      reply_to: isReply ? repliedMessage : null,
      local_id: null,
      created: moment().format(),
      updated: moment().format(),
      msg_type: 'text',
      is_read: false,
      is_unsent: false,
      is_edited: false,
      friend: userData.id,
      deleted_for: [],
    };

    if (!newMessageText) {
      return;
    }

    if (isEdited) {
      this.sendEditMessage();
      return;
    }
    if (isReply) {
      let data = {
        friend: this.props.currentFriend.friend,
        local_id: 'c2d0eebe-cc42-41aa-8ad2-997a3d3a6355',
        message_body: newMessageText,
        msg_type: 'text',
        to_user: this.props.currentFriend.user_id,
        reply_to: repliedMessage.id,
      };
      this.state.conversations.unshift(sendmsgdata);
      this.props.sendPersonalMessage(data);
    } else {
      let data = {
        friend: this.props.currentFriend.friend,
        local_id: 'c2d0eebe-cc42-41aa-8ad2-997a3d3a6355',
        message_body: newMessageText,
        msg_type: 'text',
        to_user: this.props.currentFriend.user_id,
      };
      this.state.conversations.unshift(sendmsgdata);
      this.props
        .sendPersonalMessage(data)
        .then((res) => {
          console.log('ChannelChats -> onMessageSend -> res', res);
          // this.getChannelConversations();
          var foundIndex = this.state.conversations.findIndex(
            (x) => x.id == id
          );
          this.state.conversations[foundIndex] = res;
          // this.state.conversations.findIndex()
        })
        .catch((err) => {});
    }
    this.setState({
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
      isEdited: false,
    });
  };

  sendEditMessage = () => {
    const { newMessageText, editMessageId } = this.state;

    const data = {
      message_body: newMessageText,
      friend: this.props.currentFriend.friend,
    };

    this.props
      .editPersonalMessage(editMessageId, data)
      .then((res) => {
        this.getPersonalConversation();
      })
      .catch((err) => {});
    this.setState({
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
      isEdited: false,
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

  checkEventTypes(message) {
    const { currentFriend, userData } = this.props;
    const { conversations } = this.state;

    var valueArr = conversations.map(function (item) {
      return item.id;
    });
    var isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx;
    });

    //New Message in Friend
    if (message.text.data.type == SocketEvents.NEW_MESSAGE_IN_FREIND) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        if (
          message.text.data.message_details.to_user.id == currentFriend.user_id
        ) {
          // if (!isDuplicate) {
          //   conversations.unshift(message.text.data.message_details);
          //   this.setState({conversations});
          // }
          this.getPersonalConversation();
        }
      } else if (message.text.data.message_details.to_user.id == userData.id) {
        if (
          message.text.data.message_details.from_user.id ==
          currentFriend.user_id
        ) {
          this.getPersonalConversation();
          // if (!isDuplicate) {
          //   conversations.unshift(message.text.data.message_details);
          //   this.setState({conversations});
          // }
        }
      }
    }

    //Unsend Message in Friend
    if (message.text.data.type == SocketEvents.UNSENT_MESSAGE_IN_FRIEND) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        if (
          message.text.data.message_details.to_user.id == currentFriend.user_id
        ) {
          // var foundIndex = conversations.findIndex(
          //   (item) => item.id == message.text.data.message_details.id,
          // );
          // conversations.splice(foundIndex, 1);
          // this.setState({conversations});
          this.getPersonalConversation();
        }
      } else if (message.text.data.message_details.to_user.id == userData.id) {
        if (
          message.text.data.message_details.from_user.id ==
          currentFriend.user_id
        ) {
          // var foundIndex = conversations.findIndex(
          //   (item) => item.id == message.text.data.message_details.id,
          // );
          // conversations.splice(foundIndex, 1);
          // this.setState({conversations});
          this.getPersonalConversation();
        }
      }
    }

    //Unsend Message in Friend
    if (message.text.data.type == SocketEvents.DELETE_MESSAGE_IN_FRIEND) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        if (
          message.text.data.message_details.to_user.id == currentFriend.user_id
        ) {
          this.getPersonalConversation();
        }
      } else if (message.text.data.message_details.to_user.id == userData.id) {
        if (
          message.text.data.message_details.from_user.id ==
          currentFriend.user_id
        ) {
          this.getPersonalConversation();
        }
      }
    }
  }

  getPersonalConversation() {
    this.props
      .getPersonalConversation(this.props.currentFriend.friend)
      .then((res) => {
        if (res.status === true && res.conversation.length > 0) {
          this.setState({ conversations: res.conversation });
          this.markFriendMsgsRead();
        }
      });
  }

  markFriendMsgsRead() {
    this.props.markFriendMsgsRead(this.props.currentFriend.friend);
  }

  handleMessage(message) {
    this.setState({ newMessageText: message });
    // friend
    const payload = {
      type: SocketEvents.FRIEND_TYPING_MESSAGE,
      data: {
        sender: this.props.userData.id,
        receiver: this.props.currentFriend.user_id,
        chat_type: 'personal',
        channel_name: '',
      },
    };
    // this.SingleSocket.sendMessage(payload);
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
    if (this.state.selectedMessageId != null) {
      let payload = {
        friend: this.props.currentFriend.friend,
      };
      this.props.deletePersonalMessage(this.state.selectedMessageId, payload);
    }
  };

  onCancelUnSend = () => {
    this.setState({ showMessageUnSendConfirmationModal: false });
  };

  onConfirmUnSend = () => {
    this.setState({ showMessageUnSendConfirmationModal: false });
    if (this.state.selectedMessageId != null) {
      let payload = {
        friend: this.props.currentFriend.friend,
        is_unsent: true,
      };
      this.props
        .unSendPersonalMessage(this.state.selectedMessageId, payload)
        .then((res) => {
          // this.getPersonalConversation();
          Toast.show({
            title: 'Touku',
            text: translate('pages.xchat.messageUnsent'),
            type: 'positive',
          });
        });
    }
  };

  onDeletePressed = (messageId) => {
    this.setState({
      showMessageDeleteConfirmationModal: true,
      selectedMessageId: messageId,
    });
  };

  onUnSendPressed = (messageId) => {
    this.setState({
      showMessageUnSendConfirmationModal: true,
      selectedMessageId: messageId,
    });
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
    this.setState({
      editMessageId: null,
      isEdited: false,
    });
  };

  onCameraPress = () => {
    var options = {
      title: 'Choose Option',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
      }
      // Same code as in above section!
    });
  };
  onGalleryPress = () => {
    var options = {
      title: '',
      storageOptions: {
        skipBackup: true,
        path: '',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
      }
      // Same code as in above section!
    });
  };
  onAttachmentPress = () => {
    console.log('ChannelChats -> onAttachmentPress -> onAttachmentPress');
  };

  render() {
    const {
      conversations,
      newMessageText,
      showConfirmationModal,
      showMessageDeleteConfirmationModal,
      showMessageUnSendConfirmationModal,
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
            onUnSendMsg={(id) => this.onUnSendPressed(id)}
            onMessageTranslate={(msg) => this.onMessageTranslate(msg)}
            onMessageTranslateClose={this.onMessageTranslateClose}
            onEditMessage={(msg) => this.onEdit(msg)}
            translatedMessage={translatedMessage}
            translatedMessageId={translatedMessageId}
            onCameraPress={() => this.onCameraPress()}
            onGalleryPress={() => this.onGalleryPress()}
            onAttachmentPress={() => this.onAttachmentPress()}
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
          message={translate('pages.xchat.youWantToDeleteThisMessage')}
        />

        <ConfirmationModal
          visible={showMessageUnSendConfirmationModal}
          onCancel={this.onCancelUnSend.bind(this)}
          onConfirm={this.onConfirmUnSend.bind(this)}
          orientation={orientation}
          title={translate('common.unsend')}
          message={translate('pages.xchat.toastr.messageWillBeUnsent')}
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
  markFriendMsgsRead,
  unSendPersonalMessage,
  deletePersonalMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendChats);
