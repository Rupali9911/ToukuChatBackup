import React, {Component} from 'react';
import {ImageBackground, PermissionsAndroid, Platform} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Orientation from 'react-native-orientation';
// import uuid from 'react-native-uuid';
import UUID from '../../uuid-int';
import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import RnBgTask from 'react-native-bg-thread';

import GroupChatContainer from '../../components/GroupChatContainer';
import {ChatHeader} from '../../components/Headers';
import {ListLoader, OpenLoader} from '../../components/Loaders';
import {
  ConfirmationModal,
  DeleteOptionModal,
  ShowAttahmentModal,
  ShowGalleryModal,
  UploadProgressModal,
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
  getUpdatedGroupConversation,
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
  getGroupChatConversationNextFromId,
  getGroupChatConversationPrevFromId,
  getGroupChatConversationByMsgId,
  getGroupChatConversationLatestMsgId,
  getGroupChatConversationOldestMsgId,
  setGroupChatConversation,
  setSingleGroupChatConversation,
  updateGroupStoreMsgId,
  getGroupObjectById,
  updateGroupInitialOpenStatus
} from '../../storage/Service';
import {globalStyles} from '../../styles';
import {getUserName, realmToPlainObject, eventService} from '../../utils';
import {
  setActiveTimelineTab,
  setSpecificPostId,
} from '../../redux/reducers/timelineReducer';
import { addFriendByReferralCode } from '../../redux/reducers/friendReducer';
import { getRenderMessageData, getGroupMessageObject } from './logic';

// number  0 <= id <=511
const id = 0;
const generator = UUID(id);

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
      fetchReplyMessageLaoding: false,
      mediaUploading: false,
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

  onMessageSend = async (newMessageText = '',onSendFinish,totalMedia,currentSendIndex) => {
    const {editMessageId} = this.state;
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
      if (newMessageTextWithMention.includes(`@${user_name} `)) {
        // mention = `~${groupMember.id}~`; // TODO: Cannot find variable
        newMessageTextWithMention = newMessageTextWithMention.replaceAll(
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
      if (!uploadFile.isUrl) {
        let file = uploadFile;
        let files = [file];
        const uploadedImages = await this.S3uploadService.uploadImagesOnS3Bucket(
          files,
          (e) => {
            console.log('progress_bar_percentage', e);
            this.calculateProgress(totalMedia, currentSendIndex, e.percent);
            // this.setState({uploadProgress: e.percent});
          },
        );
        msgText = uploadedImages.image[0].image;
      }else{
        msgText = uploadFile.uri;
      }
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
      timestamp: new Date().toISOString(),
      created: new Date(new Date()).toISOString(),
      reply_to: isReply
        ? {
            display_name: repliedMessage.user_by.name,
            id: repliedMessage.id,
            mentions: repliedMessage.mentions,
            message: repliedMessage.text,
            msg_type: repliedMessage.type,
            name: repliedMessage.user_by.user_name,
            sender_id: repliedMessage.user_by.id,
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
      this.sendEditMessage(msgText, editMessageId, sentMessageType, newMessageMentions);
      return;
    }
    if (isReply) {
      let groupMessage;
      if (sentMessageType !== 'text') {
        groupMessage = {
          group: this.props.currentGroup.group_id,
          local_id: generator.uuid(),
          // local_id: uuid.v4(),
          mentions: [...newMessageMentions],
          media_url: msgText,
          msg_type: sentMessageType,
          reply_to: repliedMessage.id,
        };
      } else {
        groupMessage = {
          group: this.props.currentGroup.group_id,
          local_id: generator.uuid(),
          mentions: [...newMessageMentions],
          message_body: msgText,
          msg_type: sentMessageType,
          reply_to: repliedMessage.id,
        };
      }
      // this.state.conversation.unshift(msgDataSend);
      // this.props.setGroupConversation([
      //   getGroupMessageObject(msgDataSend,this.props.userData),
      //   ...this.props.chatGroupConversation,
      // ]);
      
      let newRObject = setSingleGroupChatConversation({
        msg_id: groupMessage.local_id,
        local_id: groupMessage.local_id,
        ...msgDataSend
      });
      let Rmsg = getGroupMessageObject(newRObject,this.props.userData);
      this.props.setGroupConversation([Rmsg].concat(this.props.chatGroupConversation));
        if(onSendFinish){
          onSendFinish && onSendFinish();
        }
      this.props.sendGroupMessage(groupMessage).then((res)=>{
        if(res){}
        else{
          deleteGroupMessageById(groupMessage.local_id);
        }
      }).catch(err => {
        deleteGroupMessageById(groupMessage.local_id);
      });;
    } else {
      let groupMessage;
      if (sentMessageType !== 'text') {
        groupMessage = {
          group: this.props.currentGroup.group_id,
          local_id: generator.uuid(),
          mentions: [...newMessageMentions],
          media_url: msgText,
          msg_type: sentMessageType,
        };
      } else {
        groupMessage = {
          group: this.props.currentGroup.group_id,
          local_id: generator.uuid(),
          mentions: [...newMessageMentions],
          message_body: msgText,
          msg_type: sentMessageType,
        };
      }
      // this.state.conversation.unshift(msgDataSend);
      // this.props.setGroupConversation([
      //   getGroupMessageObject(msgDataSend,this.props.userData),
      //   ...this.props.chatGroupConversation,
      // ]);

      let newObject = setSingleGroupChatConversation({
        msg_id: groupMessage.local_id,
        local_id: groupMessage.local_id,
        ...msgDataSend
      });
      let msg = getGroupMessageObject(newObject,this.props.userData);
      this.props.setGroupConversation([msg].concat(this.props.chatGroupConversation));
        if(onSendFinish){
          onSendFinish && onSendFinish();
        }
      this.props.sendGroupMessage(groupMessage).then((res)=>{
        if(res){}
        else{
          deleteGroupMessageById(groupMessage.local_id);
        }
      }).catch(err => {
        deleteGroupMessageById(groupMessage.local_id);
      });
      console.log('creation api call');
    }
    if (uploadFile.uri) {
      this.setState(
        {
          showGalleryModal: false,
          showAttachmentModal: false,
          mediaUploading: false
        },
        () => {
          this.setState({
            uploadedFiles: [],
            sendingMedia: false,
          });
        },
      );
    }
    
    if(onSendFinish){
      onSendFinish && onSendFinish();
    }else{
      // setTimeout(()=>{
      //   this.chatContainer.scrollListToRecent();
      // },1000);
      
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

  sendEditMessage = (newMessageText, editMessageId, sentMessageType, newMessageMentions) => {
    // const {newMessageText, editMessageId,sentMessageType} = this.state;
    let data = {
      message_body: newMessageText,
    };

    if(newMessageMentions.length>0){
      data[`mentions`] = [...newMessageMentions];
    }

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

  renderMessageWitMentions = (msg = '',message) => {
    let splitNewMessageText = msg.split(' ');
    let newMessageMentions = [];
    const newMessageTextWithMention = splitNewMessageText
      .map((text) => {
        let mention = null;
        let mentions = message.mentions;
        mentions &&
          mentions.forEach((groupMember) => {
            // console.log('groupMember',groupMember);
            if (text.includes(`~${groupMember.id}~`)) {
              mention = `@${
                getUserName(groupMember.id) ||
                groupMember.desplay_name ||
                groupMember.username
                }`;
              mention = text.replace(`~${groupMember.id}~`, mention);
              newMessageMentions = [...newMessageMentions, groupMember.id];
            }
          });
        if (mention) {
          return mention;
        } else {
          return text;
        }
      })
      .join(' ');

    return newMessageTextWithMention;
  };

  onEdit = (message) => {
    this.setState({
      newMessageText: message.text,
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

  onReply = (messageId) => {
    // const { conversation } = this.state;
    const {chatGroupConversation} = this.props;

    const repliedMessage = chatGroupConversation.find(
      (item) => item.id === messageId,
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

      let msg_id = null;
      if(this.props.navigation.state.params && this.props.navigation.state.params.msg_id){
        msg_id = this.props.navigation.state.params.msg_id;
      }
      // msg_id = 22609;

      if(!this.props.currentGroup.is_mentioned && !this.props.currentGroup.unread_msg_id){
        let latest_msg_id = getGroupChatConversationLatestMsgId(this.props.currentGroup.group_id);
        // console.log('latest_msg',latest_msg);
        msg_id = latest_msg_id || msg_id;
      }

      this.getGroupConversationInitial(msg_id);

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

  onNewMessageInGroup = (message) => {
    if(message.text.data.message_details.group_id == this.props.currentGroup.group_id){
      if (
        this.props.chatGroupConversation.length > 0 &&
        this.props.chatGroupConversation[0].msg_id === message.text.data.message_details.local_id
      ) {

      } else if (
        this.props.chatGroupConversation.length > 0 &&
        this.props.chatGroupConversation[0].msg_id === message.text.data.message_details.msg_id
      ) {

      } else {
        let msg = getGroupMessageObject(message.text.data.message_details, this.props.userData);
        // this.props.setGroupConversation([msg].concat(this.props.chatGroupConversation));
      }
    }
  }

  fetchMessagesinBackground = (next, previous, group_id) => {
    if(next){
      let latest_msg_id = getGroupChatConversationLatestMsgId(group_id);
      this.fetchNext(latest_msg_id, group_id);
    }
    if(previous){
      let oldest_msg_id = getGroupChatConversationOldestMsgId(group_id);
      this.fetchPrevious(oldest_msg_id, group_id);
    }
  }

  fetchPrevious = (msg_id, group_id) => {
    console.log('bg_thread_previous_msg_id',msg_id);
    this.props
      .getUpdatedGroupConversation(group_id,msg_id,false,true)
      .then((res) => {
        console.log('loop',res.status,res.previous,this.props.currentRouteName, group_id, this.props.currentGroup.group_id);
        if (res.status && res.previous && this.props.currentRouteName === 'GroupChats' && group_id == this.props.currentGroup.group_id) {
          let oldest_msg_id = getGroupChatConversationOldestMsgId(this.props.currentGroup.group_id);
          this.fetchPrevious(oldest_msg_id, group_id);
        }
      })
      .catch((err) => {
        console.log('GroupChats -> getGroupConversation -> err', err);
      });
  }

  fetchNext = (msg_id, group_id) => {
    console.log('bg_thread_next_msg_id',msg_id);
    this.props
      .getUpdatedGroupConversation(group_id,msg_id,true,false)
      .then((res) => {
        console.log('bg_thread_next_res',res.status, res.next, this.props.currentRouteName,group_id,this.props.currentGroup.group_id);
        if (res.status && res.next && this.props.currentRouteName === 'GroupChats' && group_id == this.props.currentGroup.group_id) {
          let latest_msg_id = getGroupChatConversationLatestMsgId(group_id);
          this.fetchNext(latest_msg_id, group_id);
        }
      })
      .catch((err) => {
        console.log('GroupChats -> getGroupConversation -> err', err);
      });
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

  getLocalGroupConversation = (msg_id) => {
    return new Promise((resolve) => {
      let chat = getGroupChatConversationById(
        this.props.currentGroup.group_id,
        this.offset,
        msg_id
      );
      if (chat && chat.length>0) {
        let conversations = [];
        conversations = realmToPlainObject(chat);
        let renderMessages = getRenderMessageData(conversations, this.props.userData);
        resolve(renderMessages);
      }else{
        resolve([]);
      }
    });
  };

  getLocalPreviousConversation = (msg_id) => {
    return new Promise((resolve)=>{
      let next_messages = getGroupChatConversationPrevFromId(this.props.currentGroup.group_id, msg_id);
      if (next_messages && next_messages.length > 0) {
        let conversations = [];
        conversations = realmToPlainObject(next_messages).slice(0, 30);
        // setTimeout(()=>{
          resolve(conversations);
        // },500);
      }else {
        resolve([]);
      }
    });
  }

  getLocalNextConversation = (msg_id,length = 10, isInclusive = false) => {
    return new Promise((resolve,reject)=>{
      let next_messages = getGroupChatConversationNextFromId(this.props.currentGroup.group_id, msg_id, isInclusive);
      if (next_messages && next_messages.length > 0) {
        let conversations = [];
        conversations = realmToPlainObject(next_messages).slice(Math.max(0,next_messages.length - length), next_messages.length);
        resolve(conversations);
      } else {
        resolve([]);
      }
    });
  }

  getGroupConversation = (id, next, prev, isReply, returnAll) => {
    isReply && this.setState({fetchReplyMessageLaoding: true});
    let msg_id = id || this.props.currentGroup.last_msg_id;
    return new Promise((resolve,reject)=>{
      this.props
      .getUpdatedGroupConversation(this.props.currentGroup.group_id, msg_id, isReply?false:next, prev)
      .then((res) => {
        if (res.status && res.data.length > 0) {
          let conversations = [];
          if(next){
            let chat = getGroupChatConversationNextFromId(
              this.props.currentGroup.group_id,
              msg_id,
              isReply
            );
            if(isReply){
              let result = realmToPlainObject(chat);
              conversations = result.slice(Math.max(0,result.length-20),result.length);
            }else{
              conversations = realmToPlainObject(chat);
            }
          }else if(prev){
            let chat = getGroupChatConversationPrevFromId(
              this.props.currentGroup.group_id,
              msg_id
            );
            conversations = realmToPlainObject(chat);
          } else {
            let chat = getGroupChatConversationById(
              this.props.currentGroup.group_id,
              returnAll?res.data.length:this.offset,
              msg_id
            );
            conversations = realmToPlainObject(chat);
          }
          // this.setState({ conversation: conversations });
          // this.props.setGroupConversation(conversations);
          !msg_id && this.markGroupConversationRead();
          console.log('api response');
          let renderMessages = getRenderMessageData(conversations,this.props.userData);
          resolve(renderMessages);
          // if (res.data.length < 50) {
          //   this.setState({isLoadMore: false});
          // }
        } else {
          this.setState({isLoadMore: false});
          resolve([]);
        }
      })
      .catch((err) => {
        console.log('GroupChats -> getGroupConversation -> err', err);
        resolve([]);
      });
    })
  };

  getGroupConversationInitial = async (msg_id) => {
    this.setState({isChatLoading: true});
    console.log('msg_id', msg_id);
    let chat = getGroupChatConversationById(
      this.props.currentGroup.group_id,
      this.offset,
      msg_id
    );
    if (chat && chat.length>0 && !this.props.currentGroup.is_mentioned) {
      let conversations = [];
      conversations = realmToPlainObject(chat);
      
      const render_messages = getRenderMessageData(conversations,this.props.userData);
      // console.log('render_messages',render_messages);

      // this.props.setGroupConversation(conversations);
      this.props.setGroupConversation(render_messages);
      // this.setState({isChatLoading: false});
    }

    // if(chat && chat.length>20 && chat[0].msg_id == msg_id){
    //   RnBgTask.runInBackground_withPriority("MIN", () => {
    //     this.fetchMessagesinBackground(true, true);
    //   });
    //   return;
    // }

    await this.props
      .getUpdatedGroupConversation(this.props.currentGroup.group_id,msg_id,false,false)
      .then((res) => {
        // console.log('res', res);
        if (res.status) {
          
          if (this.props.chatGroupConversation && this.props.chatGroupConversation.length <= 20) {
            let groupChat = getGroupChatConversationById(
              this.props.currentGroup.group_id,
              this.offset,
              msg_id
            );
            let conversations = [];

            conversations = realmToPlainObject(groupChat);

            const render_messages = getRenderMessageData(conversations, this.props.userData);
            // this.props.setGroupConversation(conversations);
            this.props.setGroupConversation(render_messages);
          }
          this.setState({isChatLoading: false});
          this.markGroupConversationRead();

          RnBgTask.runInBackground_withPriority("MIN", () => {
            this.fetchMessagesinBackground(res.next, res.previous, this.props.currentGroup.group_id);
          });

          updateGroupInitialOpenStatus(this.props.currentGroup.group_id, true);

          this.getLocalNextConversation(msg_id,5).then((result)=>{
            if(result && result.length>0){
              const render_messages = getRenderMessageData(result,this.props.userData);
              setTimeout(()=>{
                this.props.setGroupConversation(render_messages.concat(this.props.chatGroupConversation));
              },500);
            }
          });

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

  handleMessage = (message) => {
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
        .then(async (res) => {
          this.setState({
            isDeleteEveryoneLoading: false,
            isDeleteMeLoading: false,
            showMessageDeleteConfirmationModal: false,
            showMoreMessageDeleteConfirmationModal: false,
          });
          if (res && res.status) {
          } else {
            let result = await this.getGroupConversation();
            this.props.setGroupConversation(result);
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

  onMessageTranslate = (index, message) => {
    const payload = {
      text: message.text,
      language: this.props.selectedLanguageItem.language_name,
    };
    console.log('payload', payload);
    this.props.translateMessage(payload).then((res) => {
      console.log('res', res);
      if (res.status === true) {
        updateGroupTranslatedMessage(message.id, res.data);
        // message.translated = res.data;
        let updateMessage = Object.assign({},message,{translated: res.data});
        let array = this.props.chatGroupConversation;
        array.splice(index,1,updateMessage);
        this.props.setGroupConversation(array);
        // this.getLocalGroupConversation();
      }
    });
  };

  onMessageTranslateClose = (index, message) => {
    updateGroupTranslatedMessage(message.id, null);
    // let message = this.props.chatGroupConversation[index];
    let updateMessage = Object.assign({},message,{translated: null});
    let array = this.props.chatGroupConversation;
    array.splice(index, 1, updateMessage);
    this.props.setGroupConversation(array);
    // this.getLocalGroupConversation();
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
      console.log('Images', images)
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

  onMediaSend = async (media) => {
    if (this.isUploading) {
      return;
    }
    this.isUploading = true;
    let index = 0;
    this.setState({mediaUploading: true});
    for (const file of media) {
      let fileType = file.type;
      if (fileType.includes('image')) {
        let source = {
          uri: file.image.uri,
          type: file.type,
          name: file.image.filename,
        };
        await this.setState(
          {
            uploadFile: source,
            sentMessageType: 'image',
            sendingMedia: true,
          },
          async () => {
            await this.onMessageSend('',null,media.length,index);
          },
        );
      } else {
        let source = {
          uri: file.image.uri,
          type: file.type,
          name: file.image.filename,
        };
        await this.setState(
          {
            uploadFile: source,
            sentMessageType: 'video',
            sendingMedia: true,
          },
          () => {
            this.onMessageSend('',null,media.length,index);
          },
        );
      }
      index++;
    }
    // this.setState({uploadedFiles: []});
    this.isUploading = false;
  }

  sendEmotion = async (model) => {
    const source = {
      uri: model.url,
      type: model.type,
      name: model.name,
      isUrl: true,
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
  };

  calculateProgress = (totalItem,currentIndex,progress) => {
    let result = 0;
    let eachTotalPercent = 1/totalItem;
    result = (currentIndex + progress) * eachTotalPercent;
    console.log('params',totalItem,currentIndex,progress);
    this.setState({uploadProgress: parseFloat(result.toFixed(2))});
  }

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

  onLoadMoreMessages = async () => {
    const {chatGroupConversation} = this.props;
    let message = chatGroupConversation[0];
    if (message && message.id && !this.loading) {
      console.log('next_msg_id', message.id,this.props.next);
      this.loading = true;
      // this.offset = this.offset + 20;
      let next_messages = await this.getLocalNextConversation(message.id);
      if (next_messages.length > 0) {
        console.log('next_messages', next_messages.length);
        const render_messages = getRenderMessageData(next_messages,this.props.userData);
        this.props.setGroupConversation(render_messages.concat(chatGroupConversation));
      } else if (this.props.next) {
        console.log('next api call', this.props.next, message.id);
        let result = await this.getGroupConversation(message.id, true, false);
        this.props.setGroupConversation(result.concat(chatGroupConversation));
      }
      this.loading = false;
    }
  }

  onLoadPreviousMessages = (currentOffset) => new Promise(async (resolve, reject)=>{
    const {chatGroupConversation} = this.props;
    console.log('this.loading',this.loading,currentOffset);
    let message = chatGroupConversation[chatGroupConversation.length-1];
    let groupObject = getGroupObjectById(this.props.currentGroup.group_id);
    if (message && message.id && !this.loading) {
      console.log('previous_msg_id', message.id,this.props.previous);
      this.loading = true;
      // this.offset = this.offset + 20;
      let next_messages = await this.getLocalPreviousConversation(message.id);
      if (next_messages.length>0 && !groupObject.store_msg_id) {
        const render_messages = getRenderMessageData(next_messages,this.props.userData);
        this.props.setGroupConversation(chatGroupConversation.concat(render_messages));
      } else if(this.props.previous){
        if(groupObject.store_msg_id){
          let result = await this.getGroupConversation(groupObject.store_msg_id,false,true);
          if(result.length>0 && result[result.length-1].id <= groupObject.latest_sequence_msg_id){
            updateGroupStoreMsgId(null, null);
          }else{
            updateGroupStoreMsgId(result[result.length-1].id, groupObject.latest_sequence_msg_id);
          }
          this.props.setGroupConversation(chatGroupConversation.concat(result));
        }else{
          console.log('previous api call',this.props.previous,message.id);
          let result = await this.getGroupConversation(message.id,false,true);
          this.props.setGroupConversation(chatGroupConversation.concat(result));
        }
      }
      this.loading = false;
    }
    console.log('resolve');
    setTimeout(()=>{
      resolve();
    },500);
  });

  loadMessagesOnReplyPress = async (id, onFinish) => {
    const {chatGroupConversation} = this.props;
    console.log('calling onReplyPress',id);
    let hasMessages = getGroupChatConversationByMsgId(this.props.currentGroup.group_id, id);
    console.log('hasMessages',hasMessages);
    if (hasMessages) {
      let next_messages = await this.getLocalNextConversation(id,20,true);
      const render_messages = getRenderMessageData(next_messages,this.props.userData);
      this.props.setGroupConversation(render_messages);
      onFinish && onFinish(render_messages);
    } else {
      console.log('next api call', this.props.next, id);
      let result = await this.getGroupConversation(id, true, false, true);
      this.props.setGroupConversation(result);
      this.setState({fetchReplyMessageLaoding: false});
      onFinish && onFinish(result);
    }
  }

  onMediaPlay = (isPlay) => {
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
  }

  showOpenLoader = (isLoading) => this.setState({openDoc: isLoading});

  onSelectedCancel = () => {
    this.setState({isMultiSelect: false, selectedIds: []});
  }

  onDelete = (id) => {
    this.setState({
      isMultiSelect: true,
      selectedIds: [...this.state.selectedIds, id + ''],
    });
    // this.onDeleteMessagePressed(id)
  }

  scrollToLatestMsg = () => {
    return new Promise(async (resolve,reject)=>{
      const {chatGroupConversation} = this.props;
      if(chatGroupConversation.length > 0){
        if(chatGroupConversation[0].id == this.props.currentGroup.last_msg_id){
          resolve();
        }else {
          let latest_msg_id = getGroupChatConversationLatestMsgId(this.props.currentGroup.group_id);
          let next_messages = getGroupChatConversationPrevFromId(this.props.currentGroup.group_id, latest_msg_id, true).slice(0, 30);
          console.log('next_messages_length',next_messages.length,next_messages[0].msg_id);
          if (next_messages && next_messages.length > 0 && next_messages[0].msg_id >= this.props.currentGroup.last_msg_id) {
            let conversations = [];
            conversations = getRenderMessageData(realmToPlainObject(next_messages),this.props.userData);
            this.props.setGroupConversation(conversations);
            resolve();
          }else if(this.props.next){
            let result = await this.getGroupConversation(this.props.currentGroup.last_msg_id,false,false,false,true);
            if(result.length>0){
              updateGroupStoreMsgId(this.props.currentGroup.group_id,result[result.length - 1].id,chatGroupConversation[0].id);
            }
            this.props.setGroupConversation(result);
            resolve();
          }else {
            resolve();
          }
        }
      }
    });
  }
 
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
      fetchReplyMessageLaoding,
      uploadProgress,
      mediaUploading
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
    console.log('chatGroupConversation', chatGroupConversation.length, uploadProgress);
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
            ref={(view) => {
              this.chatContainer = view;
            }}
            memberCount={currentGroupDetail.total_members}
            handleMessage={this.handleMessage}
            onMessageSend={this.onMessageSend}
            // onMediaSend={this.onMediaSend}
            sendEmotion={this.sendEmotion}
            onMessageReply={this.onReply}
            newMessageText={newMessageText}
            messages={chatGroupConversation}
            orientation={orientation}
            repliedMessage={repliedMessage}
            isReply={isReply}
            cancelReply={this.cancelReply.bind(this)}
            onDelete={this.onDelete}
            onUnSendMsg={this.onUnsendMessagePressed}
            onMessageTranslate={this.onMessageTranslate}
            onEditMessage={this.onEdit}
            onDownloadMessage={this.onDownload}
            onMessageTranslateClose={this.onMessageTranslateClose}
            translatedMessage={translatedMessage}
            translatedMessageId={translatedMessageId}
            onCameraPress={this.onCameraPress}
            onGalleryPress={() => this.toggleGalleryModal(true)}
            onAttachmentPress={this.onAttachmentPress}
            sendingImage={uploadFile}
            currentGroupDetail={currentGroupDetail}
            groupMembers={currentGroupMembers}
            useMentionsFunctionality={true}
            onSelectMention={this.onSelectMention}
            isMultiSelect={isMultiSelect}
            onSelect={this.onSelectChatConversation}
            selectedIds={this.state.selectedIds}
            onSelectedCancel={this.onSelectedCancel}
            onSelectedDelete={this.onDeleteMultipleMessagePressed}
            showOpenLoader={this.showOpenLoader}
            isChatDisable={currentGroupDetail.is_group_member}
            isLoadMore={chatGroupConversation.length < length}
            loading={this.loading}
            onLoadMore={this.onLoadMoreMessages}
            onLoadPrevious={this.onLoadPreviousMessages}
            onReplyPress={this.loadMessagesOnReplyPress}
            onMediaPlay={this.onMediaPlay}
            onScrollToLatestClick={this.scrollToLatestMsg}
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
        {fetchReplyMessageLaoding && <OpenLoader hideText={true}/>}

        <UploadProgressModal 
            visible={mediaUploading}
            progress={uploadProgress}
            title={translate('common.uploadImage')}/>

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
    next: state.groupReducer.next,
    previous: state.groupReducer.previous,
    currentRouteName: state.userReducer.currentRouteName,
  };
};

const mapDispatchToProps = {
  getGroupConversation,
  getUpdatedGroupConversation,
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
  addFriendByReferralCode,
  setSpecificPostId,
  setActiveTimelineTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupChats);
