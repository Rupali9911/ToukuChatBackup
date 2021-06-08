import React, {Component} from 'react';
import {Dimensions, Image, View, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import styles from './styles';

const WIDTH = Dimensions.get('window').width;

export default class NormalImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratio: 1,
      loading: true
    };
  }

  onLoadStart = () => {
    this.setState({loading: true});
  }

  onLoadEnd = () => {
    this.setState({loading: false});
  }

  render() {
    const {src, style, borderRadius, isHyperlink, resizeMode} = this.props;
    const {ratio} = this.state;

    const container = style ? style : {
      width: isHyperlink ? WIDTH : '100%',
      height: '100%',
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
          onLoadEnd={this.onLoadEnd}
          resizeMode={resizeMode || FastImage.resizeMode.contain}
        />
        <View style={styles.loaderConatiner}>
          <ActivityIndicator animating={this.state.loading} size={'small'} color={'#e26161'}/>
        </View>  
      </>
    );
  }
}
