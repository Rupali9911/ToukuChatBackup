// Library imports
import {Platform, StyleSheet} from 'react-native';

// Local imports
import {Colors, Fonts} from '../../../constants';

/**
 * StyleSheet for input with title component
 */
export default StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontFamily: Fonts.light,
    color: Colors.textTitle_orange,
  },
  inputBox: {
    height: 35,
    borderWidth: Platform.OS === 'android' ? 0.2 : 0.5,
    backgroundColor: Colors.white,
    borderRadius: 7,
    borderColor: Colors.gray_dark,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontFamily: Fonts.light,
    fontSize: 13,
    color: Colors.black,
  },
});
