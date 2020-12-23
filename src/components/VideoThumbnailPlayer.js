import React, {Component} from 'react';
import {Image} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import {createThumbnail} from 'react-native-create-thumbnail';
import RoundedImage from './RoundedImage';

export default class VideoThumbnailPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailUrl: '',
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
    createThumbnail({
      url: url,
      timeStamp: 2000,
    })
      .then((response) => {
        console.log(response);
        this.setState({thumbnailUrl: response.path});
      })
      .catch((err) => console.log({err}));
  };

  render() {
    const {url, size, thumbnailImage, showPlayButton} = this.props;
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
