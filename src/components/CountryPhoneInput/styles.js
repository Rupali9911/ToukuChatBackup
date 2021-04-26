import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../constants';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 45,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingLeft: 15,
    marginBottom: 15,
  },
  inputStyle: {
    flex: 1,
    color: Colors.white,
    fontSize: 13,
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
    fontSize: 12,
  },
  rightBtnContainer: {
    borderTopRightRadius: 45 / 2,
    borderBottomRightRadius: 45 / 2,
    backgroundColor: Colors.white,
    height: 45,
    flex: 0.35,
  },
  rightBtnSubContainer: {
    borderTopRightRadius: 45 / 2,
    borderBottomRightRadius: 45 / 2,
    backgroundColor: Colors.white,
    height: 45,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    borderRadius: 0,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 10,
  },
  phoneNumberPlaceHolder: {
    position: 'absolute',
    color: 'white',
    left: '32%',
    opacity: 0.8,
  },
  singleFlex: {
    flex: 1,
  },
  flagStyle: {
    height: 30,
    width: 30,
  },
  phoneInputFlagStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  phoneInputTextStyle: {
    color: 'white',
  },
  linearGradientStyle: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
});
