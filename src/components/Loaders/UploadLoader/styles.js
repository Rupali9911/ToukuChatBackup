// Libaray imports
import {StyleSheet} from 'react-native';

// Local imports
import {Colors} from '../../../constants';

/**
 * StyleSheet for upload loader
 */
export default StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'rgba(108, 117, 125, 0.8)',
    height: '100%',
    width: '100%',
    alignSelf: 'center',
  },
  subContainer: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },
  progressBar: {
    width: 200,
    height: 8,
  },
  uploadingText: {
    color: Colors.white,
    marginTop: 10,
  },
});
