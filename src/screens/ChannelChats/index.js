import React, {Component, Fragment} from 'react';
import {
  Dimensions,
  ImageBackground,
  View,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  Modal,
  Image,
  PixelRatio,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {Avatar} from 'react-native-paper';
import {ChatHeader} from '../../components/Headers';
import {globalStyles} from '../../styles';
import {
  Images,
  SocketEvents,
  Fonts,
  closeBoxImage,
  openBoxImage,
  appleStoreUserId,
} from '../../constants';
import ChatContainer from '../../components/ChatContainer';
import {
  translate,
  translateMessage,
} from '../../redux/reducers/languageReducer';
import {setCommonChatConversation} from '../../redux/reducers/commonReducer';
import {
  getChannelConversations,
  readAllChannelMessages,
  sendChannelMessage,
  editChannelMessage,
  deleteChannelMessage,
  resetChannelConversation,
  setChannelConversation,
  addNewSendMessage,
  getLoginBonusOfChannel,
  checkLoginBonusOfChannel,
  selectLoginJackpotOfChannel,
  assetXPValueOfChannel,
  getLocalFollowingChannels,
  deleteMultipleChannelMessage,
  pinChannel,
  unpinChannel,
} from '../../redux/reducers/channelReducer';
import {ListLoader, UploadLoader, OpenLoader} from '../../components/Loaders';
import {
  ConfirmationModal,
  UploadSelectModal,
  ShowAttahmentModal,
  ShowGalleryModal,
  UpdatePhoneModal,
} from '../../components/Modals';
import {eventService, normalize} from '../../utils';
import Toast from '../../components/Toast';
import S3uploadService from '../../helpers/S3uploadService';
import {
  setChannelChatConversation,
  getChannelChatConversationById,
  updateMessageById,
  deleteMessageById,
  setMessageUnsend,
  updateChannelUnReadCountById,
  updateChannelLastMsgWithOutCount,
  updateChannelsWhenPined,
  updateChannelsWhenUnpined,
} from '../../storage/Service';
import uuid from 'react-native-uuid';
import bonusImage from '../../../assets/images/bonus_bg.png';

const dimensions = Dimensions.get('window');

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
      bonusModal: false,
      bonusXP: 0,
      selectedKey: null,
      jackpotData: null,
      assetXPValue: null,
      loadingJackpot: false,
      showConfirmationModal: false,
      showMessageUnSendConfirmationModal: false,
      showMessageDeleteConfirmationModal: false,
      showPhoneUpdateModal: false,
      isUpdatePhoneModalVisible: false,
      showSelectModal: false,
      uploadedFiles: [],
      showAttachmentModal: false,
      showGalleryModal: false,
      isEdited: false,
      editMessageId: null,
      sentMessageType: 'text',
      sendingMedia: false,
      uploadFile: {uri: null, type: null, name: null},
      uploadProgress: 0,
      isChatLoading: false,
      isMultiSelect: false,
      selectedIds: [],
      openDoc: false,
      isReply: false,
      repliedMessage: null,
      headerRightIconMenu:
        this.props.userData.id === appleStoreUserId
          ? [
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
                title: translate('common.invitation'),
                icon: 'id-card',
                onPress: () => {
                  this.props.navigation.navigate('ChannelInvitation');
                },
              },
              {
                id: 3,
                title: translate('pages.xchat.reportChannel'),
                icon: 'user-slash',
                onPress: () => {
                  Toast.show({
                    title: 'Touku',
                    text: translate('pages.xchat.channelReported'),
                    type: 'positive',
                  });
                },
              },
              {
                id: 4,
                pinUnpinItem: true,
                onPress: () => {
                  this.onPinUnpinChannel();
                },
              },
            ]
          : [
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
                title: translate('common.invitation'),
                icon: 'id-card',
                onPress: () => {
                  this.props.navigation.navigate('ChannelInvitation');
                },
              },
              {
                id: 3,
                pinUnpinItem: true,
                onPress: () => {
                  this.onPinUnpinChannel();
                },
              },
            ],
    };
    this.S3uploadService = new S3uploadService();
    this.props.resetChannelConversation();
    this.isUploading = false;
  }

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
    this.getChannelConversationsInitial();
    if (this.props.currentChannel.id == 355) {
      this.checkHasLoginBonus();
    }
    // this.getLoginBonus();
    this.updateUnReadChannelCount();
  }

  onPinUnpinChannel = () => {
    const {currentChannel, userData} = this.props;
    const data = {};
    if (currentChannel.is_pined) {
      this.props
        .unpinChannel(currentChannel.id, data)
        .then((res) => {
          if (res.status === true) {
            Toast.show({
              title: 'Touku',
              text: translate('pages.xchat.sucessFullyUnPined'),
              type: 'positive',
            });
          }
        })
        .catch((err) => {
          Toast.show({
            title: 'Touku',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
    } else {
      this.props
        .pinChannel(currentChannel.id, data)
        .then((res) => {
          if (res.status === true) {
            Toast.show({
              title: 'Touku',
              text: translate('pages.xchat.sucessFullyPined'),
              type: 'positive',
            });
          }
        })
        .catch((err) => {
          Toast.show({
            title: 'Touku',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
    }
  };

  updateUnReadChannelCount = () => {
    updateChannelUnReadCountById(this.props.currentChannel.id, 0);

    this.props.getLocalFollowingChannels().then((res) => {
      this.props.setCommonChatConversation();
    });
  };

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  async checkEventTypes(message) {
    const {currentChannel, userData} = this.props;

    //MESSAGE_IN_FOLLOWING_CHANNEL
    // if (
    //   message.text.data.type == SocketEvents.MESSAGE_IN_FOLLOWING_CHANNEL &&
    //   message.text.data.message_details.channel == currentChannel.id
    // ) {
    //   if (message.text.data.message_details.from_user.id == userData.id) {
    //     // this.getChannelConversations();
    //     setChannelChatConversation([message.text.data.message_details]);
    //     this.getLocalChannelConversations();
    //     this.props.readAllChannelMessages(this.props.currentChannel.id);
    //   } else if (
    //     message.text.data.message_details.to_user != null &&
    //     message.text.data.message_details.to_user.id == userData.id
    //   ) {
    //     // this.getChannelConversations();
    //     setChannelChatConversation([message.text.data.message_details]);
    //     this.getLocalChannelConversations();
    //     this.props.readAllChannelMessages(this.props.currentChannel.id);
    //   }
    // }

    //DELETE_MESSAGE_IN_FOLLOWING_CHANNEL
    // if (
    //   message.text.data.type ==
    //     SocketEvents.DELETE_MESSAGE_IN_FOLLOWING_CHANNEL &&
    //   message.text.data.message_details.channel == currentChannel.id
    // ) {
    //   if (message.text.data.message_details.from_user.id == userData.id) {
    //     deleteMessageById(message.text.data.message_details.id);
    //     let chat = getChannelChatConversationById(
    //       this.props.currentChannel.id
    //     );
    //     console.log('chat',chat.length);
    //     this.props.setChannelConversation(chat);
    //   } else if (
    //     message.text.data.message_details.to_user != null &&
    //     message.text.data.message_details.to_user.id == userData.id
    //   ) {
    //     deleteMessageById(message.text.data.message_details.id);
    //     let chat = getChannelChatConversationById(
    //       this.props.currentChannel.id
    //     );
    //     console.log('chat',chat.length);
    //     this.props.setChannelConversation(chat);
    //   }
    // }

    //MULTIPLE_MESSAGE_IN_FOLLOWING_CHANNEL
    // if (
    //   message.text.data.type ==
    //   SocketEvents.MULTIPLE_MESSAGE_IN_FOLLOWING_CHANNEL
    // ) {
    //   message.text.data.message_details.map((item) => {
    //     if (item.channel === currentChannel.id) {
    //       // this.getChannelConversations();
    //     }
    //   });
    // }

    // // MESSAGE_IN_THREAD
    // if (
    //   message.text.data.type ==
    //     SocketEvents.MESSAGE_IN_THREAD &&
    //   message.text.data.message_details.channel == currentChannel.id
    // ) {
    //   if (message.text.data.message_details.from_user.id == userData.id) {
    //     this.getChannelConversations();
    //   } else if (
    //     message.text.data.message_details.to_user != null &&
    //     message.text.data.message_details.to_user.id == userData.id
    //   ) {
    //     this.getChannelConversations();
    //   }
    // }

    // MESSAGE_EDITED_IN_FOLLOWING_CHANNEL
    // if (
    //   message.text.data.type ==
    //     SocketEvents.MESSAGE_EDITED_IN_FOLLOWING_CHANNEL &&
    //   message.text.data.message_details.channel == currentChannel.id
    // ) {
    //   if (message.text.data.message_details.from_user == userData.id) {
    //     let editMessageId = message.text.data.message_details.id;
    //     let msgText = message.text.data.message_details.message_body;
    //     let msgType = message.text.data.message_details.msg_type;
    //     console.log(editMessageId,msgText,msgType);
    //     updateMessageById(editMessageId, msgText, msgType);
    //     // this.getChannelConversations();
    //     this.getLocalChannelConversations();
    //   } else if (
    //     message.text.data.message_details.to_user != null &&
    //     message.text.data.message_details.to_user.id == userData.id
    //   ) {
    //     // this.getChannelConversations();
    //     let editMessageId = message.text.data.message_details.id;
    //     let msgText = message.text.data.message_details.message_body;
    //     let msgType = message.text.data.message_details.msg_type;
    //     console.log(editMessageId,msgText,msgType);
    //     updateMessageById(editMessageId, msgText, msgType);
    //     // this.getChannelConversations();
    //     this.getLocalChannelConversations();
    //   }
    // }

    // MESSAGE_EDITED_IN_THREAD
    // if (
    //   message.text.data.type ==
    //     SocketEvents.MESSAGE_EDITED_IN_THREAD &&
    //   message.text.data.message_details.channel == currentChannel.id
    // ) {
    //   if (message.text.data.message_details.from_user.id == userData.id) {
    //     // this.getChannelConversations();
    //   } else if (
    //     message.text.data.message_details.to_user != null &&
    //     message.text.data.message_details.to_user.id == userData.id
    //   ) {
    //     // this.getChannelConversations();
    //   }
    // }

    // DELETE_MESSAGE_IN_THREAD
    // if (
    //   message.text.data.type ==
    //     SocketEvents.DELETE_MESSAGE_IN_THREAD &&
    //   message.text.data.message_details.channel == currentChannel.id
    // ) {
    //   if (message.text.data.message_details.from_user.id == userData.id) {
    //     // this.getChannelConversations();
    //   } else if (
    //     message.text.data.message_details.to_user != null &&
    //     message.text.data.message_details.to_user.id == userData.id
    //   ) {
    //     // this.getChannelConversations();
    //   }
    // }

    //UNSENT_MESSAGE_IN_FOLLOWING_CHANNEL
    // if (
    //   message.text.data.type ==
    //     SocketEvents.UNSENT_MESSAGE_IN_FOLLOWING_CHANNEL &&
    //   message.text.data.message_details.channel == currentChannel.id
    // ) {
    //   if (message.text.data.message_details.from_user == userData.id) {
    //     setMessageUnsend(message.text.data.message_details.id);
    //     // this.getChannelConversations();
    //     this.getLocalChannelConversations();
    //   } else if (
    //     message.text.data.message_details.to_user != null &&
    //     message.text.data.message_details.to_user.id == userData.id
    //   ) {
    //     // this.getChannelConversations();
    //     setMessageUnsend(message.text.data.message_details.id);
    //     this.getLocalChannelConversations();
    //   }
    // }

    //UNSENT_MESSAGE_IN_THREAD
    // if (
    //   message.text.data.type ==
    //     SocketEvents.UNSENT_MESSAGE_IN_THREAD &&
    //   message.text.data.message_details.channel == currentChannel.id
    // ) {
    //   if (message.text.data.message_details.from_user.id == userData.id) {
    //     // this.getChannelConversations();
    //   } else if (
    //     message.text.data.message_details.to_user != null &&
    //     message.text.data.message_details.to_user.id == userData.id
    //   ) {
    //     // this.getChannelConversations();
    //   }
    // }

    //MULTIPLE_MESSAGE_IN_THREAD
    // if (
    //   message.text.data.type ==
    //     SocketEvents.MULTIPLE_MESSAGE_IN_THREAD &&
    //   message.text.data.message_details.channel == currentChannel.id
    // ) {
    //   if (message.text.data.message_details.from_user.id == userData.id) {
    //     // this.getChannelConversations();
    //   } else if (
    //     message.text.data.message_details.to_user != null &&
    //     message.text.data.message_details.to_user.id == userData.id
    //   ) {
    //     // this.getChannelConversations();
    //   }
    // }

    //ADD_CHANNEL_ADMIN
    // if (
    //   message.text.data.type ==
    //     SocketEvents.ADD_CHANNEL_ADMIN &&
    //   message.text.data.message_details.channel == currentChannel.id
    // ) {
    //   if (message.text.data.message_details.from_user.id == userData.id) {
    //     // this.getChannelConversations();
    //   } else if (
    //     message.text.data.message_details.to_user != null &&
    //     message.text.data.message_details.to_user.id == userData.id
    //   ) {
    //     // this.getChannelConversations();
    //   }
    // }

    //READ_ALL_MESSAGE_CHANNEL_SUBCHAT
    // if (
    //   message.text.data.type ==
    //     SocketEvents.READ_ALL_MESSAGE_CHANNEL_SUBCHAT &&
    //   message.text.data.message_details.channel == currentChannel.id
    // ) {
    //   if (message.text.data.message_details.from_user.id == userData.id) {
    //     // this.getChannelConversations();
    //   } else if (
    //     message.text.data.message_details.to_user != null &&
    //     message.text.data.message_details.to_user.id == userData.id
    //   ) {
    //     // this.getChannelConversations();
    //   }
    // }

    //PINED_CHANNEL
    // if (
    //   message.text.data.type ==
    //     SocketEvents.PINED_CHANNEL &&
    //   message.text.data.message_details.channel == currentChannel.id
    // ) {
    //   if (message.text.data.message_details.from_user.id == userData.id) {
    //     // this.getChannelConversations();
    //   } else if (
    //     message.text.data.message_details.to_user != null &&
    //     message.text.data.message_details.to_user.id == userData.id
    //   ) {
    //     // this.getChannelConversations();
    //   }
    // }

    //UNPINED_CHANNEL
    // if (
    //   message.text.data.type ==
    //     SocketEvents.UNPINED_CHANNEL &&
    //   message.text.data.message_details.channel == currentChannel.id
    // ) {
    //   if (message.text.data.message_details.from_user.id == userData.id) {
    //     // this.getChannelConversations();
    //   } else if (
    //     message.text.data.message_details.to_user != null &&
    //     message.text.data.message_details.to_user.id == userData.id
    //   ) {
    //     // this.getChannelConversations();
    //   }
    // }
  }

  onMessageSend = async () => {
    const {newMessageText, editMessageId, isReply} = this.state;
    const {userData, currentChannel} = this.props;

    let msgText = newMessageText;
    let repliedMessage = this.state.repliedMessage;
    let isEdited = this.state.isEdited;
    let sentMessageType = this.state.sentMessageType;
    let uploadFile = this.state.uploadFile;
    if (!newMessageText && !uploadFile.uri) {
      return;
    }

    this.setState({
      newMessageText: '',
      isReply: false,
      repliedMessage: {},
      isEdited: false,
      sentMessageType: 'text',
      // sendingMedia: false,
      uploadFile: {uri: null, type: null, name: null},
    });
    if (sentMessageType === 'image') {
      let file = uploadFile;
      let files = [file];
      const uploadedImages = await this.S3uploadService.uploadImagesOnS3Bucket(
        files,
        (e) => {
          console.log('progress_bar_percentage', e);
          this.setState({uploadProgress: e.percent});
        },
      );
      msgText = uploadedImages.image[0].image;
    }

    if (sentMessageType === 'audio') {
      let file = uploadFile.uri;
      let files = [file];
      const uploadedAudio = await this.S3uploadService.uploadAudioOnS3Bucket(
        files,
        uploadFile.type,
        (e) => {
          console.log('progress_bar_percentage', e);
          this.setState({uploadProgress: e.percent});
        },
      );
      msgText = uploadedAudio;
    }

    if (sentMessageType === 'doc') {
      let file = uploadFile.uri;
      let files = [file];
      let fileType = uploadFile.type;
      const uploadedApplication = await this.S3uploadService.uploadApplicationOnS3Bucket(
        files,
        uploadFile.type,
        (e) => {
          console.log('progress_bar_percentage', e);
          this.setState({uploadProgress: e.percent});
        },
      );
      msgText = uploadedApplication;
    }

    if (sentMessageType === 'video') {
      let file = uploadFile.uri;
      let files = [file];
      const uploadedVideo = await this.S3uploadService.uploadVideoOnS3Bucket(
        files,
        uploadFile.type,
        (e) => {
          console.log('progress_bar_percentage', e);
          this.setState({uploadProgress: e.percent});
        },
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
      reply_to: isReply
        ? {
            display_name: repliedMessage.from_user.display_name,
            id: repliedMessage.id,
            message: repliedMessage.message_body,
            msg_type: repliedMessage.msg_type,
            name: repliedMessage.to_user.username,
            sender_id: repliedMessage.sender_id,
          }
        : null,
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
      schedule_post: null,
      subchat: null,
      greeting: null,
      read_by_in_replies: [],
      read_by: [],
      deleted_for: [],
    };

    if (isEdited) {
      updateMessageById(editMessageId, msgText, sentMessageType);
      this.sendEditMessage(msgText, editMessageId);
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
    // this.props.setChannelConversation([
    //   sendmsgdata,
    //   ...this.props.chatConversation,
    // ]);
    // this.state.conversations.unshift(sendmsgdata);
    if (!isReply) {
      this.props.sendChannelMessage(messageData);
    }

    let messageData123 = {
      channel: this.props.currentChannel.id,
      local_id: uuid.v4(),
      message_body: msgText,
      msg_type: sentMessageType,
      reply_to: repliedMessage.id,
    };

    if (isReply) {
      this.props.sendChannelMessage(messageData123);
    }

    if (uploadFile.uri) {
      this.setState(
        {
          showGalleryModal: false,
          showAttachmentModal: false,
        },
        () => {
          this.setState({
            uploadedFiles: [],
            sendingMedia: false,
          });
        },
      );
    }
    // this.setState({
    //   newMessageText: '',
    //   repliedMessage: null,
    //   isEdited: false,
    //   sentMessageType: 'text',
    //   sendingMedia: false,
    //   uploadFile: {uri: null, type: null, name: null},
    // });
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

  cancelReply = () => {
    this.setState({
      isReply: false,
      repliedMessage: null,
    });
  };

  sendEditMessage = (newMessageText, editMessageId) => {
    // const {newMessageText, editMessageId} = this.state;

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
      sendingMedia: false,
    });
    // this.setState({
    //   newMessageText: '',
    //   repliedMessage: null,
    //   isEdited: false,
    //   sendingMedia: false,
    // });
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

  checkHasLoginBonus = () => {
    this.props
      .checkLoginBonusOfChannel()
      .then((res) => {
        console.log('checkLoginBonusOfChannel', res);
        if (res && !res.status) {
          this.getLoginBonus();
        }
      })
      .catch((err) => {
        console.log('checkLoginBonusOfChannel_error', err);
      });
  };

  getLoginBonus = () => {
    this.props
      .getLoginBonusOfChannel()
      .then((res) => {
        console.log('getLoginBonusOfChannel', res);
        if (res) {
          this.setState({bonusXP: res.amount, bonusModal: true});
        }
      })
      .catch((err) => {
        console.log('getLoginBonusOfChannel_error', err);
      });
  };

  selectedLoginBonus = (key) => {
    if (!this.props.userData.phone) {
      this.setState({showPhoneUpdateModal: true});
      return;
    }

    this.setState({loadingJackpot: true});

    this.props
      .selectLoginJackpotOfChannel({picked_option: key})
      .then((res) => {
        if (res) {
          console.log('jackpotData', res);
          this.setState({jackpotData: res.data});
          this.getAssetXpValue();
        }
        this.setState({loadingJackpot: false});
      })
      .catch((err) => {
        console.log('err', err);
        this.setState({loadingJackpot: false});
      });
  };

  getAssetXpValue = () => {
    this.props
      .assetXPValueOfChannel()
      .then((res) => {
        if (res) {
          console.log('asset_xp', res);
          if (res && res.data) this.setState({assetXPValue: res.data});
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  checkImageWithAmount = (amount) => {
    if (amount === 0) {
      return openBoxImage.open_box;
    } else if (amount >= 10 && amount <= 100) {
      return openBoxImage.less_gold;
    } else if (amount >= 100 && amount <= 1000) {
      return openBoxImage.mid_gold;
    } else if (amount >= 1000) {
      return openBoxImage.full_gold;
    }
  };

  getAmountValue = (jackpotData) => {
    var array = [];
    if (jackpotData.picked_option == 1) {
      array = [
        parseInt(jackpotData.picked_amount),
        parseInt(jackpotData.missed1_amount),
        parseInt(jackpotData.missed2_amount),
      ];
    } else if (jackpotData.picked_option == 2) {
      array = [
        parseInt(jackpotData.missed1_amount),
        parseInt(jackpotData.picked_amount),
        parseInt(jackpotData.missed2_amount),
      ];
    } else if (jackpotData.picked_option == 3) {
      array = [
        parseInt(jackpotData.missed1_amount),
        parseInt(jackpotData.missed2_amount),
        parseInt(jackpotData.picked_amount),
      ];
    }
    return array;
  };

  getLocalChannelConversations = () => {
    let chat = getChannelChatConversationById(this.props.currentChannel.id);
    if (chat) {
      let conversations = [];
      conversations = chat.toJSON();
      this.props.setChannelConversation(conversations);
    }
  };

  getChannelConversations = async () => {
    await this.props
      .getChannelConversations(this.props.currentChannel.id)
      .then((res) => {
        if (res.status === true && res.conversation.length > 0) {
          this.setState({conversations: res.conversation});
          this.props.readAllChannelMessages(this.props.currentChannel.id);
          let chat = getChannelChatConversationById(
            this.props.currentChannel.id,
          );
          let conversations = [];

          conversations = chat.toJSON();

          this.props.setChannelConversation(conversations);
        }
      });
  };

  getChannelConversationsInitial = async () => {
    this.setState({isChatLoading: true});
    let chat = getChannelChatConversationById(this.props.currentChannel.id);
    if (chat) {
      let conversations = [];
      conversations = chat.toJSON();
      this.props.setChannelConversation(conversations);
      // this.setState({isChatLoading: false});
    }
    await this.props
      .getChannelConversations(this.props.currentChannel.id)
      .then((res) => {
        if (res.status === true && res.conversation.length > 0) {
          this.setState({conversations: res.conversation});
          this.props.readAllChannelMessages(this.props.currentChannel.id);
          let chat = getChannelChatConversationById(
            this.props.currentChannel.id,
          );
          let conversations = [];
          conversations = chat.toJSON();
          this.props.setChannelConversation(conversations);
        }
        this.setState({isChatLoading: false});
      });
  };

  handleMessage(message) {
    this.setState({newMessageText: message});
  }

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
  onGalleryPress = async () => {
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: 30,
      mediaType: 'any',
      includeBase64: true,
    }).then(async (images) => {
      this.setState({
        uploadedFiles: [...this.state.uploadedFiles, ...images],
      });
      // this.toggleSelectModal(false);
      this.toggleGalleryModal(true);
    });
  };

  onUrlUpload = (url) => {
    this.setState({uploadedFiles: [...this.state.uploadedFiles, url]});
  };

  onAttachmentPress = async () => {
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
      this.setState({
        uploadedFiles: [...this.state.uploadedFiles, ...results],
      });
      this.toggleAttachmentModal(true);
      // for (const res of results) {
      //   let fileType = res.type.substr(0, res.type.indexOf('/'));
      //   console.log(
      //     res.uri,
      //     res.type, // mime type
      //     res.name,
      //     res.size,
      //     res.type.substr(0, res.type.indexOf('/')),
      //   );
      //   let source = {uri: res.uri, type: res.type, name: res.name};
      //   if (fileType === 'audio') {
      //     this.setState({
      //       uploadFile: source,
      //       sentMessageType: 'audio',
      //       sendingMedia: true,
      //     });
      //   } else if (fileType === 'application') {
      //     this.setState({
      //       uploadFile: source,
      //       sentMessageType: 'doc',
      //       sendingMedia: true,
      //     });
      //   }
      //   this.onMessageSend();
      // }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  toggleGalleryModal = (status) => {
    this.setState({
      showGalleryModal: status,
    });
  };

  uploadAndSend = async () => {
    if (this.isUploading) {
      return;
    }
    this.isUploading = true;
    // this.toggleGalleryModal(false);

    for (const file of this.state.uploadedFiles) {
      let fileType = file.mime;
      if (fileType.includes('image')) {
        let source = {
          uri:
            file.mime === 'image/gif'
              ? 'data:image/gif;base64,' + file.data
              : 'data:image/jpeg;base64,' + file.data,
          type: file.mime,
          name: null,
        };
        await this.setState(
          {
            uploadFile: source,
            sentMessageType: 'image',
            sendingMedia: true,
          },
          async () => {
            await this.onMessageSend();
          },
        );
      } else {
        let source = {
          uri: file.path,
          type: file.mime,
          name: null,
        };
        await this.setState(
          {
            uploadFile: source,
            sentMessageType: 'video',
            sendingMedia: true,
          },
          () => {
            this.onMessageSend();
          },
        );
      }
    }
    // this.setState({uploadedFiles: []});
    this.isUploading = false;
  };

  toggleAttachmentModal = (status) => {
    this.setState({
      showAttachmentModal: status,
    });
  };

  uploadAndSendAttachment = async () => {
    if (this.isUploading) {
      return;
    }
    this.isUploading = true;
    // this.toggleAttachmentModal(false);
    for (const res of this.state.uploadedFiles) {
      let fileType = res.type.substr(0, res.type.indexOf('/'));
      let source = {uri: res.uri, type: res.type, name: res.name};
      if (fileType === 'audio') {
        await this.setState(
          {
            uploadFile: source,
            sentMessageType: 'audio',
            sendingMedia: true,
          },
          () => {
            this.onMessageSend();
          },
        );
      } else if (fileType === 'application') {
        await this.setState(
          {
            uploadFile: source,
            sentMessageType: 'doc',
            sendingMedia: true,
          },
          () => {
            this.onMessageSend();
          },
        );
      }
    }
    // this.setState({uploadedFiles: []});
    this.isUploading = false;
  };

  removeUploadData = (index) => {
    let newArray = this.state.uploadedFiles.filter((item, itemIndex) => {
      if (index !== itemIndex) {
        return item;
      }
    });
    this.setState({
      uploadedFiles: newArray,
    });
  };

  onReply = (messageId) => {
    // const { conversations } = this.state;
    const {chatConversation} = this.props;

    const repliedMessage = chatConversation.find(
      (item) => item.id === messageId,
    );

    console.log('repliedMessage', repliedMessage);
    this.setState({
      isReply: true,
      repliedMessage: repliedMessage,
    });
  };

  renderConversations() {
    const {channelLoading, chatConversation} = this.props;
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
      showPhoneUpdateModal,
      uploadFile,
      sendingMedia,
      isChatLoading,
      isMultiSelect,
      openDoc,
    } = this.state;
    if (!this.props.chatConversation) {
      return null;
    }

    if (channelLoading && this.props.chatConversation.length <= 0) {
      return <ListLoader />;
    } else {
      return (
        <View style={{flex: 1}}>
          <ChatContainer
            handleMessage={(message) => this.handleMessage(message)}
            onMessageReply={(id) => this.onReply(id)}
            onMessageSend={this.onMessageSend}
            cancelReply={this.cancelReply.bind(this)}
            newMessageText={newMessageText}
            sendEnable={newMessageText.lenght ? true : false}
            messages={chatConversation}
            orientation={orientation}
            repliedMessage={this.state.repliedMessage}
            isReply={this.state.isReply}
            onDelete={(id) => {
              this.setState({
                isMultiSelect: true,
                selectedIds: [...this.state.selectedIds, id + ''],
              });
              // this.onDeletePressed(id)
            }}
            onUnSendMsg={(id) => this.onUnSendPressed(id)}
            onMessageTranslate={(msg) => this.onMessageTranslate(msg)}
            onMessageTranslateClose={this.onMessageTranslateClose}
            translatedMessage={translatedMessage}
            translatedMessageId={translatedMessageId}
            isChannel={true}
            onEditMessage={(msg) => this.onEdit(msg)}
            onDownloadMessage={(msg) => this.onDownload(msg)}
            onCameraPress={() => this.onCameraPress()}
            onGalleryPress={() => this.toggleGalleryModal(true)}
            onAttachmentPress={() => this.onAttachmentPress()}
            sendingImage={uploadFile}
            isMultiSelect={isMultiSelect}
            onSelect={this.onSelectChatConversation}
            selectedIds={this.state.selectedIds}
            onSelectedCancel={() => {
              this.setState({isMultiSelect: false, selectedIds: []});
            }}
            onSelectedDelete={this.onDeleteMultipleMessagePressed}
            showOpenLoader={(isLoading) => this.setState({openDoc: isLoading})}
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
            onConfirm={this.onConfirmMultipleMessageDelete.bind(this)}
            orientation={orientation}
            title={translate('pages.xchat.toastr.areYouSure')}
            message={translate('pages.xchat.youWantToDeleteThisMessage')}
          />
          {/* <UploadSelectModal
            visible={this.state.showSelectModal}
            toggleSelectModal={this.toggleSelectModal}
            onSelect={(mediaType) => this.selectUploadOption(mediaType)}
          /> */}

          <ShowGalleryModal
            visible={this.state.showGalleryModal}
            toggleGalleryModal={this.toggleGalleryModal}
            data={this.state.uploadedFiles}
            onCancel={() => {
              this.setState({uploadedFiles: []});
              this.toggleGalleryModal(false);
            }}
            onUpload={() => this.uploadAndSend()}
            isLoading={sendingMedia}
            removeUploadData={(index) => this.removeUploadData(index)}
            onGalleryPress={() => this.onGalleryPress()}
            onUrlDone={this.onUrlUpload}
          />

          <ShowAttahmentModal
            visible={this.state.showAttachmentModal}
            toggleAttachmentModal={this.toggleAttachmentModal}
            data={this.state.uploadedFiles}
            onCancel={() => {
              this.setState({uploadedFiles: []});
              this.toggleAttachmentModal(false);
            }}
            onUpload={() => this.uploadAndSendAttachment()}
            isLoading={sendingMedia}
            removeUploadData={(index) => this.removeUploadData(index)}
            onAttachmentPress={() => this.onAttachmentPress()}
          />
          {/* {sendingMedia && <UploadLoader />} */}
          {openDoc && <OpenLoader />}
        </View>
      );
    }
  }

  // toggleSelectModal = (status) => {
  //   this.setState({
  //     showSelectModal: status,
  //   });
  // };

  // selectUploadOption = (mediaType) => {
  //   // this.toggleSelectModal();
  //   this.onGalleryPress(mediaType);
  // };

  // To delete message
  toggleConfirmationModal = () => {
    this.setState((prevState) => ({
      showConfirmationModal: !prevState.showConfirmationModal,
    }));
  };

  onSelectChatConversation = (id) => {
    let array = this.state.selectedIds;
    if (this.state.selectedIds.includes(id + '')) {
      let index = array.indexOf(id + '');
      array.splice(index, 1);
    } else {
      array.push(id + '');
    }
    this.setState({selectedIds: array});
  };

  onDeleteMultipleMessagePressed = () => {
    this.setState({
      showMessageDeleteConfirmationModal: true,
    });
  };

  onCancel = () => {
    this.setState({
      showConfirmationModal: false,
      showMessageUnSendConfirmationModal: false,
      showMessageDeleteConfirmationModal: false,
      showPhoneUpdateModal: false,
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
    this.setState({showMessageDeleteConfirmationModal: false});
    if (this.state.selectedMessageId != null) {
      let payload = {
        deleted_for: [this.props.userData.id],
      };
      deleteMessageById(this.state.selectedMessageId);
      this.getLocalChannelConversations();
      this.props
        .deleteChannelMessage(this.state.selectedMessageId, payload)
        .then((res) => {
          this.getChannelConversations();
        });
    }
  };

  onConfirmMultipleMessageDelete = () => {
    this.setState({showMessageDeleteConfirmationModal: false});
    if (this.state.selectedIds.length > 0) {
      let payload = {message_ids: this.state.selectedIds};

      this.state.selectedIds.map((item) => {
        deleteMessageById(item);

        if (
          this.props.currentChannel.last_msg &&
          this.props.currentChannel.last_msg.id == item
        ) {
          let chat = getChannelChatConversationById(
            this.props.currentChannel.id,
          );

          let array = chat.toJSON();

          if (array && array.length > 0) {
            updateChannelLastMsgWithOutCount(
              this.props.currentChannel.id,
              array[0],
            );
            this.props.getLocalFollowingChannels().then(() => {
              this.props.setCommonChatConversation();
            });
          }
        }
      });
      this.getLocalChannelConversations();
      this.setState({isMultiSelect: false, selectedIds: []});

      this.props.deleteMultipleChannelMessage(payload).then((res) => {
        //console.log(res);
        if (res && res.status) {
        } else {
          this.getChannelConversations();
        }
      });
    }
  };

  onConfirmUnSend = () => {
    this.setState({showMessageUnSendConfirmationModal: false});
    if (this.state.selectedMessageId != null) {
      let payload = {message_body: '', is_unsent: true};
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
    const {currentChannel} = this.props;
    const {
      showPhoneUpdateModal,
      orientation,
      isUpdatePhoneModalVisible,
    } = this.state;
    return (
      <View
        // source={Images.image_home_bg}
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
          isPined={currentChannel.is_pined}
          chatType={
            currentChannel.is_pined
              ? translate('pages.xchat.unPinThisChannel')
              : translate('pages.xchat.pinThisChannel')
          }
          type={'channel'}
          currentChannel={currentChannel}
        />
        {this.props.chatConversation && this.renderConversations()}

        <Modal
          visible={this.state.bonusModal}
          transparent
          onRequestClose={() => this.setState({bonusModal: false})}>
          <View style={styles.bonusModalContainer}>
            <SafeAreaView />
            <ImageBackground
              source={bonusImage}
              resizeMode={'cover'}
              style={styles.bonusBgContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.bonusTextHeading}>
                  {this.state.jackpotData
                    ? translate('pages.xchat.seeYouTomorrow')
                    : translate('pages.xchat.loginBonusText')}
                </Text>
                <Text style={styles.bonusTitleText}>
                  {translate('pages.xchat.jackPot')}{' '}
                  <Text style={{fontSize: normalize(25), fontWeight: 'bold'}}>
                    {this.state.bonusXP}
                  </Text>{' '}
                  <Text
                    style={{
                      fontSize: normalize(15),
                      fontFamily: Fonts.regular,
                      fontWeight: '300',
                    }}>
                    {'XP'}
                  </Text>
                </Text>
                {this.state.assetXPValue ? (
                  <Text style={styles.bonusTitleText}>
                    {translate('pages.xchat.youOwn')}{' '}
                    <Text style={{fontSize: normalize(25), fontWeight: 'bold'}}>
                      {this.state.assetXPValue.XP + ''}
                    </Text>{' '}
                    <Text
                      style={{
                        fontSize: normalize(15),
                        fontFamily: Fonts.regular,
                        fontWeight: '300',
                      }}>
                      {'XP'}
                    </Text>
                  </Text>
                ) : null}
                {this.state.loadingJackpot ? (
                  <ActivityIndicator
                    style={{marginTop: 10}}
                    size={'large'}
                    color={'#fff'}
                  />
                ) : (
                  <View style={styles.bonusImageContainer}>
                    <TouchableOpacity
                      disabled={this.state.jackpotData}
                      onPress={() => {
                        this.selectedLoginBonus(1);
                      }}
                      style={{
                        marginHorizontal: 10,
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <Image
                          style={
                            this.state.jackpotData &&
                            this.state.jackpotData.picked_option == 1
                              ? styles.bonusImageZoom
                              : styles.bonusImage
                          }
                          source={{
                            uri: this.state.jackpotData
                              ? this.checkImageWithAmount(
                                  this.getAmountValue(
                                    this.state.jackpotData,
                                  )[0],
                                )
                              : closeBoxImage[0].value,
                          }}
                          resizeMode={'contain'}
                        />
                      </View>
                      {this.state.jackpotData ? (
                        <View
                          style={{
                            flex: 1,
                            borderBottomWidth: 1,
                            borderBottomColor: '#fff',
                          }}>
                          <Text
                            style={{
                              textAlign: 'right',
                              color:
                                this.state.jackpotData &&
                                this.state.jackpotData.picked_option == 1
                                  ? '#dbf875'
                                  : '#fff',
                              fontSize: normalize(24),
                              fontFamily: Fonts.beba_regular,
                            }}>
                            {this.getAmountValue(this.state.jackpotData)[0] +
                              ''}{' '}
                            XP
                          </Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={this.state.jackpotData}
                      onPress={() => {
                        this.selectedLoginBonus(2);
                      }}
                      style={{
                        marginHorizontal: 10,
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <Image
                          style={
                            this.state.jackpotData &&
                            this.state.jackpotData.picked_option == 2
                              ? styles.bonusImageZoom
                              : styles.bonusImage
                          }
                          source={{
                            uri: this.state.jackpotData
                              ? this.checkImageWithAmount(
                                  this.getAmountValue(
                                    this.state.jackpotData,
                                  )[1],
                                )
                              : closeBoxImage[1].value,
                          }}
                          resizeMode={'contain'}
                        />
                      </View>
                      {this.state.jackpotData ? (
                        <View
                          style={{
                            flex: 1,
                            borderBottomWidth: 1,
                            borderBottomColor: '#fff',
                          }}>
                          <Text
                            style={{
                              textAlign: 'right',
                              color:
                                this.state.jackpotData &&
                                this.state.jackpotData.picked_option == 2
                                  ? '#dbf875'
                                  : '#fff',
                              fontSize: normalize(24),
                              fontFamily: Fonts.beba_regular,
                            }}>
                            {this.getAmountValue(this.state.jackpotData)[1] +
                              ''}{' '}
                            XP
                          </Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={this.state.jackpotData}
                      onPress={() => {
                        this.selectedLoginBonus(3);
                      }}
                      style={{
                        marginHorizontal: 10,
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <Image
                          style={
                            this.state.jackpotData &&
                            this.state.jackpotData.picked_option == 3
                              ? styles.bonusImageZoom
                              : styles.bonusImage
                          }
                          source={{
                            uri: this.state.jackpotData
                              ? this.checkImageWithAmount(
                                  this.getAmountValue(
                                    this.state.jackpotData,
                                  )[2],
                                )
                              : closeBoxImage[2].value,
                          }}
                          resizeMode={'contain'}
                        />
                      </View>
                      {this.state.jackpotData ? (
                        <View
                          style={{
                            flex: 1,
                            borderBottomWidth: 1,
                            borderBottomColor: '#fff',
                          }}>
                          <Text
                            style={{
                              textAlign: 'right',
                              color:
                                this.state.jackpotData &&
                                this.state.jackpotData.picked_option == 3
                                  ? '#dbf875'
                                  : '#fff',
                              fontSize: normalize(24),
                              fontFamily: Fonts.beba_regular,
                            }}>
                            {this.getAmountValue(this.state.jackpotData)[2] +
                              ''}{' '}
                            XP
                          </Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: normalize(14),
                  paddingHorizontal: normalize(5),
                  fontWeight: '300',
                  color: '#fff',
                }}>
                {translate('pages.xchat.gamePlatformText')}
              </Text>
              <TouchableOpacity
                style={{margin: normalize(20)}}
                onPress={() => {
                  this.setState({bonusModal: false});
                }}>
                <Avatar.Icon
                  size={50}
                  icon="close"
                  color={'#fff'}
                  style={{backgroundColor: '#e2b2ac'}}
                />
              </TouchableOpacity>
            </ImageBackground>
            <ConfirmationModal
              visible={showPhoneUpdateModal}
              onCancel={this.onCancel.bind(this)}
              onConfirm={() => {
                this.setState({showPhoneUpdateModal: false}, () => {
                  setTimeout(() => {
                    this.setState({isUpdatePhoneModalVisible: true});
                  }, 500);
                });
              }}
              orientation={orientation}
              confirmText={translate('swal.ok')}
              title={translate('pages.xchat.touku')}
              message={translate('swal.NeedToAddPhoneNumber')}
            />
            <UpdatePhoneModal
              visible={isUpdatePhoneModalVisible}
              onRequestClose={() =>
                this.setState({isUpdatePhoneModalVisible: false})
              }
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bonusModalContainer: {
    flex: 1,
    backgroundColor: '#00000080',
    // paddingTop: 40,
  },
  bonusBgContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 30,
    alignItems: 'center',
    overflow: 'hidden',
  },
  bonusTextHeading: {
    marginTop: normalize(20),
    // marginBottom:PixelRatio.getPixelSizeForLayoutSize(10),
    textAlign: 'center',
    fontSize: normalize(25),
    fontWeight: '300',
    color: '#ffd300',
    fontFamily: Fonts.regular,
  },
  bonusTitleText: {
    textAlign: 'center',
    fontSize: normalize(20),
    fontWeight: '300',
    color: '#fff',
    fontFamily: Fonts.beba_regular,
  },
  bonusImageContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginBottom: 20,
    marginTop: 20,
  },
  bonusImage: {
    width: Math.round(dimensions.width / 4),
    height: Math.round(dimensions.width / 4),
  },
  bonusImageZoom: {
    width: Math.round(dimensions.width / 3),
    height: Math.round(dimensions.width / 3),
  },
});

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
  deleteMultipleChannelMessage,
  setChannelConversation,
  resetChannelConversation,
  addNewSendMessage,
  getLoginBonusOfChannel,
  checkLoginBonusOfChannel,
  selectLoginJackpotOfChannel,
  assetXPValueOfChannel,
  setCommonChatConversation,
  getLocalFollowingChannels,
  pinChannel,
  unpinChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelChats);
