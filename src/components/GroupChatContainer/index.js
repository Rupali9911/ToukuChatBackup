import moment from 'moment';
import React, {Component, Fragment} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import { FlatList } from 'react-native-bidirectional-infinite-scroll';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { FAB } from 'react-native-paper';
import {connect} from 'react-redux';
import Menu from '../../components/Menu/Menu';
import MenuItem from '../../components/Menu/MenuItem';
import {Colors, Fonts, Icons, Images, SocketEvents} from '../../constants';
import {translate} from '../../redux/reducers/languageReducer';
import {getUserName, getUser_ActionFromUpdateText, eventService} from '../../utils';
import Button from '../Button';
import CheckBox from '../CheckBox';
import GroupChatMessageBox from '../GroupChatMessageBox';
import NoData from '../NoData';
import RoundedImage from '../RoundedImage';
import ChatInput from '../TextInputs/ChatInput';
import Toast from '../Toast';
import VideoThumbnailPlayer from '../VideoThumbnailPlayer';
import styles from './styles';
import {
  setActiveTimelineTab,
  setSpecificPostId,
} from '../../redux/reducers/timelineReducer';
import { addFriendByReferralCode } from '../../redux/reducers/friendReducer';
import { markGroupConversationRead } from '../../redux/reducers/groupReducer';

const {height} = Dimensions.get('window');

class GroupChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioPlayingId: null,
      previousPlayingAudioId: null,
      closeMenu: false,
      isActionButtonVisible: false,
      unreadMessage: [],
      unreadMessageCount: 0
    };
    this._listViewOffset = 0;
  }

  componentDidMount(){
    this.events = eventService.getMessage().subscribe((message) => {
      this.checkEventTypes(message);
    });
  }

  checkEventTypes = (message) => {
    switch (message.text.data.type) {
      case SocketEvents.READ_ALL_MESSAGE_GROUP_CHAT:
        
        break;
      case SocketEvents.NEW_MESSAGE_IN_GROUP:
        this.onNewMessageInGroup(message);
        break;
    }
  }

  onNewMessageInGroup = (message) => {
    if(message.text.data.message_details.group_id == this.props.currentGroup.group_id){
      
      if(this._listViewOffset <= 400){
        setTimeout(()=>{
          this.scrollListToRecent();
        },1000);
      }else{
        let array = this.state.unreadMessage;
        let set = new Set(array);
        set.add(message.text.data.message_details.msg_id);
        
        let item = message.text.data.message_details.unread_msg.filter(
          (msg) => {
            return msg.user__id === this.props.userData.id;
          },
        );
        console.log('items',[...set]);
        this.setState({
          unreadMessage: [...set],
          unreadMessageCount: item.length > 0 ? item[0].unread_count : 0
        });
      }

    }
  }

  getDate = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const msgDate = new Date(date);
    if (
      today.getDate() === msgDate.getDate() &&
      today.getMonth() === msgDate.getMonth()
    ) {
      return translate('common.today');
    }
    if (
      yesterday.getDate() === msgDate.getDate() &&
      yesterday.getMonth() === msgDate.getMonth()
    ) {
      return translate('common.yesterday');
    }
    return moment(msgDate).format('MM/DD');
  };

  testMethod(messages, index, item, conversationLength) {
    return (
      <>
        {(messages[index + 1] &&
          new Date(item.timestamp).getDate() !==
            new Date(messages[index + 1].timestamp).getDate()) ||
        index === conversationLength - 1 ? (
          item.message_body == null ? null : (
            <Fragment>
              <View style={styles.messageDateContainer}>
                <View style={styles.messageDate}>
                  <Text style={styles.messageDateText}>
                    {this.getDate(item.timestamp)}
                  </Text>
                </View>
              </View>
            </Fragment>
          )
        ) : null}
      </>
    );
  }

  markGroupConversationRead() {
    let data = {group_id: this.props.currentGroup.group_id};
    this.props.markGroupConversationRead(data);
  }

  scrollListToRecent = () => {
    this.scrollView && this.scrollView.scrollToOffset({offset: 10, animated: true});
  }

  scrollListToEnd = () => {
    this.scrollView && this.scrollView.scrollToIndex({index: 0, animated: false});
  }

  renderMessage = ({item,index}) => {
    const {
      messages,
      memberCount,
      groupMembers,
      isMultiSelect,
      onSelect,
      selectedIds 
    } = this.props;
    
    const conversationLength = messages.length;
    let isSelected = selectedIds.includes(item.msg_id + '');
    
    const messageBodyContainer = [
      {marginLeft: isMultiSelect ? -35 : 0},
      styles.messageBodyContainer,
    ];

    return (
      <Fragment key={`${item.msg_id}`}>
        <View style={styles.itemContainer}>
          {isMultiSelect && !item.is_unsent && (
            <CheckBox
              isChecked={isSelected}
              onCheck={() => onSelect(item.msg_id)}
            />
          )}
          {item.message_body &&
            item.message_body.type &&
            item.message_body.type === 'update' &&
            !item.message_body.text.includes('add a memo') ? (
              <TouchableOpacity
                style={messageBodyContainer}
                onPress={() => {
                  isMultiSelect &&
                    !item.is_unsent &&
                    onSelect(item.msg_id);
                }}>
                <Menu
                  ref={(ref) => {
                    this[`_menu_${item.msg_id}`] = ref;
                  }}
                  style={styles.menuStyle}
                  tabHeight={110}
                  headerHeight={80}
                  button={
                    <TouchableOpacity
                      disabled={isMultiSelect}
                      onLongPress={() => {
                        this.showMenu(item.msg_id);
                      }}
                      style={styles.menuButtonActionStyle}>
                      <View style={styles.menuButtonActionContainer}>
                        <Text style={styles.messageDateText}>
                          {this.renderGroupUpdate(item)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  }>
                  <MenuItem
                    onPress={() => {
                      this.props.onDelete(item.msg_id);
                      this.hideMenu(item.msg_id);
                    }}
                    customComponent={
                      <View
                        style={
                          styles.menuItemCustomComponentContainer
                        }>
                        <FontAwesome5
                          name={'trash'}
                          size={20}
                          color={Colors.white}
                        />
                        <Text style={styles.deleteLabel}>
                          {translate('common.delete')}
                        </Text>
                      </View>
                    }
                  />
                </Menu>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.singleFlex}
                disabled={!isMultiSelect}
                onPress={() => {
                  isMultiSelect &&
                    !item.is_unsent &&
                    onSelect(item.msg_id);
                }}>
                <GroupChatMessageBox
                  ref={(view) => {
                    this[`message_box_${item.msg_id}`] = view;
                  }}
                  key={item.msg_id}
                  message={item}
                  isUser={item.sender_id === this.props.userData.id}
                  time={new Date(item.created)}
                  isRead={!!(item.read_count && item.read_count > 0)}
                  memberCount={memberCount}
                  onMessageReply={this.props.onMessageReply}
                  orientation={this.props.orientation}
                  onMessageTranslate={(msg) =>
                    this.props.onMessageTranslate(msg,index)
                  }
                  onMessageTranslateClose={(msg) => this.props.onMessageTranslateClose(msg,index)}
                  translatedMessage={this.props.translatedMessage}
                  translatedMessageId={this.props.translatedMessageId}
                  onDelete={(id) => this.props.onDelete(id)}
                  onUnSend={(id) => this.props.onUnSendMsg(id)}
                  onEditMessage={(msg) =>
                    this.props.onEditMessage(msg)
                  }
                  onDownloadMessage={(msg) => {
                    this.props.onDownloadMessage(msg);
                  }}
                  audioPlayingId={this.state.audioPlayingId}
                  previousPlayingAudioId={
                    this.state.previousPlayingAudioId
                  }
                  closeMenu={this.state.closeMenu}
                  onAudioPlayPress={(id) => {
                    this.setState({
                      audioPlayingId: id,
                      previousPlayingAudioId: this.state
                        .audioPlayingId,
                    });
                  }}
                  onReplyPress={(id) => {
                    // this.scrollView.scrollToIndex({
                    //   animated: true,
                    //   index: this.searchItemIndex(
                    //     messages,
                    //     item.msg_id,
                    //     index,
                    //   )+10,
                    // });
                    let reply_index = this.searchItemIndex(messages,id,index)
                    console.log('reply_index',reply_index,index);
                    if(reply_index!==index){
                      this.scrollView.scrollToIndex({
                          animated: true,
                          index: reply_index,
                        });
                        this[`message_box_${id}`] &&
                          this[`message_box_${id}`].callBlinking(id);
                    }else{
                      this.props.onReplyPress(id,(conversations)=>{
                        this.scrollView && this.scrollView.scrollToOffset({offset: 20, animated: false});
                        setTimeout(()=>{
                          // this.scrollView && this.scrollView.scrollToOffset({offset: 20, animated: true});
                          let new_index = this.searchItemIndex(
                            conversations,
                            id,
                            index,
                          );
                          this[`message_box_${id}`] &&
                          this[`message_box_${id}`].callBlinking(id);
                          this.scrollView && this.scrollView.scrollToIndex({
                            animated: true,
                            index: new_index,
                          });
                        },500);
                      })
                    }
                  }}
                  groupMembers={groupMembers}
                  showOpenLoader={this.props.showOpenLoader}
                  isMultiSelect={isMultiSelect}
                  onMediaPlay={this.props.onMediaPlay}
                  addFriendByReferralCode={this.props.addFriendByReferralCode}
                  setActiveTimelineTab={this.props.setActiveTimelineTab}
                  setSpecificPostId={this.props.setSpecificPostId}
                  userData={this.props.userData}
                />
              </TouchableOpacity>
            )}
        </View>
        {this.testMethod(messages, index, item, conversationLength)}
      </Fragment>
    );
  };

  keyExtractor = (item, index) => {
    return `${item.msg_id}`;
  }

  listEmptyComponent = () => {
    return <NoData
      title={translate('pages.xchat.startANewConversationHere')}
      source={Images.image_conversation}
      imageColor={Colors.primary}
      imageAvailable
      style={{ transform: [{ rotate: '180deg' }] }}
      textStyle={{ transform: [{ rotateY: '180deg' }] }}
    />
  }

  renderGroupUpdate = (message) => {
    let update_text = '';
    if (message && message.message_body.type === 'update') {
      let update_obj = getUser_ActionFromUpdateText(message.message_body.text);
      let update_by =
        message.sender_id === this.props.userData.id
          ? translate('pages.xchat.you')
          : getUserName(message.sender_id) ||
            message.sender_display_name ||
            message.sender_username;
      let update_to =
        update_obj.user_id === this.props.userData.id
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
      } else if (message.message_body.text.includes('liked the memo')) {
        update_text = translate('common.likedTheMemo', {
          username: update_by,
          toUsername: update_to,
        });
      } else if (message.message_body.text.includes('commented on the memo')) {
        update_text = translate('common.commentonMemo', {
          username: update_by,
          toUsername: update_to,
        });
      }
      return update_text;
    }
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
    let result = idx;
    data.map((item, index) => {
      if (item.msg_id === id) {
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

  _onScroll = (event) => {
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = event.nativeEvent.contentOffset.y
    const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
      ? 'down'
      : 'up'
    // If the user is scrolling down (and the action-button is still visible) hide it
    // const isActionButtonVisible = direction === 'up'
    const isActionButtonVisible = currentOffset > 50;
    if (isActionButtonVisible !== this.state.isActionButtonVisible) {
      this.setState({ isActionButtonVisible })
    }
    // Update your scroll position
    console.log('scroll position',this._listViewOffset);
    this._listViewOffset = currentOffset
  }
  
  onViewableItemsChanged = ({ viewableItems, changed }) => {
    // console.log("Visible items are", viewableItems);
    // console.log("Changed in this iteration", changed);
    let array = this.state.unreadMessage;

    if(
      viewableItems.length > 0 &&
      array.includes(viewableItems[0].item.msg_id)
    ) {
      let searchIndex = array.findIndex((_) => _ == viewableItems[0].item.msg_id);
        if(searchIndex >= 0){
          array.splice(searchIndex,1);
          this.setState({unreadMessage: array});
        }
    }
    
    // console.log('viewableItems[0].index',viewableItems[0].index);
    // console.log('viewableItems[0].item.msg_id',viewableItems[0].item.msg_id,this.props.currentGroup.last_msg_id);
    // console.log('this.props.currentGroup.unread_msg',this.props.currentGroup.unread_msg);
    if (
      viewableItems.length > 0 &&
      viewableItems[0].index == 0 &&
      viewableItems[0].item.msg_id >= this.props.currentGroup.last_msg_id &&
      this.props.currentGroup.unread_msg > 0
    ) {
      this.markGroupConversationRead();
    }

    // viewableItems.map((item,index)=>{
    //     let searchIndex = array.findIndex((_) => _ == item.item.msg_id);
    //     if(searchIndex >= 0){
    //       array.splice(searchIndex,1);
    //       this.setState({unreadMessage: array});
    //     }
    //     if (this.props.currentGroup.unread_msg>0 && item.item.msg_id == this.props.currentGroup.last_msg_id){
          
    //     }
    // });
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
      groupMembers,
      isMultiSelect,
      selectedIds,
      onSelectedCancel,
      onSelectedDelete,
      isChatDisable,
      groupLoading,
      onLoadMore,
      onLoadPrevious
    } = this.props;
    const {isActionButtonVisible,unreadMessage,unreadMessageCount} = this.state;
    // console.log('isChatDisable', isChatDisable);


    const replyContainer = [
      {
        height:
          repliedMessage && repliedMessage.message_body.type !== 'text'
            ? 100
            : 80,
      },
      styles.replyContainer,
    ];

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.singleFlex}
        showsVerticalScrollIndicator={false}
        bounces={false}
        ref={(view) => {
          this.keyboardAwareScrollView = view;
        }}
        keyboardShouldPersistTaps={'always'}
        onKeyboardWillShow={() => {
          this.keyboardAwareScrollView.scrollToEnd({animated: false});
        }}
        maintainVisibleContentPosition={{minIndexForVisible: 5}}
        keyboardOpeningTime={1500}
        scrollEnabled={false}
        extraHeight={200}>
        <View
          style={[
            styles.messageAreaContainer,
            {
              paddingBottom:
                Platform.OS === 'android'
                  ? orientation === 'PORTRAIT'
                    ? 0
                    : height * 0.05
                  : orientation === 'PORTRAIT'
                  ? 0
                  : height * 0.03,
            },
          ]}>
          <Fragment>
            <FlatList
              // enableResetScrollToCoords={false}
              contentContainerStyle={[
                styles.messageAreaScroll,
                isReply && styles.replyPadding,
              ]}
              ref={(view) => {
                this.scrollView = view;
              }}
              onScrollBeginDrag={this.closeMenu}
              onScrollEndDrag={this.closeMenuFalse}
              // extraData={this.state}
              data={messages}
              inverted={true}
              // contentOffset={{x: 0, y: 20}}
              onScroll={this._onScroll}
              onStartReached={onLoadMore}
              onEndReached={onLoadPrevious.bind(null,this._listViewOffset)}
              onEndReachedThreshold={100}
              // showDefaultLoadingIndicators={true}
              // ListFooterComponent={() =>
              //   isLoadMore ? <ListLoader /> : null
              // }
              onViewableItemsChanged={this.onViewableItemsChanged}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 50
              }}
              initialNumToRender={15}
              maxToRenderPerBatch={15}
              updateCellsBatchingPeriod={60}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderMessage}
              ListEmptyComponent={this.listEmptyComponent}
            />
          </Fragment>
          {/* <ScrollView
            contentContainerStyle={[
              styles.messareAreaScroll,
              isReply && { paddingBottom: '20%' },
            ]}
            ref={(view) => {
              this.scrollView = view;
            }}
            onContentSizeChange={(contentWidth, contentHeight) => {
              if(this.props.translatedMessageId){}else{
                this.scrollView.scrollToEnd({ animated: false });
              }
            }}
            onScrollBeginDrag={() => {
              this.closeMenu();
            }}
            onScrollEndDrag={() => {
              this.closeMenuFalse();
            }}
          >
            <View style={styles.messageContainer}>
              {this.renderMessage(messages)}
            </View>
          </ScrollView> */}

          <FAB
            style={styles.fab}
            animated={false}
            // icon={() => <FontAwesome5 name="chevron-down" size={25} color={'white'} style={{alignSelf:'center'}}/>}
            icon={unreadMessage.length>0?null:'chevron-down'}
            label={unreadMessage.length>0?`+${unreadMessage.length}`:null}
            color={'white'}
            visible={isActionButtonVisible}
            onPress={() => {
              this.scrollListToRecent();
            }}
          />

          {isReply ? (
            <View style={replyContainer}>
              <View style={styles.replySubContainer}>
                <View style={styles.usernameContainer}>
                  <Text numberOfLines={2} style={styles.usernameTextStyle}>
                    {repliedMessage.sender_id === this.props.userData.id
                      ? translate('pages.xchat.you')
                      : repliedMessage.sender_display_name
                      ? repliedMessage.sender_display_name
                      : repliedMessage.sender_username}
                  </Text>
                </View>
                <View style={styles.cancelContainer}>
                  <TouchableOpacity
                    style={styles.cancelActionContainer}
                    onPress={cancelReply}>
                    <Image
                      source={Icons.icon_close}
                      style={styles.cancelIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.repliedMessageContainer}>
                {repliedMessage.message_body.type === 'image' &&
                repliedMessage.message_body.text !== null ? (
                  <RoundedImage
                    source={{url: repliedMessage.message_body.text}}
                    isRounded={false}
                    size={50}
                  />
                ) : repliedMessage.message_body.type === 'video' ? (
                  <VideoThumbnailPlayer
                    url={repliedMessage.message_body.text}
                    showPlayButton
                  />
                ) : repliedMessage.message_body.type === 'audio' ? (
                  <Fragment>
                    <Text style={styles.mediaMessage}>
                      {repliedMessage.message_body?.text
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
                  </Fragment>
                ) : repliedMessage.message_body.type === 'doc' ? (
                  <Fragment>
                    <Text style={styles.mediaMessage}>
                      {repliedMessage.message_body?.text
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
                  </Fragment>
                ) : (
                  <Text numberOfLines={2} style={{fontFamily: Fonts.regular}}>
                    {repliedMessage.message_body.text}
                  </Text>
                )}
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
                onPress={() => {
                  if (selectedIds.length) {
                    onSelectedDelete();
                  } else {
                    Toast.show({
                      title: translate('pages.xchat.touku'),
                      text: translate('pages.xchat.invalidMsgDelete'),
                      type: 'primary',
                    });
                  }
                }}
                isRounded={true}
                fontType={'smallRegularText'}
                height={40}
              />
            </View>
          </View>
        ) : isChatDisable === false ? null : (
          <ChatInput
            onAttachmentPress={() => onAttachmentPress()}
            onCameraPress={() => onCameraPress()}
            onGalleryPress={() => onGalleryPress()}
            onChangeText={(message) => handleMessage(message)}
            onSend={() => {
              if (newMessageText && newMessageText.trim().length > 0) {
                onMessageSend(()=>{
                  setTimeout(()=>{
                    messages.length > 0 &&
                    this.scrollView &&
                    this.scrollView.scrollToIndex({index: 0, animated: false});
                    console.log('scroll to 0 index done');
                  },1000);
                });
              } else {
                handleMessage('');
              }
            }}
            value={newMessageText}
            groupMembers={groupMembers}
            currentUserData={this.props.userData}
            useMentionsFunctionality={this.props.useMentionsFunctionality}
            onSelectMention={this.props.onSelectMention}
            placeholder={translate('pages.xchat.enterMessage')}
            sendingImage={sendingImage}
          />
        )}
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
    groupLoading: state.groupReducer.loading,
    currentGroup: state.groupReducer.currentGroup
  };
};

const mapDispatchToProps = {
  addFriendByReferralCode,
  setSpecificPostId,
  setActiveTimelineTab,
  markGroupConversationRead,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupChatContainer);
// export default GroupChatContainer;
