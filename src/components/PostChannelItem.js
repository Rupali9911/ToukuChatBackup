import React, { Component } from 'react';
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
  Linking,
  ImageBackground,
  Keyboard,
  TextInput,
  ScrollView,
  SafeAreaView
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Slider from '@react-native-community/slider';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors, Fonts, Images, Icons } from '../constants';
import { translate } from '../redux/reducers/languageReducer';
import ScalableImage from './ScalableImage';
import PostCardHeader from './PostCardHeader';
import VideoPlayerCustom from './VideoPlayerCustom';
import AudioPlayerCustom from './AudioPlayerCustom';
import HyperLink from 'react-native-hyperlink';
import { normalize, onPressHyperlink, getAvatar, getUserName } from '../utils';
import ViewSlider from './ViewSlider';
import KeyboardStickyView from './KeyboardStickyView';
import ConfirmationModal from './Modals/ConfirmationModal';

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
    this.autFocus = false;
  }

  componentDidMount() {
    let keyboardDismissListener = Keyboard.addListener('keyboardWillHide', () => {
      // this.setState({commentModalVisible:false});
    });
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

  renderCommentItem = ({item,index}) => {
    const {userData,deleteComment} = this.props;
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
    // console.log('post', post)
    let newArray = [];
    post.text &&
      post.text.length > 0 &&
      post.text.map((data, index) => {
        return newArray.push(data.text);
      });
    // console.log('post',post);

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
                      <View style={{
                        justifyContent: 'center',
                        width: width,
                        alignItems: 'center',
                        height: 250
                      }}
                        onLayout={(event) => {
                          let { width, height } = event.nativeEvent.layout
                          this.setState({ page_height: height });
                        }}
                      >
                        <ScalableImage src={item.url} />
                      </View>
                    }
                    {item.type === 'video' &&
                      <View style={{
                        justifyContent: 'center',
                        width: width,
                        alignItems: 'center',
                        height: 250
                      }}>
                        <VideoPlayerCustom
                          url={item.url}
                          width={width}
                          height={250} />
                      </View>
                    }
                    {item.type === 'audio' &&
                      <View style={{
                        paddingHorizontal: 20,
                        justifyContent: 'center',
                        width: width,
                        padding: 10,
                        alignItems: 'center',
                        height: 250
                      }}>
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
        {/* {post.media.audio && post.media.audio.length ? (
          <View style={{marginTop: 10}}>
            <AudioPlayerCustom
              onAudioPlayPress={(id) =>
                this.setState({
                  audioPlayingId: id,
                  perviousPlayingAudioId: this.state.audioPlayingId,
                })
              }
              audioPlayingId={this.state.audioPlayingId}
              perviousPlayingAudioId={this.state.perviousPlayingAudioId}
              postId={post.id}
              url={post.media.audio[0]}
            />
          </View>
        ) : post.media.image && post.media.image.length ? (
          <View style={{margin: 5}}>
            <ScalableImage src={post.media.image[0]} />
          </View>
        ) : post.media.video && post.media.video.length ? (
          <View style={{margin: 5}}>
            <VideoPlayerCustom url={post.media.video[0]} />
          </View>
        ) : null} */}
        <View style={{ marginHorizontal: '4%', marginVertical: 5 }}>
          <HyperLink
            onPress={(url, text) => {
              onPressHyperlink(url);
            }}
            linkStyle={{
              color: '#7e8fce',
              textDecorationLine: 'underline',
            }}>
            {newArray.length > 0 ? (
              <Text style={{ lineHeight: 18 }}>
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
                      style={{
                        fontFamily: Fonts.regular,
                        fontSize: normalize(12),
                        margin: 15,
                        color: '#7e8fce',
                      }}>
                      {newArray[2] !== null ? '\n\n ' : '\n '}
                      {'...' + translate('pages.xchat.showLess')}
                    </Text>
                  ) : (
                      <Text
                        onPress={() => this.toggleNumberOfLines('more')}
                        style={{
                          fontFamily: Fonts.regular,
                          fontSize: normalize(12),
                          color: '#7e8fce',
                          flex: 1,
                        }}>
                        {'  ' + '...' + translate('pages.xchat.showMore')}
                      </Text>
                    ))}
              </Text>
            ) : (
                <Text style={{ fontFamily: Fonts.regular, fontSize: 16 }}>
                  {post.mutlilanguage_message_body
                    ? post.mutlilanguage_message_body.en
                    : ''}
                </Text>
              )}
          </HyperLink>
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 0,
            marginHorizontal: '4%'
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            {post.liked_by_count>0 && <Text
              style={{
                color: Colors.black,
                fontFamily: Fonts.regular,
                fontWeight: '400',
                fontSize: normalize(10),
              }}>
              {post.liked_by_count} {translate('pages.xchat.like')}
            </Text>}
          </View>
        </View> */}
        {post.post_comments && post.post_comments.length > 0 && <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 0,
            marginHorizontal: '4%',
            paddingVertical: 10
          }}>
          <Text
            style={{
              color: Colors.black,
              fontFamily: Fonts.regular,
              fontWeight: '400',
              fontSize: normalize(10),
            }}
            onPress={()=>{
              this.autoFocus = false;
              this.setState({commentModalVisible: true})
            }}>
            {post.post_comments && post.post_comments.length} {translate('pages.xchat.comment')}
          </Text>
        </View>}

        <Modal
          visible={this.state.commentModalVisible}
          transparent
          onRequestClose={() => this.setState({ commentModalVisible: false })}>
          <View style={{ flex: 1, backgroundColor: '#00000040' }}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ commentModalVisible: false })} />
            <KeyboardStickyView style={{ backgroundColor:'#fff'}}>
              {/* <Entypo
                name={'chevron-thin-down'}
                color={'#fff'}
                size={normalize(20)}
                style={{ alignSelf: 'center', }}
              /> */}
              <View style={{ width: '100%', maxHeight: normalize(200), backgroundColor: '#fff' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 0,
                    // paddingHorizontal: 10,
                    // paddingVertical: 10
                  }}>
                  {post.liked_by_count > 0 && <Text
                    style={{
                      color: Colors.black,
                      fontFamily: Fonts.regular,
                      fontWeight: '400',
                      fontSize: normalize(10),
                      margin: 10
                    }}>
                    {post.liked_by_count} {translate('pages.xchat.like')}
                  </Text>}
                  {(post.post_comments && post.post_comments.length > 0) && <Text
                    style={{
                      color: Colors.black,
                      fontFamily: Fonts.regular,
                      fontWeight: '400',
                      margin: 10,
                      fontSize: normalize(10),
                    }}>
                    {post.post_comments && post.post_comments.length} {translate('pages.xchat.comment')}
                  </Text>}
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                  <Text style={{fontSize: normalize(12)}}>{translate('pages.xchat.comment')}</Text>
                </View>
                <FlatList
                  data={post.post_comments}
                  renderItem={this.renderCommentItem}
                  keyboardShouldPersistTaps={'always'}
                  ListEmptyComponent={() => {
                    return (
                      <View style={{ backgroundColor: '#fff', minHeight: 100, justifyContent: 'center' }}>
                        <Text style={{alignSelf:'center'}}>{'Be the first to leave a comment'}</Text>
                      </View>
                    );
                  }} />
              </View>
              <View style={{
                padding: 10, paddingTop: 8, width: '100%', flexDirection: 'row',
                borderTopWidth: 1,
                alignItems: 'center',
                borderTopColor: '#ccc',
                backgroundColor: '#fff'
              }}>
                <TextInput
                  autoFocus={this.autoFocus}
                  keyboardType='twitter'
                  style={{ flex: 1, fontSize: normalize(12), maxHeight: 70, backgroundColor: '#fff' }}

                  textAlignVertical={'center'}
                  placeholder={translate('pages.xchat.enterComment')}
                  multiline
                  onChangeText={(text) => this.setState({ comment: text })}
                  value={this.state.comment}
                />
                <TouchableOpacity
                  style={styles.sendButoonContainer}
                  activeOpacity={this.state.addLoading ? 0 : 1}
                  disabled={this.state.addLoading}
                  onPress={() => {
                    if (this.state.comment.trim().length > 0) {
                      this.setState({addLoading: true});
                      addComment(post.id, this.state.comment).then((res)=>{
                        if(res){
                          console.log('comment',res);
                          let array = this.state.comments;
                          array.splice(0,0,res);
                          // array.push(res);
                          this.setState({comments: array,addLoading:false,comment: ''});
                        }else{
                          this.setState({addLoading:false});
                        }
                      }).catch((err)=>{
                        this.setState({addLoading:false});
                      });
                    }
                  }}>
                  <Image
                    source={Icons.icon_send_button}
                    style={[styles.sandButtonImage]}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              </View>
              <SafeAreaView style={{backgroundColor:'#fff'}}/>
            </KeyboardStickyView>
            <ConfirmationModal
              visible={showDeleteConfirmation}
              onCancel={this.actionCancel.bind(this)}
              onConfirm={this.actionSure.bind(this)}
              title={translate('pages.xchat.toastr.deleteComment')}
              message={translate('pages.xchat.deleteCommentText')}
              isLoading={deleteLoading}
            />
          </View>
        </Modal>

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

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    height: height * 0.06,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomWidth: Platform.OS === 'ios' ? 0.3 : 0.2,
    borderBottomColor: Colors.gray_dark,
  },
  tabItem: {
    marginHorizontal: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    fontSize: 16,
    color: Colors.gradient_1,
    fontFamily: Fonts.regular,
  },
  sendButoonContainer: {
    // height: '100%',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // marginBottom: 5,
  },
  sandButtonImage: {
    // height: '50%',
    width: '65%',
    // tintColor: Colors.gray,
  },
  action_icon_container: {
    marginRight: 20
  },
  action_icon_style: {
    width: 20,
    height: 20
  }
});
