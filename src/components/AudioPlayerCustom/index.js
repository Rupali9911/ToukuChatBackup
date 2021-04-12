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
import {Colors, Icons} from '../../constants';
import SoundPlayer from 'react-native-sound-player';
import styles from './styles';

// const getAudioInfo = (url) => {
//   // Create an instance of AudioContext
//   // let audioContext = new window.AudioContext() || new window.webkitAudioContext();
//   // Open an Http Request
//   let request = new XMLHttpRequest();
//   request.open('GET', url, true);
//   request.responseType = 'arraybuffer';
//   request.onload = function () {
//     console.log('audio array buffer', request._response);
//     // audioContext.decodeAudioData(request.response, function (buffer) {
//     //   // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
//     //   let duration = buffer.duration;

//     //   // example 12.3234 seconds
//     //   console.log("The duration of the song is of: " + duration + " seconds");
//     //   // Alternatively, just display the integer value with
//     //   // parseInt(duration)
//     //   // 12 seconds
//     // });
//   };

//   // Start Request
//   request.send();
// };

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

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    this._onFinishedPlayingSubscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({success}) => {
        console.log('finished playing', success);
        this.setState({isPlaying: false});
        this.props.onPause && this.props.onPause();
      },
    );
    // getAudioInfo(this.props.url);
  }

  onPlaySound = async (url) => {
    const {onAudioPlayPress, postId, audioPlayingId, onPlay} = this.props;

    let plarUrl =
      'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3';
    if (postId !== audioPlayingId) {
      await this.stopSound();
    }
    onAudioPlayPress(postId);
    try {
      let fileFormate = url.split('.').pop();
      console.log('fileFormate', fileFormate);
      // if (fileFormate === 'mp3') {
      plarUrl = url;
      // }
      this.setState({
        isLoading: true,
      });
      await SoundPlayer.playUrl(plarUrl);
      this.getInfo();
      this.setState({
        isPlaying: true,
      });
      this.intervalID = setInterval(() => this.updateTime(), 1000);
      onPlay && onPlay();
    } catch (e) {
      console.log('cannot play the sound file', e);
    }
    this.setState({
      isPlaying: true,
    });
  };

  updateTime = async () => {
    try {
      const info = await SoundPlayer.getInfo();
      // let minutes = Math.floor(info.currentTime / 60);
      // let seconds = Math.floor(info.currentTime % 60) / 60;
      // seconds = Math.round(seconds * 100) / 100;
      // this.currentTime = minutes + seconds;
      this.currentTime = Math.round(info.currentTime);
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

  secondsToTime = (sec) => {
    let minutes = parseInt(sec / 60, 10);
    let seconds = parseInt(sec % 60, 10);
    return `${minutes}:${seconds}`;
  };

  async getInfo() {
    try {
      const info = await SoundPlayer.getInfo();
      // let minutes = Math.floor(info.duration / 60);
      // let seconds = Math.floor(info.duration % 60) / 60;

      console.log('duration', Math.round(info.duration));
      this.setState({
        // duration: minutes + Math.round((seconds + Number.EPSILON) * 100) / 100,
        duration: Math.round(info.duration),
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
    // const min = Math.floor(value.value) * 60;
    // const sec = Math.floor((value.value - Math.floor(value.value)) * 60);
    // this.currentTime = value.value;
    await SoundPlayer.seek(value.value);
    this.intervalID = setInterval(() => this.updateTime(), 500);
  };

  onPause = () => {
    clearInterval(this.intervalID);
    this.setState({
      isPaused: true,
      isPlaying: false,
    });
    SoundPlayer.pause();
    this.props.onPause && this.props.onPause();
  };

  onResume = () => {
    this.intervalID = setInterval(() => this.updateTime(), 1000);
    this.setState({
      isPaused: false,
      isPlaying: true,
    });
    SoundPlayer.resume();
    this.props.onPlay && this.props.onPlay();
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

    const container = [
      {
        paddingHorizontal: isSmall ? '5%' : '10%',
      },
      styles.container,
    ];

    const sliderContainer = {flex: isSmall ? 0.53 : 0.63};

    return (
      <View style={container}>
        <View style={styles.controlsContainer}>
          {isLoading ? (
            <TouchableOpacity>
              <ActivityIndicator size={'small'} color={Colors.black} />
            </TouchableOpacity>
          ) : isPlaying ? (
            postId === perviousPlayingAudioId &&
            perviousPlayingAudioId !== audioPlayingId ? (
              this.stopSound()
            ) : (
              <TouchableOpacity onPress={() => this.onPause()}>
                <FontAwesome5 name="pause" color={Colors.black} size={15} />
              </TouchableOpacity>
            )
          ) : (
            <TouchableOpacity
              onPress={() =>
                isPaused ? this.onResume() : this.onPlaySound(url)
              }>
              <FontAwesome5 name="play" color={Colors.black} size={15} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.currentTime}>
            {this.currentTime === 0
              ? '0.00'
              : this.secondsToTime(this.currentTime)}
            /
            {this.state.duration === 0
              ? '0.00'
              : this.secondsToTime(this.state.duration)}
          </Text>
        </View>

        <View style={sliderContainer}>
          <Slider
            style={styles.sliderStyle}
            step={1}
            minimumValue={0}
            maximumValue={this.state.duration}
            value={this.currentTime}
            onValueChange={(value) => this.updateValue({value})}
            minimumTrackTintColor={Colors.black}
            thumbTouchSize={{width: 50, height: 40}}
            trackStyle={styles.sliderTrackStyle}
            thumbStyle={styles.sliderThumbStyle}
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
        <View style={styles.dotContainer}>
          <TouchableOpacity>
            <Image
              source={Icons.icon_dots}
              style={styles.dotStyle}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
