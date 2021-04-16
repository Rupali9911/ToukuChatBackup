// Library imports
import {StyleSheet} from 'react-native';

// Local imports
import {Colors} from '../../../constants';

/**
 * StyleSheet for open loader
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
  textStyle: {
    color: Colors.white,
    marginTop: 10,
  },
});
