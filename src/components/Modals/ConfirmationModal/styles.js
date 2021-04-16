// Library imports
import {StyleSheet} from 'react-native';

// Locals imports
import {Colors, Fonts} from '../../../constants';

/**
 * StyleSheet for confirmation modal
 */
export default StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 5,
  },
  alertImage: {
    height: 70,
    width: 70,
    tintColor: Colors.orange_light,
    marginBottom: 25,
  },
  detailsAreaView: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  alertTitleTextStyle: {
    fontFamily: Fonts.medium,
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  alertmessageTextStyel: {
    fontFamily: Fonts.light,
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  singleFlex: {
    flex: 1,
  },
  sureButtoncContainer: {
    flex: 1,
    marginLeft: 10,
  },
});
