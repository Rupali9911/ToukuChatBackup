// Libaray imports
import {StyleSheet} from 'react-native';

// Local imports
import {normalize} from '../../../utils';
import {Colors, Fonts} from '../../../constants';

/**
 * StyleSheet for password confirmation modal
 */
export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    paddingVertical: '5%',
    paddingHorizontal: '5%',
  },
  infoIconContainer: {
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  iconInfo: {
    height: normalize(60),
    width: normalize(60),
    tintColor: Colors.orange_light,
  },
  subContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  detailContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  title: {
    fontFamily: Fonts.medium,
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontFamily: Fonts.light,
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: '20%',
    alignItems: 'flex-end',
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  buttonSubContainer: {
    marginHorizontal: 5,
  },
});
