import React, {Component} from 'react';
import {ImageBackground, PermissionsAndroid, Platform} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Orientation from 'react-native-orientation';
import uuid from 'react-native-uuid';
import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import GroupChatContainer from '../../components/GroupChatContainer';
import {ChatHeader} from '../../components/Headers';
import {ListLoader, OpenLoader} from '../../components/Loaders';
import {
  ConfirmationModal,
  DeleteOptionModal,
  ShowAttahmentModal,
  ShowGalleryModal,
} from '../../components/Modals';
import Toast from '../../components/Toast';
import {appleStoreUserId, Icons, Images, SocketEvents} from '../../constants';
import S3uploadService from '../../helpers/S3uploadService';
import SingleSocket from '../../helpers/SingleSocket';
import {setCommonChatConversation} from '../../redux/reducers/commonReducer';
import {
  deleteGroup,
  deleteGroupChat,
  deleteMultipleGroupMessage,
  editGroupMessage,
  getGroupConversation,
  getGroupDetail,
  getGroupMembers,
  getLocalUserGroups,
  getUserGroups,
  leaveGroup,
  markGroupConversationRead,
  pinGroup,
  resetGroupConversation,
  sendGroupMessage,
  setCurrentGroup,
  setCurrentGroupDetail,
  setCurrentGroupMembers,
  setGroupConversation,
  unpinGroup,
  unSendGroupMessage,
  updateUnreadGroupMsgsCounts,
} from '../../redux/reducers/groupReducer';
import {
  translate,
  translateMessage,
} from '../../redux/reducers/languageReducer';
import {
  deleteAllGroupMessageByGroupId,
  deleteGroupById,
  deleteGroupMessageById,
  getGroupChatConversationById,
  getGroupChatConversationLengthById,
  removeGroupById,
  setGroupLastMessageUnsend,
  setGroupMessageUnsend,
  updateGroupMessageById,
  updateGroupTranslatedMessage,
  updateLastMsgGroupsWithoutCount,
  updateUnReadCount,
} from '../../storage/Service';
import {globalStyles} from '../../styles';
import {getUserName, realmToPlainObject} from '../../utils';

class GroupChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      newMessageText: '',
      showLeaveGroupConfirmationModal: false,
      showDeleteGroupConfirmationModal: false,
      showdeleteObjectConfirmationModal: false,
      deletionOptionModal: false,
      isMyGroup: false,
      conversation: [],
      selectedMessageId: null,
      translatedMessage: null,
      translatedMessageId: null,
      showMessageDeleteConfirmationModal: false,
      showMoreMessageDeleteConfirmationModal: false,
      sentMessageType: 'text',
      showSelectModal: false,
      uploadedFiles: [],
      showAttachmentModal: false,
      showGalleryModal: false,
      sendingMedia: false,
      isLeaveLoading: false,
      deleteObjectLoading: false,
      uploadFile: {uri: null, type: null, name: null},
      uploadProgress: 0,
      isChatLoading: false,
      isMultiSelect: false,
      isDeleteMeLoading: false,
      isDeleteEveryoneLoading: false,
      selectedIds: [],
      openDoc: false,
      isLoadMore: true,
      loading: false,
      headerRightIconMenu:
        this.props.userData.id === appleStoreUserId
          ? [
              {
                id: 1,
                title: translate('pages.xchat.inviteFriends'),
                icon: Icons.man_plus_icon_black,
                isLocalIcon: true,
                onPress: () => {
                  this.props.navigation.navigate('GroupDetails', {
                    isInvite: true,
                  });
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
                id: 2,
                title: translate('pages.xchat.groupInvitation'),
                icon: 'id-card',
                onPress: () => {
                  this.props.navigation.navigate('GroupInvitation');
                },
              },
              {
                id: 3,
                title: translate('pages.xchat.leave'),
                icon: 'user-slash',
                onPress: () => {
                  this.toggleLeaveGroupConfirmationModal();
                },
              },
              {
                id: 4,
                title: translate('pages.xchat.reportGroup'),
                icon: 'user-slash',
                onPress: () => {
                  Toast.show({
                    title: 'TOUKU',
                    text: 'Group reported',
                    type: 'positive',
                  });
                },
              },
              {
                id: 5,
                pinUnpinItem: true,
                onPress: () => {
                  this.onPinUnpinGroup();
                },
              },
            ]
          : [
              {
                id: 1,
                title: translate('pages.xchat.inviteFriends'),
                icon: Icons.man_plus_icon_black,
                isLocalIcon: true,
                onPress: () => {
                  this.props.navigation.navigate('GroupDetails', {
                    isInvite: true,
                  });
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
                id: 2,
                title: translate('pages.xchat.groupInvitation'),
                icon: 'id-card',
                onPress: () => {
                  this.props.navigation.navigate('GroupInvitation');
                },
              },
              {
                id: 3,
                title: translate('pages.xchat.leave'),
                icon: 'user-slash',
                onPress: () => {
                  this.toggleLeaveGroupConfirmationModal();
                },
              },
              {
                id: 4,
                pinUnpinItem: true,
                onPress: () => {
                  this.onPinUnpinGroup();
                },
              },
            ],
      headerRightIconMenuIsGroup:
        this.props.userData.id === appleStoreUserId
          ? [
              {
                id: 1,
                title: translate('pages.xchat.inviteFriends'),
                icon: Icons.man_plus_icon_black,
                isLocalIcon: true,
                onPress: () => {
                  this.props.navigation.navigate('GroupDetails', {
                    isInvite: true,
                  });
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
                id: 2,
                title: translate('pages.xchat.groupInvitation'),
                icon: 'id-card',
                onPress: () => {
                  this.props.navigation.navigate('GroupInvitation');
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
                    title: 'TOUKU',
                    text: 'Group reported',
                    type: 'positive',
                  });
                },
              },
              {
                id: 6,
                pinUnpinItem: true,
                onPress: () => {
                  this.onPinUnpinGroup();
                },
              },
            ]
          : [
              {
                id: 1,
                title: translate('pages.xchat.inviteFriends'),
                icon: Icons.man_plus_icon_black,
                isLocalIcon: true,
                onPress: () => {
                  this.props.navigation.navigate('GroupDetails', {
                    isInvite: true,
                  });
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
                id: 2,
                title: translate('pages.xchat.groupInvitation'),
                icon: 'id-card',
                onPress: () => {
                  this.props.navigation.navigate('GroupInvitation');
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
                pinUnpinItem: true,
                onPress: () => {
                  this.onPinUnpinGroup();
                },
              },
            ],
      headerRightIconMenuIsRemoveGroup: [
        {
          id: 1,
          title: translate('pages.xchat.deleteChats'),
          icon: 'times-circle',
          onPress: () => {
            this.toggleDeleteObjectConfirmationModal();
          },
        },
        {
          id: 2,
          pinUnpinItem: true,
          onPress: () => {
            this.onPinUnpinGroup();
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
    this.isUploading = false;
    this.isLeaveLoading = false;
    this.offset = 20;
    this.loading = false;
  }

  static navigationOptions = ({navigation}) => {
    return {
      gesturesEnabled:
        navigation.state.params && navigation.state.params.isAudioPlaying
          ? false
          : true,
    };
  };

  onPinUnpinGroup = () => {
    const {currentGroup} = this.props;
    const data = {};
    if (currentGroup.is_pined) {
      this.props
        .unpinGroup(currentGroup.group_id, data)
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
        .pinGroup(currentGroup.group_id, data)
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

  onMessageSend = async () => {
    const {newMessageText, editMessageId} = this.state;
    const {userData, currentGroup, currentGroupMembers} = this.props;
    // let splitNewMessageText = newMessageText.split(' ');
    let newMessageMentions = [];
    let newMessageTextWithMention = newMessageText;
    // const newMessageTextWithMention = splitNewMessageText
    //   .map((text) => {
    //     let mention = null;
    //     currentGroupMembers.forEach((groupMember) => {
    //       console.log('groupMember',groupMember);
    //       let user_name = getUserName(groupMember.id) || groupMember.display_name || groupMember.username;
    //       if (newMessageText.includes(`@${user_name}`)) {
    //         console.log('user_name',user_name);
    //         mention = `~${groupMember.id}~`;
    //         newMessageMentions = [...newMessageMentions, groupMember.id];
    //       }
    //     });
    //     if (mention) {
    //       return mention;
    //     } else {
    //       return text;
    //     }
    //   })
    //   .join(' ');

    currentGroupMembers.forEach((groupMember) => {
      let user_name =
        getUserName(groupMember.id) ||
        groupMember.display_name ||
        groupMember.username;
      if (newMessageTextWithMention.includes(`@${user_name}`)) {
        // mention = `~${groupMember.id}~`; // TODO: Cannot find variable
        newMessageTextWithMention = newMessageTextWithMention.replace(
          `@${user_name}`,
          `~${groupMember.id}~`,
        );
        newMessageMentions = [...newMessageMentions, groupMember.id];
      }
    });

    console.log('mention', newMessageTextWithMention);
    let msgText = newMessageTextWithMention;
    let newMessageTextWithoutMention = newMessageText;
    let isReply = this.state.isReply;
    let repliedMessage = this.state.repliedMessage;
    let isEdited = this.state.isEdited;
    let sentMessageType = this.state.sentMessageType;
    let uploadFile = this.state.uploadFile;
    if (!msgText && !uploadFile.uri) {
      return;
    }
    this.setState({
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
      isEdited: false,
      sentMessageType: 'text',
      // sendingMedia: false,
      uploadFile: {uri: null, type: null, name: null},
      uploadProgress: 0,
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

    let mentions = [];
    newMessageMentions.map((item) => {
      mentions.push({id: item});
    });

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
      timestamp: new Date(),
      created: new Date(new Date()),
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
      mentions: mentions,
      read_count: null,
    };

    const sendMsgDataMention = {
      ...sendmsgdata,
      message_body: {
        ...sendmsgdata.message_body,
        text: newMessageTextWithoutMention,
      },
    };
    const msgDataSend =
      sentMessageType === 'text' ? sendMsgDataMention : sendmsgdata;

    if (isEdited) {
      updateGroupMessageById(editMessageId, {
        type: sentMessageType,
        text: msgText,
      });
      this.sendEditMessage(msgText, editMessageId, sentMessageType);
      return;
    }
    if (isReply) {
      let groupMessage;
      if (sentMessageType !== 'text') {
        groupMessage = {
          group: this.props.currentGroup.group_id,
          local_id: uuid.v4(),
          mentions: [...newMessageMentions],
          media_url: msgText,
          msg_type: sentMessageType,
          reply_to: repliedMessage.msg_id,
        };
      } else {
        groupMessage = {
          group: this.props.currentGroup.group_id,
          local_id: uuid.v4(),
          mentions: [...newMessageMentions],
          message_body: msgText,
          msg_type: sentMessageType,
          reply_to: repliedMessage.msg_id,
        };
      }
      // this.state.conversation.unshift(msgDataSend);
      this.props.setGroupConversation([
        msgDataSend,
        ...this.props.chatGroupConversation,
      ]);
      this.props.sendGroupMessage(groupMessage);
    } else {
      let groupMessage;
      if (sentMessageType !== 'text') {
        groupMessage = {
          group: this.props.currentGroup.group_id,
          local_id: uuid.v4(),
          mentions: [...newMessageMentions],
          media_url: msgText,
          msg_type: sentMessageType,
        };
      } else {
        groupMessage = {
          group: this.props.currentGroup.group_id,
          local_id: uuid.v4(),
          mentions: [...newMessageMentions],
          message_body: msgText,
          msg_type: sentMessageType,
        };
      }
      // this.state.conversation.unshift(msgDataSend);
      this.props.setGroupConversation([
        msgDataSend,
        ...this.props.chatGroupConversation,
      ]);
      this.props.sendGroupMessage(groupMessage);
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
    //   isReply: false,
    //   repliedMessage: null,
    //   isEdited: false,
    //   sentMessageType: 'text',
    //   sendingMedia: false,
    //   uploadFile: {uri: null, type: null, name: null},
    // });
  };

  sendEditMessage = (newMessageText, editMessageId, sentMessageType) => {
    // const {newMessageText, editMessageId,sentMessageType} = this.state;
    const data = {
      message_body: newMessageText,
    };
    this.props.editGroupMessage(editMessageId, data).then((res) => {
      if (this.props.currentGroup.last_msg_id === editMessageId) {
        updateLastMsgGroupsWithoutCount(
          this.props.currentGroup.group_id,
          sentMessageType,
          newMessageText,
          this.props.currentGroup.last_msg_id,
          this.props.currentGroup.timestamp,
        );
        this.props.getLocalUserGroups().then(() => {
          this.props.setCommonChatConversation();
        });
      }
    });
    this.setState({
      sendingMedia: false,
    });
    // this.setState({
    //   newMessageText: '',
    //   isReply: false,
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
    if (this.props.currentGroup) {
      this.getGroupDetail();
      this.getGroupMembers();
      this.getGroupConversationInitial();

      this.updateUnReadGroupChatCount();

      let singleSocket = SingleSocket.getInstance();

      if (
        singleSocket.webSocketBridge !== null &&
        singleSocket.webSocketBridge.readyState ===
          singleSocket.webSocketBridge.OPEN
      ) {
        singleSocket.sendMessage(
          JSON.stringify({
            type: SocketEvents.UPDATE_READ_COUNT_IN_GROUP,
            data: {
              group_id: this.props.currentGroup.group_id,
            },
          }),
        );
      }
    }
  }

  isGroupAdmin = () => {
    if (
      this.props.currentGroupAdmins &&
      this.props.currentGroupAdmins.length > 0
    ) {
      let my_group = false;
      this.props.currentGroupAdmins.map((item) => {
        if (item.id === this.props.userData.id) {
          my_group = true;
          return;
        }
      });
      return my_group;
    } else {
      return false;
    }
  };

  updateUnReadGroupChatCount = async () => {
    updateUnReadCount(this.props.currentGroup.group_id, 0);

    this.props.updateUnreadGroupMsgsCounts(0);

    this.props.getLocalUserGroups().then((res) => {
      this.props.setCommonChatConversation();
    });
  };

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  checkEventTypes(message) {
    const {currentGroup} = this.props;
    // const {conversation} = this.state;

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
    if (message.text.data.type === SocketEvents.READ_COUNT_IN_GROUP) {
      if (
        message.text.data.message_details.group_id === currentGroup.group_id
      ) {
        // this.getGroupConversation();
      }
    }

    //PINED_GROUP
    if (message.text.data.type === SocketEvents.PINED_GROUP) {
      if (
        message.text.data.message_details.group_id === currentGroup.group_id
      ) {
        // this.getGroupConversation();
      }
    }

    //UNPINED_GROUP
    if (message.text.data.type === SocketEvents.UNPINED_GROUP) {
      if (
        message.text.data.message_details.group_id === currentGroup.group_id
      ) {
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
    let chat = getGroupChatConversationById(
      this.props.currentGroup.group_id,
      this.offset,
    );
    if (chat) {
      let conversations = [];
      conversations = realmToPlainObject(chat);
      this.props.setGroupConversation(conversations);
    }
    this.loading = false;
  };

  getGroupConversation = async (msg_id) => {
    await this.props
      .getGroupConversation(this.props.currentGroup.group_id, msg_id)
      .then((res) => {
        if (res.status && res.data.length > 0) {
          // console.log('response', JSON.stringify(res));
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
            this.offset,
          );
          let conversations = [];

          conversations = realmToPlainObject(chat);

          // this.setState({ conversation: conversations });
          this.props.setGroupConversation(conversations);
          !msg_id && this.markGroupConversationRead();

          if (res.data.length < 50) {
            this.setState({isLoadMore: false});
          }
        } else {
          this.setState({isLoadMore: false});
        }
      })
      .catch((err) => {
        console.log('GroupChats -> getGroupConversation -> err', err);
      });
  };

  getGroupConversationInitial = async () => {
    this.setState({isChatLoading: true});
    let chat = getGroupChatConversationById(
      this.props.currentGroup.group_id,
      this.offset,
    );
    if (chat) {
      let conversations = [];
      // chat.map((item, index) => {
      //   let i = {
      //     msg_id: item.msg_id,
      //     sender_id: item.sender_id,
      //     group_id: item.group_id,
      //     sender_username: item.sender_username,
      //     sender_display_name: item.sender_display_name,
      //     sender_picture: item.sender_picture,
      //     message_body: item.message_body,
      //     is_edited: item.is_edited,
      //     is_unsent: item.is_unsent,
      //     timestamp: item.timestamp,
      //     reply_to: item.reply_to,
      //     mentions: item.mentions,
      //     read_count: item.read_count,
      //     created: item.created,
      //   };
      //   conversations = [...conversations, i];
      // });

      conversations = realmToPlainObject(chat);
      // conversations = chat.toJSON();

      // this.setState({ conversation: conversations });
      this.props.setGroupConversation(conversations);
      // this.setState({isChatLoading: false});
    }

    await this.props
      .getGroupConversation(this.props.currentGroup.group_id)
      .then((res) => {
        // console.log('res', res);
        if (res.status) {
          let data = res.data;
          data.sort((a, b) =>
            a.timestamp &&
            b.timestamp &&
            new Date(a.timestamp) < new Date(b.timestamp)
              ? 1
              : -1,
          );

          let groupChat = getGroupChatConversationById(
            this.props.currentGroup.group_id,
            this.offset,
          );
          let conversations = [];
          // groupChat.map((item, index) => {
          //   let i = {
          //     msg_id: item.msg_id,
          //     sender_id: item.sender_id,
          //     group_id: item.group_id,
          //     sender_username: item.sender_username,
          //     sender_display_name: item.sender_display_name,
          //     sender_picture: item.sender_picture,
          //     message_body: item.message_body,
          //     is_edited: item.is_edited,
          //     is_unsent: item.is_unsent,
          //     timestamp: item.timestamp,
          //     reply_to: item.reply_to,
          //     mentions: item.mentions,
          //     read_count: item.read_count,
          //     created: item.created,
          //   };
          //   conversations = [...conversations, i];
          // });

          conversations = realmToPlainObject(groupChat);
          // conversations = chat.toJSON();

          // this.setState({ conversation: conversations });
          this.props.setGroupConversation(conversations);
          this.setState({isChatLoading: false});
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
        //console.log('res_getGroupDetail', res);
        this.props.setCurrentGroupDetail(res);
        if(res && res.admin_details){
          for (let admin of res.admin_details) {
            if (admin.id === this.props.userData.id) {
              this.setState({isMyGroup: true});
            }
          }
        }
      })
      .catch((err) => {
        console.log('err_getGroupDetail', err.response.data);
        let response_error_data = err.response.data;
        if (response_error_data && !response_error_data.status) {
          if (
            response_error_data.message === 'backend.common.Groupdoesnotexist'
          ) {
            this.deleteLocalGroup(this.props.currentGroup.group_id);
            this.props.getUserGroups();
          }
          Toast.show({
            title: 'Touku',
            text: translate(response_error_data.message),
            type: 'primary',
          });
        } else {
          Toast.show({
            title: 'Touku',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        }
        this.props.navigation.goBack();
      });
  }

  getGroupMembers() {
    this.props
      .getGroupMembers(this.props.currentGroup.group_id)
      .then((res) => {
        this.props.setCurrentGroupMembers(res);
      })
      .catch((err) => {
        console.log('GroupChats -> getGroupMembers -> err', err);
      });
  }

  removeLocalGroup = (id) => {
    removeGroupById(id);
    this.getGroupDetail();
    this.getGroupMembers();
  };

  deleteLocalGroup = (id) => {
    this.props.setCurrentGroup(null);
    this.props.setGroupConversation([]);
    deleteGroupById(id);
    deleteAllGroupMessageByGroupId(id);
    this.props.getLocalUserGroups().then((res) => {
      this.props.setCommonChatConversation();
    });
  };

  handleMessage(message) {
    this.setState({newMessageText: message});
  }

  //Delete chat
  toggleDeleteObjectConfirmationModal = () => {
    this.setState({
      showdeleteObjectConfirmationModal: !this.state
        .showdeleteObjectConfirmationModal,
    });
  };

  onDeleteObjectCancel = () => {
    this.toggleDeleteObjectConfirmationModal();
  };

  onDeleteGroupObject = () => {
    const {currentGroup} = this.props;
    this.setState({deleteObjectLoading: true});

    let data = {
      group_id: currentGroup.group_id,
    };

    this.props
      .deleteGroupChat(data)
      .then((res) => {
        this.setState({
          deleteObjectLoading: false,
          showdeleteObjectConfirmationModal: false,
        });
        if (res && res.status) {
          this.deleteLocalGroup(currentGroup.group_id);
          this.props.getUserGroups();
          this.props.navigation.goBack();
        }
      })
      .catch((err) => {
        this.setState({
          deleteObjectLoading: false,
          showdeleteObjectConfirmationModal: false,
        });
        console.log('err', err);
      });
  };

  //Leave Group
  toggleLeaveGroupConfirmationModal = () => {
    this.setState((prevState) => ({
      showLeaveGroupConfirmationModal: !prevState.showLeaveGroupConfirmationModal,
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

  onConfirmLeaveGroup = async () => {
    if (this.isLeaveLoading) {
      return;
    }
    this.isLeaveLoading = true;
    await this.setState({isLeaveLoading: true});
    const payload = {
      group_id: this.props.currentGroup.group_id,
    };
    this.props
      .leaveGroup(payload)
      .then((res) => {
        if (res.status === true) {
          Toast.show({
            title: 'TOUKU',
            text: translate(res.message),
            type: 'positive',
          });
          this.removeLocalGroup(this.props.currentGroup.group_id);
          // this.deleteLocalGroup(this.props.currentGroup.group_id);
          // this.props.getUserGroups();
          // this.props.navigation.goBack();
        }
        this.isLeaveLoading = false;
        this.setState({isLeaveLoading: false});
        this.toggleLeaveGroupConfirmationModal();
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          title: 'TOUKU',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
        this.isLeaveLoading = false;
        this.setState({isLeaveLoading: false});
        this.toggleLeaveGroupConfirmationModal();
      });
  };

  //Delete Group
  toggleDeleteGroupConfirmationModal = () => {
    this.setState((prevState) => ({
      showDeleteGroupConfirmationModal: !prevState.showDeleteGroupConfirmationModal,
    }));
  };

  onConfirmDeleteGroup = async () => {
    if (this.isLeaveLoading) {
      return;
    }
    this.isLeaveLoading = true;
    await this.setState({isLeaveLoading: true});
    this.props
      .deleteGroup(this.props.currentGroup.group_id)
      .then((res) => {
        if (res.status === true) {
          Toast.show({
            title: 'TOUKU',
            text: translate('pages.xchat.toastr.groupIsRemoved'),
            type: 'positive',
          });
          // this.deleteLocalGroup(this.props.currentGroup.group_id);
          this.props.getUserGroups();
          this.props.navigation.goBack();
        }
        this.isLeaveLoading = false;
        this.setState({isLeaveLoading: false});
        this.toggleDeleteGroupConfirmationModal();
      })
      .catch((err) => {
        console.error(err);
        Toast.show({
          title: 'TOUKU',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
        this.isLeaveLoading = false;
        this.setState({isLeaveLoading: false});
        this.toggleDeleteGroupConfirmationModal();
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

  onDeleteMultipleMessagePressed = () => {
    if (this.isGroupAdmin()) {
      this.setState({
        showMoreMessageDeleteConfirmationModal: true,
      });
    } else {
      this.setState({
        showMessageDeleteConfirmationModal: true,
      });
    }
    // this.setState({
    //   showMessageDeleteConfirmationModal: true,
    // });
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
          this.getLocalGroupConversation();

          if (
            this.props.currentGroup.last_msg_id === this.state.selectedMessageId
          ) {
            let chat = getGroupChatConversationById(
              this.props.currentGroup.group_id,
            );

            let array = realmToPlainObject(chat);
            // let array = chat.toJSON();

            if (array && array.length > 0) {
              updateLastMsgGroupsWithoutCount(
                this.props.currentGroup.group_id,
                array[0].message_body.type,
                array[0].message_body.text,
                array[0].msg_id,
                array[0].timestamp,
              );
              this.props.getLocalUserGroups().then(() => {
                this.props.setCommonChatConversation();
              });
            }
          }
          // this.getGroupConversation();
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
        deleteGroupMessageById(item);
        if (this.props.currentGroup.last_msg_id === item) {
          let chat = getGroupChatConversationById(
            this.props.currentGroup.group_id,
          );

          let array = realmToPlainObject(chat);
          // let array = chat.toJSON();

          if (array && array.length > 0) {
            updateLastMsgGroupsWithoutCount(
              this.props.currentGroup.group_id,
              array[0].message_body && array[0].message_body.type
                ? array[0].message_body.type
                : array[0].message_body,
              array[0].message_body && array[0].message_body.text
                ? array[0].message_body.text
                : array[0].message_body,
              array[0].msg_id,
              array[0].timestamp,
            );
            this.props.getLocalUserGroups().then((res) => {
              this.props.setCommonChatConversation();
            });
          } else {
          }
        }
      });
      this.getLocalGroupConversation();
      this.setState({isMultiSelect: false, selectedIds: []});

      this.props
        .deleteMultipleGroupMessage(payload)
        .then((res) => {
          this.setState({
            isDeleteEveryoneLoading: false,
            isDeleteMeLoading: false,
            showMessageDeleteConfirmationModal: false,
            showMoreMessageDeleteConfirmationModal: false,
          });
          if (res && res.status) {
          } else {
            this.getGroupConversation();
          }
          // this.getGroupConversation();
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

  onConfirmMessageUnSend = () => {
    this.setState({showMessageUnsendConfirmationModal: false});
    if (this.state.selectedMessageId != null) {
      let payload = {delete_type: 2};
      this.props
        .unSendGroupMessage(this.state.selectedMessageId, payload)
        .then((res) => {
          setGroupMessageUnsend(this.state.selectedMessageId);
          this.getLocalGroupConversation();
          if (
            this.props.currentGroup.last_msg_id === this.state.selectedMessageId
          ) {
            setGroupLastMessageUnsend(this.props.currentGroup.group_id);
            this.props.getLocalUserGroups().then(() => {
              this.props.setCommonChatConversation();
            });
          }
          Toast.show({
            title: 'TOUKU',
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
      showMoreMessageDeleteConfirmationModal: false,
    });
  };

  onMessageTranslate = (message) => {
    const payload = {
      text: message.message_body.text,
      language: this.props.selectedLanguageItem.language_name,
    };
    console.log('payload', payload);
    this.props.translateMessage(payload).then((res) => {
      console.log('res', res);
      if (res.status === true) {
        this.setState({
          translatedMessageId: message.msg_id,
          translatedMessage: res.data,
        });
        updateGroupTranslatedMessage(message.msg_id, res.data);
        this.getLocalGroupConversation();
      }
    });
  };

  onMessageTranslateClose = (id) => {
    this.setState({
      translatedMessageId: null,
      translatedMessage: null,
    });
    updateGroupTranslatedMessage(id, null);
    this.getLocalGroupConversation();
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

  // toggleSelectModal = (status) => {
  //   this.setState({
  //     showSelectModal: status,
  //   });
  // };

  // selectUploadOption = (mediaType) => {
  //   // this.toggleSelectModal();
  //   this.onGalleryPress(mediaType);
  // };

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

  onSelectMention = (selectedMention, length) => {
    this.setState((prevState) => {
      return {
        newMessageText: `${
          length === 1
            ? prevState.newMessageText
            : prevState.newMessageText.slice(0, -length + 1)
        }${
          selectedMention.display_name
            ? selectedMention.display_name
            : selectedMention.username
        }`,
      };
    });
  };

  render() {
    const {
      newMessageText,
      showLeaveGroupConfirmationModal,
      showDeleteGroupConfirmationModal,
      showdeleteObjectConfirmationModal,
      showMessageUnsendConfirmationModal,
      orientation,
      isReply,
      repliedMessage,
      showMessageDeleteConfirmationModal,
      showMoreMessageDeleteConfirmationModal,
      translatedMessage,
      translatedMessageId,
      uploadFile,
      sendingMedia,
      isChatLoading,
      isMultiSelect,
      openDoc,
      isDeleteMeLoading,
      isDeleteEveryoneLoading,
    } = this.state;
    const {
      chatGroupConversation,
      currentGroup,
      currentGroupDetail,
      currentGroupMembers,
    } = this.props;

    let length = 0;
    let chats = [];
    if (this.props.currentGroup) {
      chats = getGroupChatConversationLengthById(
        this.props.currentGroup.group_id,
      );
      length = chats.length;
    }
    // console.log('currentGroupDetail', currentGroupDetail);
    // console.log('chatGroupConversation', chatGroupConversation);
    // console.log('currentGroupMembers', currentGroupMembers);
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
            currentGroupDetail.is_group_member === false
              ? this.state.headerRightIconMenuIsRemoveGroup
              : this.isGroupAdmin()
              ? this.state.headerRightIconMenuIsGroup
              : this.state.headerRightIconMenu
          }
          image={currentGroupDetail.group_picture}
          isPined={
            currentGroup && currentGroup.is_pined
              ? currentGroup.is_pined
              : false
          }
          chatType={
            currentGroup && currentGroup.is_pined
              ? translate('pages.xchat.unPinThisGroup')
              : translate('pages.xchat.pinThisGroup')
          }
          type={'group'}
          navigation={this.props.navigation}
          disableDetails={currentGroupDetail.is_group_member === false}
        />
        {isChatLoading && chatGroupConversation.length <= 0 ? (
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
            onDelete={(id) => {
              this.setState({
                isMultiSelect: true,
                selectedIds: [...this.state.selectedIds, id + ''],
              });
              // this.onDeleteMessagePressed(id)
            }}
            onUnSendMsg={(id) => this.onUnsendMessagePressed(id)}
            onMessageTranslate={(msg) => this.onMessageTranslate(msg)}
            onEditMessage={(msg) => this.onEdit(msg)}
            onDownloadMessage={(msg) => this.onDownload(msg)}
            onMessageTranslateClose={this.onMessageTranslateClose}
            translatedMessage={translatedMessage}
            translatedMessageId={translatedMessageId}
            onCameraPress={() => this.onCameraPress()}
            onGalleryPress={() => this.toggleGalleryModal(true)}
            onAttachmentPress={() => this.onAttachmentPress()}
            sendingImage={uploadFile}
            currentGroupDetail={currentGroupDetail}
            groupMembers={currentGroupMembers}
            useMentionsFunctionality={true}
            onSelectMention={this.onSelectMention}
            isMultiSelect={isMultiSelect}
            onSelect={this.onSelectChatConversation}
            selectedIds={this.state.selectedIds}
            onSelectedCancel={() => {
              this.setState({isMultiSelect: false, selectedIds: []});
            }}
            onSelectedDelete={this.onDeleteMultipleMessagePressed}
            showOpenLoader={(isLoading) => this.setState({openDoc: isLoading})}
            isChatDisable={currentGroupDetail.is_group_member}
            isLoadMore={chatGroupConversation.length < length}
            loading={this.loading}
            onLoadMore={(message) => {
              console.log('msg_id', message.msg_id);
              if (message && message.msg_id) {
                this.loading = true;
                this.offset = this.offset + 20;
                this.getLocalGroupConversation();
                if (length % 50 === 0 && length - this.offset <= 10) {
                  console.log('api_call');
                  this.getGroupConversation(chats[chats.length - 1].msg_id);
                }
                // this.getGroupConversation(message.msg_id);
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
          />
        )}

        <ConfirmationModal
          orientation={orientation}
          visible={showLeaveGroupConfirmationModal}
          onCancel={this.onCancelPress.bind(this)}
          onConfirm={this.onConfirmLeaveGroup.bind(this)}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.wantToLeaveText')}
          isLoading={this.state.isLeaveLoading}
        />

        <ConfirmationModal
          orientation={orientation}
          visible={showDeleteGroupConfirmationModal}
          onCancel={this.onCancelPress.bind(this)}
          onConfirm={this.onConfirmDeleteGroup.bind(this)}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.toastr.groupWillBeDeleted')}
          isLoading={this.state.isLeaveLoading}
        />

        <ConfirmationModal
          visible={showdeleteObjectConfirmationModal}
          onCancel={this.onDeleteObjectCancel}
          onConfirm={this.onDeleteGroupObject}
          orientation={orientation}
          isLoading={this.state.deleteObjectLoading}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.wantToDeleteAllChats')}
        />

        <ConfirmationModal
          visible={showMessageDeleteConfirmationModal}
          onCancel={this.onCancelPress.bind(this)}
          onConfirm={this.onConfirmMultipleMessageDelete.bind(
            this,
            'DELETE_FOR_ME',
          )}
          orientation={orientation}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.youWantToDeleteThisMessage')}
          isLoading={isDeleteMeLoading}
        />

        <ConfirmationModal
          visible={showMessageUnsendConfirmationModal}
          onCancel={this.onCancelPress.bind(this)}
          onConfirm={this.onConfirmMessageUnSend.bind(this)}
          orientation={orientation}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.toastr.messageWillBeUnsent')}
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
          onCancel={this.onCancelPress.bind(this)}
          onConfirm={this.onConfirmMultipleMessageDelete.bind(this)}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.youWantToDeleteThisMessage')}
          isDeleteMeLoading={isDeleteMeLoading}
          isDeleteEveryoneLoading={isDeleteEveryoneLoading}
        />

        {openDoc && <OpenLoader />}
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
    currentGroupMembers: state.groupReducer.currentGroupMembers,
    currentGroupAdmins: state.groupReducer.currentGroupAdmins,
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
  setCurrentGroup,
  sendGroupMessage,
  translateMessage,
  editGroupMessage,
  markGroupConversationRead,
  unSendGroupMessage,
  deleteMultipleGroupMessage,
  setGroupConversation,
  resetGroupConversation,
  setCommonChatConversation,
  getLocalUserGroups,
  updateUnreadGroupMsgsCounts,
  pinGroup,
  unpinGroup,
  deleteGroupChat,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupChats);
