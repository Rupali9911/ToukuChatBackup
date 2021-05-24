import {Dimensions, Linking, Platform, PixelRatio, PermissionsAndroid} from 'react-native';
import {Images, Icons, prodInvite, stagInvite, Environment, EnvironmentStage} from '../constants';
import Toast from '../components/Toast';
import {Subject} from 'rxjs';
import Realm from 'realm';
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
  return JSON.parse(JSON.stringify(ab, Realm.JsonSerializationReplacer));
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

export const isCloseToBottomFlatlist = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

// Generate random integer, we will use this to use random message from list of dummy messages.
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Generate unique key for message component of FlatList.
export const generateUniqueKey = () =>
  `_${Math.random().toString(36).substr(2, 9)}`;

// export type Message = {
//   id: string;
//   text: string;
//   isMyMessage: boolean;
// };

// Mocks the api call to query 'n' number of messages.
export const queryMoreMessages = (n) => {
  return new Promise((resolve) => {
    const newMessages = [];

    for (let i = 0; i < n; i++) {
      // const messageText = testMessages[getRandomInt(0, testMessages.length)];
      // newMessages.push({
      //   id: generateUniqueKey(),
      //   text: messageText,
      //   isMyMessage: Boolean(getRandomInt(0, 2)), // Randomly assign true or false.
      // });

      // const messageText = GroupMessages[i];
      // if(messageText){
      //   newMessages.push(messageText);
      // }

      const messageText = GroupMessages[i].message_body.text;
      newMessages.push({
        id: generateUniqueKey(),
        msg_id: GroupMessages[i].msg_id,
        text: messageText,
        isMyMessage: Boolean(getRandomInt(0, 2)), // Randomly assign true or false.
      });

    }

    // Lets resolve after 500 ms, to simulate network latency.
    setTimeout(() => {
      resolve(newMessages);
    }, 500);
  });
};

// List of test messages to generate chat data.
export const testMessages = [
  'Hey, where were you yesterday? I was trying to call you',
  'Yeah dude!! Had a really bad night. I was really hungover',
  'lol, thats so typical you. Who did you go out with?',
  'Dont even ask me about it, I am never going drink with Uthred again. That dude is a beast',
  'hahahaha, I can totally imagine!!',
  'Ciao :)',
];

export const GroupMessages = [
  {
    "msg_id": 22737,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "148",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:57:34.732341",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:57:34.732341Z",
    "translated": null
  },
  {
    "msg_id": 22738,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "149",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:57:36.691834",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:57:36.691834Z",
    "translated": null
  },
  {
    "msg_id": 22739,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "150",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:57:40.572266",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:57:40.572266Z",
    "translated": null
  },
  {
    "msg_id": 22740,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "151",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:57:42.896677",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:57:42.896677Z",
    "translated": null
  },
  {
    "msg_id": 22741,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "152",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:57:44.430873",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:57:44.430873Z",
    "translated": null
  },
  {
    "msg_id": 22742,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "153",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:57:45.543351",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:57:45.543351Z",
    "translated": null
  },
  {
    "msg_id": 22743,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "154",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:57:47.395595",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:57:47.395595Z",
    "translated": null
  },
  {
    "msg_id": 22744,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "155",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:57:48.695767",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:57:48.695767Z",
    "translated": null
  },
  {
    "msg_id": 22745,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "156",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:57:49.981573",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:57:49.981573Z",
    "translated": null
  },
  {
    "msg_id": 22746,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "157",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:57:51.339641",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:57:51.339641Z",
    "translated": null
  },
  {
    "msg_id": 22747,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "158",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:57:52.851601",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:57:52.851601Z",
    "translated": null
  },
  {
    "msg_id": 22748,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "159",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:57:54.693621",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:57:54.693621Z",
    "translated": null
  },
  {
    "msg_id": 22749,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "160",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:57:56.629131",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:57:56.629131Z",
    "translated": null
  },
  {
    "msg_id": 22750,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "161",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:57:59.613595",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:57:59.613595Z",
    "translated": null
  },
  {
    "msg_id": 22751,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "162",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:58:01.095327",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:58:01.095327Z",
    "translated": null
  },
  {
    "msg_id": 22752,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "163",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:58:02.915821",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:58:02.915821Z",
    "translated": null
  },
  {
    "msg_id": 22753,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "164",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:58:04.706617",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:58:04.706617Z",
    "translated": null
  },
  {
    "msg_id": 22754,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "165",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:58:06.373567",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:58:06.373567Z",
    "translated": null
  },
  {
    "msg_id": 22755,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "166",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:58:08.057771",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:58:08.057771Z",
    "translated": null
  },
  {
    "msg_id": 22756,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "167",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:58:09.492301",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:58:09.492301Z",
    "translated": null
  },
  {
    "msg_id": 22757,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "168",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:58:11.102194",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:58:11.102194Z",
    "translated": null
  },
  {
    "msg_id": 22758,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "169",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:58:12.492160",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:58:12.492160Z",
    "translated": null
  },
  {
    "msg_id": 22759,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "170",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T11:58:14.694669",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T11:58:14.694669Z",
    "translated": null
  },
  {
    "msg_id": 22810,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "~10834~ asdasdasdd  ~10720~  adasdas ~10980~ \n~10348~  ~10980~ \n~10980~",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T13:22:36.637146",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [
      {
        "desplay_name": "Dev28",
        "id": 10980,
        "username": "dev28"
      },
      {
        "desplay_name": "Vivek_dev",
        "id": 10348,
        "username": "vivek_t"
      },
      {
        "desplay_name": "dev13",
        "id": 10834,
        "username": "dev13"
      },
      {
        "desplay_name": "Dev13",
        "id": 10720,
        "username": "dev11"
      }
    ],
    "read_count": 0,
    "created": "2021-05-04T13:22:36.637146Z",
    "translated": null
  },
  {
    "msg_id": 22811,
    "sender_id": 10934,
    "group_id": 1143,
    "sender_username": "dev14",
    "sender_display_name": "dev14",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "text",
      "text": "~10348~ salads ~10720~ ~10980~ ~10348~ ~10720~ ~10348~ ~10980~",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T13:23:29.841363",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [
      {
        "desplay_name": "Dev28",
        "id": 10980,
        "username": "dev28"
      },
      {
        "desplay_name": "Vivek_dev",
        "id": 10348,
        "username": "vivek_t"
      },
      {
        "desplay_name": "Dev13",
        "id": 10720,
        "username": "dev11"
      }
    ],
    "read_count": 0,
    "created": "2021-05-04T13:23:29.841363Z",
    "translated": null
  },
  {
    "msg_id": 22918,
    "sender_id": 10348,
    "group_id": 1143,
    "sender_username": "vivek_t",
    "sender_display_name": "Vivek_dev",
    "sender_picture": "https://angelium-media.s3.amazonaws.com/static/avatar/thumb_87b8ca93-9d11-42b1-b600-b1022d15bd4a.jpg",
    "message_body": {
      "thumbnail": null,
      "type": "update",
      "text": "10935, dev17, added",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T14:38:18.663782",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 2,
    "created": "2021-05-04T14:38:18.663782Z",
    "translated": null
  },
  {
    "msg_id": 22919,
    "sender_id": 10935,
    "group_id": 1143,
    "sender_username": "dev17",
    "sender_display_name": "dev17",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "update",
      "text": "left",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T14:39:29.290794",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T14:39:29.290794Z",
    "translated": null
  },
  {
    "msg_id": 22920,
    "sender_id": 10935,
    "group_id": 1143,
    "sender_username": "dev17",
    "sender_display_name": "dev17",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "update",
      "text": "10935, dev17, added",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T14:41:34.468674",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T14:41:34.468674Z",
    "translated": null
  },
  {
    "msg_id": 22921,
    "sender_id": 10935,
    "group_id": 1143,
    "sender_username": "dev17",
    "sender_display_name": "dev17",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "update",
      "text": "left",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T14:42:25.554658",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T14:42:25.554658Z",
    "translated": null
  },
  {
    "msg_id": 22922,
    "sender_id": 10935,
    "group_id": 1143,
    "sender_username": "dev17",
    "sender_display_name": "dev17",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "update",
      "text": "10935, dev17, added",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T14:42:46.399901",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T14:42:46.399901Z",
    "translated": null
  },
  {
    "msg_id": 22923,
    "sender_id": 10980,
    "group_id": 1143,
    "sender_username": "dev28",
    "sender_display_name": "Dev28",
    "sender_picture": "https://angelium-media.s3.amazonaws.com/static/avatar/thumb_photo-1503023345310-bd7c1de61c7d.jpeg",
    "message_body": {
      "thumbnail": null,
      "type": "update",
      "text": "10935, dev17, removed",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T14:51:43.800037",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T14:51:43.800037Z",
    "translated": null
  },
  {
    "msg_id": 22924,
    "sender_id": 10980,
    "group_id": 1143,
    "sender_username": "dev28",
    "sender_display_name": "Dev28",
    "sender_picture": "https://angelium-media.s3.amazonaws.com/static/avatar/thumb_photo-1503023345310-bd7c1de61c7d.jpeg",
    "message_body": {
      "thumbnail": null,
      "type": "update",
      "text": "10935, dev17, added",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T14:52:12.173839",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T14:52:12.173839Z",
    "translated": null
  },
  {
    "msg_id": 22925,
    "sender_id": 10980,
    "group_id": 1143,
    "sender_username": "dev28",
    "sender_display_name": "Dev28",
    "sender_picture": "https://angelium-media.s3.amazonaws.com/static/avatar/thumb_photo-1503023345310-bd7c1de61c7d.jpeg",
    "message_body": {
      "thumbnail": null,
      "type": "update",
      "text": "10935, dev17, removed",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T14:53:24.033936",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T14:53:24.033936Z",
    "translated": null
  },
  {
    "msg_id": 22926,
    "sender_id": 10935,
    "group_id": 1143,
    "sender_username": "dev17",
    "sender_display_name": "dev17",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "update",
      "text": "10935, dev17, added",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T14:53:52.745620",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T14:53:52.745620Z",
    "translated": null
  },
  {
    "msg_id": 22927,
    "sender_id": 11029,
    "group_id": 1143,
    "sender_username": "romit",
    "sender_display_name": "romit",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "update",
      "text": "11029, romit, added",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T14:56:43.802969",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T14:56:43.802969Z",
    "translated": null
  },
  {
    "msg_id": 22928,
    "sender_id": 11029,
    "group_id": 1143,
    "sender_username": "romit",
    "sender_display_name": "romit",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "update",
      "text": "left",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T14:59:01.509454",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T14:59:01.509454Z",
    "translated": null
  },
  {
    "msg_id": 22929,
    "sender_id": 11029,
    "group_id": 1143,
    "sender_username": "romit",
    "sender_display_name": "romit",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "update",
      "text": "11029, romit, added",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-04T15:00:20.496036",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-04T15:00:20.496036Z",
    "translated": null
  },
  {
    "msg_id": 22933,
    "sender_id": 11029,
    "group_id": 1143,
    "sender_username": "romit",
    "sender_display_name": "romit",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "update",
      "text": "left",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-05T05:32:56.068621",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-05T05:32:56.068621Z",
    "translated": null
  },
  {
    "msg_id": 22934,
    "sender_id": 11029,
    "group_id": 1143,
    "sender_username": "romit",
    "sender_display_name": "romit",
    "sender_picture": null,
    "message_body": {
      "thumbnail": null,
      "type": "update",
      "text": "11029, romit, added",
      "media": []
    },
    "is_edited": false,
    "is_unsent": false,
    "timestamp": "2021-05-05T05:36:29.371325",
    "reply_to": {
      "display_name": null,
      "id": 0,
      "message": null,
      "msg_type": null,
      "name": null,
      "sender_id": 0
    },
    "mentions": [],
    "read_count": 0,
    "created": "2021-05-05T05:36:29.371325Z",
    "translated": null
  }
]