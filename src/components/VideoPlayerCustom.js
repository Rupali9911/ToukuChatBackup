import React, {Component} from 'react';
import {Image} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import {createThumbnail} from 'react-native-create-thumbnail';

export default class VideoPlayerCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailUrl: '',
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
      timeStamp: 1000,
    })
      .then((response) => {
        this.setState({thumbnailUrl: response.path});
      })
      .catch((err) => console.log({err}));
  };
  getAspectRatio = () => {};

  render() {
    const {url, width, height, thumbnailImage} = this.props;
    return (
      <VideoPlayer
        video={{
          uri: url,
        }}
        // autoplay
        fullScreenOnLongPress
        videoWidth={width ? width : 1600}
        videoHeight={height ? height : 900}
        thumbnail={this.state.thumbnailUrl ? this.state.thumbnailUrl : ''}
      />
    );
  }
}
