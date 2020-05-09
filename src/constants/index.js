import {Platform} from 'react-native';

export const Icons = {
  icon_language_select: require('../../assets/icons/language_icon.png'),
  icon_back: require('../../assets/icons/back_icon.png'),
  icon_tick: require('../../assets/icons/tick.png'),
  icon_close: require('../../assets/icons/close.png'),
  icon_triangle_down: require('../../assets/icons/triangle_down.png'),
  icon_facebook: require('../../assets/icons/facebook.png'),
  icon_line: require('../../assets/icons/line.png'),
  icon_google: require('../../assets/icons/googleplus.png'),
  icon_twitter: require('../../assets/icons/twitter.png'),
  icon_flag_america: require('../../assets/icons/flag_america.png'),
  icon_flag_china: require('../../assets/icons/flag_china.png'),
  icon_flag_korea: require('../../assets/icons/flag_korea.png'),
  icon_flag_japan: require('../../assets/icons/flag_japan.png'),
  icon_flag_taiwan: require('../../assets/icons/flag_taiwan.png'),
};

export const Images = {
  image_touku_bg: require('../../assets/images/touku_bg_new.png'),
};

export const Colors = {
  primary: '#ef4f8f',
  white: '#ffffff',
  black: '#000000',
  gradient_1: '#ef4f8f',
  gradient_2: '#f27478',
  gradient_3: '#f68b6b',
};

export const Fonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  thin: 'Poppins-Thin',
  light: 'Poppins-Light',
  semibold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  black: 'Poppins-Black',
  extralight: 'Poppins-ExtraLight',
  extrabold: 'Poppins-ExtraBold',
  absolute: Platform.OS === 'ios' ? 'The Absolute' : 'The-Absolute',
};
