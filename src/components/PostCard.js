import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  FlatList,
  TouchableOpacity,
  Linking,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Slider from '@react-native-community/slider';

import {Colors, Fonts, Images, Icons} from '../constants';
import {translate} from '../redux/reducers/languageReducer';
import ScalableImage from './ScalableImage';
import PostCardHeader from './PostCardHeader';
import VideoPlayerCustom from './VideoPlayerCustom';
import AudioPlayerCustom from './AudioPlayerCustom';
import HyperLink from 'react-native-hyperlink';
import ReadMore from 'react-native-read-more-text';
import PostChannelItem from '../components/PostChannelItem';
import { normalize } from '../utils';
import PostChannelRankItem from './PostChannelRankItem';

const {width, height} = Dimensions.get('window');

export default class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      audioPlayingId: null,
      perviousPlayingAudioId: null,
      readMore: false,
    };
  }

  _openMenu = () => this.setState({visible: true});

  _closeMenu = () => this.setState({visible: false});

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text
        style={{color: Colors.tintColor, marginTop: 5}}
        onPress={handlePress}>
        ...Show more
      </Text>
    );
  };

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text
        style={{color: Colors.tintColor, marginTop: 5}}
        onPress={handlePress}>
        ...Show less
      </Text>
    );
  };

  _handleTextReady = () => {
    // ...
  };

  toggleNumberOfLines = (check) => {
    if (check === 'less') {
      this.setState({readMore: false});
    } else {
      this.setState({readMore: true});
    }
  };

  renderPostItem = ({item: post, index}) => {
    let newArray = [];
    post.text &&
      post.text.length > 0 &&
      post.text.map((data, index) => {
        return newArray.push(data.text);
      });

    const {menuItems, isTimeline, isChannelTimeline, userData, likeUnlikePost, addComment, getPostComments, deleteComment} = this.props;
    return (
      <View
        style={{
          backgroundColor: isChannelTimeline?'transparent':Colors.white,
          marginVertical: 10,
          paddingVertical: 10,
          flex: 1,
          borderColor: '#dbdbdb',
          borderWidth: isChannelTimeline?1:0
        }}
        key={`${post.id}`}>
        <PostCardHeader
          menuItems={menuItems}
          post={post}
          isChannelTimeline={isChannelTimeline}
          isTimeline={isTimeline}
          index={index}
          onFollowUnfollowChannel={this.props.onFollowUnfollowChannel}
        />
        <PostChannelItem post={post} index={index} userData={userData} likeUnlikePost={likeUnlikePost} addComment={addComment} deleteComment={deleteComment} getPostComments={getPostComments}/>
      </View>
    );
  };

  renderRankedChannelItem = ({item: post, index}) => {
    const {menuItems, isTimeline, isChannelTimeline, onChannelUpdate} = this.props;
    return (
        <PostChannelRankItem post={post} key={`${post.channel_id}`} index={index} isChannelTimeline={isChannelTimeline} onChannelUpdate={onChannelUpdate}/>
    );
  };

  EmptyList = () => {
    console.log('isTimeline');
    const {rankingLoadMore} = this.props;
    return (
      <>
        <ImageBackground
          source={Images.image_home_bg}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: height / 1.3,
          }}>
          {rankingLoadMore ?
            <ActivityIndicator />
            : <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 12,
              }}>
              {translate('pages.xchat.noTimelineFound')}
            </Text>}
        </ImageBackground>
      </>
    );
  };

  channelEmptyList = () => {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        height: height * 0.5,
      }}>
        <Text
        style={{
          fontFamily: Fonts.regular,
          fontSize: normalize(12),
          marginTop: 50,
          color: Colors.dark_gray
        }}>
        {translate('pages.xchat.noTimelineFound')}
      </Text>
        
      </View>
    );
  }

  render() {
    const {
      menuItems,
      posts,
      isTimeline,
      useFlatlist,
      isChannelTimeline,
      onMomentumScrollBegin,
      onEndReached,
      isRankedChannel,
      rankingLoadMore
    } = this.props;
    return (
      <FlatList
        data={posts}
        scrollEnabled={posts.length > 0 ? true : false}
        renderItem={isRankedChannel?this.renderRankedChannelItem:this.renderPostItem}
        onEndReached={onEndReached}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onEndReachedThreshold={0.1}
        bounces={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={16}
        keyboardShouldPersistTaps={'always'}
        style={{backgroundColor: isRankedChannel?Colors.white:'transparent', marginBottom: isRankedChannel?50:0}}
        // keyExtractor={(item, index) => isRankedChannel?`${item.channel_id}`:`${item.id}`}
        ListEmptyComponent={isChannelTimeline?this.channelEmptyList:this.EmptyList(isTimeline)}
        ListFooterComponent={()=>{
          return (
            (isRankedChannel && rankingLoadMore)?<View style={{height:50}}>
              <ActivityIndicator />
            </View>:null
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    );

    // useFlatlist ? (
    //   <FlatList
    //     data={posts}
    //     renderItem={this.renderPostItem}
    //     onEndReached={onEndReached}
    //     onMomentumScrollBegin={onMomentumScrollBegin}
    //     onEndReachedThreshold={0.1}
    //     bounces={false}
    //     keyExtractor={(item, index) => `${item.id}`}
    //     ListEmptyComponent={this.EmptyList(isTimeline)}
    //   />
    // ) : (
    //   posts.map((post, index) => {
    //     return this.renderPostItem({item: post, index: index});
    //   })
    // posts.map((post, index) => {
    //   // console.log('POST TEXT', post.text);
    //   return (
    //     <View
    //       style={{
    //         backgroundColor: Colors.white,
    //         marginVertical: 10,
    //         paddingVertical: 10,
    //       }}>
    //       <PostCardHeader
    //         menuItems={menuItems}
    //         post={post}
    //         isChannelTimeline={isChannelTimeline}
    //       />
    //       {post.media.audio && post.media.audio.length ? (
    //         <View style={{margin: 10}}>
    //           <AudioPlayerCustom
    //             onAudioPlayPress={(id) =>
    //               this.setState({
    //                 audioPlayingId: id,
    //                 perviousPlayingAudioId: this.state.audioPlayingId,
    //               })
    //             }
    //             audioPlayingId={this.state.audioPlayingId}
    //             perviousPlayingAudioId={this.state.perviousPlayingAudioId}
    //             postId={post.id}
    //             url={post.media.audio[0]}
    //           />
    //         </View>
    //       ) : post.media.image && post.media.image.length ? (
    //         <View style={{margin: 5}}>
    //           <ScalableImage src={post.media.image[0]} />
    //         </View>
    //       ) : post.media.video && post.media.video.length ? (
    //         <View style={{margin: 5}}>
    //           <VideoPlayerCustom url={post.media.video[0]} />
    //         </View>
    //       ) : null}
    //       <View style={{marginHorizontal: '4%', marginVertical: 5}}>
    //         <Text style={{fontFamily: Fonts.light}}>
    //           {post.text && post.text.length > 0
    //             ? post.text[0].text
    //             : post.mutlilanguage_message_body
    //             ? post.mutlilanguage_message_body.en
    //             : ''}
    //         </Text>
    //       </View>
    //     </View>
    //   );
    // })
    // );
    // ) : (
    //   <Text
    //     style={{
    //       fontFamily: Fonts.regular,
    //       fontSize: 12,
    //       marginTop: 20,
    //       textAlign: 'center',
    //     }}>
    //     {isTimeline
    //       ? translate('pages.xchat.noTimelineFound')
    //       : translate('pages.xchat.noChannelFound')}
    //   </Text>
    // );
  }
}

PostCard.propTypes = {
  menuItems: PropTypes.object,
};

PostCard.defaultProps = {
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
});
