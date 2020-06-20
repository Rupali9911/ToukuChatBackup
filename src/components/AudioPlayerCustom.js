import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Image,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Slider from '@react-native-community/slider';
import { Colors, Fonts, Images, Icons } from '../constants';

export default class AudioPlayerCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isPlaying: false,
      isPaused: false,
    };
  }

  componentDidMount() {}

  onPlaySound = () => {
    this.setState({
      isPlaying: true,
    });
  };
  onPause = () => {
    this.setState({
      isPaused: true,
      isPlaying: false,
    });
  };

  onResume = () => {
    this.setState({
      isPlaying: true,
    });
  };

  render() {
    const { url } = this.props;
    const { isLoading, isPlaying, isPaused } = this.state;
    return (
      <View
        style={{
          margin: 5,
          backgroundColor: Colors.gray,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: '10%',
          height: 50,
          borderRadius: 100,
        }}
      >
        <View style={{ width: '7%' }}>
          {isLoading ? (
            <TouchableOpacity onPress={() => {}} style={{}}>
              <ActivityIndicator size="large" color="#F300A1" />
            </TouchableOpacity>
          ) : isPlaying ? (
            <TouchableOpacity style={{}} onPress={() => this.onPause()}>
              <FontAwesome5 name="pause" color={Colors.black} size={15} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{}}
              onPress={() => (isPaused ? this.onResume() : this.onPlaySound())}
            >
              <FontAwesome5 name="play" color={Colors.black} size={15} />
            </TouchableOpacity>
          )}
        </View>
        <View style={{ width: '20%' }}>
          <Text style={{ fontFamily: Fonts.light, fontSize: 12 }}>
            00:0/02:00
          </Text>
        </View>

        <View style={{ width: '53%' }}>
          <Slider
            style={{ width: '100%' }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={Colors.black}
            maximumTrackTintColor={Colors.gray_dark}
            thumbTintColor={Colors.black}
          />
        </View>

        <View
          style={{
            width: '10%',
            alignItems: 'flex-end',
          }}
        >
          <TouchableOpacity style={{}} onPress={() => {}}>
            <FontAwesome5 name="volume-up" color={Colors.black} size={15} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '10%',
            alignItems: 'flex-end',
          }}
        >
          <TouchableOpacity style={{}} onPress={() => {}}>
            <Image
              source={Icons.icon_dots}
              style={{
                tintColor: Colors.black_light,
                height: 15,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
