// Library imports
import {StyleSheet} from 'react-native';

// Local imports
import {Colors} from '../../constants';

/**
 * Stylesheet for no data
 */
export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  text: {
    color: Colors.gray_dark,
    marginTop: 10,
  },
});
