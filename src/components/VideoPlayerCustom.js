import React, {Component} from 'react';
import {Dimensions, View, Image, Platform, ActivityIndicator, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import VideoPlayer from 'react-native-video-player';
import {createThumbnail} from 'react-native-create-thumbnail';
import YoutubePlayer from "react-native-youtube-iframe";

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default class VideoPlayerCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailUrl: '',
      playing: false,
      isFullscreen: false,
      isLoading: true
    };
  }

  componentDidMount() {
    this.generateThumbnail(this.props.url);
    console.log('resr12312313313', this.props.url);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.url && nextProps.url !== this.props.url) {
      this.generateThumbnail(nextProps.url);
    }
  }

  generateThumbnail = (url) => {
    createThumbnail({
      url: url,
      timeStamp: 2000,
    })
      .then((response) => {
        console.log('res',response);
        this.setState({thumbnailUrl: response.path});
      })
      .catch((err) => console.log({err}));
  };
  getAspectRatio = () => {};

  onStateChange = () => {
    if (state === "ended") {
      this.setState({playing: false})
    }
  }

  getVideoId = (url) => {
    let video_id = '';
    if(url.includes('youtube.com')){
      video_id = url.substring(url.lastIndexOf('/')+1)
    }
    console.log('video_id',video_id);
    return video_id;
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if(this.props.url === nextProps.url && nextState.thumbnailUrl === this.state.thumbnailUrl) return false;
    else return true;
  }

  render() {
    const {url, width, height, thumbnailImage} = this.props;
    const {playing, isLoading, isFullscreen, thumbnailUrl, onStateChange} = this.state;
    return (
      url.includes('youtube.com') ?
        <View style={{ height: 150, width: 260}}>
            <YoutubePlayer
              height={150}
              play={playing}
              videoId={this.getVideoId(url)}
              onChangeState={onStateChange}
              onError={(err) => {
                console.log('err', err);
              }}
            />
        </View>
        :
        <VideoPlayer
          video={{
            uri: url,
          }}
          // autoplay
          fullScreenOnLongPress
          videoWidth={width ? width : 1600}
          videoHeight={height ? height : 900}
          thumbnail={thumbnailUrl ? {uri: thumbnailUrl} : ''}
        />
    );
  }
}
