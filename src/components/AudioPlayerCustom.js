import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Image,
  AppState,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Slider from 'react-native-slider';
import {Colors, Fonts, Images, Icons} from '../constants';
import SoundPlayer from 'react-native-sound-player';

export default class AudioPlayerCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isPlaying: false,
      isPaused: false,
      duration: 0,
      appState: AppState.currentState,
      isFetching: true,
    };
    this.intervalID = 0;
    this.currentTime = 0;
    this._onFinishedPlayingSubscription;
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    this._onFinishedPlayingSubscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({success}) => {
        console.log('finished playing', success);
      },
    );
  }

  onPlaySound = async (url) => {
    const {onAudioPlayPress, postId, audioPlayingId} = this.props;

    var plarUrl =
      'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3';
    if (postId !== audioPlayingId) {
      await this.stopSound();
    }
    onAudioPlayPress(postId);
    try {
      var fileFormate = url.split('.').pop();
      if (fileFormate === 'mp3') {
        plarUrl = url;
      }
      this.setState({
        isLoading: true,
      });
      await SoundPlayer.playUrl(plarUrl);
      this.getInfo();
      this.setState({
        isPlaying: true,
      });
      this.intervalID = setInterval(() => this.updateTime(), 1000);
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
    this.setState({
      isPlaying: true,
    });
  };

  updateTime = async () => {
    try {
      const info = await SoundPlayer.getInfo();
      var minutes = Math.floor(info.currentTime / 60);
      var seconds = Math.floor(info.currentTime % 60) / 60;
      seconds = Math.round(seconds * 100) / 100;
      this.currentTime = minutes + seconds;
      this.forceUpdate();
    } catch (e) {
      console.log('There is no song playing', e);
    }
  };

  componentWillUnmount() {
    this.stopSound();
    clearInterval(this.intervalID);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  stopSound = () => {
    clearInterval(this.intervalID);
    SoundPlayer.stop();
    this.setState({
      isPlaying: false,
    });
    this.currentTime = 0;
  };

  async getInfo() {
    try {
      const info = await SoundPlayer.getInfo();
      var minutes = Math.floor(info.duration / 60);
      var seconds = Math.floor(info.duration % 60) / 60;

      this.setState({
        duration: minutes + Math.round((seconds + Number.EPSILON) * 100) / 100,
        isLoading: false,
      });
      this.currentTime = info.currentTime;
    } catch (e) {
      console.log('There is no song playing', e);
    }
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }
    console.log('App run in: ', nextAppState);
    this.setState({appState: nextAppState});
    if (nextAppState === 'background') {
      SoundPlayer.stop();
    }
  };

  updateValue = async (value) => {
    clearInterval(this.intervalID);
    const min = Math.floor(value.value) * 60;
    const sec = Math.floor((value.value - Math.floor(value.value)) * 60);
    await SoundPlayer.seek(min + sec);
    this.intervalID = setInterval(() => this.updateTime(), 1000);
  };

  onPause = () => {
    clearInterval(this.intervalID);
    this.setState({
      isPaused: true,
      isPlaying: false,
    });
    SoundPlayer.pause();
  };

  onResume = () => {
    this.intervalID = setInterval(() => this.updateTime(), 1000);
    this.setState({
      isPaused: false,
      isPlaying: true,
    });
    SoundPlayer.resume();
  };

  render() {
    const {
      postId,
      perviousPlayingAudioId,
      url,
      isSmall,
      audioPlayingId,
    } = this.props;
    const {isLoading, isPlaying, isPaused} = this.state;
    return (
      <View
        style={{
          backgroundColor: Colors.white,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: isSmall ? '5%' : '10%',
          height: 45,
          borderRadius: 100,
        }}>
        <View style={{flex: 0.1}}>
          {isLoading ? (
            <TouchableOpacity onPress={() => {}} style={{}}>
              <ActivityIndicator size="small" color={Colors.black} />
            </TouchableOpacity>
          ) : isPlaying ? (
            postId === perviousPlayingAudioId &&
            perviousPlayingAudioId !== audioPlayingId ? (
              this.stopSound()
            ) : (
              <TouchableOpacity style={{}} onPress={() => this.onPause()}>
                <FontAwesome5 name="pause" color={Colors.black} size={15} />
              </TouchableOpacity>
            )
          ) : (
            <TouchableOpacity
              style={{}}
              onPress={() =>
                isPaused ? this.onResume() : this.onPlaySound(url)
              }>
              <FontAwesome5 name="play" color={Colors.black} size={15} />
            </TouchableOpacity>
          )}
        </View>
        <View style={{flex: 0.29}}>
          <Text style={{fontFamily: Fonts.light, fontSize: 12}}>
            {this.currentTime == 0 ? '0.00' : this.currentTime}/
            {this.state.duration == 0 ? '0.00' : this.state.duration}
          </Text>
        </View>

        <View style={{flex: isSmall ? 0.53 : 0.63}}>
          <Slider
            style={{
              width: '100%',
              backgroundColor: 'red',
              height: 10,
            }}
            minimumValue={0}
            maximumValue={this.state.duration}
            value={this.currentTime}
            onValueChange={(value) => this.updateValue({value})}
            style={{height: 30}}
            minimumTrackTintColor={Colors.black}
            thumbTouchSize={{width: 50, height: 40}}
            trackStyle={{
              height: 2,
              backgroundColor: Colors.gray_dark,
            }}
            thumbStyle={{
              width: 10,
              height: 10,
              backgroundColor: Colors.black,
              borderRadius: 10 / 2,
              shadowColor: Colors.black,
              shadowOffset: {width: 0, height: 0},
              shadowRadius: 2,
              shadowOpacity: 1,
            }}
          />
        </View>

        {/* <View
          style={{
            flex: 0.1,
            alignItems: 'flex-end',
          }}
        >
          <TouchableOpacity style={{}} onPress={() => {}}>
            <FontAwesome5 name="volume-up" color={Colors.black} size={15} />
          </TouchableOpacity>
        </View> */}
        <View
          style={{
            flex: 0.1,
            alignItems: 'flex-end',
          }}>
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
