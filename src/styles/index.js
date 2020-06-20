import { StyleSheet } from 'react-native';
import { Fonts, Colors } from '../constants';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeAreaView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },

  //Light Texts for the App
  smallLightText: {
    fontSize: 13,
    fontFamily: Fonts.light,
    color: Colors.white,
    textAlign: 'center',
  },
  smallLightTextTab: {
    fontSize: 10,
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
  normalRegularText: {
    fontSize: 17,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
  },

  //Semi Bold Txts
  bigSemiBoldText: {
    fontSize: 26,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
  },
  normalSemiBoldText: {
    fontSize: 17,
    fontFamily: Fonts.semibold,
    color: Colors.white,
    textAlign: 'center',
  },

  //Weight black text
  regularWeightedText: {
    fontSize: 17,
    fontWeight: '500',
    fontFamily: Fonts.regular,
    color: Colors.black_light,
    textAlign: 'center',
  },
  //App Logo Text
  logoText: {
    fontSize: 100,
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
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },

  smallIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },

  //Separator
  separator: {
    height: 1,
    color: Colors.gray,
  },
});
