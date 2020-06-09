import React, {Component, Fragment} from 'react';
import {ImageBackground, Dimensions, Platform} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';

import {ChatHeader} from '../../components/Headers';
import {globalStyles} from '../../styles';
import {Colors, Fonts, Images, Icons} from '../../constants';
import GroupChatContainer from '../../components/GroupChatContainer';
import {ConfirmationModal} from '../../components/Modals';
import {translate} from '../../redux/reducers/languageReducer';
import {
  getUserGroups,
  getGroupDetail,
  getGroupMembers,
  setCurrentGroupDetail,
  setCurrentGroupMembers,
  deleteGroup,
} from '../../redux/reducers/groupReducer';
import Toast from '../../components/Toast';

class GroupChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      newMessageText: '',
      showLeaveGroupConfirmationModal: false,
      showDeleteGroupConfirmationModal: false,
      isMyGroup: false,
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
      messagesArray: [
        {
          msg_id: 3110,
          sender_id: 10101,
          group_id: 308,
          sender_username: 'nik',
          sender_display_name: 'nik',
          sender_picture: null,
          message_body: {
            type: 'text',
            text: 'SS',
          },
          is_edited: false,
          is_unsent: false,
          timestamp: '2020-05-14T04:57:33.703368',
          reply_to: {},
          mentions: [],
        },
        {
          msg_id: 3111,
          sender_id: 10101,
          group_id: 308,
          sender_username: 'nik',
          sender_display_name: 'nik',
          sender_picture: null,
          message_body: {
            type: 'text',
            text: 'ASDAD',
          },
          is_edited: false,
          is_unsent: false,
          timestamp: '2020-05-14T04:58:02.308972',
          reply_to: {},
          mentions: [],
        },
        {
          msg_id: 3112,
          sender_id: 10101,
          group_id: 308,
          sender_username: 'nik',
          sender_display_name: 'nik',
          sender_picture: null,
          message_body: {
            type: 'text',
            text: 'I3435',
          },
          is_edited: false,
          is_unsent: false,
          timestamp: '2020-05-14T04:58:03.101552',
          reply_to: {},
          mentions: [],
        },
        {
          msg_id: 3113,
          sender_id: 10101,
          group_id: 308,
          sender_username: 'nik',
          sender_display_name: 'nik',
          sender_picture: null,
          message_body: {
            type: 'text',
            text: 'KGGGJ',
          },
          is_edited: false,
          is_unsent: false,
          timestamp: '2020-05-14T04:58:10.422368',
          reply_to: {},
          mentions: [],
        },
        {
          msg_id: 3114,
          sender_id: 10101,
          group_id: 308,
          sender_username: 'nik',
          sender_display_name: 'nik',
          sender_picture: null,
          message_body: {
            type: 'text',
            text: 'KK',
          },
          is_edited: false,
          is_unsent: false,
          timestamp: '2020-05-14T04:58:19.325510',
          reply_to: {},
          mentions: [],
        },
        {
          msg_id: 3115,
          sender_id: 10101,
          group_id: 308,
          sender_username: 'nik',
          sender_display_name: 'nik',
          sender_picture: null,
          message_body: {
            type: 'text',
            text: 'ASD',
          },
          is_edited: false,
          is_unsent: false,
          timestamp: '2020-05-14T04:59:27.730863',
          reply_to: {},
          mentions: [],
        },
        {
          msg_id: 3116,
          sender_id: 10101,
          group_id: 308,
          sender_username: 'nik',
          sender_display_name: 'nik',
          sender_picture: null,
          message_body: {
            type: 'text',
            text: 'ASD',
          },
          is_edited: false,
          is_unsent: false,
          timestamp: '2020-05-14T05:04:32.455634',
          reply_to: {},
          mentions: [],
        },
        {
          msg_id: 3117,
          sender_id: 10101,
          group_id: 308,
          sender_username: 'nik',
          sender_display_name: 'nik',
          sender_picture: null,
          message_body: {
            type: 'text',
            text: 'S',
          },
          is_edited: false,
          is_unsent: false,
          timestamp: '2020-05-14T05:06:49.480241',
          reply_to: {},
          mentions: [],
        },
        {
          msg_id: 3118,
          sender_id: 10101,
          group_id: 308,
          sender_username: 'nik',
          sender_display_name: 'nik',
          sender_picture: null,
          message_body: {
            type: 'text',
            text: 'S',
          },
          is_edited: false,
          is_unsent: false,
          timestamp: '2020-05-14T05:14:13.319157',
          reply_to: {},
          mentions: [],
        },
        {
          msg_id: 3119,
          sender_id: 10101,
          group_id: 308,
          sender_username: 'nik',
          sender_display_name: 'nik',
          sender_picture: null,
          message_body: {
            type: 'text',
            text: 'S',
          },
          is_edited: false,
          is_unsent: false,
          timestamp: '2020-05-14T05:16:41.939518',
          reply_to: {},
          mentions: [],
        },
        {
          msg_id: 3120,
          sender_id: 10101,
          group_id: 308,
          sender_username: 'nik',
          sender_display_name: 'nik',
          sender_picture: null,
          message_body: {
            type: 'text',
            text: 'AS',
          },
          is_edited: false,
          is_unsent: false,
          timestamp: '2020-05-14T05:19:18.123833',
          reply_to: {},
          mentions: [],
        },
        {
          msg_id: 3121,
          sender_id: 10101,
          group_id: 308,
          sender_username: 'nik',
          sender_display_name: 'nik',
          sender_picture: null,
          message_body: {
            type: 'text',
            text: 'ASD',
          },
          is_edited: false,
          is_unsent: false,
          timestamp: '2020-05-14T05:19:23.101623',
          reply_to: {},
          mentions: [],
        },
        {
          msg_id: 3122,
          sender_id: 10101,
          group_id: 308,
          sender_username: 'nik',
          sender_display_name: 'nik',
          sender_picture: null,
          message_body: {
            type: 'text',
            text: 'S',
          },
          is_edited: false,
          is_unsent: false,
          timestamp: '2020-05-14T05:21:10.140908',
          reply_to: {},
          mentions: [],
        },
      ],

      // [
      //   {
      //     id: 1,
      //     message: 'Hello',
      //     from_user: {
      //       id: 1,
      //       email: '',
      //       username: '',
      //       avatar: null,
      //       is_online: false,
      //       display_name: '',
      //     },
      //     isUser: false,
      //     userName: 'raj',
      //     time: '20:20',
      //   },
      //   {
      //     id: 2,
      //     message: 'HI',
      //     from_user: {
      //       id: 1,
      //       email: '',
      //       username: '',
      //       avatar: null,
      //       is_online: false,
      //       display_name: '',
      //     },
      //     isUser: true,
      //     status: 'Read',
      //     time: '20:21',
      //   },
      //   {
      //     id: 3,
      //     message:
      //       'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      //     from_user: {
      //       id: 1,
      //       email: '',
      //       username: '',
      //       avatar: null,
      //       is_online: false,
      //       display_name: '',
      //     },
      //     isUser: false,
      //     userName: 'raj',
      //     time: '20:21',
      //   },
      //   {
      //     id: 4,
      //     message:
      //       'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      //     from_user: {
      //       id: 1,
      //       email: '',
      //       username: '',
      //       avatar: null,
      //       is_online: false,
      //       display_name: '',
      //     },
      //     isUser: true,
      //     status: 'Read',
      //     time: '20:25',
      //     repliedTo: {
      //       id: 3,
      //       message:
      //         'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      //       isUser: false,
      //       userName: 'raj',
      //       time: '20:21',
      //     },
      //   },
      //   {
      //     id: 5,
      //     message:
      //       'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      //     from_user: {
      //       id: 1,
      //       email: '',
      //       username: '',
      //       avatar: null,
      //       is_online: false,
      //       display_name: '',
      //     },
      //     isUser: false,
      //     userName: 'raj',
      //     time: '20:26',
      //     repliedTo: {
      //       id: 2,
      //       message: 'HI',
      //       isUser: true,
      //       status: 'Read',
      //       time: '20:21',
      //     },
      //   },
      //   {
      //     id: 6,
      //     message:
      //       'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      //     from_user: {
      //       id: 1,
      //       email: '',
      //       username: '',
      //       avatar: null,
      //       is_online: false,
      //       display_name: '',
      //     },
      //     isUser: true,
      //     userName: 'raj',
      //     time: '20:27',
      //   },
      // ],
    };
  }

  onMessageSend = () => {
    const {newMessageText, messagesArray, isReply, repliedMessage} = this.state;
    if (!newMessageText) {
      return;
    }
    let newMessage;
    if (isReply) {
      newMessage = {
        id: messagesArray ? messagesArray.length + 1 : 1,
        message: newMessageText,
        isUser: true,
        time: '20:27',
        repliedTo: repliedMessage,
      };
    } else {
      newMessage = {
        id: messagesArray ? messagesArray.length + 1 : 1,
        message: newMessageText,
        from_user: {
          id: 1,
          email: '',
          username: '',
          avatar: null,
          is_online: false,
          display_name: '',
        },
        isUser: true,
        time: '20:27',
      };
    }

    let newMessageArray = messagesArray ? messagesArray : [];
    newMessageArray.push(newMessage);
    this.setState({
      messagesArray: newMessageArray,
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
    });
  };

  onReply = (messageId) => {
    const {messagesArray} = this.state;

    const repliedMessage = messagesArray.find(
      (item) => item.msg_id === messageId,
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
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);

    this.getGroupDetail();
    this.getGroupMembers();
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
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
    } = this.state;
    const {currentGroup} = this.props;
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
        <GroupChatContainer
          handleMessage={(message) => this.handleMessage(message)}
          onMessageSend={this.onMessageSend}
          onMessageReply={(id) => this.onReply(id)}
          newMessageText={newMessageText}
          messages={this.state.messagesArray}
          orientation={this.state.orientation}
          repliedMessage={this.state.repliedMessage}
          isReply={this.state.isReply}
          cancelReply={this.cancelReply}
        />
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
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {
  getUserGroups,
  getGroupDetail,
  getGroupMembers,
  setCurrentGroupDetail,
  setCurrentGroupMembers,
  deleteGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupChats);
