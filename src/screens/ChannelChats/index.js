import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, {Component} from 'react';
import {PermissionsAndroid, Platform, View} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Orientation from 'react-native-orientation';
import uuid from 'react-native-uuid';
import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import ChatContainer from '../../components/ChatContainer';
import {ChatHeader} from '../../components/Headers';
import {ListLoader, OpenLoader} from '../../components/Loaders';
import {
  ConfirmationModal,
  DeleteOptionModal,
  ShowAttahmentModal,
  ShowGalleryModal,
} from '../../components/Modals';
import BonusModal from '../../components/Modals/BonusModal';
import Toast from '../../components/Toast';
import {appleStoreUserId, openBoxImage} from '../../constants';
import S3uploadService from '../../helpers/S3uploadService';
import {
  addNewSendMessage,
  assetXPValueOfChannel,
  checkLoginBonusOfChannel,
  deleteChannelMessage,
  deleteMultipleChannelMessage,
  editChannelMessage,
  getChannelConversations,
  getLocalFollowingChannels,
  getLoginBonusOfChannel,
  pinChannel,
  readAllChannelMessages,
  resetChannelConversation,
  selectLoginJackpotOfChannel,
  sendChannelMessage,
  setChannelConversation,
  unfollowChannel,
  unpinChannel,
} from '../../redux/reducers/channelReducer';
import {setCommonChatConversation} from '../../redux/reducers/commonReducer';
import {
  translate,
  translateMessage,
} from '../../redux/reducers/languageReducer';
import {
  deleteMessageById,
  getChannelChatConversationById,
  setMessageUnsend,
  updateChannelLastMsgWithOutCount,
  updateChannelTranslatedMessage,
  updateChannelUnReadCountById,
  updateMessageById,
} from '../../storage/Service';
import {globalStyles} from '../../styles';
import {realmToPlainObject} from '../../utils';
import styles from './styles';

class ChannelChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      newMessageText: '',
      conversations: [],
      isLoadMore: true,
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
      showMoreMessageDeleteConfirmationModal: false,
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
      isDeleteMeLoading: false,
      isDeleteEveryoneLoading: false,
      isAdmin: false,
      selectedIds: [],
      openDoc: false,
      isReply: false,
      repliedMessage: null,
      isRegisterBonus: false,
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
                    title: 'TOUKU',
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
              {
                id: 5,
                title: translate('pages.xchat.unfollow'),
                icon: 'user-times',
                onPress: () => {
                  this.toggleConfirmationModal();
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
              {
                id: 4,
                title: translate('pages.xchat.unfollow'),
                icon: 'user-times',
                onPress: () => {
                  this.toggleConfirmationModal();
                },
              },
            ],
    };
    this.S3uploadService = new S3uploadService();
    this.props.resetChannelConversation();
    this.isUploading = false;
    this.isUnfollowing = false;
  }

  static navigationOptions = ({navigation}) => {
    return {
      gesturesEnabled:
        navigation.state.params && navigation.state.params.isAudioPlaying
          ? false
          : true,
    };
  };

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
    // const is_bonus_opened = await AsyncStorage.getItem('is_bonus_opened');
    // console.log('is_bonus_opened', is_bonus_opened)
    // if(is_bonus_opened === false){
    //     this.setState({is_bonus_opened: true, orientation: initial});
    // }else{
    //
    // }
    //
    // AsyncStorage.getItem('is_bonus_opened', (errs, result) => {
    //   if (!errs) {
    //     if (result !== null) {
    //       console.log('is_bonus_opened', result);
    //       if (result === 'false') {
    //         this.setState({isRegisterBonus: true});
    //       }
    //     }
    //   }
    // });
  }

  componentWillUnmount() {
    // this.events.unsubscribe();
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this.getChannelConversationsInitial();

    if (this.props.currentChannel.id === 355) {
      this.checkHasLoginBonus();
    }
    // this.getLoginBonus();
    this.updateUnReadChannelCount();
  }

  onPinUnpinChannel = () => {
    const {currentChannel} = this.props;
    const data = {};
    if (currentChannel.is_pined) {
      this.props
        .unpinChannel(currentChannel.id, data)
        .then((res) => {
          if (res.status === true) {
            Toast.show({
              title: 'TOUKU',
              text: translate('pages.xchat.sucessFullyUnPined'),
              type: 'positive',
            });
          }
        })
        .catch((err) => {
          console.error(err);
          Toast.show({
            title: 'TOUKU',
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
              title: 'TOUKU',
              text: translate('pages.xchat.sucessFullyPined'),
              type: 'positive',
            });
          }
        })
        .catch((err) => {
          console.error(err);
          Toast.show({
            title: 'TOUKU',
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

    this.props.readAllChannelMessages(this.props.currentChannel.id);
  };

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

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
      let file = uploadFile;
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
      // let fileType = uploadFile.type;
      const uploadedApplication = await this.S3uploadService.uploadApplicationOnS3Bucket(
        files,
        uploadFile.type,
        (e) => {
          console.log('progress_bar_percentage', e);
          this.setState({uploadProgress: e.percent});
        },
        uploadFile.name,
      );
      msgText = uploadedApplication;
    }

    if (sentMessageType === 'video') {
      let file = uploadFile;
      let files = [file];
      if (uploadFile.isUrl) {
        msgText = uploadFile.uri;
      } else {
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
            id: userData.id,
            message: repliedMessage.message_body,
            msg_type: repliedMessage.msg_type,
            name: repliedMessage.from_user.username,
            sender_id: repliedMessage.id,
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
      reply_to: isReply ? repliedMessage.id : null,
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
      .catch((err) => {
        console.error(err);
      });
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
      .then(async (res) => {
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
          if (res && res.data) {
            this.setState({assetXPValue: res.data});
          }
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
    if (jackpotData.picked_option === 1) {
      array = [
        parseInt(jackpotData.picked_amount, 10),
        parseInt(jackpotData.missed1_amount, 10),
        parseInt(jackpotData.missed2_amount, 10),
      ];
    } else if (jackpotData.picked_option === 2) {
      array = [
        parseInt(jackpotData.missed1_amount, 10),
        parseInt(jackpotData.picked_amount, 10),
        parseInt(jackpotData.missed2_amount, 10),
      ];
    } else if (jackpotData.picked_option === 3) {
      array = [
        parseInt(jackpotData.missed1_amount, 10),
        parseInt(jackpotData.missed2_amount, 10),
        parseInt(jackpotData.picked_amount, 10),
      ];
    }
    return array;
  };

  getLocalChannelConversations = () => {
    let chat = getChannelChatConversationById(this.props.currentChannel.id);
    if (chat) {
      let conversations = [];
      let a = Array.from(chat);
      conversations = realmToPlainObject(a);
      // conversations = chat.toJSON();
      this.props.setChannelConversation(conversations);
    }
  };

  getChannelConversations = async (msg_id) => {
    await this.props
      .getChannelConversations(this.props.currentChannel.id, msg_id)
      .then((res) => {
        if (res.status === true && res.conversation.length > 0) {
          this.setState({conversations: res.conversation});
          // this.props.readAllChannelMessages(this.props.currentChannel.id);
          let chat = getChannelChatConversationById(
            this.props.currentChannel.id,
          );
          let conversations = [];
          let a = Array.from(chat);
          conversations = realmToPlainObject(a);
          // conversations = chat.toJSON();

          this.props.setChannelConversation(conversations);
        } else {
          this.setState({isLoadMore: false});
        }
      });
  };

  getChannelConversationsInitial = async () => {
    this.setState({isChatLoading: true});
    let chat = getChannelChatConversationById(this.props.currentChannel.id);
    if (chat) {
      let conversations = [];
      let a = Array.from(chat);
      conversations = realmToPlainObject(a);
      // conversations = chat.toJSON();
      this.props.setChannelConversation(conversations);
      // this.setState({isChatLoading: false});
    }
    await this.props
      .getChannelConversations(this.props.currentChannel.id)
      .then((res) => {
        if (res.status === true) {
          if (res.conversation.length > 0) {
            this.setState({conversations: res.conversation});
            // this.props.readAllChannelMessages(this.props.currentChannel.id);
            let conversation = getChannelChatConversationById(
              this.props.currentChannel.id,
            );
            let conversations = [];
            let a = Array.from(conversation);
            conversations = realmToPlainObject(a);
            // conversations = chat.toJSON();
            this.props.setChannelConversation(conversations);
          }
          if (
            res.admin_id.length > 0 &&
            res.admin_id.includes(this.props.userData.id)
          ) {
            this.setState({isAdmin: true});
          }
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
          name: file.filename,
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
          name: file.filename,
          isUrl: file.isUrl,
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
      } else if (fileType === 'image') {
        await this.setState(
          {
            uploadFile: source,
            sentMessageType: 'image',
            sendingMedia: true,
          },
          () => {
            this.onMessageSend();
          },
        );
      } else if (fileType === 'video') {
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
    const {chatConversation, userConfig} = this.props;
    const {
      newMessageText,
      translatedMessage,
      translatedMessageId,
      orientation,
      showConfirmationModal,
      showMessageUnSendConfirmationModal,
      showMessageDeleteConfirmationModal,
      showMoreMessageDeleteConfirmationModal,
      uploadFile,
      sendingMedia,
      isChatLoading,
      isDeleteMeLoading,
      isDeleteEveryoneLoading,
      isMultiSelect,
      openDoc,
      isLoadMore,
    } = this.state;
    if (!this.props.chatConversation) {
      return null;
    }

    if (isChatLoading && this.props.chatConversation.length <= 0) {
      return <ListLoader />;
    } else {
      return (
        <View style={styles.container}>
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
            isLoadMore={isLoadMore}
            onLoadMore={(message) => {
              console.log('msg_id', message.id);
              if (message && message.id) {
                this.getChannelConversations(message.id);
              }
            }}
            onMediaPlay={(isPlay) => {
              if (isPlay) {
                console.log('palying media');
                this.props.navigation.setParams({
                  isAudioPlaying: true,
                });
              } else {
                console.log('pause media');
                this.props.navigation.setParams({
                  isAudioPlaying: false,
                });
              }
            }}
            UserDisplayName={userConfig.display_name}
          />

          <ConfirmationModal
            visible={showConfirmationModal}
            onCancel={this.onCancel.bind(this)}
            onConfirm={this.onConfirm.bind(this)}
            orientation={orientation}
            isLoading={this.isUnfollowing}
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
            onConfirm={this.onConfirmMultipleMessageDelete.bind(this, 'DELETE_FOR_ME')}
            orientation={orientation}
            title={translate('pages.xchat.toastr.areYouSure')}
            message={translate('pages.xchat.youWantToDeleteThisMessage')}
            isLoading={isDeleteMeLoading}
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

          <DeleteOptionModal
            visible={showMoreMessageDeleteConfirmationModal}
            orientation={orientation}
            onCancel={this.onCancel.bind(this)}
            onConfirm={this.onConfirmMultipleMessageDelete.bind(this)}
            title={translate('pages.xchat.toastr.areYouSure')}
            message={translate('pages.xchat.youWantToDeleteThisMessage')}
            isDeleteMeLoading={isDeleteMeLoading}
            isDeleteEveryoneLoading={isDeleteEveryoneLoading}
          />

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
    if (this.state.isAdmin) {
      this.setState({
        showMoreMessageDeleteConfirmationModal: true,
      });
    } else {
      this.setState({
        showMessageDeleteConfirmationModal: true,
      });
    }
  };

  onCancel = () => {
    this.setState({
      showConfirmationModal: false,
      showMessageUnSendConfirmationModal: false,
      showMessageDeleteConfirmationModal: false,
      showMoreMessageDeleteConfirmationModal: false,
      showPhoneUpdateModal: false,
    });
  };

  // onConfirm = () => {
  //   this.toggleConfirmationModal();
  // };

  onConfirm = async () => {
    if (this.isUnfollowing) {
      return;
    }
    this.isUnfollowing = true;
    await this.setState({
      isLoading: true,
    });
    let user = {
      user_id: this.props.userData.id,
    };
    this.props
      .unfollowChannel(this.props.currentChannel.id, user)
      .then(async (res) => {
        console.log('res', res);
        if (res.status === true) {
          await this.toggleConfirmationModal();
          this.isUnfollowing = false;
          this.setState({
            isLoading: false,
          });
          this.props.navigation.popToTop();
        }
        return;
      })
      .catch((err) => {
        console.log('ChannelInfo -> onConfirm -> err', err);
        Toast.show({
          title: 'TOUKU',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
        this.isUnfollowing = false;
        this.setState({
          isLoading: false,
        });
        this.toggleConfirmationModal();
      });
  };

  onDeletePressed = (messageId) => {
    this.setState({
      showMessageDeleteConfirmationModal: true,
      selectedMessageId: messageId,
    });
  };

  onUnSendPressed = (messageId) => {
    console.log('messageId', messageId);

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

  onConfirmMultipleMessageDelete = (delete_type) => {
    // this.setState({showMessageDeleteConfirmationModal: false});
    if (this.state.selectedIds.length > 0) {
      let payload = {
        message_ids: this.state.selectedIds,
        delete_type: delete_type,
      };

      if (delete_type === 'DELETE_FOR_EVERYONE') {
        this.setState({isDeleteEveryoneLoading: true});
      } else {
        this.setState({isDeleteMeLoading: true});
      }

      console.log('payload', payload);

      this.state.selectedIds.map((item) => {
        deleteMessageById(item);

        if (
          this.props.currentChannel.last_msg &&
          this.props.currentChannel.last_msg.id === item
        ) {
          let chat = getChannelChatConversationById(
            this.props.currentChannel.id,
          );

          let a = Array.from(chat);
          let array = realmToPlainObject(a);
          // let array = chat.toJSON();

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

      this.props
        .deleteMultipleChannelMessage(payload)
        .then((res) => {
          //console.log(res);
          this.setState({
            isDeleteEveryoneLoading: false,
            isDeleteMeLoading: false,
            showMessageDeleteConfirmationModal: false,
            showMoreMessageDeleteConfirmationModal: false,
          });
          if (res && res.status) {
          } else {
            this.getChannelConversations();
          }
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            isDeleteEveryoneLoading: false,
            isDeleteMeLoading: false,
            showMessageDeleteConfirmationModal: false,
            showMoreMessageDeleteConfirmationModal: false,
          });
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
            title: 'TOUKU',
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
        updateChannelTranslatedMessage(message.id, res.data);
        this.getLocalChannelConversations();
      }
    });
  };

  onMessageTranslateClose = (id) => {
    this.setState({
      translatedMessageId: null,
      translatedMessage: null,
    });
    updateChannelTranslatedMessage(id, null);
    this.getLocalChannelConversations();
  };

  render() {
    const {currentChannel} = this.props;
    const {bonusModal, bonusXP, isRegisterBonus} = this.state;
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
          onBackPress={() => {
            this.props.navigation.goBack();
          }}
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

        <BonusModal
          visible={bonusModal}
          onRequestClose={() => this.setState({bonusModal: false})}
          bonusXP={bonusXP}
          registerBonus={isRegisterBonus}
        />
      </View>
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
    userConfig: state.configurationReducer.userConfig,
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
  unfollowChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelChats);
