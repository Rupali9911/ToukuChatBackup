import React, {Component} from 'react';
import {Dimensions, Image} from 'react-native';
import FastImage from 'react-native-fast-image';

const WIDTH = Dimensions.get('window').width;

export default class ScalableImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratio: 1,
      img_width: 0,
      img_height: 0
    };
  }

  componentDidMount() {
    this.getAspectRatio();
  }

  getAspectRatio = () => {
    Image.getSize(this.props.src, (height, width) => {
      this.setState({
        ratio: height / width,
        img_width: width,
        img_height: height
      });
    });
  };

  render() {
    const {src, borderRadius, isHyperlink} = this.props;
    const {ratio,img_width,img_height} = this.state;

    const container = {
      width: isHyperlink ? WIDTH : '100%',
      // height: img_height > 500 ? 500 : img_height,
      aspectRatio: ratio || 1,
      borderRadius: borderRadius ? borderRadius : 0,
    };
    return (
      <FastImage
        style={container}
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
