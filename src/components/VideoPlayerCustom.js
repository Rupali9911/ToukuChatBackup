import React, {Component} from 'react';
import {Image} from 'react-native';
import VideoPlayer from 'react-native-video-player';

export default class VideoPlayerCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  getAspectRatio = () => {};

  render() {
    const {url, width, height, thumbnailImage} = this.props;
    return (
      <VideoPlayer
        video={{
          uri: url,
        }}
        autoplay
        fullScreenOnLongPress
        videoWidth={width ? width : 1600}
        videoHeight={height ? height : 900}
        thumbnail={{
          uri: thumbnailImage,
        }}
      />
    );
  }
}
