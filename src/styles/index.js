import {StyleSheet, Platform} from 'react-native';
import {Fonts, Colors} from '../constants';
import {normalize} from '../utils';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeAreaView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },

  //Light Texts for the App
  normalRegularText17: {
    fontSize: 17,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    color: 'black',
    marginLeft: 10,
    fontWeight: '300',
  },

  smallLightText10: {
    fontSize: 10,
    fontFamily: Fonts.light,
    color: Colors.white,
    textAlign: 'center',
  },

  smallLightText: {
    fontSize: 13,
    fontFamily: Fonts.light,
    color: Colors.white,
    // textAlign: 'center',
  },

  smallNunitoLightText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
  },

  smallLightTextTab: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
  },
  normalLightText: {
    fontSize: 17,
    fontFamily: Fonts.light,
    color: Colors.white,
    textAlign: 'center',
  },

  //Regular Texts for the App
  smallRegularText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
  },
  smallNunitoRegular17Text: {
    fontSize: 17,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
  },
  smallNunitoRegularText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
  },
  smallNunitoRegularFW300Text: {
    fontSize: Platform.isPad ? normalize(8) : 15,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '300',
  },
  normalRegular15Text: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
  },
  normalRegularText: {
    fontSize: 17,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
  },
  normalRegularText15: {
    fontSize: Platform.isPad ? 20 : 15,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '400',
  },

  //Semi Bold Txts
  bigSemiBoldText: {
    fontSize: 26,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
  },
  normalRegular22Text: {
    fontSize: 20,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '400',
  },
  normalSemiBoldText: {
    fontSize: 17,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
  },

  //Weight black text
  regularWeightedText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: Fonts.regular,
    color: Colors.black_light,
    textAlign: 'center',
  },
  //App Logo Text
  logoText: {
    fontSize: Platform.isPad ? 142 : 125,
    fontFamily: Fonts.absolute,
    paddingVertical: 15,
    textAlign: 'center',
    color: Colors.white,
    opacity: 0.7,
  },

  //Icons
  iconStyle: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },

  iconStyleTab: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  smallIcon: {
    width: Platform.isPad ? 23 : 18,
    height: Platform.isPad ? 23 : 18,
    resizeMode: 'contain',
  },

  //Separator
  separator: {
    height: 1,
    color: Colors.gray,
  },
});
