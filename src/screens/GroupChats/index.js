import React, {Component, Fragment} from 'react';
import {
  ImageBackground,
  Dimensions,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';

import {ChatHeader} from '../../components/Headers';
import {globalStyles} from '../../styles';
import {Colors, Fonts, Images, Icons, SocketEvents} from '../../constants';
import GroupChatContainer from '../../components/GroupChatContainer';
import {ConfirmationModal, UploadSelectModal} from '../../components/Modals';
import {
  translate,
  translateMessage,
} from '../../redux/reducers/languageReducer';
import {
  getGroupConversation,
  getUserGroups,
  getGroupDetail,
  getGroupMembers,
  setCurrentGroupDetail,
  setCurrentGroupMembers,
  deleteGroup,
  sendGroupMessage,
  leaveGroup,
  editGroupMessage,
  markGroupConversationRead,
  unSendGroupMessage,
  setGroupConversation,
  resetGroupConversation,
} from '../../redux/reducers/groupReducer';
import Toast from '../../components/Toast';
import {ListLoader, UploadLoader} from '../../components/Loaders';
import {eventService} from '../../utils';
import S3uploadService from '../../helpers/S3uploadService';

import {
  setGroupChatConversation,
  getGroupChatConversationById,
  deleteGroupMessageById,
  updateGroupMessageById,
  setGroupMessageUnsend,
} from '../../storage/Service';
import uuid from 'react-native-uuid';

class GroupChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      newMessageText: '',
      showLeaveGroupConfirmationModal: false,
      showDeleteGroupConfirmationModal: false,
      isMyGroup: false,
      conversation: [],
      selectedMessageId: null,
      translatedMessage: null,
      translatedMessageId: null,
      showMessageDeleteConfirmationModal: false,
      sentMessageType: 'text',
      showSelectModal: false,
      sendingMedia: false,
      uploadFile: {uri: null, type: null, name: null},
      headerRightIconMenu: [
        {
          id: 1,
          title: translate('pages.xchat.groupDetails'),
          icon: 'bars',
          onPress: () => {
            this.props.navigation.navigate('GroupDetails');
          },
        },
        {
          id: 2,
          title: translate('pages.xchat.leave'),
          icon: 'user-slash',
          onPress: () => {
            this.toggleLeaveGroupConfirmationModal();
          },
        },
        {
          id: 3,
          title: translate('pages.xchat.reportGroup'),
          icon: 'user-slash',
          onPress: () => {
            Toast.show({
              title: 'Touku',
              text: 'Group reported',
              type: 'positive',
            });
          },
        },
      ],
      headerRightIconMenuIsGroup: [
        {
          id: 1,
          title: translate('pages.xchat.inviteFriends'),
          icon: Icons.man_plus_icon_black,
          isLocalIcon: true,
          onPress: () => {
            this.props.navigation.navigate('GroupDetails', {isInvite: true});
          },
        },
        {
          id: 2,
          title: translate('pages.xchat.groupDetails'),
          icon: 'bars',
          onPress: () => {
            this.props.navigation.navigate('GroupDetails');
          },
        },
        {
          id: 3,
          title: translate('pages.xchat.deleteGroup'),
          icon: 'trash',
          onPress: () => {
            this.toggleDeleteGroupConfirmationModal();
          },
        },
        {
          id: 4,
          title: translate('pages.xchat.leave'),
          icon: 'user-slash',
          onPress: () => {
            this.toggleLeaveGroupConfirmationModal();
          },
        },
        {
          id: 5,
          title: translate('pages.xchat.reportGroup'),
          icon: 'user-slash',
          onPress: () => {
            Toast.show({
              title: 'Touku',
              text: 'Group reported',
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
    this.S3uploadService = new S3uploadService();
    this.props.resetGroupConversation();
  }

  onMessageSend = async () => {
    const {
      newMessageText,
      conversation,
      isReply,
      repliedMessage,
      isEdited,
      sentMessageType,
      uploadFile,
    } = this.state;
    const {userData, currentGroup} = this.props;

    if (!newMessageText && !uploadFile.uri) {
      return;
    }
    let msgText = newMessageText;
    if (sentMessageType === 'image') {
      let file = uploadFile.uri;
      let files = [file];
      const uploadedImages = await this.S3uploadService.uploadImagesOnS3Bucket(
        files,
      );

      msgText = uploadedImages.image[0].image;
    }
    if (sentMessageType === 'audio') {
      let file = uploadFile.uri;
      let files = [file];
      const uploadedAudio = await this.S3uploadService.uploadAudioOnS3Bucket(
        files,
        uploadFile.name,
        uploadFile.type,
      );
      msgText = uploadedAudio;
    }

    if (sentMessageType === 'doc') {
      let file = uploadFile.uri;
      let files = [file];
      const uploadedApplication = await this.S3uploadService.uploadApplicationOnS3Bucket(
        files,
        uploadFile.name,
        uploadFile.type,
      );
      msgText = uploadedApplication;
    }

    if (sentMessageType === 'video') {
      let file = uploadFile.uri;
      let files = [file];
      const uploadedVideo = await this.S3uploadService.uploadVideoOnS3Bucket(
        files,
        uploadFile.type,
      );
      msgText = uploadedVideo;
    }
    let sendmsgdata = {
      sender_id: userData.id,
      group_id: currentGroup.group_id,
      sender_username: userData.username,
      sender_display_name: userData.display_name,
      sender_picture: userData.avatar,
      message_body: {
        type: sentMessageType,
        text: msgText,
      },
      is_edited: false,
      is_unsent: false,
      timestamp: moment().format(),
      reply_to: isReply
        ? {
            display_name: repliedMessage.sender_display_name,
            id: repliedMessage.msg_id,
            mentions: repliedMessage.mentions,
            message: repliedMessage.message_body.text,
            msg_type: repliedMessage.message_body.type,
            name: repliedMessage.sender_username,
            sender_id: repliedMessage.sender_id,
          }
        : null,
      mentions: [],
      read_count: null,
    };
    if (isEdited) {
      updateGroupMessageById(this.state.editMessageId, {
        type: sentMessageType,
        text: msgText,
      });
      this.sendEditMessage();
      return;
    }
    if (isReply) {
      let groupMessage;
      if (sentMessageType !== 'text') {
        groupMessage = {
          group: this.props.currentGroup.group_id,
          local_id: uuid.v4(),
          mentions: [],
          media_url: msgText,
          msg_type: sentMessageType,
          reply_to: repliedMessage.msg_id,
        };
      } else {
        groupMessage = {
          group: this.props.currentGroup.group_id,
          local_id: uuid.v4(),
          mentions: [],
          message_body: msgText,
          msg_type: sentMessageType,
          reply_to: repliedMessage.msg_id,
        };
      }
      this.state.conversation.unshift(sendmsgdata);
      this.props.setGroupConversation([
        sendmsgdata,
        ...this.props.chatGroupConversation,
      ]);
      this.props.sendGroupMessage(groupMessage);
    } else {
      let groupMessage;
      if (sentMessageType !== 'text') {
        groupMessage = {
          group: this.props.currentGroup.group_id,
          local_id: uuid.v4(),
          mentions: [],
          media_url: msgText,
          msg_type: sentMessageType,
        };
      } else {
        groupMessage = {
          group: this.props.currentGroup.group_id,
          local_id: uuid.v4(),
          mentions: [],
          message_body: msgText,
          msg_type: sentMessageType,
        };
      }

      this.state.conversation.unshift(sendmsgdata);
      this.props.setGroupConversation([
        sendmsgdata,
        ...this.props.chatGroupConversation,
      ]);
      this.props.sendGroupMessage(groupMessage);
    }

    this.setState({
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
      isEdited: false,
      sentMessageType: 'text',
      sendingMedia: false,
      uploadFile: {uri: null, type: null, name: null},
    });
  };

  sendEditMessage = () => {
    const {newMessageText, editMessageId} = this.state;
    const data = {
      message_body: newMessageText,
    };
    this.props.editGroupMessage(editMessageId, data);
    this.setState({
      newMessageText: '',
      isReply: false,
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

    let fileName = message.message_body.text
      .split('/')
      .pop()
      .split('%2F')
      .pop();
    if (
      message.message_body.type === 'image' &&
      fileName.lastIndexOf('.') === -1
    ) {
      fileName = `${fileName}.jpg`;
    }
    if (
      message.message_body.type === 'video' &&
      fileName.lastIndexOf('.') === -1
    ) {
      fileName = `${fileName}.mp4`;
    }

    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      path: `${dirs.DownloadDir}/${fileName}`,
      fileCache: true,
    })
      .fetch('GET', message.message_body.text, {})
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
      newMessageText: message.message_body.text,
      editMessageId: message.msg_id,
      isEdited: true,
    });
  };

  onEditClear = () => {
    this.setState({
      editMessageId: null,
      isEdited: false,
    });
  };

  onReply = (messageId) => {
    // const { conversation } = this.state;
    const {chatGroupConversation} = this.props;

    const repliedMessage = chatGroupConversation.find(
      (item) => item.msg_id === messageId,
    );
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
    this.setState({orientation: initial});

    // this.events = eventService.getMessage().subscribe((message) => {
    //   this.checkEventTypes(message);
    // });
  }

  componentWillUnmount() {
    // this.events.unsubscribe();
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);

    this.getGroupConversationInitial();
    this.getGroupDetail();
    this.getGroupMembers();
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  checkEventTypes(message) {
    const {currentGroup, userData} = this.props;
    const {conversation} = this.state;

    // console.log('event_msg', JSON.stringify(message));

    //New Message in group
    // if (message.text.data.type == SocketEvents.NEW_MESSAGE_IN_GROUP) {
    //   var valueArr = conversation.map(function (item) {
    //     return item.msg_id;
    //   });
    //   var isDuplicate = valueArr.some(function (item, idx) {
    //     return valueArr.indexOf(item) != idx;
    //   });
    //   if (message.text.data.message_details.group_id == currentGroup.group_id) {
    //     this.markGroupConversationRead();
    //     setGroupChatConversation([message.text.data.message_details]);
    //     this.getLocalGroupConversation();
    //     // if (message.text.data.message_details.sender_id != userData.id) {
    //     //   this.getGroupConversation();
    //     // } else {
    //     //   this.getGroupConversation();
    //     // }
    //   }
    // }

    //Edit Message from group
    // if (message.text.data.type == SocketEvents.MESSAGE_EDIT_FROM_GROUP) {
    //   if (message.text.data.message_details.group_id == currentGroup.group_id) {
    //     updateGroupMessageById(message.text.data.message_details.msg_id,message.text.data.message_details.message_body);
    //     // this.getGroupConversation();
    //     this.getLocalGroupConversation();
    //   }
    // }

    //Unsend Message From Group
    // if (message.text.data.type == SocketEvents.UNSENT_MESSAGE_FROM_GROUP) {
    //   if (message.text.data.message_details.group_id == currentGroup.group_id) {
    //     setGroupMessageUnsend(message.text.data.message_details.msg_id);
    //     // this.getGroupConversation();
    //     this.getLocalGroupConversation();
    //   }
    // }

    //Delete Message From Group
    // if (message.text.data.type == SocketEvents.DELETE_MESSAGE_IN_GROUP) {
    //   if (message.text.data.message_details.group_id == currentGroup.group_id) {
    //     deleteGroupMessageById(message.text.data.message_details.msg_id);
    //     let chat = getGroupChatConversationById(
    //       this.props.currentGroup.group_id
    //     );
    //     this.props.setGroupConversation(chat);
    //   }
    // }

    //REMOVE_GROUP_MEMBER
    // if (message.text.data.type == SocketEvents.REMOVE_GROUP_MEMBER) {
    //   if (message.text.data.message_details.group_id == currentGroup.group_id) {
    //     this.getGroupDetail();
    //     this.getGroupMembers();
    //   }
    // }

    //ADD_GROUP_MEMBER
    // if (message.text.data.type == SocketEvents.ADD_GROUP_MEMBER) {
    //   if (message.text.data.message_details.group_id == currentGroup.group_id) {
    //     this.getGroupDetail();
    //     this.getGroupMembers();
    //   }
    // }

    //READ_COUNT_IN_GROUP
    if (message.text.data.type == SocketEvents.READ_COUNT_IN_GROUP) {
      if (message.text.data.message_details.group_id == currentGroup.group_id) {
        // this.getGroupConversation();
      }
    }

    //PINED_GROUP
    if (message.text.data.type == SocketEvents.PINED_GROUP) {
      if (message.text.data.message_details.group_id == currentGroup.group_id) {
        // this.getGroupConversation();
      }
    }

    //UNPINED_GROUP
    if (message.text.data.type == SocketEvents.UNPINED_GROUP) {
      if (message.text.data.message_details.group_id == currentGroup.group_id) {
        // this.getGroupConversation();
      }
    }

    //EDIT_GROUP_DETAIL
    // if(message.text.data.type == SocketEvents.EDIT_GROUP_DETAIL) {
    //   console.log('get update detail');
    //   this.getGroupDetail();
    // }
  }

  markGroupConversationRead() {
    let data = {group_id: this.props.currentGroup.group_id};
    this.props.markGroupConversationRead(data);
  }

  getLocalGroupConversation = () => {
    let chat = getGroupChatConversationById(this.props.currentGroup.group_id);
    if (chat.length) {
      let conversations = [];
      chat.map((item, index) => {
        conversations = [...conversations, item];
      });
      this.props.setGroupConversation(conversations);
    }
  };

  getGroupConversation = async () => {
    await this.props
      .getGroupConversation(this.props.currentGroup.group_id)
      .then((res) => {
        if (res.status) {
          console.log('response', JSON.stringify(res));
          let data = res.data;
          data.sort((a, b) =>
            a.timestamp &&
            b.timestamp &&
            new Date(a.timestamp) < new Date(b.timestamp)
              ? 1
              : -1,
          );

          let chat = getGroupChatConversationById(
            this.props.currentGroup.group_id,
          );
          let conversations = [];
          chat.map((item, index) => {
            conversations = [...conversations, item];
          });

          // this.setState({ conversation: conversations });
          this.props.setGroupConversation(conversations);
          this.markGroupConversationRead();
        }
      })
      .catch((err) => {
        console.log('GroupChats -> getGroupConversation -> err', err);
      });
  };

  getGroupConversationInitial = async () => {
    let chat = getGroupChatConversationById(this.props.currentGroup.group_id);
    if (chat.length) {
      let conversations = [];
      chat.map((item, index) => {
        conversations = [...conversations, item];
      });

      // this.setState({ conversation: conversations });
      this.props.setGroupConversation(conversations);
    }

    await this.props
      .getGroupConversation(this.props.currentGroup.group_id)
      .then((res) => {
        if (res.status) {
          console.log('response', JSON.stringify(res));
          let data = res.data;
          data.sort((a, b) =>
            a.timestamp &&
            b.timestamp &&
            new Date(a.timestamp) < new Date(b.timestamp)
              ? 1
              : -1,
          );

          let chat = getGroupChatConversationById(
            this.props.currentGroup.group_id,
          );
          let conversations = [];
          chat.map((item, index) => {
            conversations = [...conversations, item];
          });

          // this.setState({ conversation: conversations });
          this.props.setGroupConversation(conversations);
          this.markGroupConversationRead();
        }
      })
      .catch((err) => {
        console.log('GroupChats -> getGroupConversation -> err', err);
      });
  };

  getGroupDetail() {
    this.props
      .getGroupDetail(this.props.currentGroup.group_id)
      .then((res) => {
        console.log('group_detail', JSON.stringify(res));
        this.props.setCurrentGroupDetail(res);
        for (let admin of res.admin_details) {
          if (admin.id === this.props.userData.id) {
            this.setState({isMyGroup: true});
          }
        }
      })
      .catch((err) => {
        Toast.show({
          title: 'Touku',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
        this.props.navigation.goBack();
      });
  }

  getGroupMembers() {
    this.props
      .getGroupMembers(this.props.currentGroup.group_id)
      .then((res) => {
        this.props.setCurrentGroupMembers(res.results);
      })
      .catch((err) => {});
  }

  handleMessage(message) {
    this.setState({newMessageText: message});
  }

  //Leave Group
  toggleLeaveGroupConfirmationModal = () => {
    this.setState((prevState) => ({
      showLeaveGroupConfirmationModal: !prevState.showLeaveGroupConfirmationModal,
    }));
  };

  onConfirmLeaveGroup = () => {
    const payload = {
      group_id: this.props.currentGroup.group_id,
    };
    this.props
      .leaveGroup(payload)
      .then((res) => {
        if (res.status === true) {
          Toast.show({
            title: 'Touku',
            text: translate('common.success'),
            type: 'positive',
          });
          this.props.getUserGroups();
          this.props.navigation.goBack();
        }
        this.toggleLeaveGroupConfirmationModal();
      })
      .catch((err) => {
        Toast.show({
          title: 'Touku',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
        this.toggleLeaveGroupConfirmationModal();
      });
  };

  //Delete Group
  toggleDeleteGroupConfirmationModal = () => {
    this.setState((prevState) => ({
      showDeleteGroupConfirmationModal: !prevState.showDeleteGroupConfirmationModal,
    }));
  };

  onConfirmDeleteGroup = () => {
    this.toggleDeleteGroupConfirmationModal();
    this.props
      .deleteGroup(this.props.currentGroup.group_id)
      .then((res) => {
        if (res.status === true) {
          Toast.show({
            title: 'Touku',
            text: translate('pages.xchat.toastr.groupIsRemoved'),
            type: 'positive',
          });
          this.props.getUserGroups();
          this.props.navigation.goBack();
        }
      })
      .catch((err) => {
        Toast.show({
          title: 'Touku',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
      });
  };

  toggleMessageDeleteConfirmationModal = () => {
    this.setState((prevState) => ({
      showMessageDeleteConfirmationModal: !prevState.showMessageDeleteConfirmationModal,
    }));
  };

  onDeleteMessagePressed = (messageId) => {
    this.setState({
      showMessageDeleteConfirmationModal: true,
      selectedMessageId: messageId,
    });
  };

  onUnsendMessagePressed = (messageId) => {
    this.setState({
      showMessageUnsendConfirmationModal: true,
      selectedMessageId: messageId,
    });
  };

  onConfirmMessageDelete = () => {
    this.setState({showMessageDeleteConfirmationModal: false});
    if (this.state.selectedMessageId != null) {
      let payload = {delete_type: 1};
      this.props
        .unSendGroupMessage(this.state.selectedMessageId, payload)
        .then((res) => {
          deleteGroupMessageById(this.state.selectedMessageId);
          this.getGroupConversation();
        });
    }
  };

  onConfirmMessageUnSend = () => {
    this.setState({showMessageUnsendConfirmationModal: false});
    if (this.state.selectedMessageId != null) {
      let payload = {delete_type: 2};
      this.props
        .unSendGroupMessage(this.state.selectedMessageId, payload)
        .then((res) => {
          setGroupMessageUnsend(this.state.selectedMessageId);
          Toast.show({
            title: 'Touku',
            text: translate('pages.xchat.messageUnsent'),
            type: 'positive',
          });
        });
    }
  };

  onCancelPress = () => {
    this.setState({
      showDeleteGroupConfirmationModal: false,
      showLeaveGroupConfirmationModal: false,
      showMessageDeleteConfirmationModal: false,
      showMessageUnsendConfirmationModal: false,
    });
  };

  onMessageTranslate = (message) => {
    const payload = {
      text: message.message_body.text,
      language: this.props.selectedLanguageItem.language_name,
    };
    this.props.translateMessage(payload).then((res) => {
      if (res.status == true) {
        this.setState({
          translatedMessageId: message.msg_id,
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

  onCameraPress = () => {
    ImagePicker.openCamera({
      includeBase64: true,
      mediaType: 'photo',
    }).then((image) => {
      let source = {uri: 'data:image/jpeg;base64,' + image.data};
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
          res.type.substr(0, res.type.indexOf('/')),
        );
        let source = {uri: res.uri, type: res.type, name: res.name};
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
      newMessageText,
      showLeaveGroupConfirmationModal,
      showDeleteGroupConfirmationModal,
      showMessageUnsendConfirmationModal,
      orientation,
      isMyGroup,
      conversation,
      isReply,
      repliedMessage,
      showMessageDeleteConfirmationModal,
      translatedMessage,
      translatedMessageId,
      uploadFile,
      sendingMedia,
    } = this.state;
    const {
      chatGroupConversation,
      currentGroup,
      currentGroupDetail,
      groupLoading,
    } = this.props;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <ChatHeader
          title={currentGroupDetail.name}
          description={
            currentGroupDetail.total_members +
            ' ' +
            translate('pages.xchat.members')
          }
          onBackPress={() => this.props.navigation.goBack()}
          menuItems={
            isMyGroup
              ? this.state.headerRightIconMenuIsGroup
              : this.state.headerRightIconMenu
          }
          image={currentGroupDetail.group_picture}
        />
        {groupLoading && chatGroupConversation.length <= 0 ? (
          <ListLoader />
        ) : (
          <GroupChatContainer
            memberCount={currentGroupDetail.total_members}
            handleMessage={(message) => this.handleMessage(message)}
            onMessageSend={this.onMessageSend}
            onMessageReply={(id) => this.onReply(id)}
            newMessageText={newMessageText}
            messages={chatGroupConversation}
            orientation={orientation}
            repliedMessage={repliedMessage}
            isReply={isReply}
            cancelReply={this.cancelReply.bind(this)}
            onDelete={(id) => this.onDeleteMessagePressed(id)}
            onUnSendMsg={(id) => this.onUnsendMessagePressed(id)}
            onMessageTranslate={(msg) => this.onMessageTranslate(msg)}
            onEditMessage={(msg) => this.onEdit(msg)}
            onDownloadMessage={(msg) => this.onDownload(msg)}
            onMessageTranslateClose={this.onMessageTranslateClose}
            translatedMessage={translatedMessage}
            translatedMessageId={translatedMessageId}
            onCameraPress={() => this.onCameraPress()}
            onGalleryPress={() => this.toggleSelectModal(true)}
            onAttachmentPress={() => this.onAttachmentPress()}
            sendingImage={uploadFile}
          />
        )}

        <ConfirmationModal
          orientation={orientation}
          visible={showLeaveGroupConfirmationModal}
          onCancel={this.onCancelPress.bind(this)}
          onConfirm={this.onConfirmLeaveGroup.bind(this)}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.wantToLeaveText')}
        />

        <ConfirmationModal
          orientation={orientation}
          visible={showDeleteGroupConfirmationModal}
          onCancel={this.onCancelPress.bind(this)}
          onConfirm={this.onConfirmDeleteGroup.bind(this)}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.toastr.groupWillBeDeleted')}
        />

        <ConfirmationModal
          visible={showMessageDeleteConfirmationModal}
          onCancel={this.onCancelPress.bind(this)}
          onConfirm={this.onConfirmMessageDelete.bind(this)}
          orientation={orientation}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.youWantToDeleteThisMessage')}
        />

        <ConfirmationModal
          visible={showMessageUnsendConfirmationModal}
          onCancel={this.onCancelPress.bind(this)}
          onConfirm={this.onConfirmMessageUnSend.bind(this)}
          orientation={orientation}
          title={translate('pages.xchat.toastr.areYouSure')}
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
    currentGroup: state.groupReducer.currentGroup,
    groupLoading: state.groupReducer.loading,
    currentGroupDetail: state.groupReducer.currentGroupDetail,
    chatGroupConversation: state.groupReducer.chatGroupConversation,
    userData: state.userReducer.userData,
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {
  getGroupConversation,
  getUserGroups,
  getGroupDetail,
  getGroupMembers,
  setCurrentGroupDetail,
  setCurrentGroupMembers,
  deleteGroup,
  leaveGroup,
  sendGroupMessage,
  translateMessage,
  editGroupMessage,
  markGroupConversationRead,
  unSendGroupMessage,
  setGroupConversation,
  resetGroupConversation,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupChats);
