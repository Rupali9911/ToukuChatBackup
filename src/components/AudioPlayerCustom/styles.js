import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,

    height: 45,
    borderRadius: 100,
  },
  controlsContainer: {
    flex: 0.1,
  },
  timeContainer: {
    flex: 0.29,
  },
  currentTime: {
    fontFamily: Fonts.light,
    fontSize: 12,
  },
  sliderStyle: {
    width: '100%',
    backgroundColor: 'red',
    height: 30,
  },
  sliderTrackStyle: {
    height: 2,
    backgroundColor: Colors.gray_dark,
  },
  sliderThumbStyle: {
    width: 10,
    height: 10,
    backgroundColor: Colors.black,
    borderRadius: 10 / 2,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  dotContainer: {
    flex: 0.1,
    alignItems: 'flex-end',
  },
  dotStyle: {
    tintColor: Colors.black_light,
    height: 15,
  },
});
