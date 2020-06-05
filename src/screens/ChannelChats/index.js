import React, {Component, Fragment} from 'react';
import {ImageBackground} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';

import {ChatHeader} from '../../components/Headers';
import {globalStyles} from '../../styles';
import {Images} from '../../constants';
import ChatContainer from '../../components/ChatContainer';
import {translate} from '../../redux/reducers/languageReducer';
import {
  getChannelConversations,
  readAllChannelMessages,
} from '../../redux/reducers/channelReducer';
import {ListLoader} from '../../components/Loaders';
import NoData from '../../components/NoData';

class ChannelChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      newMessageText: '',
      conversations: [],
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
      isReply: false,
      repliedMessage: null,
      messagesArray: [
        {
          id: 990,
          thumbnail: 'www.google.com',
          from_user: {
            id: 93,
            email: 'sourabh.webllisto@gmail.com',
            username: 'sourabh004',
            avatar:
              'https://angelium-media.s3.amazonaws.com/static/avatar/thumb_InShot_20190827_234248134.jpg',
            is_online: false,
          },
          to_user: null,
          created: '2020-05-18T07:18:56.670428Z',
          updated: '2020-05-23T16:27:04.286271Z',
          msg_type: 'image',
          message_body: 'www.google.com',
          mutlilanguage_message_body: {},
          hyperlink: '',
          is_edited: false,
          is_multilanguage: false,
          is_unsent: false,
          bonus_message: false,
          channel: 735,
          reply_to: null,
          schedule_post: 1717,
          subchat: null,
          greeting: null,
          read_by_in_replies: [],
          read_by: [],
          deleted_for: [],
        },
        {
          id: 1,
          message: 'Hello',
          isUser: false,
          userName: 'raj',
          time: '20:20',
        },
        {
          id: 2,
          message: 'HI',
          isUser: true,
          status: 'Read',
          time: '20:21',
        },
        {
          id: 3,
          message:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          isUser: false,
          userName: 'raj',
          time: '20:21',
        },
        {
          id: 4,
          message:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
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
          isUser: true,
          userName: 'raj',
          time: '20:27',
        },
        {
          id: 7,
          messageType: 'image',
          url: 'https://miro.medium.com/max/1400/0*mhcKpcQqduW4KPcB',
          isUser: true,
          time: '20:27',
        },
        {
          id: 8,
          messageType: 'image',
          url:
            'https://www.peakperformance.com/dw/image/v2/BDGL_PRD/on/demandware.static/-/Sites-master-catalog-pp/default/dwe2be5cf8/zoom/G66816006_089_model1.jpg?sw=1110&sh=1480',
          isUser: false,
          userName: 'raj',
          time: '20:27',
        },
        {
          id: 9,
          messageType: 'image',
          url:
            'https://www.peakperformance.com/dw/image/v2/BDGL_PRD/on/demandware.static/-/Sites-master-catalog-pp/default/dwe2be5cf8/zoom/G66816006_089_model1.jpg?sw=1110&sh=1480',
          isUser: true,
          time: '20:27',
        },
        {
          id: 10,
          messageType: 'image',
          url: 'https://miro.medium.com/max/1400/0*mhcKpcQqduW4KPcB',
          isUser: false,
          userName: 'raj',
          time: '20:27',
        },
      ],
    };
  }

  onMessageSend = () => {
    const {newMessageText, conversations} = this.state;
    if (!newMessageText) {
      return;
    }
    const newMessage = {
      id: conversations ? conversations.length + 1 : 1,
      message: newMessageText,
      isUser: true,
      time: '20:27',
    };

    let newMessageArray = conversations ? conversations : [];
    newMessageArray.push(newMessage);
    this.setState({
      conversations: newMessageArray,
      newMessageText: '',
    });
  };

  onMessageSend = () => {
    const {newMessageText, conversations, isReply, repliedMessage} = this.state;
    if (!newMessageText) {
      return;
    }
    let newMessage;
    if (isReply) {
      newMessage = {
        id: conversations ? conversations.length + 1 : 1,
        message: newMessageText,
        isUser: true,
        time: '20:27',
        repliedTo: repliedMessage,
      };
    } else {
      newMessage = {
        id: conversations ? conversations.length + 1 : 1,
        message: newMessageText,
        isUser: true,
        time: '20:27',
      };
    }

    let newMessageArray = conversations ? conversations : [];
    newMessageArray.push(newMessage);
    this.setState({
      conversations: newMessageArray,
      newMessageText: '',
      isReply: false,
      repliedMessage: null,
    });
  };

  onReply = (messageId) => {
    console.log('ChannelChats -> onReply -> messageId', messageId);
    const {conversations} = this.state;

    const repliedMessage = conversations.find((item) => item.id === messageId);
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
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this.props
      .getChannelConversations(this.props.currentChannel.id)
      .then((res) => {
        if (res.status === true && res.conversation.length > 0) {
          this.setState({conversations: res.conversation}, () => {
            console.log(
              'Convertation 1-1-1--1-1-1-1-1-1-1-1-1-1-1--1-1-1-1-1-1-1-1-1-1-1',
              this.state.conversations,
            );
          });
          this.props.readAllChannelMessages(this.props.currentChannel.id);
        }
      });
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  handleMessage(message) {
    this.setState({newMessageText: message});
  }

  renderConversations() {
    const {channelLoading} = this.props;
    const {conversations, newMessageText} = this.state;

    if (channelLoading) {
      return <ListLoader />;
    } else {
      return (
        <ChatContainer
          handleMessage={(message) => this.handleMessage(message)}
          onMessageSend={this.onMessageSend}
          onMessageReply={(id) => this.onReply(id)}
          newMessageText={newMessageText}
          // messages={this.state.conversations}
          messages={conversations}
          orientation={this.state.orientation}
          repliedMessage={this.state.repliedMessage}
          isReply={this.state.isReply}
          cancelReply={this.cancelReply}
        />
      );
    }
  }

  render() {
    const {newMessageText, conversations} = this.state;
    const {currentChannel} = this.props;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
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
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentChannel: state.channelReducer.currentChannel,
    channelLoading: state.channelReducer.loading,
  };
};

const mapDispatchToProps = {
  getChannelConversations,
  readAllChannelMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelChats);
