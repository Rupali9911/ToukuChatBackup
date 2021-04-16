// Library imports
import {Platform, StyleSheet} from 'react-native';

// Local imports
import {Colors} from '../../../constants';

/**
 * StyleSheet for header
 */
export default StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: Platform.OS === 'ios' ? 0 : 30,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  titleTxt: {
    color: Colors.black,
    fontSize: 20,
  },
});
