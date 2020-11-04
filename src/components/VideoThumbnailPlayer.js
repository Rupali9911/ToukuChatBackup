import React, { Component } from 'react';
import { Image } from 'react-native';
import VideoPlayer from 'react-native-video-player';
import { createThumbnail } from "react-native-create-thumbnail";
import RoundedImage from './RoundedImage';

export default class VideoThumbnailPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailUrl: ''
    };
  }

  componentDidMount() {
    this.generateThumbnail(this.props.url);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.url){
      this.generateThumbnail(nextProps.url);
    }
  }

  generateThumbnail = (url) => {
    createThumbnail({
      url: url,
      timeStamp: 1000,
    }).then(response => {
      console.log(response);
      this.setState({thumbnailUrl: response.path});
    }).catch(err => console.log({ err }));
  }

  render() {
    const { url, size, thumbnailImage } = this.props;
    return (
      <RoundedImage
        source={this.state.thumbnailUrl?{ url: this.state.thumbnailUrl }:''}
        isRounded={false}
        size={size?size:50}
      />
    );
  }
}
