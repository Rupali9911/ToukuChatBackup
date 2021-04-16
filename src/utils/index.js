import {Dimensions, Linking, Platform, PixelRatio, PermissionsAndroid} from 'react-native';
import {Images, Icons, prodInvite, stagInvite, Environment, EnvironmentStage} from '../constants';
import Toast from '../components/Toast';
import {Subject} from 'rxjs';
import ImageResizer from 'react-native-image-resizer';
import { inviteUrlRoot, staging } from '../helpers/api';
import NavigationService from '../navigation/NavigationService';
import { getLocalUserFriend } from '../storage/Service';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

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
    return Images.channel_background;
  } else if (isContainUrl(source)) {
    return {uri: source};
  } else {
    return Images.channel_background;
  }
}

export function showToast(title, text, type) {
  Toast.show({
    title: title,
    text: text,
    type: type,
  });
}

const subject = new Subject();

export const eventService = {
  sendMessage: (message) => subject.next({text: message}),
  clearMessages: () => subject.next(),
  getMessage: () => subject.asObservable(),
};

export function getParamsFromURL(url) {
  let regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
    console.log(match[1], match[2]);
  }
  return params;
}

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export const isContainUrl = (text) => {
  var urlRE = new RegExp(
    '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+',
  );
  const url = text.match(urlRE);
  return url;
};

export const isValidUrl = (url = '') => {
  // var urlRE = new RegExp(
  //   '(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/i',
  // );

  var urlRE = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;

  return !!urlRE.test(url);
}

export const resizeImage = async (file, width, height) => {
  return await ImageResizer.createResizedImage(file, width, height, 'JPEG', 10)
    .then(async ({uri}) => {
      console.log('Image resizer');
      return uri;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const hasStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "External Storage Permission",
        message:
          "Storage permission require to download image" +
          "so you can save media.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
      return true;
    } else {
      console.log("Camera permission denied");
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export const getChannelIdAndReferral = (url) => {
  let channel_id = '';
  let referral = '';

  let split_url = url.split('/');
  console.log('split_url',JSON.stringify(split_url));

  channel_id = split_url[4];
  referral = split_url[5];

  return {channel_id,referral};
}

export const onPressHyperlink = (url) => {
  let match_url = staging ? stagInvite : prodInvite
  if (url.includes(match_url)) {
    let params = getChannelIdAndReferral(url);
    console.log('params', params);
    NavigationService.navigate('ChannelInfo', { channelItem: params });
  } else if(url.includes(`${inviteUrlRoot}/Groups/invite/`)) {
    let s_url = url.split(`${inviteUrlRoot}/Groups/invite/`)[1];
    let group_id = s_url.substring(0,s_url.lastIndexOf('/'));
    NavigationService.navigate('GroupDetails', { group_id: group_id });
  } else {
    Linking.openURL(url);
  }
}

export const getUserName = (id) => {
  if(id){
    let users = getLocalUserFriend(id);
    let user_name = '';
    if(users && users.length>0){
      let user = users.toJSON()[0];
      user_name = user.display_name || user.username;
    }
    return user_name;
  }
  return '';
}

export const getUser_ActionFromUpdateText = (text) => {
  let user_id = '';
  let user_name = '';
  let action = '';

  if(text === 'left'){
    user_id = null;
    user_name = null;
    action = text;
  }else{
    let split_txt = text.split(',');
    if(split_txt.length>0){
      user_id = split_txt[0].trim();
      user_name = split_txt[1].trim();
      action = split_txt[2].trim();
    }
  }
  return {user_id,user_name,action};
}

export const realmToPlainObject = (realmObj) => {
  let ab = Array.from(realmObj);
  return JSON.parse(JSON.stringify(ab));
}

export function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export const checkDeepLinkUrl = (url) => {
  let checkUrl = staging ? 'touku.angelium.net/' : 'touku.net/';
  return url.includes(checkUrl);
}
