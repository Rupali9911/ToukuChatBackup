import {StyleSheet} from 'react-native';
import {Colors} from '../../constants';

export default StyleSheet.create({
  imageLoaderStyle: {
    overflow: 'hidden',
  },
  badgeContainer: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
    top: 5,
    right: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSubContainer: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
