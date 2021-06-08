import React, {Component} from 'react';
import {Dimensions, Image, View, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import { isEqual } from 'lodash';
import {normalize} from '../../utils';
import styles from './styles';

const WIDTH = Dimensions.get('window').width;

export default class ScalableImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratio: 1,
      img_width: 0,
      img_height: 0,
      loading: true,
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

  onLoadStart = () => {
    this.setState({loading: true});
  }

  onLoadEnd = () => {
    this.setState({loading: false});
  }

  shouldComponentUpdate(nextProps, nextState){
    if(isEqual(this.props, nextProps) && isEqual(this.state, nextState)){
      return false;
    }
    return true;
  }

  render() {
    const {src, borderRadius, isHyperlink, isEmotion} = this.props;
    const {ratio} = this.state;

    let width;
    if (isHyperlink) {
      width = WIDTH;
    } else if (isEmotion) {
      width = isEmotion.type === 'gif' ? normalize(68) : normalize(100);
    } else {
      width = '100%';
    }
    const container = {
      width,
      aspectRatio: ratio || 1,
      borderRadius: borderRadius ? borderRadius : 0,
    };
    return (
      <>
        <FastImage
          style={container}
          source={{
            uri: src,
          }}
          // onLoadStart={this.onLoadStart}
          onLoadStart={this.onLoadEnd}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.loaderConatiner}>
          <ActivityIndicator
            animating={this.state.loading}
            size={'small'}
            color={'#e26161'}
          />
        </View>
      </>
    );
  }
}
