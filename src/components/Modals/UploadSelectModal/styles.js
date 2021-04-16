// Library imports
import {StyleSheet} from 'react-native';

// Local imports
import {Colors, Fonts} from '../../../constants';

/**
 * StyleSheet for upload select modal
 */
export default StyleSheet.create({
  safeAreaContainer: {
    // flex: '10%',
    height: '20%',
    alignSelf: 'center',
    width: '60%',
  },
  container: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientContainer: {
    flex: 0.3,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  uploadTypeText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: Fonts.regular,
  },
  mediaContainer: {
    flex: 0.7,
  },
  mediaActionContainer: {
    flex: 0.5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaLabelText: {
    color: Colors.black,
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
});
