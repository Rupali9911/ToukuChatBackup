import {Platform} from 'react-native';

export const Icons = {
  icon_language_select: require('../../assets/icons/language_icon.png'),
  icon_back: require('../../assets/icons/back_icon.png'),
  icon_arrow_right: require('../../assets/icons/arrow_right.png'),
  icon_arrow_up: require('../../assets/icons/arrow_up.png'),
  icon_arrow_down: require('../../assets/icons/arrow_down.png'),
  icon_tick: require('../../assets/icons/tick.png'),
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
  icon_channel_select: require('../../assets/icons/channel_select.png'),
  icon_message: require('../../assets/icons/message.png'),
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

};

export const Images = {
  image_touku_bg: require('../../assets/images/touku_bg_new.png'),
  image_default_profile: require('../../assets/images/default_profile.png'),
  image_home_bg: require('../../assets/images/touku_home_bg.png'),
  image_loading: require('../../assets/images/loading.gif'),
  image_gallery: require('../../assets/images/gallery.png'),
  image_cover_1: require('../../assets/images/cover_1.jpg'),
  image_cover_2: require('../../assets/images/cover_2.jpg'),
  image_cover_3: require('../../assets/images/cover_3.jpg'),
  image_cover_4: require('../../assets/images/cover_4.jpg'),
  image_cover_5: require('../../assets/images/cover_5.jpg'),
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
  home_header: '#fb9a7a',
  indigo: '#6610f2',
  purple: '#6f42c1',
  green: '#1bd078',
  dark_gray: '#2c3e50',
    dark_orange: '#e15b63',
    light_gray: '#909093',
    gradient_4: '#ff62a5eb',
    gradient_5: '#ff8960eb'
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

export const languageArray =[
    {
        language_id: 1,
        language_name: 'en',
        icon: Icons.icon_flag_america,
        language_display: 'English'
    },
    {
        language_id: 2,
        language_name: 'ja',
        icon: Icons.icon_flag_japan,
        language_display: '日本語'
    },
    {
        language_id: 3,
        language_name: 'ch',
        icon: Icons.icon_flag_china,
        language_display: '中文（简体）'
    },
    {
        language_id: 4,
        language_name: 'tw',
        icon: Icons.icon_flag_taiwan,
        language_display: '中文（繁体）'
    },
    {
        language_id: 5,
        language_name: 'ko',
        icon: Icons.icon_flag_korea,
        language_display: '한국어'
    },
]

export const supportUrl = 'https://www.touku.net/#/support/'
export const registerUrl = 'https://www.touku.net/#/register/'
