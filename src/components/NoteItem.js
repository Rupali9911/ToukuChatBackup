import React, {Component, Fragment} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import ChatMessageBox from './ChatMessageBox';
import ChatInput from './TextInputs/ChatInput';
import {translate} from '../redux/reducers/languageReducer';
import {Colors, Fonts, Images, Icons, SocketEvents} from '../constants';
import {
  getAvatar,
  isIphoneX,
  normalize,
  eventService,
  getUserName,
} from '../../src/utils';
import NoData from './NoData';

import TextAreaWithTitle from '../components/TextInputs/TextAreaWithTitle';
import RoundedImage from './RoundedImage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import VideoThumbnailPlayer from './VideoThumbnailPlayer';
import CheckBox from './CheckBox';
import Button from './Button';
import {
  getGroupCommentList,
  likeUnlikeGroupComment,
  deleteComment,
  commentOnGroupNote,
} from '../redux/reducers/groupReducer';
import {
  commentOnNote,
  getFriendCommentList,
  likeUnlikeComment,
  deleteFriendComment,
} from '../redux/reducers/friendReducer';
import CommentItem from './CommentItem';
import {ConfirmationModal} from './Modals';
import {TouchableOpacity as GHTouchableHighlight} from 'react-native-gesture-handler';
import MentionsInput, {
  parseMarkdown,
} from '../../LineLibChanges/react-native-mentions-input/index.tsx';

const {height} = Dimensions.get('window');

class NoteItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      text: '',
      commentText: '',
      showComment: false,
      showCommentBox: false,
      commentData: [],
      offset: 0,
      commentResult: null,
      showDeleteConfirmationModal: false,
      deleteIndex: null,
      deleteItem: null,
      loadComment: false,
      suggestionData: [],
      suggestionDataHeight: 0,
    };
  }

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});

    // this.events = eventService.getMessage().subscribe((message) => {
    //     this.checkEventTypes(message);
    // });
  }

  componentWillUnmount() {
    // this.events.unsubscribe();
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
    Orientation.addOrientationListener(this._orientationDidChange);

    if (this.props.item.showComment === true) {
      if (!this.state.commentResult)
        this.getCommentList(this.props.item.id, this.props.offset);
    }
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  checkEventTypes(message) {
    const {currentGroupDetail} = this.props;
    switch (message.text.data.type) {
      case SocketEvents.LIKE_OR_UNLIKE_GROUP_NOTE_COMMENT_DATA:
        this.handleCommentLikeUnlike(message);
        break;
      case SocketEvents.DELETE_GROUP_NOTE_COMMENT:
        this.handleDeleteComment(message);
        break;
      case SocketEvents.GROUP_NOTE_COMMENT_DATA:
        this.handleCommentAdd(message);
        break;
      case SocketEvents.LIKE_OR_UNLIKE_FRIEND_NOTE_COMMENT_DATA:
        this.handleCommentLikeUnlike(message);
        break;
      case SocketEvents.FRIEND_NOTE_COMMENT_DATA:
        this.handleCommentAdd(message);
        break;
      case SocketEvents.DELETE_FRIEND_NOTE_COMMENT:
        this.handleDeleteComment(message);
        break;
    }
  }

  getDate = (date) => {
    return moment(date).format('MM/DD/YYYY HH:mm');
  };

  getItemId = () => {
    return this.props.item.id;
  };

  onCancelDeletePress = () => {
    this.setState({
      showDeleteConfirmationModal: false,
    });
  };

  toggleDeleteConfirmationModal = (index = null, item = null) => {
    this.setState((prevState) => ({
      showDeleteConfirmationModal: !prevState.showDeleteConfirmationModal,
      deleteIndex: index,
      deleteItem: item,
    }));
  };

  onConfirmDelete = () => {
    this.deleteComment(this.state.deleteItem.id);
  };

  getCommentList = (note_id, offset) => {
    this.setState({loadComment: true});
    if (this.props.isFriend) {
      this.props
        .getFriendCommentList(note_id, offset)
        .then((res) => {
          if (res) {
            this.setState({
              loadComment: false,
              commentResult: res,
              commentData: [...this.state.commentData, ...res.results],
              offset: res.next ? offset + 20 : offset,
            });
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      this.props
        .getGroupCommentList(note_id, offset)
        .then((res) => {
          if (res) {
            this.setState({
              loadComment: false,
              commentResult: res,
              commentData: [...this.state.commentData, ...res.results],
              offset: res.next ? offset + 20 : offset,
            });
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  };

  postGroupComment = (text, mentions) => {
    const {item, groupMembers} = this.props;
    const {showComment, commentResult, offset} = this.state;

    if (this.props.isFriend) {
      let data = {friend_note: item.id, text: text};
      this.props
        .commentOnNote(data)
        .then((res) => {
          if (res) {
            this.setState({showCommentBox: false, showComment: true}, () => {
              if (!commentResult) this.getCommentList(item.id, offset);
            });
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      let splitNewMessageText = text.split(' ');
      let newMessageMentions = [];
      const newMessageTextWithMention = splitNewMessageText
        .map((text) => {
          let mention = null;
          groupMembers.forEach((groupMember) => {
            if (text === `@${groupMember.display_name}`) {
              mention = `~${groupMember.id}~`;
              newMessageMentions = [...newMessageMentions, groupMember.id];
            }
          });
          if (mention) {
            return mention;
          } else {
            return text;
          }
        })
        .join(' ');

      console.log('text', ...newMessageTextWithMention);

      let data = {group_note: item.id, text: text};

      if (newMessageMentions.length > 0) {
        data['mention'] = [...newMessageMentions];
      }

      this.props
        .commentOnGroupNote(data)
        .then((res) => {
          if (res) {
            this.setState({showCommentBox: false, showComment: true}, () => {
              if (!commentResult) this.getCommentList(item.id, offset);
            });
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  };

  likeUnlikeComment = (item, index) => {
    let data = {comment_id: item.id};
    if (this.props.isFriend) {
      this.props
        .likeUnlikeComment(data)
        .then((res) => {
          if (res) {
            // let array = this.state.commentData;
            // item['is_liked'] = res.like;
            // item['liked_by_count'] = res.like ? (item.liked_by_count + 1) : (item.liked_by_count - 1);
            // array.splice(index, 1, item);
            // this.setState({ commentData: [...array] });
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      this.props
        .likeUnlikeGroupComment(data)
        .then((res) => {
          if (res) {
            // let array = this.state.commentData;
            // item['is_liked'] = res.like;
            // item['liked_by_count'] = res.like ? (item.liked_by_count + 1) : (item.liked_by_count - 1);
            // array.splice(index, 1, item);
            // this.setState({ commentData: [...array] });
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  };

  deleteComment = (comment_id) => {
    if (this.props.isFriend) {
      this.props
        .deleteFriendComment(comment_id)
        .then((res) => {
          this.toggleDeleteConfirmationModal();
          if (res) {
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      this.props
        .deleteComment(comment_id)
        .then((res) => {
          this.toggleDeleteConfirmationModal();
          if (res) {
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  };

  handleCommentAdd = (message) => {
    const {item, isFriend} = this.props;
    const {commentResult} = this.state;
    if (isFriend) {
      let data = message.text.data.message_details.data;
      console.log('friend comment data', data);
      if (commentResult && data && data.friend_note === item.id) {
        let array = this.state.commentData;
        array = [data, ...array];
        this.setState({commentData: array});
      }
    } else {
      let data = message.text.data.message_details;
      if (commentResult && data && data.group_note === item.id) {
        let array = this.state.commentData;
        array = [data, ...array];
        this.setState({commentData: array});
      }
    }
  };

  handleCommentLikeUnlike = (message) => {
    const {item, isFriend, userData} = this.props;

    let data = isFriend
      ? message.text.data.message_details.data
      : message.text.data.message_details;
    if (data && data.note_id === item.id) {
      let array = this.state.commentData;
      let i = array.find((e) => e.id === data.comment_id);
      if (i) {
        let index = array.indexOf(i);
        if (data.user_id === userData.id)
          i['is_liked'] = data.like && data.like.like;

        i['liked_by_count'] =
          data.like && data.like.like
            ? i.liked_by_count + 1
            : i.liked_by_count - 1;
        array.splice(index, 1, i);
        this.setState({commentData: array});
      }
      // this.refs['comment_'+data.comment_id] && this.refs['comment_'+data.comment_id].forceUpdate();
    }
  };

  handleDeleteComment = (message) => {
    const {item, isFriend} = this.props;
    let data = isFriend
      ? message.text.data.message_details.data
      : message.text.data.message_details;
    if (data && data.note_id === item.id) {
      let array = this.state.commentData;
      let i = array.find((e) => e.id === data.comment_id);
      if (i) {
        let index = array.indexOf(i);
        array.splice(index, 1);
        this.setState({commentData: array});
      }
    }
  };

  groupMembersMentions = (value) => {
    const {groupMembers, userData} = this.props;
    let splitNewMessageText = value.split(' ');
    // let text = splitNewMessageText[splitNewMessageText.length - 1];
    let text = value;
    // let splitNewMessageText = value.split(' ');
    // let newMessageMentions = [];
    // const newMessageTextWithMention = splitNewMessageText
    //   .map((text) => {
    //     let mention = null;
    //     groupMembers.forEach((groupMember) => {
    //       if (text === `~${groupMember.id}~`) {
    //         mention = `@${groupMember.display_name}`;
    //         newMessageMentions = [...newMessageMentions, groupMember.id];
    //       }
    //     });
    //     if (mention) {
    //       return mention;
    //     } else {
    //       return text;
    //     }
    //   })
    //   .join(' ');
    if (groupMembers && userData) {
      let suggestionRowHeight;
      if (text.substring(1).length) {
        let newUser = [];
        groupMembers.filter((member) => {
          if (member.id !== userData.id) {
            // return splitNewMessageText.map((text) => {
            if (member.display_name) {
              let obj = {
                ...member,
                name: member.display_name,
              };

              return newUser.push(obj);
            } else {
              let obj = {
                ...member,
                name: member.username,
              };
              return newUser.push(obj);
            }
          } else {
            return false;
          }
        });
        suggestionRowHeight =
          newUser.length < 11
            ? newUser.length * normalize(22) + 5
            : normalize(220) + 5;
        this.setState({
          suggestionData: newUser,
          suggestionDataHeight: suggestionRowHeight,
        });

        console.log('users_array', newUser);
      } else {
        let newUser = [];
        groupMembers.filter((member) => {
          if (member.id !== userData.id) {
            let obj = {
              ...member,
              name: member.display_name ? member.display_name : member.username,
            };
            return newUser.push(obj);
          }
        });

        suggestionRowHeight =
          newUser.length < 11
            ? newUser.length * normalize(22) + 5
            : normalize(220) + 5;
        this.setState({
          suggestionData: newUser,
          suggestionDataHeight: suggestionRowHeight,
        });
      }
      this.forceUpdate();
    } else {
      this.setState({suggestionData: [], suggestionDataHeight: 0});
    }
  };

  // groupMembersMentions = (value) => {
  //   const {groupMembers, userData} = this.props;
  //   let splitNewMessageText = value.split(' ');
  //   let text = value;
  //   if (groupMembers && userData) {
  //     let suggestionRowHeight;
  //     if (text.substring(1).length) {
  //       let array = groupMembers.filter((member) => {
  //         if (member.id !== userData.id) {
  //           // return splitNewMessageText.map((text) => {
  //           if (member.display_name) {
  //             return member.display_name
  //               .toLowerCase()
  //               .startsWith(text.substring(1).toLowerCase());
  //           } else {
  //             return member.username
  //               .toLowerCase()
  //               .startsWith(text.substring(1).toLowerCase());
  //           }
  //         } else {
  //           return false;
  //         }
  //       });
  //       suggestionRowHeight =
  //         array < 4 ? array * normalize(22) + 5 : normalize(90) + 5;
  //       this.setState({
  //         suggestionData: array,
  //         suggestionDataHeight: suggestionRowHeight,
  //       });
  //     } else {
  //       let array = groupMembers.filter((member) => member.id !== userData.id);
  //       suggestionRowHeight =
  //         array < 4 ? array * normalize(22) + 5 : normalize(90) + 5;
  //       this.setState({
  //         suggestionData: array,
  //         suggestionDataHeight: suggestionRowHeight,
  //       });
  //     }
  //     this.forceUpdate();
  //   } else {
  //     this.setState({suggestionData: [], suggestionDataHeight: 0});
  //   }
  // };

  suggestionsDataHeight = (value) => {
    // console.log('suggestionsDataHeight -> suggestionsDataHeight', value);
    let groupMembersLength;
    let suggestionRowHeight;
    // groupMembersLength = this.groupMembersMentions(value).length;
    groupMembersLength = this.state.suggestionData.length;
    console.log('render -> groupMembersLength', groupMembersLength);
    suggestionRowHeight =
      groupMembersLength < 4
        ? groupMembersLength * normalize(22) + 5
        : normalize(90) + 5;
    console.log(
      'suggestionsDataHeight -> suggestionRowHeight',
      suggestionRowHeight,
    );
    return suggestionRowHeight;
  };

  onSelectMention = (selectedMention, length) => {
    console.log('length', length);
    this.setState((prevState) => {
      return {
        commentText: `${
          length === 1
            ? prevState.commentText
            : prevState.commentText.slice(0, -length + 1)
        }${selectedMention.display_name}`,
      };
    });
  };

  render() {
    const {
      index,
      editNote,
      item,
      onEdit,
      onDelete,
      onCancel,
      onPost,
      onLikeUnlike,
      userData,
      isFriend,
      onExpand,
    } = this.props;
    const {
      orientation,
      showComment,
      showCommentBox,
      text,
      commentText,
      commentData,
      offset,
      commentResult,
      showDeleteConfirmationModal,
      loadComment,
      suggestionData,
      suggestionDataHeight,
    } = this.state;

    return (
      <View
        style={{
          borderWidth: 0.5,
          borderColor: Colors.light_gray,
          borderRadius: 3,
          padding: 10,
        }}>
        {!editNote ? (
          <View>
            <View
              style={{
                borderBottomColor: Colors.light_gray,
                borderBottomWidth:
                  item.showComment && commentData.length > 0 ? 0.5 : 0,
                // paddingBottom: 2,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={getAvatar(item.created_by_avatar)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      resizeMode: 'cover',
                      marginRight: 5,
                    }}
                  />
                  <View style={{marginLeft: 5}}>
                    <Text
                      style={{
                        marginRight: 5,
                        color: '#e26161',
                        fontFamily: Fonts.regular,
                        fontWeight: '400',
                        fontSize: normalize(10),
                      }}>
                      {userData.id === item.created_by
                        ? translate('pages.xchat.you')
                        : getUserName(item.created_by) ||
                          item.created_by_username}
                    </Text>
                    <Text
                      style={{
                        color: '#6c757dc7',
                        fontFamily: Fonts.regular,
                        fontWeight: '400',
                        fontSize: normalize(10),
                      }}>
                      {this.getDate(item.updated)}
                    </Text>
                  </View>
                </View>
                {userData.id === item.created_by && (
                  <View style={{flexDirection: 'row'}}>
                    <FontAwesome5
                      name={'pencil-alt'}
                      size={14}
                      color={Colors.black}
                      style={{marginRight: 5}}
                      onPress={() => {
                        onEdit(index, item);
                        this.setState({text: item.text});
                      }}
                    />
                    <FontAwesome5
                      name={'trash'}
                      size={14}
                      color={Colors.black}
                      style={{marginLeft: 5}}
                      onPress={() => {
                        onDelete(index, item);
                      }}
                    />
                  </View>
                )}
              </View>
              <View style={{marginTop: 5}}>
                <Text
                  style={{
                    color: Colors.black,
                    fontFamily: Fonts.regular,
                    fontWeight: '400',
                    fontSize: normalize(10),
                  }}>
                  {item.text}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: showCommentBox && !isFriend ? 20 : 0,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      color: Colors.textTitle_orange,
                      fontFamily: Fonts.regular,
                      fontWeight: '400',
                      fontSize: normalize(10),
                    }}
                    onPress={() => {
                      onLikeUnlike(item.id, index);
                    }}>
                    {item.is_liked
                      ? translate('pages.xchat.unlike')
                      : translate('pages.xchat.like')}
                  </Text>

                  <Entypo
                    name={'dot-single'}
                    color={'#6c757dc7'}
                    size={normalize(18)}
                  />

                  <Text
                    style={{
                      color: Colors.textTitle_orange,
                      fontFamily: Fonts.regular,
                      fontWeight: '400',
                      fontSize: normalize(10),
                    }}
                    onPress={() => {
                      onExpand(item.id, item);
                      this.setState({
                        showCommentBox: !this.state.showCommentBox,
                      });
                    }}>
                    {translate('pages.xchat.comment')}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  <FontAwesome
                    name={item.is_liked ? 'thumbs-up' : 'thumbs-o-up'}
                    size={normalize(12)}
                    color={Colors.black}
                    style={{marginRight: 5}}
                  />

                  <Text
                    style={{
                      color: Colors.black,
                      fontFamily: Fonts.regular,
                      fontWeight: '400',
                      fontSize: normalize(10),
                    }}>
                    {item.liked_by_count}
                  </Text>

                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={() => {
                      if (item.comment_count > 0) {
                        onExpand(item.id, item);
                        // this.setState({showComment: !showComment}, () => {
                        if (!commentResult)
                          this.getCommentList(item.id, offset);
                        // });
                      }
                    }}>
                    <MaterialCommunityIcons
                      name={'comment-outline'}
                      size={normalize(12)}
                      color={Colors.black}
                      style={{marginRight: 5, marginLeft: 5}}
                    />

                    <Text
                      style={{
                        color: Colors.black,
                        fontFamily: Fonts.regular,
                        fontWeight: '400',
                        fontSize: normalize(10),
                      }}>
                      {item.comment_count}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {showCommentBox && (
                <>
                  {!isFriend ? (
                    <MentionsInput
                      value={commentText}
                      maxHeight={500}
                      multiline={true}
                      onTextChange={(message) => {
                        if (!message.includes('@')) {
                          this.setState({suggestionData: []});
                        }
                        this.setState({commentText: message});
                        this.groupMembersMentions(message);
                      }}
                      onMarkdownChange={(markdown) => {}}
                      placeholder={translate('pages.xchat.enterComment')}
                      placeholderTextColor={'gray'}
                      mentionStyle={styles.mentionStyle}
                      textInputStyle={styles.textInputStyle}
                      users={this.state.suggestionData}
                      suggestedUsersComponent={(users, addMentions, index) =>
                        users.length > 0 && (
                          <View
                            style={{
                              width: '100%',
                              height: this.suggestionsDataHeight(users.length),
                              overflow: 'hidden',
                              position: 'absolute',
                              top:
                                users.length === 1
                                  ? -35
                                  : -this.suggestionsDataHeight(users.length),
                            }}>
                            <ScrollView
                              style={{
                                marginBottom: 8,
                                left: -2,
                              }}>
                              {users.map((item, index) => {
                                return (
                                  <GHTouchableHighlight
                                    onPress={() => addMentions(item)}
                                    style={{
                                      height: normalize(22),
                                      justifyContent: 'center',
                                      alignItems: 'flex-start',
                                      width: '100%',
                                      paddingLeft: 5,
                                    }}
                                    activeOpacity={1}>
                                    <View
                                      key={item.id}
                                      style={[
                                        styles.suggestedUserComponentStyle,
                                        {
                                          width: '100%',
                                          height: '100%',
                                          backgroundColor:
                                            index === 0 ? '#FFB582' : 'white',
                                        },
                                      ]}>
                                      <Text
                                        style={{
                                          color: index === 0 ? '#fff' : '#000',
                                        }}>
                                        {item.name}
                                      </Text>
                                    </View>
                                  </GHTouchableHighlight>
                                );
                              })}
                            </ScrollView>
                            {/* <FlatList
                              scrollEnabled={true}
                              showsVerticalScrollIndicator={false}
                              // nestedScrollEnabled={true}
                              keyboardShouldPersistTaps={'always'}
                              horizontal={this.props.horizontal}
                              ListEmptyComponent={this.props.loadingComponent}
                              enableEmptySections={true}
                              data={users}
                              keyExtractor={this.props.keyExtractor}
                              renderItem={({item, index}) => {
                                return (

                                );
                              }}
                            /> */}
                          </View>
                        )
                      }
                    />
                  ) : (
                    // <MentionsTextInput
                    //   multiline={true}
                    //   numberOfLines={10}
                    //   textInputStyle={styles.textInput}
                    //   suggestionsPanelStyle={{
                    //     width: '100%',
                    //     height: this.suggestionsDataHeight(commentText),
                    //     overflow: 'hidden',
                    //     position: 'absolute',
                    //     top: -this.suggestionsDataHeight(commentText),
                    //     zIndex: 1,
                    //   }}
                    //   loadingComponent={() => null}
                    //   textInputMinHeight={100}
                    //   // textInputMaxHeight={500}
                    //   trigger={'@'}
                    //   triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
                    //   value={commentText}
                    //   onChangeText={(message) => {
                    //     if (!message.includes('@')) {
                    //       this.setState({suggestionData: []});
                    //     }
                    //     this.setState({commentText: message});
                    //   }}
                    //   placeholder={translate('pages.xchat.enterComment')}
                    //   autoCorrect={false}
                    //   triggerCallback={(lastKeyword) => {
                    //     console.log(
                    //       'ChatInput -> render -> triggerCallback',
                    //       lastKeyword,
                    //     );
                    //     this.groupMembersMentions(lastKeyword);
                    //   }}
                    //   suggestionsData={suggestionData} // array of objects
                    //   keyExtractor={(item, index) => item.id}
                    //   renderSuggestionsRow={({item, index}, hidePanel) => {
                    //     return (
                    //       <GHTouchableHighlight
                    //         key={index + ''}
                    //         underlayColor="#FFB582"
                    //         onShowUnderlay={() => {
                    //           this.setState({highlightItemId: item.id});
                    //         }}
                    //         onHideUnderlay={() => {
                    //           this.setState({highlightItemId: null});
                    //         }}
                    //         style={{
                    //           backgroundColor:
                    //             index === 0 ? '#FFB582' : 'white',
                    //           paddingTop: index === 0 ? 5 : 0,
                    //         }}
                    //         onPress={() => {
                    //           hidePanel();
                    //           this.setState({isMentionsOpen: false});
                    //           this.onSelectMention(
                    //             item,
                    //             commentText.split(' ')[
                    //               commentText.split(' ').length - 1
                    //             ].length,
                    //           );
                    //         }}>
                    //         <View
                    //           style={{
                    //             height: normalize(22),
                    //             justifyContent: 'center',
                    //             alignItems: 'flex-start',
                    //             width: '100%',
                    //             paddingLeft: 5,
                    //           }}>
                    //           <Text
                    //             style={{
                    //               fontSize: normalize(11),
                    //               paddingHorizontal: 10,
                    //               // backgroundColor: '#FFB582',
                    //               fontFamily: Fonts.regular,
                    //               fontWeight: '400',
                    //               color:
                    //                 // this.state.highlightItemId === item.id
                    //                 //   ? 'white'
                    //                 //   :
                    //                 index === 0 ? 'white' : 'black',
                    //               textAlign: 'center',
                    //             }}>
                    //             {item.display_name || item.username}
                    //           </Text>
                    //         </View>
                    //       </GHTouchableHighlight>
                    //     );
                    //   }}
                    //   suggestionRowHeight={
                    //     suggestionDataHeight ? suggestionDataHeight : 0
                    //   }
                    //   horizontal={false}
                    //   customOnContentSizeChange={({nativeEvent}) => {
                    //     this.forceUpdate();
                    //   }}
                    // />
                    <TextAreaWithTitle
                      onChangeText={(text) =>
                        this.setState({commentText: text})
                      }
                      value={commentText}
                      rightTitle={`${commentText.length}/150`}
                      maxLength={150}
                      placeholder={translate('pages.xchat.enterComment')}
                    />
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      // flex: 0.5,
                      marginTop: 10,
                      height: 30,
                      width: '100%',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 5,
                        // width: 60,
                      }}>
                      <Button
                        title={translate('common.cancel')}
                        type={'secondary'}
                        onPress={() => {
                          this.setState({
                            commentText: '',
                            showCommentBox: false,
                          });
                        }}
                        height={30}
                        isRounded={false}
                      />
                    </View>
                    <View
                      style={{
                        // width: 60,
                        marginHorizontal: 5,
                      }}>
                      <Button
                        title={translate('pages.xchat.post')}
                        type={'primary'}
                        onPress={() => {
                          console.log('post pressed');
                          this.postGroupComment(commentText);
                          this.setState({commentText: ''});
                        }}
                        height={30}
                        isRounded={false}
                        disabled={!commentText}
                        // loading={isLoading}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
            {item && item.showComment && item.showComment === true ? (
              <View style={{marginTop: 5}}>
                {commentData.length > 0 ? (
                  commentData.map((item, index) => {
                    return (
                      <CommentItem
                        ref={'comment_' + item.id}
                        index={index}
                        item={item}
                        onDelete={this.toggleDeleteConfirmationModal}
                        onLikeUnlike={this.likeUnlikeComment}
                        userData={userData}
                      />
                    );
                  })
                ) : loadComment ? (
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <ActivityIndicator />
                  </View>
                ) : null}
                {commentResult && commentResult.next && (
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    {loadComment ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                        <ActivityIndicator />
                      </View>
                    ) : (
                      <Text
                        style={{
                          color: Colors.textTitle_orange,
                          fontFamily: Fonts.regular,
                          fontWeight: '400',
                          fontSize: normalize(10),
                        }}
                        onPress={() => {
                          this.getCommentList(item.id, offset);
                        }}>
                        {translate('pages.xchat.loadMore')}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ) : null}
          </View>
        ) : (
          <View
            style={{
              borderBottomColor: Colors.black_light,
              borderBottomWidth: 0.5,
              marginBottom: 10,
              paddingBottom: 2,
            }}>
            <TextAreaWithTitle
              onChangeText={(text) => this.setState({text})}
              value={text}
              rightTitle={`${text.length}/300`}
              maxLength={300}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                // flex: 0.5,
                marginTop: 10,
                height: 30,
                width: '100%',
              }}>
              <View
                style={{
                  marginHorizontal: 5,
                  // width: 60,
                }}>
                <Button
                  title={translate('common.cancel')}
                  type={'secondary'}
                  onPress={() => {
                    onCancel(), this.setState({text: ''});
                  }}
                  height={30}
                  isRounded={false}
                />
              </View>
              <View
                style={{
                  // width: 60,
                  marginHorizontal: 5,
                }}>
                <Button
                  title={translate('pages.xchat.update')}
                  type={'primary'}
                  onPress={() => {
                    console.log('post pressed');
                    onPost(text);
                    this.setState({text: ''});
                  }}
                  height={30}
                  isRounded={false}
                  disabled={!text}
                  // loading={isLoading}
                />
              </View>
            </View>
          </View>
        )}
        <ConfirmationModal
          orientation={orientation}
          visible={showDeleteConfirmationModal}
          onCancel={this.onCancelDeletePress.bind(this)}
          onConfirm={this.onConfirmDelete.bind(this)}
          title={translate('pages.xchat.toastr.deleteComment')}
          message={translate('pages.xchat.deleteCommentText')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: Platform.OS === 'android' ? 0.2 : 0.5,
    backgroundColor: Colors.white,
    borderRadius: 7,
    borderColor: Colors.gray_dark,
    // marginTop: 10,
    height: 100,
    textAlignVertical: 'top',
    paddingHorizontal: 10,
    fontFamily: Fonts.light,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  textInputStyle: {
    borderWidth: Platform.OS === 'android' ? 0.2 : 0.5,
    backgroundColor: Colors.white,
    borderRadius: 7,
    borderColor: Colors.gray_dark,
    // marginTop: 10,
    height: 100,
    textAlignVertical: 'top',
    paddingHorizontal: 10,
    fontFamily: Fonts.light,
    width: '100%',
  },
  suggestedUserComponentImageStyle: {
    width: 20,
    height: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginRight: 5,
  },
  suggestedUserComponentStyle: {
    alignItems: 'center',
    paddingHorizontal: 10,
    height: height / 16,
    flexDirection: 'row',
  },
  mentionStyle: {
    fontWeight: '500',
    color: 'blue',
  },

  // Example styles
  sendButtonStyle: {
    marginTop: 20,
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 15,
  },
  exampleContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    paddingHorizontal: 30,
    marginVertical: 30,
  },
  exampleHeader: {
    fontWeight: '700',
  },
});

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {
  getGroupCommentList,
  likeUnlikeGroupComment,
  deleteComment,
  commentOnGroupNote,
  commentOnNote,
  getFriendCommentList,
  likeUnlikeComment,
  deleteFriendComment,
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteItem);
