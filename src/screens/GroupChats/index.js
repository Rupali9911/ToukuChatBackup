import React, {Component, Fragment} from 'react';
import {ImageBackground, Dimensions, Platform} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';

import {ChatHeader} from '../../components/Headers';
import {globalStyles} from '../../styles';
import {Colors, Fonts, Images, Icons, SocketEvents} from '../../constants';
import GroupChatContainer from '../../components/GroupChatContainer';
import {ConfirmationModal} from '../../components/Modals';
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
} from '../../redux/reducers/groupReducer';
import Toast from '../../components/Toast';
import {ListLoader} from '../../components/Loaders';
import {eventService} from '../../utils';

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
      translatedMessage: null,
      translatedMessageId: null,
      showMessageDeleteConfirmationModal: false,
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
      ],
      headerRightIconMenuIsGroup: [
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
          title: translate('pages.xchat.deleteGroup'),
          icon: 'trash',
          onPress: () => {
            this.toggleDeleteGroupConfirmationModal();
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
      isReply: false,
      repliedMessage: null,
      isEdited: false,
      editMessageId: null,
    };
  }

  onMessageSend = () => {
    const {
      newMessageText,
      conversation,
      isReply,
      repliedMessage,
      isEdited,
    } = this.state;
    if (!newMessageText) {
      return;
    }
    if (isEdited) {
      this.sendEditMessage();
      return;
    }
    if (isReply) {
      let groupMessage = {
        group: this.props.currentGroup.group_id,
        local_id: '5aa71daf-d684-4534-a2a7-4259b93ef158',
        mentions: [],
        message_body: newMessageText,
        msg_type: 'text',
        reply_to: repliedMessage.msg_id,
      };

      this.props.sendGroupMessage(groupMessage).then((res) => {
        // alert(JSON.stringify(res));
        this.getGroupConversation();
      });
    } else {
      let groupMessage = {
        group: this.props.currentGroup.group_id,
        local_id: '5aa71daf-d684-4534-a2a7-4259b93ef158',
        mentions: [],
        message_body: newMessageText,
        msg_type: 'text',
      };

      this.props.sendGroupMessage(groupMessage).then((res) => {
        // alert(JSON.stringify(res));
        this.getGroupConversation();
      });
    }

    this.setState({
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
      isEdited: false,
    });
  };

  sendEditMessage = () => {
    const {newMessageText, editMessageId} = this.state;

    const data = {
      message_body: newMessageText,
    };

    this.props.editGroupMessage(editMessageId, data).then((res) => {
      this.getGroupConversation();
    });
    // .catch((err) => {});
    this.setState({
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
      isEdited: false,
    });
  };

  onEdit = (message) => {
    console.log('GroupChats -> onEdit -> message', message);
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
    const {conversation} = this.state;

    const repliedMessage = conversation.find(
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

    this.events = eventService.getMessage().subscribe((message) => {
      this.checkEventTypes(message);
    });
  }

  componentWillUnmount() {
    this.events.unsubscribe();
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);

    this.getGroupConversation();
    this.getGroupDetail();
    this.getGroupMembers();
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  checkEventTypes(message) {
    const {currentGroup, userData} = this.props;

    if (message.text.data.type == SocketEvents.NEW_MESSAGE_IN_GROUP) {
      if (message.text.data.message_details.group_id == currentGroup.group_id) {
        this.getGroupConversation();
      }
    }
  }

  markGroupConversationRead() {
    let data = {group_id: this.props.currentGroup.group_id};
    this.props.markGroupConversationRead(data);
  }

  getGroupConversation() {
    this.props
      .getGroupConversation(this.props.currentGroup.group_id)
      .then((res) => {
        if (res.status) {
          this.setState({conversation: res.data});
          this.markGroupConversationRead();
        }
      })
      .catch((err) => {
        console.log('GroupChats -> getGroupConversation -> err', err);
        // Toast.show({
        //   title: 'Touku',
        //   text: translate('common.somethingWentWrong'),
        //   type: 'primary',
        // });
      });
  }

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
        this.props.setCurrentGroupMembers(res.results);
      })
      .catch((err) => {});
  }

  handleMessage(message) {
    this.setState({newMessageText: message});
    if (!message.length && this.state.isEdited) {
      this.onEditClear();
    }
  }

  //Leave Group
  toggleLeaveGroupConfirmationModal = () => {
    this.setState((prevState) => ({
      showLeaveGroupConfirmationModal: !prevState.showLeaveGroupConfirmationModal,
    }));
  };

  onCancelLeaveGroup = () => {
    this.toggleLeaveGroupConfirmationModal();
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

  onCancelDeteleGroup = () => {
    this.toggleDeleteGroupConfirmationModal();
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

  onCancelMessageDelete = () => {
    console.log('GroupChats -> onCancelMessageDelete -> onCancelMessageDelete');
    this.toggleMessageDeleteConfirmationModal();
  };

  onConfirmMessageDelete = () => {
    console.log(
      'GroupChats -> onConfirmMessageDelete -> onConfirmMessageDelete',
    );
    this.toggleMessageDeleteConfirmationModal();
  };

  onDeleteMessagePressed = (messageId) => {
    console.log('ChannelChats -> onDeletePressed -> message', messageId);
    this.setState({showMessageDeleteConfirmationModal: true});
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

  render() {
    const {
      newMessageText,
      showLeaveGroupConfirmationModal,
      showDeleteGroupConfirmationModal,
      orientation,
      isMyGroup,
      conversation,
      isReply,
      repliedMessage,
      showMessageDeleteConfirmationModal,
      translatedMessage,
      translatedMessageId,
    } = this.state;
    const {currentGroup, groupLoading} = this.props;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <ChatHeader
          title={currentGroup.group_name}
          description={
            currentGroup.total_members + ' ' + translate('pages.xchat.members')
          }
          onBackPress={() => this.props.navigation.goBack()}
          menuItems={
            isMyGroup
              ? this.state.headerRightIconMenuIsGroup
              : this.state.headerRightIconMenu
          }
          image={currentGroup.group_picture}
        />
        {groupLoading && conversation.length <= 0 ? (
          <ListLoader />
        ) : (
          <GroupChatContainer
            handleMessage={(message) => this.handleMessage(message)}
            onMessageSend={this.onMessageSend.bind(this)}
            onMessageReply={(id) => this.onReply(id)}
            newMessageText={newMessageText}
            messages={conversation}
            orientation={orientation}
            repliedMessage={repliedMessage}
            isReply={isReply}
            cancelReply={this.cancelReply.bind(this)}
            onDelete={(id) => this.onDeleteMessagePressed(id)}
            onMessageTranslate={(msg) => this.onMessageTranslate(msg)}
            onEditMessage={(msg) => this.onEdit(msg)}
            onMessageTranslateClose={this.onMessageTranslateClose}
            translatedMessage={translatedMessage}
            translatedMessageId={translatedMessageId}
          />
        )}
        <ConfirmationModal
          orientation={orientation}
          visible={showLeaveGroupConfirmationModal}
          onCancel={this.onCancelLeaveGroup.bind(this)}
          onConfirm={this.onConfirmLeaveGroup.bind(this)}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.wantToLeaveText')}
        />
        <ConfirmationModal
          orientation={orientation}
          visible={showDeleteGroupConfirmationModal}
          onCancel={this.onCancelDeteleGroup.bind(this)}
          onConfirm={this.onConfirmDeleteGroup.bind(this)}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.toastr.groupWillBeDeleted')}
        />

        <ConfirmationModal
          visible={showMessageDeleteConfirmationModal}
          onCancel={this.onCancelMessageDelete.bind(this)}
          onConfirm={this.onConfirmMessageDelete.bind(this)}
          orientation={orientation}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.toLeaveThisChannel')}
        />
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentGroup: state.groupReducer.currentGroup,
    groupLoading: state.groupReducer.loading,
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
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupChats);
