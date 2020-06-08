import React, { Component, Fragment } from 'react';
import { ImageBackground, Dimensions, Platform } from 'react-native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';

import { ChatHeader } from '../../components/Headers';
import { translate } from '../../redux/reducers/languageReducer';
import { globalStyles } from '../../styles';
import { Colors, Fonts, Images, Icons } from '../../constants';
import ChatContainer from '../../components/ChatContainer';
import { ConfirmationModal } from '../../components/Modals';

class GroupChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      newMessageText: '',
      showConfirmationModal: false,
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
            this.toggleConfirmationModal();
          },
        },
      ],
      isReply: false,
      repliedMessage: null,
      messagesArray: [
        {
          id: 1,
          message: 'Hello',
          from_user: {
            id: 1,
            email: '',
            username: '',
            avatar: null,
            is_online: false,
            display_name: '',
          },
          isUser: false,
          userName: 'raj',
          time: '20:20',
        },
        {
          id: 2,
          message: 'HI',
          from_user: {
            id: 1,
            email: '',
            username: '',
            avatar: null,
            is_online: false,
            display_name: '',
          },
          isUser: true,
          status: 'Read',
          time: '20:21',
        },
        {
          id: 3,
          message:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          from_user: {
            id: 1,
            email: '',
            username: '',
            avatar: null,
            is_online: false,
            display_name: '',
          },
          isUser: false,
          userName: 'raj',
          time: '20:21',
        },
        {
          id: 4,
          message:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          from_user: {
            id: 1,
            email: '',
            username: '',
            avatar: null,
            is_online: false,
            display_name: '',
          },
          isUser: true,
          status: 'Read',
          time: '20:25',
          repliedTo: {
            id: 3,
            message:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            isUser: false,
            userName: 'raj',
            time: '20:21',
          },
        },
        {
          id: 5,
          message:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          from_user: {
            id: 1,
            email: '',
            username: '',
            avatar: null,
            is_online: false,
            display_name: '',
          },
          isUser: false,
          userName: 'raj',
          time: '20:26',
          repliedTo: {
            id: 2,
            message: 'HI',
            isUser: true,
            status: 'Read',
            time: '20:21',
          },
        },
        {
          id: 6,
          message:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          from_user: {
            id: 1,
            email: '',
            username: '',
            avatar: null,
            is_online: false,
            display_name: '',
          },
          isUser: true,
          userName: 'raj',
          time: '20:27',
        },
      ],
    };
  }

  onMessageSend = () => {
    const {
      newMessageText,
      messagesArray,
      isReply,
      repliedMessage,
    } = this.state;
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
    const { messagesArray } = this.state;

    const repliedMessage = messagesArray.find((item) => item.id === messageId);
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

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({ orientation: initial });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  handleMessage(message) {
    this.setState({ newMessageText: message });
  }

  toggleConfirmationModal = () => {
    this.setState({ showConfirmationModal: !this.state.showConfirmationModal });
  };

  onCancel = () => {
    console.log('ChannelChats -> onCancel -> onCancel');
    this.toggleConfirmationModal();
  };

  onConfirm = () => {
    console.log('ChannelChats -> onConfirm -> onConfirm');
    this.toggleConfirmationModal();
  };

  render() {
    const { newMessageText, showConfirmationModal, orientation } = this.state;
    const { currentGroup } = this.props;
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
          menuItems={this.state.headerRightIconMenu}
          image={currentGroup.group_picture}
        />
        <ChatContainer
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
          visible={showConfirmationModal}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.wantToLeaveText')}
        />
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentGroup: state.groupReducer.currentGroup,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GroupChats);
