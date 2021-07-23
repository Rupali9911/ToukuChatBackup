import moment from 'moment';
import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  InteractionManager,
} from 'react-native';
import {
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {Colors, Fonts, Icons, Images} from '../../constants';
import {translate} from '../../redux/reducers/languageReducer';
import {addEmotionToFrequentlyUsed} from '../../redux/reducers/chatReducer';
import {addFriendByReferralCode} from '../../redux/reducers/friendReducer';
import {
  setActiveTimelineTab,
  setSpecificPostId,
} from '../../redux/reducers/timelineReducer';
import Button from '../Button';
import ChatMessageBox from '../ChatMessageBox';
import CheckBox from '../CheckBox';
import {ListLoader} from '../Loaders';
import Menu from '../Menu/Menu';
import MenuItem from '../Menu/MenuItem';
import NoData from '../NoData';
import RoundedImage from '../RoundedImage';
import ChatInput from '../TextInputs/ChatInput';
import Toast from '../Toast';
import VideoThumbnailPlayer from '../VideoThumbnailPlayer';
import ChatUpdateInfo from '../ChatUpdateInfo';
import styles from './styles';
import {
  getUserName,
  getUser_ActionFromUpdateText,
  normalize,
} from '../../../src/utils';
import { isEqual } from 'lodash';
import RnBgTask from 'react-native-bg-thread';

const {height} = Dimensions.get('window');

const AUTOSCROLLTOTOPTHRESHOLD = 300;

class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioPlayingId: null,
      perviousPlayingAudioId: null,
      closeMenu: false,
      hideStickerView: false,
      isRepling: false
    };
    this.listCurrentOffset = 0;
    this.enableAutoScroll = true;
  }

  getDate = (date) => {
    const today = moment();
    const yesterday = moment();
    yesterday.subtract(1,'day');
    const msgDate = moment(date);
    if (today.isSame(msgDate, 'day')) {
      return translate('common.today');
    }
    if (yesterday.isSame(msgDate, 'day')) {
      return translate('common.yesterday');
    }
    return moment(msgDate).format('MM/DD');
  };

  onItemPress = (item) => {
    const {isMultiSelect,onSelect} = this.props;
    isMultiSelect && !item.is_unsent && onSelect(item.id);
  }

  infoMenuRef = (item, ref) => {
    this[`_menu_${item.id}`] = ref;
  }

  onInfoDelete = (item) => {
    this.props.onDelete(item.id);
    this.hideMenu(item.id);
  }

  chatBoxRef = (item, view) => {
    this[`message_box_${item.id}`] = view;
    // console.log('ref__',this[`message_box_${item.id}`] && this[`message_box_${item.id}`].callBlinking);
  }

  onAudioPlayPress = (id) => {
    this.setState({
      audioPlayingId: id,
      perviousPlayingAudioId: this.state.audioPlayingId,
    });
  }

  onReplyPress = (index,id) => {
    const {messages} = this.props;
    this.setState({isRepling: true});
    try{
      let searchIndex = this.searchItemIndex(messages,id,index);
      console.log('searchIndex',searchIndex, index, id);
      if(searchIndex >= 0 && searchIndex !== index && (searchIndex - index) < 70){
        this.scrollView.scrollToIndex({
          animated: true,
          index: searchIndex,
          viewPosition: 0.5
        });
        InteractionManager.runAfterInteractions(()=>{
          // console.log('ref_',this[`message_box_${id}`]);
          this[`message_box_${id}`] &&
          this[`message_box_${id}`].callBlinking(id);
          this.setState({isRepling: false});
        });
      } else {
        this[`message_box_${messages[index].id}`] && this[`message_box_${messages[index].id}`].showLoading();
        RnBgTask.runInBackground_withPriority("MIN", () => {
          this.props.onReplyPress(id).then((result)=>{
            setTimeout(() => {
              // this.scrollView && this.scrollView.scrollToOffset({offset: 20, animated: true});
              let searchIndex = this.searchItemIndex(result,id,index);
              // this.scrollView && this.scrollView.scrollToIndex({
              //   animated: true,
              //   index: result.length - 1,
              //   viewPosition: 0.5
              // });
              this.scrollView && this.scrollView.scrollToEnd({animated: true});
              this[`message_box_${messages[index].id}`] && this[`message_box_${messages[index].id}`].hideLoading();
              setTimeout(() => {
                // console.log('ref_',this[`message_box_${id}`]);
                this[`message_box_${id}`] &&
                this[`message_box_${id}`].callBlinking(id);
                this.setState({isRepling: false});
              },2000);
            }, 500);
          });
        });
      }
    }catch(err){
      console.log('error on replay click', err);
      this.setState({isRepling: false});
    }
  }

  renderMessageItem = ({item, index}) => {
    const {
      messages,
      isChatDisable,
      isMultiSelect,
      onSelect,
      selectedIds,
    } = this.props;

    const conversationLength = messages.length;
    let isSelected = selectedIds.includes(item.id + '');
    return (
      <>
        <View style={styles.listItemContainer}>
          {isMultiSelect && !item.is_unsent && (
            <CheckBox
              isChecked={isSelected}
              onCheck={onSelect.bind(null,item.id)}
            />
          )}
          {item.msg_type &&
          item.msg_type === 'update' &&
          !item.message_body.includes('add a memo') ? (
              <ChatUpdateInfo
                isMultiSelect={isMultiSelect}
                text={this.renderUpdate(item)}
                onItemPress={this.onItemPress.bind(this, item)}
                infoMenuRef={this.infoMenuRef.bind(this, item)}
                showMenu={this.showMenu.bind(this, item.id)}
                onInfoDelete={this.onInfoDelete.bind(this, item)}
              />
          ) : (
            <TouchableOpacity
              style={styles.singleFlex}
              disabled={!isMultiSelect}
              onPress={this.onItemPress.bind(this,item)}>
              <ChatMessageBox
                ref={this.chatBoxRef.bind(this,item)}
                key={item.id}
                message={item}
                isUser={
                  item.from_user.id === this.props.userData.id ||
                  item.from_user === this.props.userData.id
                    ? item.to_user &&
                      item.to_user.id === this.props.userData.id
                      ? false
                      : item.schedule_post
                      ? false
                      : true
                    : false
                }
                time={new Date(item.created)}
                isChannel={this.props.isChannel}
                currentChannel={this.props.currentChannel}
                is_read={item.is_read}
                onMessageReply={this.props.onMessageReply}
                onMessageTranslate={this.props.onMessageTranslate}
                onMessageTranslateClose={this.props.onMessageTranslateClose}
                onEditMessage={this.props.onEditMessage}
                onDownloadMessage={this.props.onDownloadMessage}
                translatedMessage={this.props.translatedMessage}
                translatedMessageId={this.props.translatedMessageId}
                onDelete={this.props.onDelete}
                onUnSend={this.props.onUnSendMsg}
                orientation={this.props.orientation}
                audioPlayingId={this.state.audioPlayingId}
                // closeMenu={this.state.closeMenu}
                perviousPlayingAudioId={this.state.perviousPlayingAudioId}
                onAudioPlayPress={this.onAudioPlayPress}
                onReplyPress={this.onReplyPress.bind(this,index)}
                showOpenLoader={this.props.showOpenLoader}
                isMultiSelect={isMultiSelect}
                isChatDisable={isChatDisable}
                onMediaPlay={this.props.onMediaPlay}
                UserDisplayName={this.props.UserDisplayName}
                userData={this.props.userData}
                addFriendByReferralCode={this.props.addFriendByReferralCode}
                setSpecificPostId={this.props.setSpecificPostId}
                setActiveTimelineTab={this.props.setActiveTimelineTab}
              />
            </TouchableOpacity>
          )}
        </View>
        {(messages[index + 1] &&
          new Date(item.created).getDate() !==
            new Date(messages[index + 1].created).getDate()) ||
        index === conversationLength - 1 ? (
          item.message_body == null && !item.is_unsent ? null : (
            <>
              <View style={styles.messageDateCntainer}>
                <View style={styles.messageDate}>
                  <Text style={styles.messageDateText}>
                    {this.getDate(item.created)}
                  </Text>
                </View>
              </View>
            </>
          )
        ) : null}
      </>
    );
  };

  closeMenu = () => {
    if (!this.state.closeMenu) {
      this.setState({
        closeMenu: true,
      });
    }
  };

  closeMenuFalse = () => {
    if (this.state.closeMenu) {
      this.setState({
        closeMenu: false,
      });
    }
  };

  searchItemIndex = (data, id, idx) => {
    var result = idx;
    data.map((item, index) => {
      if (item.id === id) {
        result = index;
      }
    });
    return result;
  };

  hideMenu = (id) => {
    this[`_menu_${id}`] && this[`_menu_${id}`].hide();
    this.setState({visible: false});
  };

  showMenu = (id) => {
    this[`_menu_${id}`] && this[`_menu_${id}`].show();
    this.setState({visible: true});
  };

  renderUpdate = (message) => {
    let update_text = '';
    if (message && message.msg_type === 'update') {
      let update_obj = getUser_ActionFromUpdateText(message.message_body);
      let update_by =
        message.from_user.id == this.props.userData.id
          ? translate('pages.xchat.you')
          : getUserName(message.from_user.id) ||
            message.from_user.display_name ||
            message.from_user.username;
      let update_to =
        update_obj.user_id == this.props.userData.id
          ? translate('pages.xchat.you')
          : getUserName(update_obj.user_id) || update_obj.user_name;
      // console.log('update_to',update_obj);
      if (update_obj.action === 'left') {
        update_text = translate('common.leftGroup', {username: update_by});
      } else if (update_obj.action === 'added') {
        if (update_by === update_to) {
          update_text = translate('pages.xchat.userJoinedGroup', {
            displayName: update_by,
          });
        } else {
          update_text = translate('common.addedInGroup', {
            username: update_by,
            toUsername: update_to,
          });
        }
      } else if (update_obj.action === 'removed') {
        update_text = translate('common.removedToGroup', {
          username: update_by,
          toUsername: update_to,
        });
      } else if (message.message_body.includes('liked the memo')) {
        update_text = translate('common.likedTheMemo', {
          username: update_by,
          toUsername: update_to,
        });
      } else if (message.message_body.includes('commented on the memo')) {
        update_text = translate('common.commentonMemo', {
          username: update_by,
          toUsername: update_to,
        });
      }
      return update_text;
    }
  };

  onScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.y;
    const visibleLength = event.nativeEvent.layoutMeasurement.height;
    const contentLength = event.nativeEvent.contentSize.height;

    this.listCurrentOffset = offset;

    // Check if scroll has reached either start of end of list.
    const isScrollAtStart = offset < 50;
    // const isScrollAtEnd = contentLength - visibleLength - offset < onEndReachedThreshold;
    console.log('this.listCurrentOffset',this.listCurrentOffset);
    if(isScrollAtStart && !this.state.isRepling){
      console.log('isScrollAtStart');
      this.props.onScrollToStart && this.props.onScrollToStart();
    }

  }

  onEndReached = () => {
    const {isChannel, friendLoading, isLoadMore, channelLoading, messages, onLoadMore} = this.props;
    if (isChannel) {
      if (!channelLoading) {
        console.log('load more');
        onLoadMore && onLoadMore(messages[messages.length - 1]);
      }
    } else {
      if (!friendLoading) {
        onLoadMore && onLoadMore(messages[messages.length - 1]);
      }
    }
  }

  onScrollToIndexFailed = (info) => {
    console.log('onScrollToIndexFailed_info',info);
    let offset = info.averageItemLength * info.index;
    console.log('onScrollToIndexFailed_info',offset);
    this.scrollView.scrollToOffset({offset: offset, animated: true});
  }

  listFooterComponent = () => {
    const {channelLoading,friendLoading,isChannel} = this.props;
    if(isChannel && channelLoading){
      return <ListLoader />
    }else if(friendLoading){
      return <ListLoader />
    }
    return null;
  }

  listEmptyComponent = () => (
    <NoData
      title={translate('pages.xchat.startANewConversationHere')}
      source={Images.image_conversation}
      imageColor={Colors.primary}
      imageAvailable
      style={{transform: [{rotate: '180deg'}]}}
      textStyle={{transform: [{rotateY: '180deg'}]}}
    />
  )

  listRef = (view) => {
    this.scrollView = view;
  }

  listKeyExtractor = (item, index) => {
    return `_${item.id}`;
  }

  onScrollBeginDrag = () => {
    this.closeMenu();
  }

  onScrollEndDrag = () => {
    this.closeMenuFalse();
  }

  onSend = (newMessageText) => {
    const {onMessageSend, handleMessage, messages} = this.props;
    if (newMessageText && newMessageText.trim().length > 0) {
      onMessageSend(newMessageText,()=>{
        if(this.listCurrentOffset > AUTOSCROLLTOTOPTHRESHOLD){
          setTimeout(()=>{
            messages.length > 0 &&
            this.scrollView &&
            this.scrollView.scrollToIndex({index: 0, animated: true});
          },100);
        }
      });
    } else {
      handleMessage('');
    }
  }

  scrollToTop = () => {
    const {messages} = this.props;
    console.log('height',this.chat_input.getHeight());
    // if(this.listCurrentOffset > AUTOSCROLLTOTOPTHRESHOLD){
      setTimeout(()=>{
        messages.length > 0 &&
        this.scrollView &&
        // this.scrollView.scrollToIndex({index: 0, animated: true});
        this.scrollView.scrollToOffset({offset: this.chat_input.getHeight(), animated: true});
      },100);
    // }
  }

  onStartShouldSetResponder = (event) => {
    const {isChatDisable} = this.props;
    const {hideStickerView} = this.state;
    if (!isChatDisable){
      console.log('onStartShouldSetResponder called');
        // this.setState({hideStickerView: !hideStickerView})
        this.chat_input && this.chat_input.hideStickerView();
    }
  }

  onDeletePress = () => {
    const {selectedIds, onSelectedDelete} = this.props;
    if (selectedIds.length) {
      onSelectedDelete();
    } else {
      Toast.show({
        title: translate('pages.xchat.touku'),
        text: translate('pages.xchat.invalidMsgDelete'),
        type: 'primary',
      });
    }
  }

  chatInputRefs = (chat_input) => {
    this.chat_input = chat_input;
  }

  shouldComponentUpdate(nextProps, nextState){
    if(
      !isEqual(nextProps.newMessageText,this.props.newMessageText) ||
      !isEqual(nextProps.sendEnable,this.props.sendEnable) ||
      !isEqual(nextProps.messages,this.props.messages) ||
      !isEqual(nextProps.orientation,this.props.orientation) ||
      !isEqual(nextProps.repliedMessage,this.props.repliedMessage) ||
      !isEqual(nextProps.isReply,this.props.isReply) ||
      !isEqual(nextProps.isMultiSelect,this.props.isMultiSelect) ||
      !isEqual(nextProps.selectedIds,this.props.selectedIds) ||
      !isEqual(nextProps.isLoadMore,this.props.isLoadMore) ||
      !isEqual(nextProps.UserDisplayName,this.props.UserDisplayName) ||
      !isEqual(nextProps.userData,this.props.userData) ||
      !isEqual(nextProps.currentChannel,this.props.currentChannel) ||
      !isEqual(nextProps.currentFriend,this.props.currentFriend) ||
      !isEqual(nextProps.channelLoading,this.props.channelLoading) ||
      !isEqual(nextProps.friendLoading,this.props.friendLoading) ||
      !isEqual(nextProps.emotions,this.props.emotions) ||
      !isEqual(nextProps.sendingImage,this.props.sendingImage)
      ){
      console.log('re-render by props');
      this.enableAutoScroll = (nextProps.messages.length - this.props.messages.length) < 5; 
      return true;
    }else if(!isEqual(nextState,this.state)){
      return true;
    }
    return false;
  }

  render() {
    const {
      orientation,
      isReply,
      messages,
      repliedMessage,
      handleMessage,
      onMessageSend,
      newMessageText,
      cancelReply,
      onCameraPress,
      onGalleryPress,
      onAttachmentPress,
      sendingImage,
      currentChannel,
      channelLoading,
      friendLoading,
      sendEnable,
      isMultiSelect,
      onSelect,
      selectedIds,
      onSelectedCancel,
      onSelectedDelete,
      currentFriend,
      isChatDisable,
      onLoadMore,
      isLoadMore,
      sendEmotion,
    } = this.props;
    const{hideStickerView} = this.state

    const replayContainer = [
      {
        height: repliedMessage && repliedMessage.msg_type !== 'text' ? 100 : 80,
      },
      styles.replayContainer,
    ];

    console.log('messages length',messages.length);
    return (
      <View
        style={styles.singleFlex}
        // contentContainerStyle={styles.singleFlex}
        // showsVerticalScrollIndicator={false}
        // bounces={false}
        // ref={(view) => {
        //   this.keyboardAwareScrollView = view;
        // }}
        // keyboardShouldPersistTaps={'always'}
        // onKeyboardWillShow={() => {
        //   this.keyboardAwareScrollView &&
        //     this.keyboardAwareScrollView.scrollToEnd({animated: false});
        // }}
        // keyboardOpeningTime={1500}
        // scrollEnabled={false}
        // extraHeight={200}
        onStartShouldSetResponder={this.onStartShouldSetResponder}
        >
        <View
          style={[
            styles.messageAreaConatiner,
            {
              paddingBottom:
                Platform.OS === 'android'
                  ? orientation === 'PORTRAIT'
                    ? height * 0
                    : height * 0.05
                  : orientation === 'PORTRAIT'
                  ? height * 0
                  : height * 0.03,
            },
          ]}>
          <>
            <FlatList
              // style={{backgroundColor: 'red'}}
              enableResetScrollToCoords={false}
              contentContainerStyle={[
                styles.messareAreaScroll,
                // isReply && styles.keyboardFlatlistContentContainer,
              ]}
              ref={this.listRef}
              // onContentSizeChange={() => {
              //   if (this.props.translatedMessageId) {
              //   } else {
              //     // messages.length>0 && this.scrollView.scrollToIndex({index:0, animated: false });
              //   }
              // }}
              // getItemLayout={(data, index) => (
              //   {length: 250, offset: 250 * index, index}
              // )}
              onScrollToIndexFailed={this.onScrollToIndexFailed}
              automaticallyAdjustContentInsets
              contentInsetAdjustmentBehavior={'automatic'}
              decelerationRate={'normal'}
              // onScrollBeginDrag={this.onScrollBeginDrag}
              // onScrollEndDrag={this.onScrollEndDrag}
              onScroll={this.onScroll}
              data={messages}
              inverted={true}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={0.1}
              ListFooterComponent={this.listFooterComponent}
              renderItem={this.renderMessageItem}
              ListEmptyComponent={this.listEmptyComponent}
              keyExtractor={this.listKeyExtractor}
              initialNumToRender={15}
              maintainVisibleContentPosition={{
                // autoscrollToTopThreshold: this.enableAutoScroll?AUTOSCROLLTOTOPTHRESHOLD:undefined,
                minIndexForVisible: 1,
              }}
            />
          </>
          {isReply ? (
            <View style={replayContainer}>
              <View style={styles.replyHeader}>
                <View style={styles.replyUser}>
                  <Text numberOfLines={2} style={{color: Colors.gradient_1}}>
                    {this.props.isChannel ||
                    repliedMessage.from_user.id === this.props.userData.id
                      ? repliedMessage.from_user.id === this.props.userData.id
                        ? translate('pages.xchat.you')
                        : this.props.isChannel
                        ? currentChannel.name
                        : repliedMessage.from_user.display_name
                        ? repliedMessage.from_user.display_name
                        : repliedMessage.from_user.username
                      : currentFriend.display_name
                      ? currentFriend.display_name
                      : currentFriend.username}
                  </Text>
                </View>
                <View style={styles.replyCloseIcon}>
                  <TouchableOpacity
                    style={styles.replyCloseActionContainer}
                    onPress={cancelReply}>
                    <Image source={Icons.icon_close} style={styles.closeIcon} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.messageTypeContainer}>
                {repliedMessage.msg_type === 'image' &&
                repliedMessage.message_body !== null ? (
                  <RoundedImage
                    source={{uri: repliedMessage.message_body}}
                    isRounded={false}
                    size={50}
                  />
                ) : repliedMessage.msg_type === 'video' ? (
                  <VideoThumbnailPlayer
                    url={repliedMessage.message_body}
                    showPlayButton
                  />
                ) : repliedMessage.msg_type === 'audio' ? (
                  <>
                    <Text style={styles.mediaMessageBody}>
                      {repliedMessage.message_body
                        .split('/')
                        .pop()
                        .split('%2F')
                        .pop()}
                    </Text>
                    <View style={styles.mediaContainer}>
                      <FontAwesome
                        name={'volume-up'}
                        size={15}
                        color={Colors.black_light}
                      />
                      <Text style={styles.mediaLabel}>Audio</Text>
                    </View>
                  </>
                ) : repliedMessage.msg_type === 'doc' ? (
                  <>
                    <Text style={styles.mediaMessageBody}>
                      {repliedMessage.message_body
                        .split('/')
                        .pop()
                        .split('%2F')
                        .pop()}
                    </Text>
                    <View style={styles.mediaContainer}>
                      <FontAwesome
                        name={'file-o'}
                        size={15}
                        color={Colors.black_light}
                      />
                      <Text style={styles.mediaLabel}>File</Text>
                    </View>
                  </>
                ) : (
                  <Text numberOfLines={2} style={{fontFamily: Fonts.regular}}>
                    {repliedMessage.message_body}
                  </Text>
                )}
                {/* <Text numberOfLines={2} style={{fontFamily: Fonts.regular}}>
                  {repliedMessage.message_body}
                </Text> */}
              </View>
            </View>
          ) : null}
        </View>
        {isMultiSelect ? (
          <View style={styles.multiSelectContainer}>
            <View style={styles.singleFlex}>
              <Button
                title={translate('common.cancel')}
                onPress={onSelectedCancel}
                isRounded={true}
                type={'secondary'}
                fontType={'smallRegularText'}
                height={40}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.singleFlex}>
              <Button
                title={
                  translate('common.delete') +
                  (selectedIds.length ? ` (${selectedIds.length})` : '')
                }
                onPress={this.onDeletePress}
                isRounded={true}
                fontType={'smallRegularText'}
                height={40}
              />
            </View>
          </View>
        ) : isChatDisable ? null : (
          <ChatInput
            ref={this.chatInputRefs}
            sendEmotion={sendEmotion}
            onAttachmentPress={onAttachmentPress}
            onCameraPress={onCameraPress}
            onGalleryPress={onGalleryPress}
            onChangeText={handleMessage}
            onSend={this.onSend}
            value={newMessageText}
            sendEnable={sendEnable}
            placeholder={translate('pages.xchat.enterMessage')}
            sendingImage={sendingImage}
            hideStickerView={hideStickerView}
            emotions={this.props.emotions}
            addEmotionToFrequentlyUsed={this.props.addEmotionToFrequentlyUsed}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
    currentChannel: state.channelReducer.currentChannel,
    currentFriend: state.friendReducer.currentFriend,
    channelLoading: state.channelReducer.loading,
    friendLoading: state.friendReducer.loading,
    emotions: state.chatReducer.emotions,
  };
};

const mapDispatchToProps = {
  addEmotionToFrequentlyUsed,
  addFriendByReferralCode,
  setSpecificPostId,
  setActiveTimelineTab,
};

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(ChatContainer);
