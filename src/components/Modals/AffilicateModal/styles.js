// Library imports
import {StyleSheet} from 'react-native';

// Local imports
import {Colors, Fonts} from '../../../constants';

/**
 * StyleSheet for affilicate modal
 */
export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  gradientStyle: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  title: {
    color: Colors.white,
    fontFamily: Fonts.light,
    fontWeight: '400',
    flex: 0.9,
  },
  imageContainer: {
    flex: 0.1,
    alignItems: 'flex-end',
  },
  image: {
    tintColor: Colors.white,
    height: 10,
  },
  urlContainer: {
    flex: 0.5,
    marginHorizontal: '5%',
    justifyContent: 'center',
  },
  url: {
    textAlign: 'center',
    fontFamily: Fonts.light,
  },
  buttonContainer: {
    flex: 0.3,
    marginHorizontal: '5%',
  },
});
