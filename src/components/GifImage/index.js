import React, {Component} from 'react';
import {Dimensions, Image, View, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import styles from './styles';
import { normalize } from '../../utils';

const WIDTH = Dimensions.get('window').width;

export default class GifImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratio: 1,
      loading: true,
      height: 200,
      width: 200
    };
  }
  componentDidMount() {
    if(this.props.isGif){
      this.getAspectRatio();
    }
  }

  getAspectRatio = () => {
    Image.getSize(this.props.src, (height, width) => {
      this.setState({
        ratio: height / width,
      });
    });
  };

  onLoadStart = () => {
    this.setState({loading: true});
  }

  onLoadEnd = () => {
    this.setState({loading: false});
  }

  render() {
    const {src,isGif,borderRadius} = this.props;
    const container = [styles.container, isGif ? {
      aspectRatio: this.state.ratio,
      maxWidth: normalize(200),
    } : {
      height: normalize(150),
      width: normalize(150)
    },
    {
      borderRadius: borderRadius ? borderRadius : 10,
    }
  ]
    return (
      <>
        <FastImage
          style={container}
          source={{
            uri: src,
          }}
          // onLoadStart={this.onLoadStart}
          onLoadEnd={this.onLoadEnd}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.loaderConatiner}>
          <ActivityIndicator animating={this.state.loading} size={'small'} color={'#e26161'}/>
        </View>  
      </>
    );
  }
}
