import { Platform } from 'react-native';

export const Icons = {
  icon_language_select: require('../../assets/icons/language_icon.png'),
  icon_back: require('../../assets/icons/back_icon.png'),
  icon_arrow_right: require('../../assets/icons/arrow_right.png'),
  icon_arrow_up: require('../../assets/icons/arrow_up.png'),
  icon_arrow_down: require('../../assets/icons/arrow_down.png'),
  icon_tick: require('../../assets/icons/tick.png'),
  icon_tick1: require('../../assets/icons/tick1.png'),
  icon_tick_circle: require('../../assets/icons/tick_circle.png'),
  icon_close: require('../../assets/icons/close.png'),
  icon_triangle_down: require('../../assets/icons/triangle_down.png'),
  icon_triangle_up: require('../../assets/icons/triangle_up.png'),
  icon_facebook: require('../../assets/icons/facebook.png'),
  icon_line: require('../../assets/icons/line.png'),
  icon_google: require('../../assets/icons/googleplus.png'),
  icon_twitter: require('../../assets/icons/twitter.png'),
  icon_flag_america: require('../../assets/icons/flag_america.png'),
  icon_flag_china: require('../../assets/icons/flag_china.png'),
  icon_flag_korea: require('../../assets/icons/flag_korea.png'),
  icon_flag_japan: require('../../assets/icons/flag_japan.png'),
  icon_flag_taiwan: require('../../assets/icons/flag_taiwan.png'),
  icon_menu: require('../../assets/icons/menu.png'),
  icon_home: require('../../assets/icons/home.png'),
  icon_home_active: require('../../assets/icons/home_color.png'),
  icon_home_select: require('../../assets/icons/home_select.png'),
  icon_chat: require('../../assets/icons/chat.png'),
  icon_chat_select: require('../../assets/icons/chat_select.png'),
  icon_more: require('../../assets/icons/more.png'),
  icon_more_select: require('../../assets/icons/more_select.png'),
  icon_timeline: require('../../assets/icons/timeline.png'),
  icon_timeline_select: require('../../assets/icons/timeline_select.png'),
  icon_channel: require('../../assets/icons/channel.png'),
  icon_channel_new: require('../../assets/icons/Channel_new.png'),
  icon_channel_select: require('../../assets/icons/channel_select.png'),
    icon_setting_tab: require('../../assets/icons/setting_tab.png'),
    icon_setting_tab_select: require('../../assets/icons/setting_selected.png'),
  icon_message: require('../../assets/icons/message.png'),
  icon_warning: require('../../assets/icons/warning.png'),
  icon_scenario: require('../../assets/icons/scenario.png'),
  icon_camera: require('../../assets/icons/camera.png'),
  icon_pencil: require('../../assets/icons/pencil.png'),
  icon_alert: require('../../assets/icons/alert.png'),
  icon_edit_pen: require('../../assets/icons/edit_icon.png'),
  icon_search: require('../../assets/icons/search.png'),
  icon_dots: require('../../assets/icons/dots.png'),
  icon_create_group_chat: require('../../assets/icons/CreateGroupChat.png'),
  icon_create_new_channel: require('../../assets/icons/CreateNewChannel.png'),
  icon_upload: require('../../assets/icons/upload.png'),
  icon_send_button: require('../../assets/icons/send_button.png'),
  icon_camera_grad: require('../../assets/icons/camera_grad.png'),
  icon_setting: require('../../assets/icons/setting.png'),
  icon_info: require('../../assets/icons/info.png'),
  add_friend: require('../../assets/icons/add-friend.png'),
  xana_app: require('../../assets/icons/xana.png'),
  channel_mode: require('../../assets/icons/Channel-mode.png'),
  icon_drop_down: require('../../assets/icons/filed_down.png'),
  icon_copy: require('../../assets/icons/copy.png'),
  icon_download: require('../../assets/icons/download.png'),
  icon_kakao: require('../../assets/icons/talk.png'),
  icon_telegram: require('../../assets/icons/telegram.png'),
  man_plus_icon: require('../../assets/icons/man_plus_icon.png'),
  man_plus_icon_black: require('../../assets/icons/man_plus_icon_black.png'),
  gallery_icon_select: require('../../assets/icons/gallery_icon_select.png'),
  plus_icon_select: require('../../assets/icons/plus_icon_select.png'),
  icon_apple: require('../../assets/icons/apple.png'),
};

export const Images = {
  image_touku_bg: require('../../assets/images/touku_bg_new.png'),
  image_touku_bg_phone: require('../../assets/images/touku_bg_phone.png'),
  image_default_profile: require('../../assets/images/default_profile.png'),
  image_home_bg: require('../../assets/images/touku_home_bg.png'),
  image_loading: require('../../assets/images/loading.gif'),
  image_gallery: require('../../assets/images/gallery.png'),
  image_loader: require('../../assets/images/loader.gif'),
  image_conversation: require('../../assets/images/conversation.png'),
};

export const Colors = {
  primary: '#ef4f8f',
  white: '#ffffff',
  black: '#000000',
  gradient_1: '#ef4f8f',
  gradient_2: '#f27478',
  gradient_3: '#f68b6b',
  orange: '#fd7e14',
  orange_light: '#FEB381',
  gray: '#dcdcdc',
  gray_dark: '#6c757d',
  danger: '#DC3545',
  home_header: '#fd9a7a',
  indigo: '#6610f2',
  purple: '#6f42c1',
  green: '#1bd078',
  dark_gray: '#2c3e50',
  dark_orange: '#e15b63',
  light_gray: '#909093',
  gradient_4: '#ff8960',
  gradient_5: '#ff62a5',
  black_light: '#0a1f44',
  foorter_gradient_1: 'rgba(255, 137, 96, 0.68)',
  foorter_gradient_2: 'rgba(255, 98, 165, 0.68)',
    orange_header: 'rgba(255,107,0,00.40)'
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

export const environment = {
  s3BucketConfig: {
    accessKeyId: 'AKIA4J4DJVXPUM6H57F7',
    secretAccessKey: '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',
    region: 'ap-southeast-1',
  },
};

export const languageArray = [
  {
    language_id: 1,
    language_name: 'en',
    icon: Icons.icon_flag_america,
    language_display: 'English',
  },
  {
    language_id: 2,
    language_name: 'ja',
    icon: Icons.icon_flag_japan,
    language_display: '日本語',
  },
  {
    language_id: 3,
    language_name: 'ch',
    icon: Icons.icon_flag_china,
    language_display: '中文（简体）',
  },
  {
    language_id: 4,
    language_name: 'tw',
    icon: Icons.icon_flag_taiwan,
    language_display: '中文（繁体）',
  },
  {
    language_id: 5,
    language_name: 'ko',
    icon: Icons.icon_flag_korea,
    language_display: '한국어',
  },
];

export const supportUrl = 'https://www.touku.net/#/support/';
export const termsUrl = 'https://www.touku.net/#/terms/';
export const registerUrl = 'https://www.touku.net/#/register/';
export const loginUrl = 'https://www.touku.net/#/login/';
export const channelUrl = 'https://www.touku.net/#/channels/';
export const xanaUrl = 'https://www.xanawallet.net/#/login';
export const xanaDeepLink = 'xana://';
export const xanaAppStore = 'https://apps.apple.com/us/app/id1502362416';
export const DEEPLINK = 'touku://'
export const Environment = 'https://www.touku.net/'

export const SocketEvents = {
  // Friend actions
  NEW_MESSAGE_IN_FREIND: 'New message in friend',
  MESSAGE_EDITED_IN_FRIEND: 'Message edited in friend',
  DELETE_MESSAGE_IN_FRIEND: 'Delete message in friend',
  UNSENT_MESSAGE_IN_FRIEND: 'Unsend message in friend',
  MESSAGE_READ_IN_FRIEND: 'Message read in friend',
  FRIEND_TYPING_MESSAGE: 'Friend typing message',
  NEW_FRIEND_REQUEST: 'New friend request',
  FRIEND_REQUEST_ACCEPTED: 'Friend request accepted',
  FRIEND_REQUEST_REJECTED: 'Friend request rejected',
  UNFRIEND: 'Unfriend',
  FRIEND_REQUEST_CANCELLED: 'Friend request cancelled',
  READ_ALL_MESSAGE_FRIEND_CHAT: 'Read all message friend chat',
  PINED_FRIEND: 'pined friend',
    UNPINED_FRIEND: 'unpined friend',
  // Thread actions
  MESSAGE_IN_THREAD: 'Message in thread',
  MULTIPLE_MESSAGE_IN_THREAD: 'Multiple message in thread',
  MESSAGE_IN_FOLLOWING_CHANNEL: 'Message in following channel',
  MULTIPLE_MESSAGE_IN_FOLLOWING_CHANNEL:
    'Multiple message in following channel',
  MESSAGE_EDITED_IN_THREAD: 'Message edited in thread',
  MESSAGE_EDITED_IN_FOLLOWING_CHANNEL: 'Message edit in following channel',
  DELETE_MESSAGE_IN_THREAD: 'Delete message in thread',
  DELETE_MESSAGE_IN_MY_CHANNEL: 'Delete message in my channel',
  DELETE_MESSAGE_IN_FOLLOWING_CHANNEL: 'Delete message in following channel',
  UNSENT_MESSAGE_IN_MY_CHANNEL: 'Unsent message in my channel',
  UNSENT_MESSAGE_IN_FOLLOWING_CHANNEL: 'Unsent message in following channel',
  UNSENT_MESSAGE_IN_THREAD: 'Unsent message in thread',
  NEW_TIMELINE_BULCK_SOCKET: 'New timeline bulck socket',
  NEW_CHANNEL_BULCK_SOCKET: 'New channel bulck socket',
  REMOVE_MEMBER_FROM_CHANNEL: 'Remove member from channel',
  MEMBER_REMOVED_FROM_CHANNEL_COUNT: 'Member removed from channel count',
  REMOVE_CHANNEL_MEMBER_ADMIN_SIDE: 'Remove channel member admin side',
  REMOVE_CHANNEL_ADMIN_ADMIN_SIDE: 'Remove channel admin side',
  REMOVE_CHANNEL_MEMBER: 'Remove member from channel',
  REMOVE_CHANNEL_ADMIN: 'Remove admin from channel',
  ADD_CHANNEL_USER: 'Add channel user',
  ADD_CHANNEL_MEMBER: 'Add channel member',
  ADD_CHANNEL_MEMBER_ADMIN_SIDE: 'Add channel member admin side',
  ADD_CHANNEL_ADMIN_ADMIN_SIDE: 'Add channel admin admin side',
  MEMBER_ADDED_IN_CHANNEL_COUNT: 'Member added in channel count',
  CHANNEL_MEMBER_TO_ADMIN: 'Add channel member to admin',
  CHANNEL_MEMBER_TO_ADMIN_ADMIN_SIDE: 'Channel member to admin',
  ADD_CHANNEL_ADMIN: 'Add channel admin',
  CHANNEL_DELETE: 'Channel delete',
  UPDATE_CHANNEL_DETAIL: 'Update channel detail',
  CREATE_NEW_CHANNEL: 'Create new channel',
  MESSAGE_TYPING: 'Message typing',
  USER_ONLINE_STATUS: 'Usser online status',
  CREATE_NEW_SUB_CHANNEL: 'Create new sub channel',
  READ_ALL_MESSAGE_CHANNEL_CHAT: 'Read all message channel chat',
  READ_ALL_MESSAGE_CHANNEL_SUBCHAT: 'Read all message channel subchat',
  // Group
  CREATE_NEW_GROUP: 'Create new group',
  EDIT_GROUP_DETAIL: 'Edit group detail',
  ADD_GROUP_MEMBER: 'Add group member',
  REMOVE_GROUP_MEMBER: 'Remove group member',
  GROUP_MEMBER_TO_ADMIN: 'Group member to admin',
  DELETE_GROUP: 'Delete group',
  MUTE_GROUP: 'Mute group',
  NEW_MESSAGE_IN_GROUP: 'New message in group',
  MESSAGE_EDIT_FROM_GROUP: 'Message edit from group',
  DELETE_MESSAGE_IN_GROUP: 'Delete message in group',
  UNSENT_MESSAGE_FROM_GROUP: 'Unsent message from group',
  READ_ALL_MESSAGE_GROUP_CHAT: 'Read all message group chat',
  PINED_GROUP: 'pined group',
    UNPINED_GROUP: 'unpined group',
  TP_POINT_ACTION: 'Tp point action',
  TP_POINT_ADD: 'Tp point add',
  TP_POINT_DEDUCT: 'Tp point deduct',
  UPLOAD_AVTAR: 'Upload avtar',
  SOCKET_CONNECTED: 'Socket connected',
  CHECK_IS_USER_ONLINE: 'Check is user online',
  UPDATE_USER_PROFILE: 'Update user profile',
  // UPDATE_CHANNEL_MODE NOT ALLOWED FOR PUSH NOTIFICATION
  UPDATE_CHANNEL_MODE: 'Update configration channel mode',
  PINED_CHANNEL: 'pined channel',
  UNPINED_CHANNEL: 'unpined channel',

};
