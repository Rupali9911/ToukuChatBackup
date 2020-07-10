import React, { Component, Fragment } from 'react';
import { ImageBackground, View } from 'react-native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import moment from 'moment';

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
} from '../../redux/reducers/channelReducer';
import { ListLoader, UploadLoader } from '../../components/Loaders';
import { ConfirmationModal, UploadSelectModal } from '../../components/Modals';
import { eventService } from '../../utils';
import Toast from '../../components/Toast';
import ImagePicker from 'react-native-image-picker';
import S3uploadService from '../../helpers/S3uploadService';
import DocumentPicker from 'react-native-document-picker';

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
    this.getChannelConversations();
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  onMessageSend = async () => {
    const {
      newMessageText,
      isEdited,
      sentMessageType,
      uploadFile,
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
      const uploadedApplication = await this.S3uploadService.uploadVideoOnS3Bucket(
        files
      );
      msgText = uploadedApplication;
      return;
    }
    let sendmsgdata = {
      // id: id,
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
      this.sendEditMessage();
      return;
    }
    let messageData = {
      channel: this.props.currentChannel.id,
      local_id: '45da06d9-0bc6-4031-b9ba-2cfff1e72013',
      message_body: msgText,
      msg_type: sentMessageType,
    };
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

  checkEventTypes(message) {
    const { currentChannel, userData } = this.props;

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

    if (
      message.text.data.type ==
        SocketEvents.DELETE_MESSAGE_IN_FOLLOWING_CHANNEL &&
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
  }

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
        let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          uploadFile: source,
          sentMessageType: 'image',
          sendingMedia: true,
        });
        this.onMessageSend();
      }
      // Same code as in above section!
    });
  };
  onGalleryPress = async (mediaType) => {
    var options = {
      title: '',
      mediaType: mediaType,
      storageOptions: {
        skipBackup: true,
        path: '',
      },
    };

    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        if (mediaType === 'images') {
          let fileType = response.type.substr(0, response.type.indexOf('/'));
          let source = {
            uri: 'data:image/jpeg;base64,' + response.data,
            type: fileType,
            name: response.fileName,
          };
          this.setState({
            uploadFile: source,
            sentMessageType: 'image',
            sendingMedia: true,
          });
        } else {
          let source = { uri: response.uri, type: null, name: null };
          this.setState({
            uploadFile: source,
            sentMessageType: 'video',
            sendingMedia: true,
          });
        }
        this.onMessageSend();
      }
      // this.toggleSelectModal();
      // Same code as in above section!
    });
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
    const { channelLoading } = this.props;
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

    if (channelLoading && conversations.length <= 0) {
      return <ListLoader />;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <ChatContainer
            handleMessage={(message) => this.handleMessage(message)}
            onMessageSend={this.onMessageSend}
            newMessageText={newMessageText}
            messages={conversations}
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
            onCameraPress={() => this.onCameraPress()}
            onGalleryPress={() => this.onGalleryPress('images')}
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
            toggleSelectModal={this.ontoggleSelectModal}
            onSelect={(mediaType) => this.selectUploadOption(mediaType)}
          />
          {sendingMedia && <UploadLoader />}
        </View>
      );
    }
  }

  toggleSelectModal = () => {
    this.setState((prevState) => ({
      showSelectModal: !prevState.showSelectModal,
    }));
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
      this.props.deleteChannelMessage(this.state.selectedMessageId, payload);
    }
  };

  onConfirmUnSend = () => {
    this.setState({ showMessageUnSendConfirmationModal: false });
    if (this.state.selectedMessageId != null) {
      let payload = { message_body: '', is_unsent: true };
      this.props
        .editChannelMessage(this.state.selectedMessageId, payload)
        .then((res) => {
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
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {
  getChannelConversations,
  readAllChannelMessages,
  sendChannelMessage,
  translateMessage,
  editChannelMessage,
  deleteChannelMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelChats);
