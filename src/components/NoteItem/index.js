import moment from 'moment';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ScrollView,
  TouchableOpacity as GHTouchableHighlight,
} from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation';
import Entypo from 'react-native-vector-icons/Entypo';
import {getLinkPreview} from 'link-preview-js';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinkifyIt from 'linkify-it';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import MentionsInput from '../../../LineLibChanges/react-native-mentions-input';
import {Colors, SocketEvents} from '../../constants';
import {
  commentOnNote,
  deleteFriendComment,
  getFriendCommentList,
  likeUnlikeComment,
} from '../../redux/reducers/friendReducer';
import {
  commentOnGroupNote,
  deleteComment,
  getGroupCommentList,
  likeUnlikeGroupComment,
} from '../../redux/reducers/groupReducer';
import {translate} from '../../redux/reducers/languageReducer';
import {getAvatar, getUserName, normalize, videoEx} from '../../utils';
import Button from '../Button';
import CommentItem from '../CommentItem';
import {ConfirmationModal} from '../Modals';
import TextAreaWithTitle from '../TextInputs/TextAreaWithTitle';
import styles from './styles';
import ScalableImage from '../ScalableImage';
import ViewSlider from '../ViewSlider';
import VideoPlayerCustom from '../VideoPlayerCustom';
import AudioPlayerCustom from '../AudioPlayerCustom';
import ImageGrid from '../ImageGrid';
import VideoPreview from '../VideoPreview';
import NormalImage from '../NormalImage';

const { width, height } = Dimensions.get('window');
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
      step: 1,
      commentResult: null,
      showDeleteConfirmationModal: false,
      deleteIndex: null,
      deleteItem: null,
      loadComment: false,
      suggestionData: [],
      suggestionDataHeight: 0,
      linkPreview: null,
      disableLikeUnlikeAction: false
    };
    this.likeUnlikeApiCallStatus = false;
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
      if (!this.state.commentResult) {
        this.getCommentList(this.props.item.id, this.props.offset);
      }
    }
    this.hasLink(this.props.item.text);
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  checkEventTypes(message) {
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
    if (this.state.deleteItem && this.state.deleteItem.id) {
      this.deleteComment(this.state.deleteItem.id);
    }
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
    const {commentResult, offset} = this.state;

    if (this.props.isFriend) {
      let data = {friend_note: item.id, text: text};
      this.props
        .commentOnNote(data)
        .then((res) => {
          if (res) {
            this.setState({showCommentBox: false, showComment: true}, () => {
              if (!commentResult) {
                this.getCommentList(item.id, offset);
              }
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
        .map((splitText) => {
          let mention = null;
          groupMembers.forEach((groupMember) => {
            if (splitText === `@${groupMember.display_name}`) {
              mention = `~${groupMember.id}~`;
              newMessageMentions = [...newMessageMentions, groupMember.id];
            }
          });
          if (mention) {
            return mention;
          } else {
            return splitText;
          }
        })
        .join(' ');

      console.log('text', ...newMessageTextWithMention);

      let data = {group_note: item.id, text: text};

      if (newMessageMentions.length > 0) {
        data.mention = [...newMessageMentions];
      }

      this.props
        .commentOnGroupNote(data)
        .then((res) => {
          if (res) {
            this.setState({showCommentBox: false, showComment: true}, () => {
              if (!commentResult) {
                this.getCommentList(item.id, offset);
              }
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
        if (data.user_id === userData.id) {
          i.is_liked = data.like && data.like.like;
        }

        i.liked_by_count =
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
    // let splitNewMessageText = value.split(' ');
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

  getThumbnailImageForVideo = (url) => {
    console.log('thumbnail_response',url);
    createThumbnail({
      url: url,
      timeStamp: 2000,
    }).then((res)=>{
      return res.path;
    });
    // console.log('thumbnail_response',thumbnail_response);
    // return thumbnail_response ? thumbnail_response.path : '';
  }

  getUrlByVideoId = (url) => {
    let thumb_url = '';
    if (url.includes('youtube.com')) {
      let video_id = '';
      if (url.includes('watch?v=')) {
        let params = url.split('?')[1];
        let video_param = params.split('&')[0];
        video_id = video_param.substring(video_param.indexOf('=')+1);
      }else if (url.includes('youtu.be')){
        video_id = url.substring(url.lastIndexOf('/') + 1);
      }
      thumb_url = `https://img.youtube.com/vi/${video_id}/sddefault.jpg`;
    }
    console.log('thumb_url',thumb_url);
    return thumb_url;
  };

  hasLink = (text) => {
    let arrLinks = LinkifyIt().match(text);
    if(arrLinks && arrLinks.length>0){
      console.debug('arrLinks',arrLinks[0].url);
      if(arrLinks[0].url.match(videoEx) != null){
        this.setState({
          linkPreview: {
            contentType: "video/mp4", 
            favicons: '', 
            mediaType: "video", 
            url: arrLinks[0].url
          }
        })
      }else{
        getLinkPreview(arrLinks[0].url)
        .then(data => {
          console.debug(data);
          this.setState({ linkPreview: data });
        }).catch((err)=>console.debug(err));
      }
    }
  }

  renderLinkPreview = (linkPreview) => {
      return linkPreview ? (
        linkPreview.mediaType.includes("video") ?
          <VideoPreview url={linkPreview.url} showLink={true}/> :
          linkPreview.mediaType.includes("image") ?
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => { Linking.openURL(linkPreview.url) }}
              style={{
                flex: 1,
                marginBottom: 5,
              }}>
              <ScalableImage
                src={linkPreview.url}
              />
              <View style={{ width: '100%', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#00000040', position: 'absolute', bottom: 0 }}>
                <Text style={{ color: 'white', fontSize: normalize(12) }} numberOfLines={2}>{linkPreview.url}</Text>
              </View>
            </TouchableOpacity>
            : linkPreview.contentType.includes("text/html") ?
              linkPreview.url.includes('youtube.com') ?
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => { Linking.openURL(linkPreview.url) }}
                  style={{
                    flex: 1,
                    marginBottom: 5,
                  }}>
                  <ScalableImage
                    src={this.getUrlByVideoId(linkPreview.url)}
                  />
                  <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#00000040', position: 'absolute', bottom: 0 }}>
                    <Text style={{ flex: 1, color: 'white', fontSize: normalize(12) }} numberOfLines={2}>{linkPreview.url}</Text>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <FontAwesome name="play" size={15} color={Colors.white} />
                    </View>
                  </View>
                </TouchableOpacity> :
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => { Linking.openURL(linkPreview.url) }}
                  style={{
                    flex: 1,
                    marginBottom: 5,
                  }}>
                  <ScalableImage
                    src={linkPreview.images[0]}
                  />
                  <View style={{ width: '100%', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#00000040', position: 'absolute', bottom: 0 }}>
                    <Text style={{ color: 'white', fontSize: normalize(12) }} numberOfLines={2}>{linkPreview.url}</Text>
                  </View>
                </TouchableOpacity> :
              null
      ) : null;
  }

  renderMedia = (media) => {
    if(!media) return;
    return (
      <ViewSlider
        style={styles.viewSlider}
        width={width - 50}
        step={this.state.step}
        onScroll={(index) => {
          if (media[this.state.step - 1].media_type == 'audio') {
            this.audio && this.audio.stopSound();
          }
          this.setState({ step: index });
        }}
        renderSlides={
          <>
            {media.map(item => {
              return (
                <>
                  {item.media_type === 'image' &&
                    <View style={styles.swipeMediaContainer}
                      onLayout={(event) => {
                        let { height } = event.nativeEvent.layout
                        this.setState({ page_height: height });
                      }}
                    >
                      <NormalImage src={item.media_url}/>
                    </View>
                  }
                  {item.media_type === 'video' &&
                    <View style={styles.swipeMediaContainer}>
                      <VideoPlayerCustom
                        url={item.media_url}
                        width={width - 50}
                        height={250} />
                    </View>
                  }
                  {item.media_type === 'audio' &&
                    <View style={styles.swipeAudioContainer}>
                      <AudioPlayerCustom
                        ref={(audio) => this.audio = audio}
                        onAudioPlayPress={(id) =>
                          this.setState({
                            audioPlayingId: id,
                            perviousPlayingAudioId: this.state.audioPlayingId,
                          })
                        }
                        audioPlayingId={this.state.audioPlayingId}
                        perviousPlayingAudioId={this.state.perviousPlayingAudioId}
                        postId={post.id}
                        url={item.media_url}
                      />
                    </View>
                  }
                </>
              );
            })}
          </>
        } />
    );
  }

  onLikeUnlikeNotePress = (item,index) => {
    this.props.onLikeUnlike(item.id, index);
  }

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
      linkPreview
    } = this.state;
    const contentContainer = [
      {
        borderBottomWidth: item.showComment && commentData.length > 0 ? 0.5 : 0,
        // paddingBottom: 2,
      },
      styles.contentContainer,
    ];

    const interactionContainer = [
      styles.interactionContainer,
      {
        marginBottom: showCommentBox && !isFriend ? 20 : 0,
      },
    ];

    let medias = [];
    item.image && item.image.map(item => medias.push({ type: 'image', url: item }));
    item.video && item.video.map(item => medias.push({ type: 'video', url: item }));
    item.audio && item.audio.map(item => medias.push({ type: 'audio', url: item }));

    return (
      <View style={styles.container}>
        {!editNote ? (
          <View>
            <View style={contentContainer}>
              <View style={styles.userContentContainer}>
                <View style={styles.row}>
                  <Image
                    source={getAvatar(item.created_by_avatar)}
                    style={styles.avatar}
                  />
                  <View style={styles.leftMargin}>
                    <Text style={styles.username}>
                      {userData.id === item.created_by
                        ? translate('pages.xchat.you')
                        : getUserName(item.created_by) ||
                          item.created_by_username}
                    </Text>
                    <Text style={styles.updatedDate}>
                      {this.getDate(item.updated)}
                    </Text>
                  </View>
                </View>
                {userData.id === item.created_by && (
                  <View style={styles.row}>
                    <FontAwesome5
                      name={'pencil-alt'}
                      size={14}
                      color={Colors.black}
                      style={styles.rightMargin}
                      onPress={() => {
                        onEdit(index, item);
                        this.setState({text: item.text});
                      }}
                    />
                    <FontAwesome5
                      name={'trash'}
                      size={14}
                      color={Colors.black}
                      style={styles.leftMargin}
                      onPress={() => {
                        onDelete(index, item);
                      }}
                    />
                  </View>
                )}
              </View>
              <View style={styles.topMargin}>
                {this.renderMedia(item.media)}
                {item.media && item.media.length<=0 && this.renderLinkPreview(linkPreview)}
                {/* {this.renderLinkPreview(linkPreview)} */}
                <Text style={styles.itemText}>{item.text}</Text>
              </View>
              <View style={interactionContainer}>
                <View style={styles.interactionContentContainer}>
                  <Text
                    style={styles.interactionText}
                    onPress={this.onLikeUnlikeNotePress.bind(this,item,index)}>
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
                    style={styles.interactionText}
                    onPress={() => {
                      onExpand(item.id, item);
                      this.setState({
                        showCommentBox: !this.state.showCommentBox,
                      });
                    }}>
                    {translate('pages.xchat.comment')}
                  </Text>
                </View>
                <View style={styles.interactionIconContainer}>
                  <FontAwesome
                    name={item.is_liked ? 'thumbs-up' : 'thumbs-o-up'}
                    size={normalize(12)}
                    color={Colors.black}
                    style={styles.rightMargin}
                  />

                  <Text style={styles.countText}>{item.liked_by_count>=0?item.liked_by_count:0}</Text>

                  <TouchableOpacity
                    style={styles.interactionContentContainer}
                    onPress={() => {
                      if (item.comment_count > 0) {
                        onExpand(item.id, item);
                        // this.setState({showComment: !showComment}, () => {
                        if (!commentResult) {
                          this.getCommentList(item.id, offset);
                        }
                        // });
                      }
                    }}>
                    <MaterialCommunityIcons
                      name={'comment-outline'}
                      size={normalize(12)}
                      color={Colors.black}
                      style={styles.commentIcon}
                    />

                    <Text style={styles.countText}>{item.comment_count}</Text>
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
                      onMarkdownChange={() => {}}
                      placeholder={translate('pages.xchat.enterComment')}
                      placeholderTextColor={'gray'}
                      mentionStyle={styles.mentionStyle}
                      textInputStyle={styles.textInputStyle}
                      users={this.state.suggestionData}
                      suggestedUsersComponent={(users, addMentions) =>
                        users.length > 0 && (
                          <View
                            style={[
                              {
                                height: this.suggestionsDataHeight(
                                  users.length,
                                ),
                                top:
                                  users.length === 1
                                    ? -35
                                    : -this.suggestionsDataHeight(users.length),
                              },
                              styles.suggestedUsersComponentContainer,
                            ]}>
                            <ScrollView
                              style={styles.suggestedUsersScrollStyle}>
                              {users.map((user, idx) => {
                                const suggestedUsersContainer = [
                                  styles.suggestedUserComponentStyle,
                                  {
                                    backgroundColor:
                                      idx === 0 ? '#FFB582' : 'white',
                                  },
                                  styles.suggestedUsersContainer,
                                ];

                                const name = {
                                  color: idx === 0 ? '#fff' : '#000',
                                };

                                return (
                                  <GHTouchableHighlight
                                    onPress={() => addMentions(user)}
                                    style={styles.suggestedUsersActionContainer}
                                    activeOpacity={1}>
                                    <View
                                      key={user.id}
                                      style={suggestedUsersContainer}>
                                      <Text style={name}>{user.name}</Text>
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
                      onChangeText={(comment) =>
                        this.setState({commentText: comment})
                      }
                      value={commentText}
                      rightTitle={`${commentText.length}/150`}
                      maxLength={150}
                      placeholder={translate('pages.xchat.enterComment')}
                    />
                  )}

                  <View style={styles.dialogContainer}>
                    <View style={styles.commentButtonContainer}>
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
                    <View style={styles.commentButtonContainer}>
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
              <View style={styles.topMargin}>
                {commentData.length > 0 ? (
                  commentData.map((comment, idx) => {
                    return (
                      <CommentItem
                        ref={'comment_' + comment.id}
                        index={idx}
                        item={comment}
                        onDelete={this.toggleDeleteConfirmationModal}
                        onLikeUnlike={this.likeUnlikeComment}
                        userData={userData}
                      />
                    );
                  })
                ) : loadComment ? (
                  <View style={styles.loadCommentContainer}>
                    <ActivityIndicator />
                  </View>
                ) : null}
                {commentResult && commentResult.next && (
                  <View style={styles.loadCommentContainer}>
                    {loadComment ? (
                      <View style={styles.loadCommentContainer}>
                        <ActivityIndicator />
                      </View>
                    ) : (
                      <Text
                        style={styles.interactionText}
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
          <View style={styles.commentUpdateContainer}>
            <TextAreaWithTitle
              onChangeText={(text) => this.setState({text})}
              value={text}
              rightTitle={`${text.length}/300`}
              maxLength={300}
            />
            <View style={styles.commentUpdateSubContainer}>
              <View style={styles.commentButtonContainer}>
                <Button
                  title={translate('common.cancel')}
                  type={'secondary'}
                  onPress={() => {
                    onCancel();
                    this.setState({text: ''});
                  }}
                  height={30}
                  isRounded={false}
                />
              </View>
              <View style={styles.commentButtonContainer}>
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
