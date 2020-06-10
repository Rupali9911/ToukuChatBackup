import React, { Component, Fragment } from 'react';
import { ImageBackground, Dimensions, Platform } from 'react-native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';

import { ChatHeader } from '../../components/Headers';
import { globalStyles } from '../../styles';
import { Colors, Fonts, Images, Icons } from '../../constants';
import GroupChatContainer from '../../components/GroupChatContainer';
import { ConfirmationModal } from '../../components/Modals';
import { translate } from '../../redux/reducers/languageReducer';
import {
  getGroupConversation,
  getUserGroups,
  getGroupDetail,
  getGroupMembers,
  setCurrentGroupDetail,
  setCurrentGroupMembers,
  deleteGroup,
  sendGroupMessage,
} from '../../redux/reducers/groupReducer';
import Toast from '../../components/Toast';
import { ListLoader } from '../../components/Loaders';

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
    };
  }

  onMessageSend = () => {
    const {
      newMessageText,
      conversation,
      isReply,
      repliedMessage,
    } = this.state;
    if (!newMessageText) {
      return;
    }
    if (isReply) {
    } else {
      let groupMessage = {
        group: this.props.currentGroup.group_id,
        local_id: '5aa71daf-d684-4534-a2a7-4259b93ef158',
        mentions: [],
        message_body: newMessageText,
        msg_type: 'text',
      };

      this.props.sendGroupMessage(groupMessage).then((res) => {
        alert(JSON.stringify(res));
        this.getGroupConversation();
      });
    }

    this.setState({
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
    });
  };

  onReply = (messageId) => {
    const { conversation } = this.state;

    const repliedMessage = conversation.find(
      (item) => item.msg_id === messageId
    );
    this.setState({
      isReply: true,
      repliedMessage: repliedMessage,
    });
  };

  // onReply = (messageId) => {
  //   console.log('ChannelChats -> onReply -> messageId', messageId);
  //   const { conversations } = this.state;

  //   const repliedMessage = conversations.find((item) => item.id === messageId);
  //   this.setState(
  //     {
  //       isReply: true,
  //       repliedMessage: repliedMessage,
  //     },
  //     () => {
  //       console.log(
  //         'ChannelChats -> onReply -> repliedMessage',
  //         this.state.repliedMessage
  //       );
  //     }
  //   );
  // };

  cancelReply = () => {
    this.setState({
      isReply: false,
      repliedMessage: null,
    });
  };

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({ orientation: initial });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);

    this.getGroupConversation();
    this.getGroupDetail();
    this.getGroupMembers();
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  getGroupConversation() {
    this.props
      .getGroupConversation(this.props.currentGroup.group_id)
      .then((res) => {
        if (res.status) {
          this.setState({ conversation: res.data });
        }
      })
      .catch((err) => {
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
            this.setState({ isMyGroup: true });
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
    this.setState({ newMessageText: message });
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
    this.toggleLeaveGroupConfirmationModal();
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
    } = this.state;
    const { currentGroup, groupLoading } = this.props;

    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
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
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentGroup: state.groupReducer.currentGroup,
    groupLoading: state.groupReducer.loading,
    userData: state.userReducer.userData,
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
  sendGroupMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupChats);
