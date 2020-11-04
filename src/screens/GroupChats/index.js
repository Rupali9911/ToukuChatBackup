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
import {
  Colors,
  Fonts,
  Images,
  Icons,
  SocketEvents,
  appleStoreUserId,
} from '../../constants';
import GroupChatContainer from '../../components/GroupChatContainer';
import {
  ConfirmationModal,
  UploadSelectModal,
  ShowAttahmentModal,
  ShowGalleryModal,
} from '../../components/Modals';
import {
  translate,
  translateMessage,
} from '../../redux/reducers/languageReducer';
import {setCommonChatConversation} from '../../redux/reducers/commonReducer';
import {
  getGroupConversation,
  getUserGroups,
  getGroupDetail,
  getGroupMembers,
  getLocalUserGroups,
  updateUnreadGroupMsgsCounts,
  setCurrentGroupDetail,
  setCurrentGroupMembers,
  setCurrentGroup,
  deleteGroup,
  sendGroupMessage,
  leaveGroup,
  editGroupMessage,
  markGroupConversationRead,
  unSendGroupMessage,
  setGroupConversation,
  resetGroupConversation,
  getGroupConversationRequest,
} from '../../redux/reducers/groupReducer';
import Toast from '../../components/Toast';
import {ListLoader, UploadLoader} from '../../components/Loaders';
import {eventService} from '../../utils';
import S3uploadService from '../../helpers/S3uploadService';
import SingleSocket from '../../helpers/SingleSocket';

import {
  setGroupChatConversation,
  getGroupChatConversationById,
  deleteGroupMessageById,
  updateGroupMessageById,
  setGroupMessageUnsend,
  updateUnReadCount,
  deleteGroupById,
  deleteAllGroupMessageByGroupId,
  updateLastMsgGroupsWithoutCount,
  setGroupLastMessageUnsend,
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
      uploadedFiles: [],
      showAttachmentModal: false,
      showGalleryModal: false,
      sendingMedia: false,
      isLeaveLoading: false,
      uploadFile: {uri: null, type: null, name: null},
      uploadProgress: 0,
      isChatLoading: false,
      headerRightIconMenu:
        this.props.userData.id === appleStoreUserId
          ? [
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
            ]
          : [
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
            ],
      isReply: false,
      repliedMessage: null,
      isEdited: false,
      editMessageId: null,
    };
    this.S3uploadService = new S3uploadService();
    this.props.resetGroupConversation();
    this.isUploading = false;
  }

  onMessageSend = async () => {
    const {newMessageText, editMessageId, conversation} = this.state;
    const {userData, currentGroup, currentGroupMembers} = this.props;
    let splitNewMessageText = newMessageText.split(' ');
    let newMessageMentions = [];
    const newMessageTextWithMention = splitNewMessageText
      .map((text) => {
        let mention = null;
        currentGroupMembers.forEach((groupMember) => {
          if (text === `@${groupMember.display_name}`) {
            mention = `~${groupMember.id}~`;
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
      let file = uploadFile.uri;
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
        uploadFile.name,
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
        uploadFile.name,
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
      mentions: [...newMessageMentions],
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
      console.log('GroupChats -> msgDataSend', msgDataSend);
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

      console.log('GroupChats -> msgDataSend', msgDataSend);
      console.log('GroupChats -> groupMessage', groupMessage);
      // this.state.conversation.unshift(msgDataSend);
      this.props.setGroupConversation([
        msgDataSend,
        ...this.props.chatGroupConversation,
      ]);
      this.props.sendGroupMessage(groupMessage);
    }
    if (uploadFile.uri) {
      this.setState({
        sendingMedia: false,
      });
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
      if (this.props.currentGroup.last_msg_id == editMessageId) {
        updateLastMsgGroupsWithoutCount(
          this.props.currentGroup.group_id,
          sentMessageType,
          newMessageText,
          this.props.currentGroup.last_msg_id,
          this.props.currentGroup.timestamp,
        );
        this.props.getLocalUserGroups().then((res) => {
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
        let i = {
          msg_id: item.msg_id,
          sender_id: item.sender_id,
          group_id: item.group_id,
          sender_username: item.sender_username,
          sender_display_name: item.sender_display_name,
          sender_picture: item.sender_picture,
          message_body: item.message_body,
          is_edited: item.is_edited,
          is_unsent: item.is_unsent,
          timestamp: item.timestamp,
          reply_to: item.reply_to,
          mentions: item.mentions,
          read_count: item.read_count,
          created: item.created,
        };
        conversations = [...conversations, i];
      });
      this.props.setGroupConversation(conversations);
    }
  };

  getGroupConversation = async () => {
    await this.props
      .getGroupConversation(this.props.currentGroup.group_id)
      .then((res) => {
        if (res.status) {
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
          );
          let conversations = [];
          chat.map((item, index) => {
            let i = {
              msg_id: item.msg_id,
              sender_id: item.sender_id,
              group_id: item.group_id,
              sender_username: item.sender_username,
              sender_display_name: item.sender_display_name,
              sender_picture: item.sender_picture,
              message_body: item.message_body,
              is_edited: item.is_edited,
              is_unsent: item.is_unsent,
              timestamp: item.timestamp,
              reply_to: item.reply_to,
              mentions: item.mentions,
              read_count: item.read_count,
              created: item.created,
            };
            conversations = [...conversations, i];
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
    this.setState({isChatLoading: true});
    let chat = getGroupChatConversationById(this.props.currentGroup.group_id);
    if (chat.length) {
      let conversations = [];
      chat.map((item, index) => {
        let i = {
          msg_id: item.msg_id,
          sender_id: item.sender_id,
          group_id: item.group_id,
          sender_username: item.sender_username,
          sender_display_name: item.sender_display_name,
          sender_picture: item.sender_picture,
          message_body: item.message_body,
          is_edited: item.is_edited,
          is_unsent: item.is_unsent,
          timestamp: item.timestamp,
          reply_to: item.reply_to,
          mentions: item.mentions,
          read_count: item.read_count,
          created: item.created,
        };
        conversations = [...conversations, i];
      });

      // this.setState({ conversation: conversations });
      this.props.setGroupConversation(conversations);
      this.setState({isChatLoading: false});
    }

    await this.props
      .getGroupConversation(this.props.currentGroup.group_id)
      .then((res) => {
        if (res.status) {
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
          );
          let conversations = [];
          chat.map((item, index) => {
            let i = {
              msg_id: item.msg_id,
              sender_id: item.sender_id,
              group_id: item.group_id,
              sender_username: item.sender_username,
              sender_display_name: item.sender_display_name,
              sender_picture: item.sender_picture,
              message_body: item.message_body,
              is_edited: item.is_edited,
              is_unsent: item.is_unsent,
              timestamp: item.timestamp,
              reply_to: item.reply_to,
              mentions: item.mentions,
              read_count: item.read_count,
              created: item.created,
            };
            conversations = [...conversations, i];
          });

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
        this.props.setCurrentGroupMembers(res);
      })
      .catch((err) => {
        console.log('GroupChats -> getGroupMembers -> err', err);
      });
  }

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
    this.setState({isLeaveLoading: true});
    this.props
      .leaveGroup(payload)
      .then((res) => {
        if (res.status === true) {
          Toast.show({
            title: 'Touku',
            text: translate(res.message),
            type: 'positive',
          });
          this.deleteLocalGroup(this.props.currentGroup.group_id);
          this.props.getUserGroups();
          this.props.navigation.goBack();
        }
        this.setState({isLeaveLoading: false});
        this.toggleLeaveGroupConfirmationModal();
      })
      .catch((err) => {
        Toast.show({
          title: 'Touku',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
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
          this.deleteLocalGroup(this.props.currentGroup.group_id);
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
          this.getLocalGroupConversation();

          if (
            this.props.currentGroup.last_msg_id == this.state.selectedMessageId
          ) {
            let chat = getGroupChatConversationById(
              this.props.currentGroup.group_id,
            );

            let array = chat.toJSON();

            if (array && array.length > 0) {
              updateLastMsgGroupsWithoutCount(
                this.props.currentGroup.group_id,
                array[0].message_body.type,
                array[0].message_body.text,
                array[0].msg_id,
                array[0].timestamp,
              );
              this.props.getLocalUserGroups().then((res) => {
                this.props.setCommonChatConversation();
              });
            }
          }
          // this.getGroupConversation();
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
            this.props.currentGroup.last_msg_id == this.state.selectedMessageId
          ) {
            setGroupLastMessageUnsend(this.props.currentGroup.group_id);
            this.props.getLocalUserGroups().then((res) => {
              this.props.setCommonChatConversation();
            });
          }
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
    this.toggleGalleryModal(false);

    for (const file of this.state.uploadedFiles) {
      let fileType = file.mime;
      if (fileType.includes('image')) {
        let source = {
          uri: 'data:image/jpeg;base64,' + file.data,
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
    this.setState({uploadedFiles: []});
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
    this.toggleAttachmentModal(false);
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
    this.setState({uploadedFiles: []});
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
        }${selectedMention.display_name}`,
      };
    });
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
      isChatLoading,
    } = this.state;
    const {
      chatGroupConversation,
      currentGroup,
      currentGroupDetail,
      groupLoading,
      currentGroupMembers,
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
            onDelete={(id) => this.onDeleteMessagePressed(id)}
            onUnSendMsg={(id) => this.onUnsendMessagePressed(id)}
            onMessageTranslate={(msg) => this.onMessageTranslate(msg)}
            onEditMessage={(msg) => this.onEdit(msg)}
            onDownloadMessage={(msg) => this.onDownload(msg)}
            onMessageTranslateClose={this.onMessageTranslateClose}
            translatedMessage={translatedMessage}
            translatedMessageId={translatedMessageId}
            onCameraPress={() => this.onCameraPress()}
            onGalleryPress={() => this.onGalleryPress()}
            onAttachmentPress={() => this.onAttachmentPress()}
            sendingImage={uploadFile}
            currentGroupDetail={currentGroupDetail}
            groupMembers={currentGroupMembers}
            useMentionsFunctionality={true}
            onSelectMention={this.onSelectMention}
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
          isLoading={this.isUploading}
          removeUploadData={(index) => this.removeUploadData(index)}
          onGalleryPress={() => this.onGalleryPress()}
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
          isLoading={this.isUploading}
          removeUploadData={(index) => this.removeUploadData(index)}
          onAttachmentPress={() => this.onAttachmentPress()}
        />
        {sendingMedia && <UploadLoader/>}
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
  setGroupConversation,
  resetGroupConversation,
  setCommonChatConversation,
  getLocalUserGroups,
  updateUnreadGroupMsgsCounts,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupChats);
