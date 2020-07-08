import React, { Component } from 'react';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image'

export default class ScalableImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratio: 1,
    };
  }

  componentDidMount() {
    this.getAspectRatio();
  }

  getAspectRatio = () => {
    Image.getSize(this.props.src, (height, width) => {
      this.setState({
        ratio: height / width,
      });
    });
  };

  render() {
    const { src, borderRadius } = this.props;
    const { ratio } = this.state;
    return (
        <FastImage
            style={{
                width: '100%',
                aspectRatio: ratio,
                borderRadius: borderRadius ? borderRadius : 0,
            }}
            source={{
                uri: src,
            }}
            resizeMode={FastImage.resizeMode.contain}
        />
      // <Image
      //   source={{
      //     uri: src,
      //   }}
      //   style={{
      //     width: '100%',
      //     aspectRatio: ratio,
      //     borderRadius: borderRadius ? borderRadius : 0,
      //   }}
      //   resizeMode="contain"
      // />
    );
  }
}
