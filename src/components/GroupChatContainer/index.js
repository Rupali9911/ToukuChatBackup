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
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import Menu from '../../components/Menu/Menu';
import MenuItem from '../../components/Menu/MenuItem';
import {Colors, Fonts, Icons, Images} from '../../constants';
import {translate} from '../../redux/reducers/languageReducer';
import {getUserName, getUser_ActionFromUpdateText} from '../../utils';
import Button from '../Button';
import CheckBox from '../CheckBox';
import GroupChatMessageBox from '../GroupChatMessageBox';
import {ListLoader} from '../Loaders';
import NoData from '../NoData';
import RoundedImage from '../RoundedImage';
import ChatInput from '../TextInputs/ChatInput';
import Toast from '../Toast';
import VideoThumbnailPlayer from '../VideoThumbnailPlayer';
import styles from './styles';

const {height} = Dimensions.get('window');

class GroupChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioPlayingId: null,
      previousPlayingAudioId: null,
      closeMenu: false,
    };
  }

  componentDidMount(){
    // setTimeout(()=>{
    //   this.scrollView && this.scrollView.scrollToOffset({offset: 130, animated: false});
    // },50);
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

  renderMessage = (messages) => {
    const {memberCount, groupMembers} = this.props;
    if (!messages || !messages.length) {
      return (
        <NoData
          title={translate('pages.xchat.startANewConversationHere')}
          source={Images.image_conversation}
          imageColor={Colors.primary}
          imageAvailable
        />
      );
    }

    const conversationLength = messages.length;
    const msg = messages.map((item, index) => {
      return (
        <Fragment key={index}>
          {this.testMethod(messages, index, item, conversationLength)}
          <GroupChatMessageBox
            key={item.msg_id}
            message={item}
            isUser={item.sender_id === this.props.userData.id}
            time={new Date(item.timestamp)}
            isRead={!!(item.read_count && item.read_count > 0)}
            memberCount={memberCount}
            onMessageReply={(id) => this.props.onMessageReply(id)}
            orientation={this.props.orientation}
            onMessageTranslate={(translatedMsg) =>
              this.props.onMessageTranslate(translatedMsg)
            }
            onMessageTranslateClose={this.props.onMessageTranslateClose}
            translatedMessage={this.props.translatedMessage}
            translatedMessageId={this.props.translatedMessageId}
            onDelete={(id) => this.props.onDelete(id)}
            onUnSend={(id) => this.props.onUnSendMsg(id)}
            onEditMessage={(editedMsg) => this.props.onEditMessage(editedMsg)}
            onDownloadMessage={(downloadedMsg) => {
              this.props.onDownloadMessage(downloadedMsg);
            }}
            audioPlayingId={this.state.audioPlayingId}
            previousPlayingAudioId={this.state.previousPlayingAudioId}
            closeMenu={this.state.closeMenu}
            onAudioPlayPress={(id) => {
              this.setState({
                audioPlayingId: id,
                previousPlayingAudioId: this.state.audioPlayingId,
              });
            }}
            groupMembers={groupMembers}
            showOpenLoader={this.props.showOpenLoader}
          />
        </Fragment>
      );
    });

    return <Fragment>{msg.reverse()}</Fragment>;
  };

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
      memberCount,
      groupMembers,
      isMultiSelect,
      onSelect,
      selectedIds,
      onSelectedCancel,
      onSelectedDelete,
      isChatDisable,
      groupLoading,
      onLoadMore,
      isLoadMore,
    } = this.props;
    // console.log('isChatDisable', isChatDisable);

    const messageBodyContainer = [
      {marginLeft: isMultiSelect ? -35 : 0},
      styles.messageBodyContainer,
    ];

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
            <KeyboardAwareFlatList
              enableResetScrollToCoords={false}
              contentContainerStyle={[
                styles.messageAreaScroll,
                isReply && styles.replyPadding,
              ]}
              innerRef={(view) => {
                this.scrollView = view;
              }}
              onContentSizeChange={(w,h) => {

                if (this.props.translatedMessageId) {

                } else {
                  // messages.length>0 && this.scrollView.scrollToIndex({index:0, animated: false });
                }
              }}
              // getItemLayout={(data, index) => (
              //   {length: 250, offset: 250 * index, index}
              // )}
              // initialScrollIndex={4}
              contentOffset = {{x: 0, y: 0}}
              onScrollBeginDrag={() => {
                this.closeMenu();
              }}
              onScrollEndDrag={() => {
                this.closeMenuFalse();
              }}
              onScroll={({nativeEvent})=>{
                console.log('event',nativeEvent);
                this.setState({contentHeight: nativeEvent.contentSize.height});
                if(nativeEvent.contentOffset.y < 0 ){
                  onLoadMore && onLoadMore(messages[0]);
                }
              }}
              extraData={this.state}
              data={messages}
              inverted={true}
              onEndReached={() => {
                console.log('onEndReached', groupLoading);
                if (
                  messages.length > 0 &&
                  messages.length % 20 === 0 &&
                  isLoadMore &&
                  !groupLoading
                ) {
                  console.log('load more');
                  onLoadMore && onLoadMore(messages[messages.length - 1]);
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
                messages.length % 20 === 0 && isLoadMore ? <ListLoader /> : null
              }
              renderItem={({item, index}) => {
                const conversationLength = messages.length;
                let isSelected = selectedIds.includes(item.msg_id + '');
                return (
                  <Fragment key={`${index}`}>
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
                            onMessageReply={(id) =>
                              this.props.onMessageReply(id)
                            }
                            orientation={this.props.orientation}
                            onMessageTranslate={(msg) =>
                              this.props.onMessageTranslate(msg)
                            }
                            onMessageTranslateClose={
                              this.props.onMessageTranslateClose
                            }
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
                              this.scrollView.scrollToIndex({
                                animated: true,
                                index: this.searchItemIndex(
                                  messages,
                                  id,
                                  index,
                                ),
                              });
                              this[`message_box_${id}`] &&
                                this[`message_box_${id}`].callBlinking(id);
                            }}
                            groupMembers={groupMembers}
                            showOpenLoader={this.props.showOpenLoader}
                            isMultiSelect={isMultiSelect}
                            onMediaPlay={this.props.onMediaPlay}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    {this.testMethod(messages, index, item, conversationLength)}
                  </Fragment>
                );
              }}
              ListEmptyComponent={() => (
                <NoData
                  title={translate('pages.xchat.startANewConversationHere')}
                  source={Images.image_conversation}
                  imageColor={Colors.primary}
                  imageAvailable
                  style={{transform: [{rotate: '180deg'}]}}
                  textStyle={{transform: [{rotateY: '180deg'}]}}
                />
              )}
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
                onMessageSend();
                messages.length > 0 &&
                  this.scrollView &&
                  this.scrollView.scrollToIndex({index: 0, animated: false});
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
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GroupChatContainer);
