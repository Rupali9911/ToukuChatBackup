// Library imports
import {Platform, StyleSheet} from 'react-native';

// Local imports
import {Colors, Fonts} from '../../../constants';

/**
 * StyleSheet for Text area with title component
 */
export default StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontFamily: Fonts.light,
  },
  textBox: {
    borderWidth: Platform.OS === 'android' ? 0.2 : 0.5,
    backgroundColor: Colors.white,
    borderRadius: 7,
    borderColor: Colors.gray_dark,
    marginTop: 10,
    height: 100,
    textAlignVertical: 'top',
    paddingHorizontal: 10,
    fontFamily: Fonts.light,
  },
  rightFont: {
    fontFamily: Fonts.light,
    color: Colors.gray_dark,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightTitleContainer: {
    flex: 0.5,
    alignItems: 'flex-end',
  },
  textInputBorder: {
    borderWidth: 1,
    borderColor: Colors.orange,
  },
});
