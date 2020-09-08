import React, { Component } from 'react';
import { ImageBackground, PermissionsAndroid, Platform } from 'react-native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';

import { ChatHeader } from '../../components/Headers';
import ChatContainer from '../../components/ChatContainer';
import { globalStyles } from '../../styles';
import { Images, SocketEvents } from '../../constants';
import { ConfirmationModal, UploadSelectModal } from '../../components/Modals';
import { ListLoader } from '../../components/Loaders';
import { UploadLoader } from '../../components/Loaders';
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
  setFriendConversation,
  addNewSendMessage,
  resetFriendConversation,
} from '../../redux/reducers/friendReducer';
import Toast from '../../components/Toast';
import { eventService } from '../../utils';
import SingleSocket from '../../helpers/SingleSocket';
import S3uploadService from '../../helpers/S3uploadService';
import {
  setFriendChatConversation,
  getFriendChatConversationById,
  getFriendChatConversation,
  updateFriendMessageById,
  deleteFriendMessageById,
  setFriendMessageUnsend,
  updateAllFriendMessageRead
} from '../../storage/Service';

// let uuid = require('react-native-uuid')
import uuid from 'react-native-uuid';
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
      sentMessageType: 'text',
      sendingMedia: false,
      showSelectModal: false,
      uploadFile: { uri: null, type: null, name: null },
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
        {
          id: 3,
          title: translate('pages.xchat.reportUser'),
          icon: 'user-times',
          onPress: () => {
            Toast.show({
              title: 'Touku',
              text: 'User reported',
              type: 'positive',
            });
          },
        },
        {
          id: 3,
          title: translate('pages.xchat.blockUser'),
          icon: 'user-times',
          onPress: () => {
            Toast.show({
              title: 'Touku',
              text: 'User blocked',
              type: 'positive',
            });
          },
        },
      ],
      isReply: false,
      repliedMessage: null,
      isEdited: false,
      editMessageId: null,
    };

    this.SingleSocket = new SingleSocket();
    this.S3uploadService = new S3uploadService();
    this.props.resetFriendConversation();
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
    this.getPersonalConversationInitial();

    this.SingleSocket.create({ user_id: this.props.userData.id });

    // alert(JSON.stringify(this.props.userData));
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  onMessageSend = async () => {
    const {
      newMessageText,
      isReply,
      repliedMessage,
      isEdited,
      sentMessageType,
      editMessageId,
      uploadFile,
    } = this.state;
    const { currentFriend, userData } = this.props;

    if (!newMessageText && !uploadFile.uri) {
      return;
    }
    let msgText = newMessageText;
    let imgThumb = ''
    if (sentMessageType === 'image') {
      let file = uploadFile.uri;
      let files = [file];
      const uploadedImages = await this.S3uploadService.uploadImagesOnS3Bucket(
        files
      );
      console.log('uploadedImages', uploadedImages)
      msgText = uploadedImages.image[0].image;
        imgThumb = uploadedImages.image[0].thumbnail;
    }

    if (sentMessageType === 'audio') {
      let file = uploadFile.uri;
      let files = [file];
      const uploadedAudio = await this.S3uploadService.uploadAudioOnS3Bucket(
        files,
        uploadFile.name,
        uploadFile.type
      );
      msgText = uploadedAudio;
    }

    if (sentMessageType === 'doc') {
      let file = uploadFile.uri;
      let files = [file];
      let fileType = uploadFile.type;
      const uploadedApplication = await this.S3uploadService.uploadApplicationOnS3Bucket(
        files,
        uploadFile.name,
        uploadFile.type
      );
      msgText = uploadedApplication;
    }

    if (sentMessageType === 'video') {
      let file = uploadFile.uri;
      let files = [file];
      const uploadedVideo = await this.S3uploadService.uploadVideoOnS3Bucket(
        files,
        uploadFile.type
      );
      msgText = uploadedVideo;
    }

    let sendmsgdata = {
      thumbnail: imgThumb,
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
      message_body: msgText,
      reply_to: isReply
        ? {
            display_name: repliedMessage.from_user.display_name,
            id: repliedMessage.id,
            message: repliedMessage.message_body,
            msg_type: repliedMessage.msg_type,
            name: repliedMessage.from_user.username,
            sender_id: repliedMessage.from_user.id,
          }
        : null,
      local_id: uuid.v4(),
      created: moment().format(),
      updated: moment().format(),
      msg_type: sentMessageType,
      is_read: false,
      is_unsent: false,
      is_edited: false,
      friend: userData.id,
      deleted_for: [],
      sentMessageType: 'text',
    };

    if (isEdited) {
      updateFriendMessageById(editMessageId,newMessageText,sentMessageType);
      this.sendEditMessage();
      return;
    }
    if (isReply) {
      let data = {
        friend: this.props.currentFriend.friend,
        local_id: uuid.v4(),
        message_body: msgText,
        msg_type: sentMessageType,
        to_user: this.props.currentFriend.user_id,
        reply_to: repliedMessage.id,
      };
      this.state.conversations.unshift(sendmsgdata);
      this.props.sendPersonalMessage(data);
    } else {
      let data = {
        friend: this.props.currentFriend.friend,
        local_id: uuid.v4(),
        message_body: msgText,
        msg_type: sentMessageType,
        to_user: this.props.currentFriend.user_id,
      };
      this.state.conversations.unshift(sendmsgdata);
      this.props.sendPersonalMessage(data);
    }
    this.setState({
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
      isEdited: false,
      sentMessageType: 'text',
      sendingMedia: false,
      uploadFile: { uri: null, type: null, name: null },
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
      sendingMedia: false,
    });
  };

  onReply = (messageId) => {
    // const { conversations } = this.state;
    const {chatFriendConversation} = this.props;

    const repliedMessage = chatFriendConversation.find((item) => item.id === messageId);
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
          // this.getPersonalConversation();
          setFriendChatConversation([message.text.data.message_details]);
          this.getLocalFriendConversation();
          this.markFriendMsgsRead();
        }
      } else if (message.text.data.message_details.to_user.id == userData.id) {
        if (
          message.text.data.message_details.from_user.id ==
          currentFriend.user_id
        ) {
          // this.getPersonalConversation();
          setFriendChatConversation([message.text.data.message_details]);
          this.getLocalFriendConversation();
          this.markFriendMsgsRead();
        }
      }
    }

    //Unsend Message in Friend
    if (message.text.data.type == SocketEvents.UNSENT_MESSAGE_IN_FRIEND) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        if (
          message.text.data.message_details.to_user.id == currentFriend.user_id
        ) {
          // this.getPersonalConversation();
          setFriendMessageUnsend(message.text.data.message_details.id);
          this.getLocalFriendConversation();
        }
      } else if (message.text.data.message_details.to_user.id == userData.id) {
        if (
          message.text.data.message_details.from_user.id ==
          currentFriend.user_id
        ) {
          // this.getPersonalConversation();
          setFriendMessageUnsend(message.text.data.message_details.id);
          this.getLocalFriendConversation();
        }
      }
    }

    //DELETE_MESSAGE_IN_FRIEND
    if (message.text.data.type == SocketEvents.DELETE_MESSAGE_IN_FRIEND) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        if (
          message.text.data.message_details.to_user.id == currentFriend.user_id
        ) {
          deleteFriendMessageById(message.text.data.message_details.id);
          let chat = getFriendChatConversationById(
            this.props.currentFriend.friend
          );
          this.props.setFriendConversation(chat);
        }
      } else if (message.text.data.message_details.to_user.id == userData.id) {
        if (
          message.text.data.message_details.from_user.id ==
          currentFriend.user_id
        ) {
          deleteFriendMessageById(message.text.data.message_details.id);
          let chat = getFriendChatConversationById(
            this.props.currentFriend.friend
          );
          this.props.setFriendConversation(chat);
        }
      }
    }

    //MESSAGE_EDITED_IN_FRIEND
    if (message.text.data.type == SocketEvents.MESSAGE_EDITED_IN_FRIEND) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        if (
          message.text.data.message_details.to_user.id == currentFriend.user_id
        ) {
          let editMessageId = message.text.data.message_details.id;
          let newMessageText = message.text.data.message_details.message_body;
          let messageType = message.text.data.message_details.msg_type;
          updateFriendMessageById(editMessageId,newMessageText,messageType);
          this.getLocalFriendConversation();
        }
      } else if (message.text.data.message_details.to_user.id == userData.id) {
        if (
          message.text.data.message_details.from_user.id ==
          currentFriend.user_id
        ) {
          let editMessageId = message.text.data.message_details.id;
          let newMessageText = message.text.data.message_details.message_body;
          let messageType = message.text.data.message_details.msg_type;
          updateFriendMessageById(editMessageId,newMessageText,messageType);
          this.getLocalFriendConversation();
        }
      }
    }

    //READ_ALL_MESSAGE_FRIEND_CHAT
    if (message.text.data.type == SocketEvents.READ_ALL_MESSAGE_FRIEND_CHAT) {
      if (message.text.data.message_details.read_by == userData.id) {
          // this.getPersonalConversation();
          updateAllFriendMessageRead(message.text.data.message_details.friend_id);
      }
    }

    //PINED_FRIEND
    if (message.text.data.type == SocketEvents.PINED_FRIEND) {
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

    //UNPINED_FRIEND
    if (message.text.data.type == SocketEvents.UNPINED_FRIEND) {
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

  getPersonalConversation = async () => {
    await this.props
      .getPersonalConversation(this.props.currentFriend.friend)
      .then((res) => {
        if (res.status === true && res.conversation.length > 0) {
          // this.setState({ conversations: res.conversation });
          this.markFriendMsgsRead();
          let chat = getFriendChatConversationById(
            this.props.currentFriend.friend
          );
          let conversations = [];
          chat.map((item, index) => {
            conversations = [...conversations, item];
          });
          this.props.setFriendConversation(conversations);
        }
      });
  }

  getLocalFriendConversation = () => {
    let chat = getFriendChatConversationById(this.props.currentFriend.friend);
    if (chat.length) {
      let conversations = [];
      chat.map((item, index) => {
        conversations = [...conversations, item];
      });
      this.props.setFriendConversation(conversations);
    }
  }

  getPersonalConversationInitial = async () => {

    let chat = getFriendChatConversationById(this.props.currentFriend.friend);
    if (chat.length) {
      let conversations = [];
      chat.map((item, index) => {
        conversations = [...conversations, item];
      });
      this.props.setFriendConversation(conversations);
    }

    await this.props
      .getPersonalConversation(this.props.currentFriend.friend)
      .then((res) => {
        if (res.status === true && res.conversation.length > 0) {
          // this.setState({ conversations: res.conversation });
          this.markFriendMsgsRead();
          let chat = getFriendChatConversationById(
            this.props.currentFriend.friend
          );
          let conversations = [];
          chat.map((item, index) => {
            conversations = [...conversations, item];
          });
          this.props.setFriendConversation(conversations);
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
        if (res.status === true) {
          // Toast.show({
          //   title: 'Touku',
          //   text: translate('common.success'),
          //   type: 'positive',
          // });
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
      this.props.deletePersonalMessage(this.state.selectedMessageId, payload)
      .then((res) => {
        deleteFriendMessageById(this.state.selectedMessageId);
        this.getPersonalConversation();
      });
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
      setFriendMessageUnsend(this.state.selectedMessageId);
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

  onDownload = async (message) => {
    if (Platform.OS === 'android') {
      const isRequestPermission = await this.requestStoragePermission();
      if (!isRequestPermission) {
        return;
      }
    }

    let fileName = message.message_body.split('/').pop().split('%2F').pop();
    if (message.msg_type === 'image' && fileName.lastIndexOf('.') === -1) {
      fileName = `${fileName}.jpg`;
    }
    if (message.msg_type === 'video' && fileName.lastIndexOf('.') === -1) {
      fileName = `${fileName}.mp4`;
    }

    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      path: `${dirs.DownloadDir}/${fileName}`,
      fileCache: true,
    })
      .fetch('GET', message.message_body, {})
      .then((res) => {
        if (Platform.OS === 'ios') {
          RNFetchBlob.ios.openDocument(res.data);
        }
        console.log('The file saved to ', res.path());
      });
  };

  requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]).then((result) => {
        if (
          result['android.permission.READ_EXTERNAL_STORAGE'] &&
          result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
        ) {
          return true;
        } else if (
          result['android.permission.READ_EXTERNAL_STORAGE'] ||
          result['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            'never_ask_again'
        ) {
          return false;
        }
      });

      return granted;
    } catch (err) {
      console.warn(err);
    }
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
    ImagePicker.openCamera({
      includeBase64: true,
      mediaType: 'photo',
    }).then((image) => {
      let source = { uri: 'data:image/jpeg;base64,' + image.data };
      this.setState({
        uploadFile: source,
        sentMessageType: 'image',
        sendingMedia: true,
      });
      this.onMessageSend();
    });
  };
  onGalleryPress = async (mediaType) => {
    if (mediaType === 'images') {
      ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        includeBase64: true,
      }).then(async (images) => {
        await images.map(async (item, index) => {
          let source = {
            uri: 'data:image/jpeg;base64,' + item.data,
            type: item.mime,
            name: null,
          };
          this.setState({
            uploadFile: source,
            sentMessageType: 'image',
            sendingMedia: true,
          });
          this.toggleSelectModal(false);
          await this.onMessageSend();
        });
      });
    }
    if (mediaType === 'video') {
      ImagePicker.openPicker({
        multiple: true,
        mediaType: 'video',
      }).then(async (video) => {
        console.log('ChannelChats -> onGalleryPress -> video', video);
        await video.map(async (item, index) => {
          let source = {
            uri: item.path,
            type: item.mime,
            name: null,
          };
          this.setState({
            uploadFile: source,
            sentMessageType: 'video',
            sendingMedia: true,
          });
          this.toggleSelectModal(false);
          await this.onMessageSend();
        });
      });
    }
  };

  onAttachmentPress = async () => {
    console.log('ChannelChats -> onAttachmentPress -> onAttachmentPress');
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.plainText,
          DocumentPicker.types.pdf,
          DocumentPicker.types.csv,
          DocumentPicker.types.zip,
          DocumentPicker.types.audio,
        ],
      });
      for (const res of results) {
        let fileType = res.type.substr(0, res.type.indexOf('/'));
        console.log(
          res.uri,
          res.type, // mime type
          res.name,
          res.size,
          res.type.substr(0, res.type.indexOf('/'))
        );
        let source = { uri: res.uri, type: res.type, name: res.name };
        if (fileType === 'audio') {
          this.setState({
            uploadFile: source,
            sentMessageType: 'audio',
            sendingMedia: true,
          });
        } else if (fileType === 'application') {
          this.setState({
            uploadFile: source,
            sentMessageType: 'doc',
            sendingMedia: true,
          });
        }
        this.onMessageSend();
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  toggleSelectModal = (status) => {
    this.setState({
      showSelectModal: status,
    });
  };

  selectUploadOption = (mediaType) => {
    // this.toggleSelectModal();
    this.onGalleryPress(mediaType);
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
      uploadFile,
      sendingMedia,
    } = this.state;
    const { currentFriend, chatsLoading, chatFriendConversation } = this.props;
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
        {chatsLoading && chatFriendConversation.length <= 0 ? (
          <ListLoader />
        ) : (
          <ChatContainer
            handleMessage={(message) => this.handleMessage(message)}
            onMessageSend={this.onMessageSend}
            onMessageReply={(id) => this.onReply(id)}
            newMessageText={newMessageText}
            messages={chatFriendConversation}
            orientation={this.state.orientation}
            repliedMessage={this.state.repliedMessage}
            isReply={this.state.isReply}
            cancelReply={this.cancelReply}
            onDelete={(id) => this.onDeletePressed(id)}
            onUnSendMsg={(id) => this.onUnSendPressed(id)}
            onMessageTranslate={(msg) => this.onMessageTranslate(msg)}
            onMessageTranslateClose={this.onMessageTranslateClose}
            onEditMessage={(msg) => this.onEdit(msg)}
            onDownloadMessage={(msg) => this.onDownload(msg)}
            translatedMessage={translatedMessage}
            translatedMessageId={translatedMessageId}
            onCameraPress={() => this.onCameraPress()}
            onGalleryPress={() => this.toggleSelectModal(true)}
            onAttachmentPress={() => this.onAttachmentPress()}
            sendingImage={uploadFile}
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

        <UploadSelectModal
          visible={this.state.showSelectModal}
          toggleSelectModal={this.toggleSelectModal}
          onSelect={(mediaType) => this.selectUploadOption(mediaType)}
        />
        {sendingMedia && <UploadLoader />}
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
    chatFriendConversation: state.friendReducer.chatFriendConversation,
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
  setFriendConversation,
  addNewSendMessage,
  resetFriendConversation,
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendChats);
