import {Platform, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    paddingLeft: 15,
    marginBottom: 15,
  },
  inputStyle: {
    flex: 1,
    // color: Colors.white,
    fontSize: Platform.isPad ? 17 : 15,
    fontFamily: Fonts.light,
    marginHorizontal: 5,
  },
  iconTriangle: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
  placeholderStyle: {
    fontSize: Platform.isPad ? 17 : 15,
  },
  rightBtnContainer: {
    borderTopRightRadius: Platform.isPad ? 55 / 2 : 45 / 2,
    borderBottomRightRadius: Platform.isPad ? 55 / 2 : 45 / 2,
    backgroundColor: Colors.white,
    height: Platform.isPad ? 55 : 45,
    flex: 0.3,
  },
  rightBtnSubContainer: {
    borderTopRightRadius: Platform.isPad ? 55 / 2 : 45 / 2,
    borderBottomRightRadius: Platform.isPad ? 55 / 2 : 45 / 2,
    backgroundColor: Colors.white,
    height: Platform.isPad ? 55 : 45,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStatusContaner: {
    paddingEnd: 18,
  },
  leftSideActionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIconActionContainer: {
    marginRight: 10,
  },
});
