import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    height: 150,
    width: 260,
  },
  youtubePlayer: {
    alignSelf: 'stretch',
    height: 150,
  },
  androidVideoPlayer: {
    width: 260,
    // height: 100
  },
  iOSVideoPlayer: {
    width: 260,
    height: 150,
  },
  videoPlayButtonContainer: {
    justifyContent: 'center', 
    alignItems: 'center'
  },
  videoPlayButton: {
    position: 'absolute',
    backgroundColor: '#e26161'
  },
});
