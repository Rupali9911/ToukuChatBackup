import {Dimensions, Platform} from 'react-native';
import {Images, Icons} from '../constants';

export function isPortrait() {
  const dim = Dimensions.get('screen');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
}

export function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
}

export function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

export function getAvatar(source) {
  if (
    source === null ||
    source === '' ||
    typeof source === null ||
    source === undefined
  ) {
    return Images.image_default_profile;
  } else {
    return {uri: source};
  }
}

export function getImage(source) {
  if (
    source === null ||
    source === '' ||
    typeof source === null ||
    source === undefined
  ) {
    return Images.image_gallery;
  } else {
    return {uri: source};
  }
}
