import React, {Component} from 'react';
import {
  Modal,
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  FlatList,
  TouchableOpacity,
  Keyboard,
  TextInput,
  SafeAreaView
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Colors, Fonts, Icons } from '../../constants';
import { translate } from '../../redux/reducers/languageReducer';
import ScalableImage from '../ScalableImage';
import VideoPlayerCustom from '../VideoPlayerCustom';
import AudioPlayerCustom from '../AudioPlayerCustom';
import HyperLink from 'react-native-hyperlink';
import { normalize, onPressHyperlink, getAvatar, getUserName } from '../../utils';
import ViewSlider from '../ViewSlider';
import TimelineCommentModal from '../Modals/TimelineCommentModal';
import KeyboardStickyView from '../KeyboardStickyView';
import ConfirmationModal from '../Modals/ConfirmationModal';
import styles from './styles';

const { width, height } = Dimensions.get('window');

export default class PostChannelItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      audioPlayingId: null,
      perviousPlayingAudioId: null,
      readMore: false,
      character: 40,
      page_height: 250,
      step: 1,
      commentModalVisible: false,
      comment: '',
      comments: [],
      addLoading: false,
      showDeleteConfirmation: false,
      deleteLoading: false,
      deleteCommentId: null
    };
    this.autoFocus = false;
  }

  componentDidMount() {
  }

  _openMenu = () => this.setState({ visible: true });

  _closeMenu = () => this.setState({ visible: false });

  toggleNumberOfLines = (check) => {
    if (check === 'less') {
      this.setState({ readMore: false });
    } else {
      this.setState({ readMore: true });
    }
  };

  getDate = (date) => {
    return moment(date).format('MM/DD/YYYY HH:mm');
  };

  actionCancel = () => {
    this.setState({showDeleteConfirmation: false});
  }

  actionSure = () => {
    if(this.state.deleteCommentId){
      this.setState({deleteLoading: true});
      this.props.deleteComment(this.state.deleteCommentId).then((res)=>{
        this.setState({deleteLoading: false, showDeleteConfirmation:false});
        console.log(res);
      }).catch((err)=>{
        this.setState({deleteLoading: false, showDeleteConfirmation: false});
        console.log(err);
      })
    }
  }

  // function for add comment and update modal
  onAddComment = (id, comment, onFinish) => {
    this.props.addComment(id, comment).then((res) => {
      if (res) {
        onFinish();
      } else {
        onFinish();
      }
    }).catch((err) => {
      console.log('error',err);
      onFinish();
    });
  }

  // function for delete comment and update modal
  onDeleteComment = (commentId, onFinish) => {
    this.props.deleteComment(commentId).then((res)=>{
      console.log(res);
      onFinish();
    }).catch((err)=>{
      console.log(err);
      onFinish();
    })
  }

  renderCommentItem = ({item}) => {
    const {userData} = this.props;
    return (
      <View style={{padding:10,flexDirection:'row'}}>
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
        <View
          style={{
            // paddingBottom: 2,
            flex: 1
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{ flex:1, flexDirection: 'row' }}>
              <View>
                <View style={{ marginLeft: 5, flexDirection: 'row',marginBottom:5 }}>
                  <Text
                    style={{
                      marginRight: 5,
                      color: '#e26161',
                      fontFamily: Fonts.regular,
                      fontWeight: '400',
                      fontSize: normalize(10),
                    }}>
                    {userData.id === item.created_by ? translate('pages.xchat.you') : getUserName(item.created_by) || item.created_by_username}
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
                <Text
                  style={{
                    color: Colors.black,
                    fontFamily: Fonts.regular,
                    fontWeight: '400',
                    fontSize: normalize(10),
                    marginLeft: 5,
                  }}>
                  {item.text}
                </Text>
              </View>
            </View>
            {userData.id === item.created_by && (
              <View style={{ flexDirection: 'row' }}>
                <FontAwesome5
                  name={'trash'}
                  size={14}
                  color={Colors.black}
                  style={{ marginLeft: 5 }}
                  onPress={() => {
                    this.setState({showDeleteConfirmation: true,deleteCommentId: item.id});
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { post, index, likeUnlikePost, addComment, getPostComments } = this.props;
    const { page_height, showDeleteConfirmation, deleteLoading } = this.state;
    //  console.log('post', post)
    let newArray = [];
    post.text &&
      post.text.length > 0 &&
      post.text.map((data, index) => {
          let text = data.text
          if (text && text.includes('{Display Name}')){
            text = text.replace(/{Display Name}/g,'');
        }
        return newArray.push(text);
      });
     console.log('newArray',newArray);

    let medias = [];
    post.media.image && post.media.image.map(item => medias.push({ type: 'image', url: item }));
    post.media.video && post.media.video.map(item => medias.push({ type: 'video', url: item }));
    post.media.audio && post.media.audio.map(item => medias.push({ type: 'audio', url: item }));
    return (
      <View>
        <ViewSlider
          step={this.state.step}
          onScroll={(index) => {
            if (medias[this.state.step - 1].type == 'audio') {
              this.audio && this.audio.stopSound();
            }
            this.setState({ step: index });
          }}
          renderSlides={
            <>
              {medias.map(item => {
                return (
                  <>
                    {item.type === 'image' &&
                      <View style={styles.swipeMediaContainer}
                        onLayout={(event) => {
                          let { height } = event.nativeEvent.layout
                          this.setState({ page_height: height });
                        }}
                      >
                        <ScalableImage src={item.url} />
                      </View>
                    }
                    {item.type === 'video' &&
                      <View style={styles.swipeMediaContainer}>
                        <VideoPlayerCustom
                          url={item.url}
                          width={width}
                          height={250} />
                      </View>
                    }
                    {item.type === 'audio' &&
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
                          url={item.url}
                        />
                      </View>
                    }
                  </>
                );
              })}
            </>
          } />
        <View style={styles.hyperlinkContainer}>
          <HyperLink
            onPress={(url) => {
              onPressHyperlink(url);
            }}
            linkStyle={styles.linkStyle}>
            {newArray.length > 0 ? (
              <Text style={styles.textContent}>
                {this.state.readMore
                  ? newArray.join('\n')
                  : newArray.join('').length > 35
                    ? newArray.join('\n').substring(0, this.state.character)
                    : newArray.join('')}
                {newArray.join('\n').length > this.state.character &&
                  !this.state.readMore
                  ? ' '
                  : ' '}
                {newArray.join('\n').length > this.state.character &&
                  (this.state.readMore ? (
                    <Text
                      onPress={() => this.toggleNumberOfLines('less')}
                      style={styles.showLessText}>
                      {newArray[2] !== null ? '\n\n ' : '\n '}
                      {'...' + translate('pages.xchat.showLess')}
                    </Text>
                  ) : (
                    <Text
                      onPress={() => this.toggleNumberOfLines('more')}
                      style={styles.showMoreText}>
                      {'  ' + '...' + translate('pages.xchat.showMore')}
                    </Text>
                  ))}
              </Text>
            ) : (
              <Text style={styles.messageBodyContainer}>
                {post.mutlilanguage_message_body
                  ? post.mutlilanguage_message_body.en
                  : ''}
              </Text>
            )}
          </HyperLink>
        </View>

        {/* Comment below code until not available on production */}
        {/* <View
          style={styles.likeCommentContainer}>
          <View style={styles.likeCommentActionContainer}>
            <TouchableOpacity style={styles.action_icon_container}
              onPress={() => {
                likeUnlikePost(post.id, !post.is_liked, index);
              }}>
              <Image
                source={post.is_liked ? Icons.icon_like : Icons.icon_like_black}
                style={styles.action_icon_style}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.action_icon_container}
              onPress={() => {
                this.autoFocus = true;
                this.setState({ commentModalVisible: true });
                getPostComments(post.id).then((res)=>{
                  if(res){
                    console.log('response_comments',res);
                    this.setState({comments: res.results});
                  }
                }).catch((err)=>{

                });
              }}>
              <Image
                source={Icons.icon_comment_black}
                style={styles.action_icon_style}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.likeCountContainer}>
            {post.liked_by_count > 0 &&
              <Text style={styles.countText}>
                {post.liked_by_count} {translate('pages.xchat.like')}
              </Text>
            }
          </View>
        </View>
        {post.post_comments && post.post_comments.length > 0 && <View
          style={styles.commentCountContainer}>
          <Text style={styles.countText}
            onPress={()=>{
              this.autoFocus = false;
              this.setState({commentModalVisible: true})
            }}>
            {post.post_comments && post.post_comments.length} {translate('pages.xchat.comment')}
          </Text>
        </View>} */}

        <TimelineCommentModal
          autoFocus={this.autoFocus}
          post={post}
          visible={this.state.commentModalVisible}
          userData={this.props.userData}
          onAddComment={this.onAddComment}
          onDeleteComment={this.onDeleteComment}
          onRequestClose={() => this.setState({ commentModalVisible: false })}
        />
        
      </View>
    );
  }
}

PostChannelItem.propTypes = {
  menuItems: PropTypes.object,
};

PostChannelItem.defaultProps = {
  menuItems: {},
};
