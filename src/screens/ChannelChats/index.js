import React, { Component, Fragment } from 'react';
import { ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import { ChatHeader } from '../../components/Headers';
import { globalStyles } from '../../styles';
import { Images } from '../../constants';
import ChatContainer from '../../components/ChatContainer';
import {
  translate,
  translateMessage,
} from '../../redux/reducers/languageReducer';
import {
  getChannelConversations,
  readAllChannelMessages,
  sendChannelMessage,
  editChannelMessage,
} from '../../redux/reducers/channelReducer';
import { ListLoader } from '../../components/Loaders';
import { ConfirmationModal } from '../../components/Modals';
class ChannelChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      newMessageText: '',
      conversations: [],
      translatedMessage: null,
      translatedMessageId: null,
      showConfirmationModal: false,
      isEdited: false,
      editMessageId: null,
      headerRightIconMenu: [
        {
          id: 1,
          title: translate('pages.xchat.channelDetails'),
          icon: 'bars',
          onPress: () => {
            this.props.navigation.navigate('ChannelInfo');
          },
        },
      ],
    };
  }

  onMessageSend = () => {
    const { newMessageText, isEdited } = this.state;
    if (!newMessageText) {
      return;
    }
    if (isEdited) {
      this.sendEditMessage();
      return;
    }
    let messageData = {
      channel: this.props.currentChannel.id,
      local_id: '45da06d9-0bc6-4031-b9ba-2cfff1e72013',
      message_body: newMessageText,
      msg_type: 'text',
    };
    this.props
      .sendChannelMessage(messageData)
      .then((res) => {
        this.getChannelConversations();
      })
      .catch((err) => {});
    this.setState({
      newMessageText: '',
      repliedMessage: null,
      isEdited: false,
    });
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

  sendEditMessage = () => {
    const { newMessageText, editMessageId } = this.state;

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
      newMessageText: '',
      repliedMessage: null,
      isEdited: false,
    });
  };

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({ orientation: initial });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this.getChannelConversations();
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  getChannelConversations() {
    this.props
      .getChannelConversations(this.props.currentChannel.id)
      .then((res) => {
        if (res.status === true && res.conversation.length > 0) {
          this.setState({ conversations: res.conversation });
          this.props.readAllChannelMessages(this.props.currentChannel.id);
        }
      });
  }

  handleMessage(message) {
    this.setState({ newMessageText: message });
    if (!message.length && this.state.isEdited) {
      this.onEditClear();
    }
  }

  renderConversations() {
    const { channelLoading } = this.props;
    const {
      conversations,
      newMessageText,
      translatedMessage,
      translatedMessageId,
      orientation,
      repliedMessage,
    } = this.state;

    if (channelLoading && conversations.length <= 0) {
      return <ListLoader />;
    } else {
      return (
        <ChatContainer
          handleMessage={(message) => this.handleMessage(message)}
          onMessageSend={this.onMessageSend.bind(this)}
          newMessageText={newMessageText}
          messages={conversations}
          orientation={orientation}
          repliedMessage={repliedMessage}
          onDelete={(id) => this.onDeletePressed(id)}
          onMessageTranslate={(msg) => this.onMessageTranslate(msg)}
          onMessageTranslateClose={this.onMessageTranslateClose}
          translatedMessage={translatedMessage}
          translatedMessageId={translatedMessageId}
          isChannel={true}
          onEditMessage={(msg) => this.onEdit(msg)}
        />
      );
    }
  }

  // To delete message
  toggleConfirmationModal = () => {
    this.setState((prevState) => ({
      showConfirmationModal: !prevState.showConfirmationModal,
    }));
  };

  onCancel = () => {
    this.toggleConfirmationModal();
  };

  onConfirm = () => {
    this.toggleConfirmationModal();
  };

  onDeletePressed = (messageId) => {
    this.setState({ showConfirmationModal: true });
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
    const { currentChannel, showConfirmationModal, orientation } = this.props;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
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
        />
        {this.renderConversations()}
        <ConfirmationModal
          visible={showConfirmationModal}
          onCancel={this.onCancel.bind(this)}
          onConfirm={this.onConfirm.bind(this)}
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
    currentChannel: state.channelReducer.currentChannel,
    channelLoading: state.channelReducer.loading,
    userData: state.userReducer.userData,
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {
  getChannelConversations,
  readAllChannelMessages,
  sendChannelMessage,
  translateMessage,
  editChannelMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelChats);
