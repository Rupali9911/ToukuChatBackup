import moment from 'moment';
import React, {Component} from 'react';
import {ImageBackground, PermissionsAndroid, Platform} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Orientation from 'react-native-orientation';
// let uuid = require('react-native-uuid')
import uuid from 'react-native-uuid';
import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import RnBgTask from 'react-native-bg-thread';
import ChatContainer from '../../components/ChatContainer';
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
import {
  sendFriendRequest,
  setAcceptedRequest,
} from '../../redux/reducers/addFriendReducer';
import {setCommonChatConversation} from '../../redux/reducers/commonReducer';
import {
  addNewSendMessage,
  deleteFriendObject,
  deleteMultiplePersonalMessage,
  deletePersonalMessage,
  editPersonalMessage,
  getPersonalConversation,
  getUserFriends,
  markFriendMsgsRead,
  pinFriend,
  resetFriendConversation,
  sendPersonalMessage,
  setCurrentFriend,
  setFriendConversation,
  setUserFriends,
  unFriendUser,
  unpinFriend,
  unSendPersonalMessage,
  updateUnreadFriendMsgsCounts,
} from '../../redux/reducers/friendReducer';
import {
  translate,
  translateMessage,
} from '../../redux/reducers/languageReducer';
import {
  deleteFriendMessageById,
  getFriendChatConversationById,
  getFriendChatConversationByMsgId,
  getFriendChatPreviousConversationFromMsgId,
  getFriendChatConversationOldestMsgId,
  removeUserFriends,
  setFriendMessageUnsend,
  updateAllFriendMessageRead,
  updateFriendLastMsgWithoutCount,
  updateFriendMessageById,
  updateFriendsUnReadCount,
  updateFriendTranslatedMessage,
  realm,
} from '../../storage/Service';
import {globalStyles} from '../../styles';
import {realmToPlainObject} from '../../utils';
import { isEqual } from 'lodash';

class FriendChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      newMessageText: '',
      conversations: [],
      chatFriendConversation: [],
      selectedMessageId: null,
      translatedMessage: null,
      translatedMessageId: null,
      showConfirmationModal: false,
      showMessageDeleteConfirmationModal: false,
      showMoreMessageDeleteConfirmationModal: false,
      showMessageUnSendConfirmationModal: false,
      showdeleteObjectConfirmationModal: false,
      deleteObjectLoading: false,
      sentMessageType: 'text',
      sendingMedia: false,
      showSelectModal: false,
      callingApi: false,
      uploadedFiles: [],
      showAttachmentModal: false,
      showGalleryModal: false,
      uploadFile: {uri: null, type: null, name: null},
      uploadProgress: 0,
      isChatLoading: false,
      isMultiSelect: false,
      isDeleteMeLoading: false,
      isDeleteEveryoneLoading: false,
      selectedIds: [],
      openDoc: false,
      isLoadMore: false,
      headerRightIconMenu:
        this.props.userData.id === appleStoreUserId
          ? [
              {
                id: 1,
                title: translate('pages.xchat.createGroup'),
                icon: 'users',
                onPress: () => {
                  this.props.navigation.navigate('CreateFriendGroup');
                },
              },
              {
                id: 2,
                title: translate('pages.xchat.reportUser'),
                icon: 'user-times',
                onPress: () => {
                  Toast.show({
                    title: 'TOUKU',
                    text: translate('pages.xchat.userReported'),
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
                    title: 'TOUKU',
                    text: translate('pages.xchat.userBlocked'),
                    type: 'positive',
                  });
                },
              },
              {
                id: 4,
                title: translate('pages.xchat.blockUser'),
                icon: 'sticky-note',
                onPress: () => {
                  this.props.navigation.navigate('FriendNotes', {
                    showAdd: true,
                  });
                },
              },
              {
                id: 5,
                pinUnpinItem: true,
                onPress: () => {
                  this.onPinUnpinFriend();
                },
              },
              {
                id: 6,
                title: translate('pages.changeDisplayName'),
                icon: Icons.print,
                onPress: () => {
                  this.props.navigation.navigate('FriendNotes');
                },
              },
              {
                id: 7,
                title: translate('pages.xchat.unfriend'),
                icon: 'user-times',
                onPress: () => {
                  this.toggleConfirmationModal();
                },
              },
            ]
          : [
              {
                id: 1,
                title: translate('pages.xchat.createGroup'),
                icon: 'users',
                onPress: () => {
                  this.props.navigation.navigate('CreateFriendGroup');
                },
              },
              {
                id: 2,
                title: translate('pages.xchat.addNote'),
                icon: 'sticky-note',
                onPress: () => {
                  this.props.navigation.navigate('FriendNotes', {
                    showAdd: true,
                  });
                },
              },
              {
                id: 3,
                pinUnpinItem: true,
                onPress: () => {
                  this.onPinUnpinFriend();
                },
              },
              {
                id: 4,
                title: translate('pages.changeDisplayName'),
                icon: Icons.icon_print,
                onPress: () => {
                  this.props.navigation.navigate('FriendNotes');
                },
              },
              {
                id: 5,
                title: translate('pages.xchat.unfriend'),
                icon: 'user-times',
                onPress: () => {
                  this.toggleConfirmationModal();
                },
              },
            ],
      unfriendMenus: [
        {
          id: 1,
          title: translate('pages.xchat.addFriend'),
          icon: 'user-plus',
          onPress: () => {
            this.onAddFriend();
          },
        },
        {
          id: 2,
          title: translate('pages.xchat.deleteChats'),
          icon: 'times-circle',
          onPress: () => {
            this.toggleDeleteObjectConfirmationModal();
          },
        },
        {
          id: 3,
          pinUnpinItem: true,
          onPress: () => {
            this.onPinUnpinFriend();
          },
        },
      ],
      isReply: false,
      repliedMessage: null,
      isEdited: false,
      editMessageId: null,
    };
    this.S3uploadService = new S3uploadService();
    this.props.resetFriendConversation();
    this.isUploading = false;
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

    // this.events = eventService.getMessage().subscribe((message) => {
    //   this.checkEventTypes(message);
    // });
  }

  componentWillUnmount() {
    // this.events.unsubscribe();
    console.log('component unmount')
    // this.resultList && this.resultList.removeAllListeners();
    this.resultList && this.resultList.removeListener(this.handleDbChanges);
    // this.resultList = null;
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this.getPersonalConversationInitial();

    // this.resultList = realm.objects('chat_conversation_friend')
    // .sorted('created', {ascending: true})
    // .filtered(`friend == ${this.props.currentFriend.friend}`);
    // if(this.resultList){
    //   this.resultList.addListener(this.handleDbChanges);
    // }
    // this.setState({chatFriendConversation: this.resultList.toJSON()});
    // this.markFriendMsgsRead();
    if (this.props.currentFriend.unread_msg > 0) {
      this.updateUnReadFriendChatCount();
    }
    // alert(JSON.stringify(this.props.userData));
  }

  handleDbChanges = (list, changes)=>{
    changes.deletions.forEach((index) => {
      // You cannot directly access deleted objects,
      // but you can update a UI list, etc. based on the index.
      console.log(`Looks like #${index} has left the realm.`);
      this.props.setFriendConversation(list.toJSON());
    });
    // Handle newly added message objects
    changes.insertions.forEach((index) => {
      const insertedMessage = list[index];
      console.log(`new friend msg!`,index);
      this.props.setFriendConversation(list.toJSON());
      // this.setState({chatFriendConversation: list.toJSON()});
    });
    // Handle message objects that were modified
    changes.modifications.forEach((index) => {
      const modifiedMessage = list[index];
      console.log(`Hey ${modifiedMessage.id}, you look different!`);
      // this.props.chatFriendConversation.splice(index,1,modifiedMessage);
      this.props.setFriendConversation(list.toJSON());
    });
  }

  onPinUnpinFriend = () => {
    const {currentFriend} = this.props;
    const data = {};
    if (currentFriend.is_pined) {
      this.props
        .unpinFriend(currentFriend.friend, currentFriend.user_id, data)
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
        .pinFriend(currentFriend.friend, currentFriend.user_id, data)
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

  updateUnReadFriendChatCount = () => {
    updateFriendsUnReadCount(this.props.currentFriend.friend, 0);

    let array = this.props.acceptedRequest;
    const index = array.indexOf(this.props.currentFriend.user_id);
    if (index > -1) {
      array.splice(index, 1);
    }
    this.props.setAcceptedRequest(array);

    this.props.updateUnreadFriendMsgsCounts(0);

    this.props.setUserFriends().then(() => {
      this.props.setCommonChatConversation();
    });
  };

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  onMessageSendInBg = (newMessageText, finishSending) => {
    RnBgTask.runInBackground_withPriority("MIN", () => {
      this.onMessageSend(newMessageText,finishSending);
    });
  }

  onMessageSend = async (newMessageText='',finishSending) => {
    const { editMessageId} = this.state;
    const {currentFriend, userData} = this.props;

    let msgText = newMessageText;
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

    let imgThumb = '';
    if (sentMessageType === 'image') {
      if(!uploadFile.isUrl){
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
        imgThumb = uploadedImages.image[0].thumbnail;
      }else{
        msgText = uploadFile.uri;
        imgThumb = uploadFile.uri;
      }
    }

      if (sentMessageType === 'sticker') {
        msgText = uploadFile.uri;
        imgThumb = uploadFile.uri;
      }

      if (sentMessageType === 'gif') {
        msgText = uploadFile.uri;
        imgThumb = uploadFile.uri;
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
      console.log('file', uploadFile);
      const uploadedApplication = await this.S3uploadService.uploadApplicationOnS3Bucket(
        files,
        uploadFile.type,
        (e) => {
          console.log('progress_bar_percentage', e);
          this.setState({uploadProgress: e.percent});
        },
        uploadFile.name,
      );
      console.log('uploadedApplication', uploadedApplication);
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
            display_name:
              repliedMessage.from_user.id === userData.id
                ? repliedMessage.from_user.display_name
                : currentFriend.display_name
                ? currentFriend.display_name
                : repliedMessage.from_user.display_name,
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
      msg_type: (sentMessageType === 'sticker' || sentMessageType === 'gif') ? 'image' : sentMessageType,
      is_read: false,
      is_unsent: false,
      is_edited: false,
      friend: userData.id,
      deleted_for: [],
      sentMessageType: 'text',
    };

    if (isEdited) {
      updateFriendMessageById(editMessageId, msgText, sentMessageType);
      this.sendEditMessage(msgText, editMessageId);
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
      this.props.setFriendConversation([
        sendmsgdata,
        ...this.props.chatFriendConversation,
      ]);
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
      this.props.setFriendConversation([
        sendmsgdata,
        ...this.props.chatFriendConversation,
      ]);
      this.props.sendPersonalMessage(data);
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
    finishSending && finishSending();
    this.chatContainerRef && this.chatContainerRef.scrollToTop();
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

  sendEditMessage = (newMessageText, editMessageId) => {
    // const {newMessageText, editMessageId} = this.state;

    const data = {
      message_body: newMessageText,
      friend: this.props.currentFriend.friend,
    };

    this.props
      .editPersonalMessage(editMessageId, data)
      .then(() => {
        this.getPersonalConversation();
      })
      .catch((err) => {
        console.error(err);
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

  onReply = (messageId) => {
    // const { conversations } = this.state;
    const {chatFriendConversation} = this.props;

    const repliedMessage = chatFriendConversation.find(
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

  checkEventTypes(message) {
    const {currentFriend, userData} = this.props;
    // const {conversations} = this.state;

    // var valueArr = conversations.map(function (item) {
    //   return item.id;
    // });
    // var isDuplicate = valueArr.some(function (item, idx) {
    //   return valueArr.indexOf(item) !== idx;
    // });

    // //New Message in Friend
    // if (message.text.data.type === SocketEvents.NEW_MESSAGE_IN_FREIND) {
    //   if (message.text.data.message_details.from_user.id === userData.id) {
    //     if (
    //       message.text.data.message_details.to_user.id === currentFriend.user_id
    //     ) {
    //       // if (!isDuplicate) {
    //       //   conversations.unshift(message.text.data.message_details);
    //       //   this.setState({conversations});
    //       // }
    //       // this.getPersonalConversation();
    //       setFriendChatConversation([message.text.data.message_details]);
    //       this.getLocalFriendConversation();
    //       this.markFriendMsgsRead();
    //     }
    //   } else if (message.text.data.message_details.to_user.id === userData.id) {
    //     if (
    //       message.text.data.message_details.from_user.id ==
    //       currentFriend.user_id
    //     ) {
    //       // this.getPersonalConversation();
    //       setFriendChatConversation([message.text.data.message_details]);
    //       this.getLocalFriendConversation();
    //       this.markFriendMsgsRead();
    //     }
    //   }
    // }

    // Unsend Message in Friend
    // if (message.text.data.type === SocketEvents.UNSENT_MESSAGE_IN_FRIEND) {
    //   if (message.text.data.message_details.from_user.id === userData.id) {
    //     if (
    //       message.text.data.message_details.to_user.id === currentFriend.user_id
    //     ) {
    //       // this.getPersonalConversation();
    //       setFriendMessageUnsend(message.text.data.message_details.id);
    //       this.getLocalFriendConversation();
    //     }
    //   } else if (message.text.data.message_details.to_user.id === userData.id) {
    //     if (
    //       message.text.data.message_details.from_user.id ==
    //       currentFriend.user_id
    //     ) {
    //       // this.getPersonalConversation();
    //       setFriendMessageUnsend(message.text.data.message_details.id);
    //       this.getLocalFriendConversation();
    //     }
    //   }
    // }

    // DELETE_MESSAGE_IN_FRIEND
    // if (message.text.data.type === SocketEvents.DELETE_MESSAGE_IN_FRIEND) {
    //   if (message.text.data.message_details.from_user.id === userData.id) {
    //     if (
    //       message.text.data.message_details.to_user.id === currentFriend.user_id
    //     ) {
    //       deleteFriendMessageById(message.text.data.message_details.id);
    //       let chat = getFriendChatConversationById(
    //         this.props.currentFriend.friend,
    //       );
    //       this.props.setFriendConversation(chat);
    //     }
    //   } else if (message.text.data.message_details.to_user.id === userData.id) {
    //     if (
    //       message.text.data.message_details.from_user.id ==
    //       currentFriend.user_id
    //     ) {
    //       deleteFriendMessageById(message.text.data.message_details.id);
    //       let chat = getFriendChatConversationById(
    //         this.props.currentFriend.friend,
    //       );
    //       this.props.setFriendConversation(chat);
    //     }
    //   }
    // }

    // MESSAGE_EDITED_IN_FRIEND
    // if (message.text.data.type === SocketEvents.MESSAGE_EDITED_IN_FRIEND) {
    //   if (message.text.data.message_details.from_user.id === userData.id) {
    //     if (
    //       message.text.data.message_details.to_user.id === currentFriend.user_id
    //     ) {
    //       let editMessageId = message.text.data.message_details.id;
    //       let newMessageText = message.text.data.message_details.message_body;
    //       let messageType = message.text.data.message_details.msg_type;
    //       updateFriendMessageById(editMessageId, newMessageText, messageType);
    //       this.getLocalFriendConversation();
    //     }
    //   } else if (message.text.data.message_details.to_user.id === userData.id) {
    //     if (
    //       message.text.data.message_details.from_user.id ==
    //       currentFriend.user_id
    //     ) {
    //       let editMessageId = message.text.data.message_details.id;
    //       let newMessageText = message.text.data.message_details.message_body;
    //       let messageType = message.text.data.message_details.msg_type;
    //       updateFriendMessageById(editMessageId, newMessageText, messageType);
    //       this.getLocalFriendConversation();
    //     }
    //   }
    // }

    //READ_ALL_MESSAGE_FRIEND_CHAT
    if (message.text.data.type === SocketEvents.READ_ALL_MESSAGE_FRIEND_CHAT) {
      if (message.text.data.message_details.read_by === userData.id) {
        // this.getPersonalConversation();
        updateAllFriendMessageRead(message.text.data.message_details.friend_id);
      }
    }

    //PINED_FRIEND
    if (message.text.data.type === SocketEvents.PINED_FRIEND) {
      if (message.text.data.message_details.from_user.id === userData.id) {
        if (
          message.text.data.message_details.to_user.id === currentFriend.user_id
        ) {
          this.getPersonalConversation();
        }
      } else if (message.text.data.message_details.to_user.id === userData.id) {
        if (
          message.text.data.message_details.from_user.id ===
          currentFriend.user_id
        ) {
          this.getPersonalConversation();
        }
      }
    }

    //UNPINED_FRIEND
    if (message.text.data.type === SocketEvents.UNPINED_FRIEND) {
      if (message.text.data.message_details.from_user.id === userData.id) {
        if (
          message.text.data.message_details.to_user.id === currentFriend.user_id
        ) {
          this.getPersonalConversation();
        }
      } else if (message.text.data.message_details.to_user.id === userData.id) {
        if (
          message.text.data.message_details.from_user.id ===
          currentFriend.user_id
        ) {
          this.getPersonalConversation();
        }
      }
    }
  }

  getPersonalConversation = async (id) => {
    await this.props
      .getPersonalConversation(this.props.currentFriend.friend, id)
      .then((res) => {
        if (res.status === true && res.conversation.length > 0) {
          // this.setState({ conversations: res.conversation });
          // this.markFriendMsgsRead();
          let chat = getFriendChatConversationById(
            this.props.currentFriend.friend,
          );
          let conversations = [];
          conversations = realmToPlainObject(chat);

          this.props.setFriendConversation(conversations);
          if(res.conversation.length>=50){
            this.setState({isLoadMore: true});
          }else{
            this.setState({isLoadMore: false});
          }
        }else{
          this.setState({isLoadMore: false});
        }
      });
  };

  getLocalFriendConversation = () => {
    let chat = getFriendChatConversationById(this.props.currentFriend.friend);
    if (chat) {
      let conversations = [];
      conversations = realmToPlainObject(chat);
      // conversations = chat.toJSON();
      this.props.setFriendConversation(conversations);
    }
  };

  getPersonalConversationInitial = async () => {
    this.setState({isChatLoading: true});
    let callApi = true;
    let chat = getFriendChatConversationById(this.props.currentFriend.friend);
    if (chat.length) {
      let conversations = [];
      conversations = realmToPlainObject(chat);
      // console.log('friends_conversations',JSON.stringify(conversations))
      this.props.setFriendConversation(conversations);
      // this.setState({isChatLoading: false});
      if(this.props.currentFriend.last_msg_id && this.props.currentFriend.last_msg_id <= conversations[0].id){
        callApi = false;
      }
    }

    if(callApi){
      await this.props
      .getPersonalConversation(this.props.currentFriend.friend)
      .then((res) => {
        let isLoadMore = false;
        if (res.status === true && res.conversation.length > 0) {
          // this.setState({ conversations: res.conversation });
          this.markFriendMsgsRead();
          let friendChat = getFriendChatConversationById(
            this.props.currentFriend.friend,
          );
          let conversations = [];
          conversations = realmToPlainObject(friendChat);

          this.props.setFriendConversation(conversations);
          if(res.conversation.length>=50){
            isLoadMore = true;
            RnBgTask.runInBackground_withPriority("MIN", () => {
              this.fetchMessagesinBackground(this.props.currentFriend.friend);
            });
          } else {
            isLoadMore = false;
          }
        }else{
          isLoadMore = false;
        }
        this.setState({isChatLoading: false, isLoadMore});
      });
    }else{
      setTimeout(()=>{
        RnBgTask.runInBackground_withPriority("MIN", () => {
          this.fetchMessagesinBackground(this.props.currentFriend.friend);
        });
      },3000);
    }
  };

  fetchMessagesinBackground = (friend) => {
      let oldest_msg_id = getFriendChatConversationOldestMsgId(friend);
      this.fetchPrevious(oldest_msg_id, friend);
  }

  fetchPrevious = (msg_id, friend) => {
    console.log('bg_thread_previous_msg_id',msg_id);
    this.props
      .getPersonalConversation(this.props.currentFriend.friend, msg_id)
      .then((res) => {
        console.log('loop',res.status,res.conversation.length,this.props.currentRouteName, friend, this.props.currentFriend.friend);
        if (res.status && res.conversation.length>=50 && this.props.currentRouteName === 'FriendChats' && friend == this.props.currentFriend.friend) {
          let oldest_msg_id = getFriendChatConversationOldestMsgId(friend);
          if(oldest_msg_id !== msg_id){
            this.fetchPrevious(oldest_msg_id, friend);
          }
        }
      })
      .catch((err) => {
        console.log('FriendChats -> getFriendConversation -> err', err);
      });
  }

  markFriendMsgsRead() {
    this.props.markFriendMsgsRead(this.props.currentFriend.friend);
  }

  handleMessage = (message) => {
    this.setState({newMessageText: message});
    // friend
    // const payload = {
    //   type: SocketEvents.FRIEND_TYPING_MESSAGE,
    //   data: {
    //     sender: this.props.userData.id,
    //     receiver: this.props.currentFriend.user_id,
    //     chat_type: 'personal',
    //     channel_name: '',
    //   },
    // };
  }

  onAddFriend = () => {
    const {currentFriend} = this.props;
    this.props.sendFriendRequest(currentFriend.user_id).then((res) => {
      if (res.status) {
        Toast.show({
          title: translate('pages.xchat.toastr.added'),
          text: translate('pages.xchat.toastr.friendRequestSentSuccessfully'),
          type: 'positive',
        });
      } else {
        Toast.show({
          title: 'TOUKU',
          text: translate('pages.xchat.toastr.friendRequestAlreadySent'),
          type: 'primary',
        });
      }
    });
  };

  toggleConfirmationModal = () => {
    this.setState({showConfirmationModal: !this.state.showConfirmationModal});
  };

  toggleDeleteObjectConfirmationModal = () => {
    this.setState({
      showdeleteObjectConfirmationModal: !this.state
        .showdeleteObjectConfirmationModal,
    });
  };

  onSelectChatConversation = (id) => {
    console.log('id',id);
    let array = this.state.selectedIds.slice();
    if (this.state.selectedIds.includes(id + '')) {
      let index = array.indexOf(id + '');
      array.splice(index, 1);
    } else {
      array.push(id + '');
    }
    this.setState({selectedIds: array});
  };

  onCancel = () => {
    this.toggleConfirmationModal();
  };

  onConfirm = () => {
    const payload = {
      channel_name: `unfriend_${this.props.currentFriend.user_id}`,
      unfriend_user_id: this.props.currentFriend.user_id,
    };
    this.setState({callingApi: true});
    this.props
      .unFriendUser(payload)
      .then((res) => {
        if (res.status === true) {
          // Toast.show({
          //   title: 'TOUKU',
          //   text: translate('common.success'),
          //   type: 'positive',
          // });
          this.props.getUserFriends();
          this.props.navigation.goBack();
        }
        this.toggleConfirmationModal();
        this.setState({callingApi: false});
      })
      .catch((err) => {
        console.log('FriendChats -> onConfirm -> err', err);
        Toast.show({
          title: 'TOUKU',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
        this.toggleConfirmationModal();
        this.setState({callingApi: false});
      });
  };

  onDeleteObjectCancel = () => {
    this.toggleDeleteObjectConfirmationModal();
  };

  onDeletefriendObject = () => {
    const {currentFriend} = this.props;
    this.setState({deleteObjectLoading: true});
    this.props
      .deleteFriendObject(currentFriend.user_id)
      .then((res) => {
        this.setState({deleteObjectLoading: false});
        this.toggleDeleteObjectConfirmationModal();
        if (res && res.status) {
          removeUserFriends(currentFriend.user_id);
          this.props.setUserFriends().then(() => {
            this.props.setCommonChatConversation();
          });
          Toast.show({
            title: currentFriend.display_name,
            text: translate('pages.xchat.toastr.chatHistoryDelete'),
            type: 'positive',
          });
          this.props.navigation.goBack();
        }
      })
      .catch((err) => {
        this.setState({deleteObjectLoading: false});
        console.log('err', err);
      });
  };

  // To delete message
  toggleMessageDeleteConfirmationModal = () => {
    this.setState((prevState) => ({
      showMessageDeleteConfirmationModal: !prevState.showMessageDeleteConfirmationModal,
    }));
  };

  toggleMessageDeleteOptionConfirmationModal = () => {
    this.setState((prevState) => ({
      showMoreMessageDeleteConfirmationModal: !prevState.showMoreMessageDeleteConfirmationModal,
    }));
  };

  onCancelDeleteOption = () => {
    this.toggleMessageDeleteOptionConfirmationModal();
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
      this.props
        .deletePersonalMessage(this.state.selectedMessageId, payload)
        .then(() => {
          deleteFriendMessageById(this.state.selectedMessageId);
          this.getPersonalConversation();

          if (
            this.props.currentFriend.last_msg_id ===
            this.state.selectedMessageId
          ) {
            let chat = getFriendChatConversationById(
              this.props.currentFriend.friend,
            );

            let array = realmToPlainObject(chat);
            // let array = chat.toJSON();

            if (array && array.length > 0) {
              updateFriendLastMsgWithoutCount(
                this.props.currentFriend.user_id,
                {
                  id: array[0].id,
                  msg_type: array[0].msg_type,
                  message_body: array[0].message_body,
                  created: array[0].timestamp,
                },
              );
              this.props.setUserFriends().then(() => {
                this.props.setCommonChatConversation();
              });
            }
          }
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
        deleteFriendMessageById(item);

        if (this.props.currentFriend.last_msg_id === item) {
          let chat = getFriendChatConversationById(
            this.props.currentFriend.friend,
          );

          let array = realmToPlainObject(chat);
          // let array = chat.toJSON();

          if (array && array.length > 0) {
            updateFriendLastMsgWithoutCount(this.props.currentFriend.user_id, {
              id: array[0].id,
              msg_type: array[0].msg_type,
              message_body: array[0].message_body,
              created: array[0].timestamp,
            });
            this.props.setUserFriends().then(() => {
              this.props.setCommonChatConversation();
            });
          }
        }
      });
      this.getLocalFriendConversation();
      this.setState({isMultiSelect: false, selectedIds: []});

      this.props
        .deleteMultiplePersonalMessage(payload)
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
            this.getPersonalConversation();
          }
        })
        .catch(() => {
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

  onCancelUnSend = () => {
    this.setState({showMessageUnSendConfirmationModal: false});
  };

  onConfirmUnSend = () => {
    this.setState({showMessageUnSendConfirmationModal: false});
    if (this.state.selectedMessageId != null) {
      let payload = {
        friend: this.props.currentFriend.friend,
        is_unsent: true,
      };
      setFriendMessageUnsend(this.state.selectedMessageId);
      this.props
        .unSendPersonalMessage(this.state.selectedMessageId, payload)
        .then(() => {
          // this.getPersonalConversation();
          Toast.show({
            title: 'TOUKU',
            text: translate('pages.xchat.messageUnsent'),
            type: 'positive',
          });
        });
    }
  };

  onDeletePressed = (messageId) => {
    // this.setState({
    //   showMessageDeleteConfirmationModal: true,
    //   selectedMessageId: messageId,
    // });
    this.setState({
      isMultiSelect: true,
      selectedIds: [...this.state.selectedIds, messageId + ''],
    });
  };

  onDeleteMultipleMessagePressed = () => {
    const {chatFriendConversation, userData} = this.props;

    let arr = this.state.selectedIds;
    let isDeleteEveryOption = true;

    chatFriendConversation.map((item) => {
      if (arr.includes(item.id + '') && item.from_user.id !== userData.id) {
        isDeleteEveryOption = false;
        return;
      }
    });

    if (isDeleteEveryOption) {
      this.setState({
        showMoreMessageDeleteConfirmationModal: true,
      });
    } else {
      this.setState({
        showMessageDeleteConfirmationModal: true,
      });
    }
  };

  onSelectedCancel = () => {
    this.setState({isMultiSelect: false, selectedIds: []});
  }

  showOpenLoader = (isLoading) => {
    console.log('showOpenLoader in Friend Chat', isLoading);
    this.setState({openDoc: isLoading});
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
        updateFriendTranslatedMessage(message.id, res.data);
        this.getLocalFriendConversation();
      }
    });
  };

  onMessageTranslateClose = (id) => {
    this.setState({
      translatedMessageId: null,
      translatedMessage: null,
    });
    updateFriendTranslatedMessage(id, null);
    this.getLocalFriendConversation();
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
          DocumentPicker.types.allFiles,
        ],
      });
      this.setState({
        uploadedFiles: [...this.state.uploadedFiles, ...results],
      });
      console.log('results', results);
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
        // sentMessageType: 'image',
        sentMessageType: model.type,
        sendingMedia: true,
      },
      async () => {
        await this.onMessageSend();
      },
    );
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

  onLoadMoreMessages = (message) => {
    console.log('load more messages friend chats');
    const {chatFriendConversation} = this.props;
    const {isLoadMore} = this.state;
    if(message && message.id){
      let result = getFriendChatPreviousConversationFromMsgId(this.props.currentFriend.friend, message.id);
      // console.log('result',message.id,result);
      let chats = realmToPlainObject(result);
      if(chats.length>0){
        this.props.setFriendConversation(chatFriendConversation.concat(chats));
      }else if(chatFriendConversation.length>0 && isLoadMore){
        this.getPersonalConversation(message.id);
      }
    }
  }

  onReplyPress = (id) => {
    return new Promise((resolve, reject)=>{
      let result = getFriendChatConversationByMsgId(this.props.currentFriend.friend, id);
      let messages = realmToPlainObject(result);
      console.log('messages',messages);
      if(messages && messages.length > 0 && messages[messages.length-1].id == id){
        this.props.setFriendConversation(messages);
        resolve(messages);
      }else{
        let dataInterval = setInterval(()=>{
          let result = getFriendChatConversationByMsgId(this.props.currentFriend.friend, id);
          let messages = realmToPlainObject(result);
          if (messages && messages.length > 0 && messages[messages.length - 1].id == id) {
            clearInterval(dataInterval);
            this.props.setFriendConversation(messages);
            resolve(messages);
          }
        },1000);
      }
    });
  }

  onScrollToStart = () => {
    const {chatFriendConversation} = this.props;
    // let result = getFriendChatConversationById(this.props.currentFriend.friend);
    if(chatFriendConversation.length>0 && chatFriendConversation[0].id){
      console.log(chatFriendConversation[0].id);
      let result = getFriendChatConversationByMsgId(this.props.currentFriend.friend, chatFriendConversation[0].id, 30, false);
      let chats = realmToPlainObject(result);
      console.log('chats',chats);
      this.props.setFriendConversation(chats.concat(chatFriendConversation));
    }
    
  }

  onBackPress = () => {
    this.props.navigation.goBack()
  }

  onCloseGalleyModal = () => {
    this.setState({uploadedFiles: []});
    this.toggleGalleryModal(false);
  }

  onCloseAttachmentModal = () => {
    this.setState({uploadedFiles: []});
    this.toggleAttachmentModal(false);
  }

  containerRef = (container) => {
    this.chatContainerRef = container;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !isEqual(this.props.currentFriend, nextProps.currentFriend) ||
      !isEqual(this.props.chatFriendConversation, nextProps.chatFriendConversation) ||
      !isEqual(this.props.unFriendLoading, nextProps.unFriendLoading) ||
      !isEqual(this.props.userData, nextProps.userData) ||
      !isEqual(this.props.selectedLanguageItem, nextProps.selectedLanguageItem)
    ) {
      console.log('props----');
      return true;
    } else if (!isEqual(this.state, nextState)) {
      console.log('state----');
      return true;
    }
    return false;
  }

  render() {
    const {
      newMessageText,
      showConfirmationModal,
      showMessageDeleteConfirmationModal,
      showMessageUnSendConfirmationModal,
      showdeleteObjectConfirmationModal,
      showMoreMessageDeleteConfirmationModal,
      orientation,
      translatedMessage,
      translatedMessageId,
      uploadFile,
      sendingMedia,
      isChatLoading,
      isMultiSelect,
      openDoc,
      isDeleteMeLoading,
      isDeleteEveryoneLoading,
      isLoadMore,
    } = this.state;
    const {
      currentFriend,
      chatFriendConversation
    } = this.props;
    console.log('FriendChats : re-render',isLoadMore);
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <ChatHeader
          title={
            currentFriend.display_name
              ? currentFriend.display_name
              : currentFriend.username
          }
          description={
            currentFriend.total_members + ' ' + translate('pages.xchat.members')
          }
          type={'friend'}
          image={currentFriend.profile_picture}
          onBackPress={this.onBackPress}
          menuItems={
            currentFriend.friend_status === 'UNFRIEND'
              ? this.state.unfriendMenus
              : this.state.headerRightIconMenu
          }
          navigation={this.props.navigation}
          isPined={currentFriend.is_pined}
          chatType={
            currentFriend.is_pined
              ? translate('pages.xchat.unPinThisChat')
              : translate('pages.xchat.pinThisChat')
          }
          disableDetails={currentFriend.friend_status === 'UNFRIEND'}
        />
        {isChatLoading && chatFriendConversation.length <= 0 ? (
          <ListLoader />
        ) : (
          <ChatContainer
            ref={this.containerRef}
            sendEmotion={this.sendEmotion}
            handleMessage={this.handleMessage}
            onMessageSend={this.onMessageSendInBg}
            onMessageReply={this.onReply}
            newMessageText={newMessageText}
            sendEnable={newMessageText.length ? true : false}
            messages={chatFriendConversation}
            orientation={this.state.orientation}
            repliedMessage={this.state.repliedMessage}
            isReply={this.state.isReply}
            cancelReply={this.cancelReply}
            onDelete={this.onDeletePressed}
            onUnSendMsg={this.onUnSendPressed}
            onMessageTranslate={this.onMessageTranslate}
            onMessageTranslateClose={this.onMessageTranslateClose}
            onEditMessage={this.onEdit}
            onDownloadMessage={this.onDownload}
            translatedMessage={translatedMessage}
            translatedMessageId={translatedMessageId}
            onCameraPress={this.onCameraPress}
            onGalleryPress={this.toggleGalleryModal.bind(this,true)}
            onAttachmentPress={this.onAttachmentPress}
            sendingImage={uploadFile}
            isMultiSelect={isMultiSelect}
            onSelect={this.onSelectChatConversation}
            selectedIds={this.state.selectedIds}
            onSelectedCancel={this.onSelectedCancel}
            onSelectedDelete={this.onDeleteMultipleMessagePressed}
            showOpenLoader={this.showOpenLoader}
            isChatDisable={
              currentFriend.friend_status === 'UNFRIEND' ||
              currentFriend.friend_status === 'REQUESTED'
            }
            onMediaPlay={this.onMediaPlay}
            isLoadMore={isLoadMore}
            onLoadMore={this.onLoadMoreMessages}
            onReplyPress={this.onReplyPress}
            onScrollToStart={this.onScrollToStart}
          />
        )}

        <ConfirmationModal
          visible={showConfirmationModal}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
          orientation={orientation}
          isLoading={this.props.unFriendLoading}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.toastr.selectedUserWillBeRemoved')}
        />

        <ConfirmationModal
          visible={showdeleteObjectConfirmationModal}
          onCancel={this.onDeleteObjectCancel}
          onConfirm={this.onDeletefriendObject}
          orientation={orientation}
          isLoading={this.state.deleteObjectLoading}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.toastr.chatsWillBeDeleted')}
        />

        <ConfirmationModal
          visible={showMessageDeleteConfirmationModal}
          onCancel={this.onCancelDelete.bind(this)}
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
          visible={showMessageUnSendConfirmationModal}
          onCancel={this.onCancelUnSend.bind(this)}
          onConfirm={this.onConfirmUnSend.bind(this)}
          orientation={orientation}
          title={translate('common.unsend')}
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
          onCancel={this.onCloseGalleyModal}
          onUpload={this.uploadAndSend}
          isLoading={sendingMedia}
          removeUploadData={this.removeUploadData}
          onGalleryPress={this.onGalleryPress}
          onUrlDone={this.onUrlUpload}
        />

        <ShowAttahmentModal
          visible={this.state.showAttachmentModal}
          toggleAttachmentModal={this.toggleAttachmentModal}
          data={this.state.uploadedFiles}
          onCancel={this.onCloseAttachmentModal}
          onUpload={this.uploadAndSendAttachment}
          isLoading={sendingMedia}
          removeUploadData={this.removeUploadData}
          onAttachmentPress={this.onAttachmentPress}
        />
        {/* {sendingMedia && <UploadLoader />} */}

        <DeleteOptionModal
          visible={showMoreMessageDeleteConfirmationModal}
          orientation={orientation}
          onCancel={this.onCancelDeleteOption.bind(this)}
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
    currentFriend: state.friendReducer.currentFriend,
    // chatsLoading: state.friendReducer.loading,
    unFriendLoading: state.friendReducer.unFriendLoading,
    userData: state.userReducer.userData,
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    chatFriendConversation: state.friendReducer.chatFriendConversation,
    acceptedRequest: state.addFriendReducer.acceptedRequest,
    currentRouteName: state.userReducer.currentRouteName,
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
  deleteMultiplePersonalMessage,
  setFriendConversation,
  addNewSendMessage,
  resetFriendConversation,
  setCommonChatConversation,
  updateUnreadFriendMsgsCounts,
  setUserFriends,
  pinFriend,
  unpinFriend,
  deleteFriendObject,
  setCurrentFriend,
  sendFriendRequest,
  setAcceptedRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendChats);
