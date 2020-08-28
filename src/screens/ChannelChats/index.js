import React, { Component, Fragment } from 'react';
import {
  ImageBackground,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';

import { ChatHeader } from '../../components/Headers';
import { globalStyles } from '../../styles';
import { Images, SocketEvents } from '../../constants';
import ChatContainer from '../../components/ChatContainer';
import {
  translate,
  translateMessage,
} from '../../redux/reducers/languageReducer';
import {
  getChannelConversations,
  readAllChannelMessages,
  sendChannelMessage,
  editChannelMessage,
  deleteChannelMessage,
  resetChannelConversation,
  setChannelConversation,
  addNewSendMessage,
} from '../../redux/reducers/channelReducer';
import { ListLoader, UploadLoader } from '../../components/Loaders';
import { ConfirmationModal, UploadSelectModal } from '../../components/Modals';
import { eventService } from '../../utils';
import Toast from '../../components/Toast';
import S3uploadService from '../../helpers/S3uploadService';
import {
  getChannelChatConversationById,
  updateMessageById,
  deleteMessageById,
  setMessageUnsend,
} from '../../storage/Service';
import uuid from 'react-native-uuid';


class ChannelChats extends Component {
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
      showMessageUnSendConfirmationModal: false,
      showMessageDeleteConfirmationModal: false,
      showSelectModal: false,
      isEdited: false,
      editMessageId: null,
      sentMessageType: 'text',
      sendingMedia: false,
      uploadFile: { uri: null, type: null, name: null },
      headerRightIconMenu: [
        {
          id: 1,
          title: translate('pages.xchat.channelDetails'),
          icon: 'bars',
          onPress: () => {
            this.props.navigation.navigate('ChannelInfo');
          },
        },
        {
          id: 2,
          title: 'Report Channel',
          icon: 'user-slash',
          onPress: () => {
            Toast.show({
              title: 'Touku',
              text: 'Channel reported',
              type: 'positive',
            });
          },
        },
      ],
    };
    this.S3uploadService = new S3uploadService();
    this.props.resetChannelConversation();
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
    this.getChannelConversationsInitial();
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  async checkEventTypes(message) {
    const { currentChannel, userData } = this.props;

    //MESSAGE_IN_FOLLOWING_CHANNEL
    if (
      message.text.data.type == SocketEvents.MESSAGE_IN_FOLLOWING_CHANNEL &&
      message.text.data.message_details.channel == currentChannel.id
    ) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        this.getChannelConversations();
      } else if (
        message.text.data.message_details.to_user != null &&
        message.text.data.message_details.to_user.id == userData.id
      ) {
        this.getChannelConversations();
      }
    }

    //DELETE_MESSAGE_IN_FOLLOWING_CHANNEL
    if (
      message.text.data.type ==
        SocketEvents.DELETE_MESSAGE_IN_FOLLOWING_CHANNEL &&
      message.text.data.message_details.channel == currentChannel.id
    ) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        deleteMessageById(message.text.data.message_details.id);
        let chat = getChannelChatConversationById(
          this.props.currentChannel.id
        );
        console.log('chat',chat.length);
        this.props.setChannelConversation(chat);
      } else if (
        message.text.data.message_details.to_user != null &&
        message.text.data.message_details.to_user.id == userData.id
      ) {
        deleteMessageById(message.text.data.message_details.id);
        let chat = getChannelChatConversationById(
          this.props.currentChannel.id
        );
        console.log('chat',chat.length);
        this.props.setChannelConversation(chat);
      }
    }

    //MULTIPLE_MESSAGE_IN_FOLLOWING_CHANNEL
    if (
      message.text.data.type ==
      SocketEvents.MULTIPLE_MESSAGE_IN_FOLLOWING_CHANNEL
    ) {
      message.text.data.message_details.map((item) => {
        if (item.channel === currentChannel.id) {
          this.getChannelConversations();
        }
      });
    }

    // MESSAGE_IN_THREAD
    if (
      message.text.data.type ==
        SocketEvents.MESSAGE_IN_THREAD &&
      message.text.data.message_details.channel == currentChannel.id
    ) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        this.getChannelConversations();
      } else if (
        message.text.data.message_details.to_user != null &&
        message.text.data.message_details.to_user.id == userData.id
      ) {
        this.getChannelConversations();
      }
    }

    // MESSAGE_EDITED_IN_FOLLOWING_CHANNEL
    if (
      message.text.data.type ==
        SocketEvents.MESSAGE_EDITED_IN_FOLLOWING_CHANNEL &&
      message.text.data.message_details.channel == currentChannel.id
    ) {
      if (message.text.data.message_details.from_user == userData.id) {
        let editMessageId = message.text.data.message_details.id;
        let msgText = message.text.data.message_details.message_body;
        let msgType = message.text.data.message_details.msg_type;
        console.log(editMessageId,msgText,msgType);
        updateMessageById(editMessageId, msgText, msgType);
        this.getChannelConversations();
      } else if (
        message.text.data.message_details.to_user != null &&
        message.text.data.message_details.to_user.id == userData.id
      ) {
        // this.getChannelConversations();
      }
    }

    // MESSAGE_EDITED_IN_THREAD
    if (
      message.text.data.type ==
        SocketEvents.MESSAGE_EDITED_IN_THREAD &&
      message.text.data.message_details.channel == currentChannel.id
    ) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        // this.getChannelConversations();
      } else if (
        message.text.data.message_details.to_user != null &&
        message.text.data.message_details.to_user.id == userData.id
      ) {
        // this.getChannelConversations();
      }
    }

    // DELETE_MESSAGE_IN_THREAD
    if (
      message.text.data.type ==
        SocketEvents.DELETE_MESSAGE_IN_THREAD &&
      message.text.data.message_details.channel == currentChannel.id
    ) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        // this.getChannelConversations();
      } else if (
        message.text.data.message_details.to_user != null &&
        message.text.data.message_details.to_user.id == userData.id
      ) {
        // this.getChannelConversations();
      }
    }

    //UNSENT_MESSAGE_IN_FOLLOWING_CHANNEL
    if (
      message.text.data.type ==
        SocketEvents.UNSENT_MESSAGE_IN_FOLLOWING_CHANNEL &&
      message.text.data.message_details.channel == currentChannel.id
    ) {
      if (message.text.data.message_details.from_user == userData.id) {
        setMessageUnsend(message.text.data.message_details.id);
        this.getChannelConversations();
      } else if (
        message.text.data.message_details.to_user != null &&
        message.text.data.message_details.to_user.id == userData.id
      ) {
        // this.getChannelConversations();
      }
    }

    //UNSENT_MESSAGE_IN_THREAD
    if (
      message.text.data.type ==
        SocketEvents.UNSENT_MESSAGE_IN_THREAD &&
      message.text.data.message_details.channel == currentChannel.id
    ) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        // this.getChannelConversations();
      } else if (
        message.text.data.message_details.to_user != null &&
        message.text.data.message_details.to_user.id == userData.id
      ) {
        // this.getChannelConversations();
      }
    }

    //MULTIPLE_MESSAGE_IN_THREAD
    if (
      message.text.data.type ==
        SocketEvents.MULTIPLE_MESSAGE_IN_THREAD &&
      message.text.data.message_details.channel == currentChannel.id
    ) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        // this.getChannelConversations();
      } else if (
        message.text.data.message_details.to_user != null &&
        message.text.data.message_details.to_user.id == userData.id
      ) {
        // this.getChannelConversations();
      }
    }

    //ADD_CHANNEL_ADMIN
    if (
      message.text.data.type ==
        SocketEvents.ADD_CHANNEL_ADMIN &&
      message.text.data.message_details.channel == currentChannel.id
    ) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        // this.getChannelConversations();
      } else if (
        message.text.data.message_details.to_user != null &&
        message.text.data.message_details.to_user.id == userData.id
      ) {
        // this.getChannelConversations();
      }
    }

    //READ_ALL_MESSAGE_CHANNEL_SUBCHAT
    if (
      message.text.data.type ==
        SocketEvents.READ_ALL_MESSAGE_CHANNEL_SUBCHAT &&
      message.text.data.message_details.channel == currentChannel.id
    ) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        // this.getChannelConversations();
      } else if (
        message.text.data.message_details.to_user != null &&
        message.text.data.message_details.to_user.id == userData.id
      ) {
        // this.getChannelConversations();
      }
    }

    //PINED_CHANNEL
    if (
      message.text.data.type ==
        SocketEvents.PINED_CHANNEL &&
      message.text.data.message_details.channel == currentChannel.id
    ) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        // this.getChannelConversations();
      } else if (
        message.text.data.message_details.to_user != null &&
        message.text.data.message_details.to_user.id == userData.id
      ) {
        // this.getChannelConversations();
      }
    }

    //UNPINED_CHANNEL
    if (
      message.text.data.type ==
        SocketEvents.UNPINED_CHANNEL &&
      message.text.data.message_details.channel == currentChannel.id
    ) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        // this.getChannelConversations();
      } else if (
        message.text.data.message_details.to_user != null &&
        message.text.data.message_details.to_user.id == userData.id
      ) {
        // this.getChannelConversations();
      }
    }


  }

  onMessageSend = async () => {
    const {
      newMessageText,
      isEdited,
      sentMessageType,
      uploadFile,
      editMessageId,
    } = this.state;
    const { userData, currentChannel } = this.props;

    if (!newMessageText && !uploadFile.uri) {
      return;
    }
    let msgText = newMessageText;
    if (sentMessageType === 'image') {
      let file = uploadFile.uri;
      let files = [file];
      const uploadedImages = await this.S3uploadService.uploadImagesOnS3Bucket(
        files
      );
      msgText = uploadedImages.image[0].image;
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
      thumbnail: null,
      from_user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        avatar: userData.avatar,
        is_online: true,
        display_name: userData.display_name,
      },
      to_user: null,
      replies_is_read: null,
      created: moment().format(),
      updated: moment().format(),
      msg_type: sentMessageType,
      message_body: msgText,
      mutlilanguage_message_body: {},
      hyperlink: null,
      is_edited: false,
      is_multilanguage: false,
      is_unsent: false,
      bonus_message: false,
      channel: currentChannel.id,
      reply_to: null,
      schedule_post: null,
      subchat: null,
      greeting: null,
      read_by_in_replies: [],
      read_by: [],
      deleted_for: [],
    };

    if (isEdited) {
      updateMessageById(editMessageId, msgText, sentMessageType);
      this.sendEditMessage();
      return;
    }
    let messageData = {
      channel: this.props.currentChannel.id,
      local_id: uuid.v4(),
      message_body: msgText,
      msg_type: sentMessageType,
    };
    // console.log('ChannelChats -> onMessageSend -> sendmsgdata', sendmsgdata);
    this.props.addNewSendMessage(sendmsgdata);
    this.state.conversations.unshift(sendmsgdata);
    this.props.sendChannelMessage(messageData);
    this.setState({
      newMessageText: '',
      repliedMessage: null,
      isEdited: false,
      sentMessageType: 'text',
      sendingMedia: false,
      uploadFile: { uri: null, type: null, name: null },
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

  sendEditMessage = () => {
    const { newMessageText, editMessageId } = this.state;

    const data = {
      message_body: newMessageText,
    };

    this.props
      .editChannelMessage(editMessageId, data)
      .then((res) => {
        this.getChannelConversations();
      })
      .catch((err) => {});
    this.setState({
      newMessageText: '',
      repliedMessage: null,
      isEdited: false,
      sendingMedia: false,
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

  getChannelConversations = async () => {
    await this.props
      .getChannelConversations(this.props.currentChannel.id)
      .then((res) => {
        if (res.status === true && res.conversation.length > 0) {
          this.setState({ conversations: res.conversation });
          this.props.readAllChannelMessages(this.props.currentChannel.id);
          let chat = getChannelChatConversationById(
            this.props.currentChannel.id
          );
          let conversations = [];
          chat.map((item, index) => {
            conversations = [...conversations, item];
          });
          this.props.setChannelConversation(conversations);
        }
      });
  };

  getChannelConversationsInitial = async () => {
    let chat = getChannelChatConversationById(this.props.currentChannel.id);
    if (chat.length) {
      let conversations = [];
      chat.map((item, index) => {
        conversations = [...conversations, item];
      });
      this.props.setChannelConversation(conversations);
    }
    await this.props
      .getChannelConversations(this.props.currentChannel.id)
      .then((res) => {
        if (res.status === true && res.conversation.length > 0) {
          this.setState({ conversations: res.conversation });
          this.props.readAllChannelMessages(this.props.currentChannel.id);
          let chat = getChannelChatConversationById(
            this.props.currentChannel.id
          );
          let conversations = [];
          chat.map((item, index) => {
            conversations = [...conversations, item];
          });
          this.props.setChannelConversation(conversations);
        }
      });
  };

  handleMessage(message) {
    this.setState({ newMessageText: message });
  }

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
        console.log('ChannelChats -> onAttachmentPress -> res', res);
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
          });
        } else if (fileType === 'application') {
          this.setState({
            uploadFile: source,
            sentMessageType: 'doc',
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

  renderConversations() {
    const { channelLoading, chatConversation } = this.props;
    const {
      conversations,
      newMessageText,
      translatedMessage,
      translatedMessageId,
      orientation,
      repliedMessage,
      showConfirmationModal,
      showMessageUnSendConfirmationModal,
      showMessageDeleteConfirmationModal,
      uploadFile,
      sendingMedia,
    } = this.state;
    if (!this.props.chatConversation) {
      return null;
    }
    console.log('chatConversation',chatConversation.length);
    if (channelLoading && chatConversation.length <= 0) {
      return <ListLoader />;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <ChatContainer
            handleMessage={(message) => this.handleMessage(message)}
            onMessageSend={this.onMessageSend}
            newMessageText={newMessageText}
            messages={chatConversation}
            orientation={orientation}
            repliedMessage={repliedMessage}
            onDelete={(id) => this.onDeletePressed(id)}
            onUnSendMsg={(id) => this.onUnSendPressed(id)}
            onMessageTranslate={(msg) => this.onMessageTranslate(msg)}
            onMessageTranslateClose={this.onMessageTranslateClose}
            translatedMessage={translatedMessage}
            translatedMessageId={translatedMessageId}
            isChannel={true}
            onEditMessage={(msg) => this.onEdit(msg)}
            onDownloadMessage={(msg) => this.onDownload(msg)}
            onCameraPress={() => this.onCameraPress()}
            onGalleryPress={() => this.toggleSelectModal(true)}
            onAttachmentPress={() => this.onAttachmentPress()}
            sendingImage={uploadFile}
          />

          <ConfirmationModal
            visible={showConfirmationModal}
            onCancel={this.onCancel.bind(this)}
            onConfirm={this.onConfirm.bind(this)}
            orientation={orientation}
            title={translate('pages.xchat.toastr.areYouSure')}
            message={translate('pages.xchat.toLeaveThisChannel')}
          />

          <ConfirmationModal
            visible={showMessageUnSendConfirmationModal}
            onCancel={this.onCancel.bind(this)}
            onConfirm={this.onConfirmUnSend.bind(this)}
            orientation={orientation}
            title={translate('common.unsend')}
            message={translate('pages.xchat.toastr.messageWillBeUnsent')}
          />

          <ConfirmationModal
            visible={showMessageDeleteConfirmationModal}
            onCancel={this.onCancel.bind(this)}
            onConfirm={this.onConfirmDeleteMessage.bind(this)}
            orientation={orientation}
            title={translate('pages.xchat.toastr.areYouSure')}
            message={translate('pages.xchat.youWantToDeleteThisMessage')}
          />
          <UploadSelectModal
            visible={this.state.showSelectModal}
            toggleSelectModal={this.toggleSelectModal}
            onSelect={(mediaType) => this.selectUploadOption(mediaType)}
          />
          {sendingMedia && <UploadLoader />}
        </View>
      );
    }
  }

  toggleSelectModal = (status) => {
    this.setState({
      showSelectModal: status,
    });
  };

  selectUploadOption = (mediaType) => {
    // this.toggleSelectModal();
    this.onGalleryPress(mediaType);
  };

  // To delete message
  toggleConfirmationModal = () => {
    this.setState((prevState) => ({
      showConfirmationModal: !prevState.showConfirmationModal,
    }));
  };

  onCancel = () => {
    this.setState({
      showConfirmationModal: false,
      showMessageUnSendConfirmationModal: false,
      showMessageDeleteConfirmationModal: false,
    });
  };

  onConfirm = () => {
    this.toggleConfirmationModal();
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

  onConfirmDeleteMessage = () => {
    this.setState({ showMessageDeleteConfirmationModal: false });
    if (this.state.selectedMessageId != null) {
      let payload = {
        deleted_for: [this.props.userData.id],
      };
      deleteMessageById(this.state.selectedMessageId);
      this.props
        .deleteChannelMessage(this.state.selectedMessageId, payload)
        .then((res) => {
          this.getChannelConversations();
        });
    }
  };

  onConfirmUnSend = () => {
    this.setState({ showMessageUnSendConfirmationModal: false });
    if (this.state.selectedMessageId != null) {
      let payload = { message_body: '', is_unsent: true };
      this.props
        .editChannelMessage(this.state.selectedMessageId, payload)
        .then((res) => {
          setMessageUnsend(this.state.selectedMessageId);
          this.getChannelConversations();
          Toast.show({
            title: 'Touku',
            text: translate('pages.xchat.messageUnsent'),
            type: 'positive',
          });
        });
    }
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
        {this.props.chatConversation && this.renderConversations()}
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentChannel: state.channelReducer.currentChannel,
    channelLoading: state.channelReducer.loading,
    userData: state.userReducer.userData,
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    chatConversation: state.channelReducer.chatConversation,
  };
};

const mapDispatchToProps = {
  getChannelConversations,
  readAllChannelMessages,
  sendChannelMessage,
  translateMessage,
  editChannelMessage,
  deleteChannelMessage,
  setChannelConversation,
  resetChannelConversation,
  addNewSendMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelChats);
