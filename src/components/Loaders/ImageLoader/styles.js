// Library imports
import {StyleSheet} from 'react-native';

/**
 * StyleSheet for image loader
 */
export default StyleSheet.create({
  backgroundImage: {
    position: 'relative',
  },
  activityIndicator: {
    position: 'absolute',
    margin: 'auto',
    zIndex: 9,
  },
  viewImageStyles: {
    flex: 1,
    backgroundColor: '#e9eef1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderStyles: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewChildrenStyles: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  playButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
