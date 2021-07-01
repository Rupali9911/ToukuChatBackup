// Libaray imports
import {Platform, StyleSheet} from 'react-native';

// Local imports
import {Colors, Fonts} from '../../../constants';
import {normalize} from '../../../utils';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    paddingTop: 5,
    fontSize: Platform.isPad ? normalize(6) : normalize(10),
  },
  badgeStyle: {
    backgroundColor: Colors.green,
    color: Colors.white,
    fontSize: 11,
    fontFamily: Fonts.regular,
    position: 'absolute',
    top: -5,
    right: -6,
  },
});
