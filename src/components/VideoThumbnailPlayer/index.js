import React, {Component} from 'react';
import {createThumbnail} from 'react-native-create-thumbnail';
import {getYoutubeMeta} from 'react-native-youtube-iframe';
import RoundedImage from '../RoundedImage';

export default class VideoThumbnailPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailUrl: '',
      playing: false,
    };
  }

  componentDidMount() {
    this.generateThumbnail(this.props.url);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.url && nextProps.url !== this.props.url) {
      this.generateThumbnail(nextProps.url);
    }
  }

  generateThumbnail = (url) => {
    if (url.includes('youtube.com')) {
      getYoutubeMeta(this.getVideoId(url))
        .then((youtubedata) => {
          // console.log(youtubedata);
          if (youtubedata && youtubedata.thumbnail_url) {
            this.setState({thumbnailUrl: youtubedata.thumbnail_url});
          }
        })
        .catch((err) => console.log({err}));
    } else {
      createThumbnail({
        url: url,
        timeStamp: 2000,
      })
        .then((response) => {
          // console.log(response);
          this.setState({thumbnailUrl: response.path});
        })
        .catch((err) => console.log({err, url}));
    }
  };

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

  render() {
    const {size, showPlayButton} = this.props;
    return (
      <RoundedImage
        source={this.state.thumbnailUrl ? {uri: this.state.thumbnailUrl} : ''}
        isRounded={false}
        size={size ? size : 50}
        showPlayButton={showPlayButton ? true : false}
      />
    );
  }
}
