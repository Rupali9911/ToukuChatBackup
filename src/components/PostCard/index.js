import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Text,
  View,
} from 'react-native';
import {Colors, Images} from '../../constants';
import {translate} from '../../redux/reducers/languageReducer';
import PostCardHeader from '../PostCardHeader';
import PostChannelItem from '../PostChannelItem';
import PostChannelRankItem from '../PostChannelRankItem';
import styles from './styles';

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
      <Text style={styles.truncatedText} onPress={handlePress}>
        ...Show more
      </Text>
    );
  };

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={styles.truncatedText} onPress={handlePress}>
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
      post.text.map((data) => {
        return newArray.push(data.text);
      });

    const {menuItems, isTimeline, isChannelTimeline, userData, likeUnlikePost, addComment, getPostComments, deleteComment} = this.props;

    const container = [
      {
        backgroundColor: isChannelTimeline ? 'transparent' : Colors.white,
        borderWidth: isChannelTimeline ? 1 : 0,
      },
      styles.postItemContainer,
    ];

    return (
      <View style={container} key={`${post.id}`}>
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
    const {isChannelTimeline, onChannelUpdate} = this.props;
    return (
      <PostChannelRankItem
        post={post}
        key={`${post.channel_id}`}
        index={index}
        isChannelTimeline={isChannelTimeline}
        onChannelUpdate={onChannelUpdate}
      />
    );
  };

  EmptyList = () => {
    const {rankingLoadMore} = this.props;
    return (
      <>
        <ImageBackground
          source={Images.image_home_bg}
          style={styles.emptyListBackground}>
          {rankingLoadMore ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.emptyListMessage}>
              {translate('pages.xchat.noTimelineFound')}
            </Text>
          )}
        </ImageBackground>
      </>
    );
  };

  channelEmptyList = () => {
    return (
      <View style={styles.emptyChannelContainer}>
        <Text style={styles.emptyChannelText}>
          {translate('pages.xchat.noTimelineFound')}
        </Text>
      </View>
    );
  };

  render() {
    const {
      posts,
      isTimeline,
      isChannelTimeline,
      onMomentumScrollBegin,
      onEndReached,
      isRankedChannel,
      rankingLoadMore,
    } = this.props;

    const listStyle = {
      backgroundColor: isRankedChannel ? Colors.white : 'transparent',
      marginBottom: isRankedChannel ? 50 : 0,
    };
    return (
      <FlatList
        data={posts}
        scrollEnabled={posts.length > 0 ? true : false}
        renderItem={
          isRankedChannel ? this.renderRankedChannelItem : this.renderPostItem
        }
        onEndReached={onEndReached}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onEndReachedThreshold={0.1}
        bounces={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={16}
        keyboardShouldPersistTaps={'always'}
        style={listStyle}
        // keyExtractor={(item, index) => isRankedChannel?`${item.channel_id}`:`${item.id}`}
        ListEmptyComponent={
          isChannelTimeline ? this.channelEmptyList : this.EmptyList(isTimeline)
        }
        ListFooterComponent={() => {
          return isRankedChannel && rankingLoadMore ? (
            <View style={styles.listFooterComponent}>
              <ActivityIndicator />
            </View>
          ) : null;
        }}
        keyExtractor={(_, index) => index.toString()}
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
