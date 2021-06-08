import React, {Component} from 'react';
import {Platform, View, ActivityIndicator} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import VideoIos from 'react-native-video';
import YouTube from 'react-native-youtube';
import YoutubePlayer from 'react-native-youtube-iframe';
import VideoAndroid from '../Video/components/Video';
import styles from './styles';
import { Images } from '../../constants';
import { isEqual } from 'lodash';

export default class VideoPlayerCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailUrl: '',
      playing: false,
      isFullscreen: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.generateThumbnail(this.props.url);
    // console.log('resr12312313313', this.props.url);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.url && nextProps.url !== this.props.url) {
      this.generateThumbnail(nextProps.url);
    }
  }

  generateThumbnail = (url) => {

    if (url.includes('youtube.com')) {
    } else {
      createThumbnail({
        url: url,
        timeStamp: 2000,
      })
        .then((response) => {
          // console.log('res', response);
          this.setState({thumbnailUrl: response.path});
        })
        .catch((err) => console.log({err}));
    }
  };
  getAspectRatio = () => {};

  onStateChange = () => {
    if (this.state.playing === 'ended') {
      this.setState({playing: false});
    }
  };

  getVideoId = (url) => {
    let video_id = '';
    if (url.includes('youtube.com')) {
      video_id = url.substring(url.lastIndexOf('/') + 1);
    }
    console.log('video_id', video_id);
    return video_id;
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (isEqual(this.props, nextProps) && isEqual(this.state, nextState)
      // this.props.url === nextProps.url &&
      // nextState.thumbnailUrl === this.state.thumbnailUrl 
    ) {
      return false;
    } else {
      return true;
    }
  };

  onLoadStart = () => {
    console.log('start loading');
    this.setState({isLoading: true});
  }

  onLoad = () => {
    console.log('stop loading');
    this.setState({isLoading: false});
  }

  render() {
    const {url,width,height} = this.props;
    const {playing, thumbnailUrl, isLoading} = this.state;

    let videoIosStyle = {
      width: width || 260,
      height: height || 150,
      borderRadius: 7
    }
    console.log('isLoading',isLoading);
    return (
      <View>
        {url.includes('youtube.com') ? (
          <View style={styles.container}>
            {Platform.OS === 'ios' ? (
              <YouTube
                videoId={this.getVideoId(url)} // The YouTube video ID
                play={false} // control playback of video with true/false
                fullscreen // control whether the video should play in fullscreen or inline
                loop // control whether the video should loop when ended
                onReady={(e) => this.setState({isReady: true})}
                onChangeState={(e) => this.setState({status: e.state})}
                onChangeQuality={(e) => this.setState({quality: e.quality})}
                onError={(e) => this.setState({error: e.error})}
                style={styles.youtubePlayer}
                origin={'https://youtube.com/'}
              />
            ) : (
              <YoutubePlayer
                height={150}
                play={playing}
                videoId={this.getVideoId(url)}
                onChangeState={this.onStateChange}
                onError={(err) => {
                  console.log('youtube err', err);
                }}
              />
            )}
          </View>
        ) : Platform.OS === 'android' ? (
          <VideoAndroid
            ref={(ref) => {
              this.player = ref;
            }}
            url={url}
            paused={true}
            controls={true}
            style={styles.androidVideoPlayer}
            hideFullScreenControl
            inlineOnly
            lockRatio={16 / 9}
            poster={thumbnailUrl}
            resizeMode={'contain'}
            placeholder={Images.image_loader}
          />
        ) : (
          <VideoIos
            ref={(ref) => {
              this.player = ref;
            }}
            source={{uri: url}} // Can be a URL or a local file.
            paused={true}
            controls={true} // Store reference
            // onBuffer={this.onBuffer}                // Callback when remote video is buffering
            // onError={this.videoError}               // Callback when video cannot be loaded
            style={videoIosStyle}
            poster={thumbnailUrl}
            resizeMode={'contain'}
            onLoadStart={this.onLoadStart}
            onLoad={this.onLoad}
          />
        )}
        {isLoading && <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator />
        </View>}
      </View>
    );
  }
}
