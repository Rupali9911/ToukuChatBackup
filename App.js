import React, {Component, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  AppState,
  Linking,
  Alert,
  TextInput,
} from 'react-native';
import Routes from './src/navigation';
import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {PersistGate} from 'redux-persist/es/integration/react';
import {store, persistor} from './src/redux/store';
import Root from './src/screens/Root';
import InternetInfo from './src/components/InternetInfo';
import {
  CLEAR_BADGE_COUNT,
  client,
  socket,
  staging,
  userAgent,
} from './src/helpers/api';
import NavigationService from './src/navigation/NavigationService';
import AsyncStorage from '@react-native-community/async-storage';
import {
  loginUrl,
  registerUrl,
  channelUrl,
  DEEPLINK,
  Environment,
  NotificationType,
  registerUrlStage,
} from './src/constants/index';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import NotifService from './src/helpers/LocalNotification/NotifService';
import {setCurrentChannel} from './src/redux/reducers/channelReducer';
import {
  setCurrentFriend,
  addFriendByReferralCode,
} from './src/redux/reducers/friendReducer';
import {setCurrentGroup} from './src/redux/reducers/groupReducer';
import {
  isEventIdExists,
  getLastEventId,
  getUserFriendByFriendId,
  getChannelsById,
  getGroupsById,
  updateLastEventId,
} from './src/storage/Service';

import {
  getMissedSocketEventsByIdFromApp,
  setCurrentRouteData,
} from './src/redux/reducers/userReducer';
import SingleSocket from './src/helpers/SingleSocket';
import {eventService} from './src/utils';
import { setSpecificId, setActiveTab } from './src/redux/reducers/timelineReducer';
import {getMaintenance} from './src/redux/reducers/configurationReducer';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      notifData: '',
    };
    this.notif = new NotifService();
    //this.onNotif.bind(this),
  }

  componentDidMount() {
    this.createNotificationListeners();
    this.addListener();
    this.checkNotificationPermission();
    this.getInitialLinking();

    this.onTokenRefreshListener = messaging().onTokenRefresh((fcmToken) => {
      // Process your token as required
      this.getToken();
      // console.log('Updated Token=' + fcmToken);
    });
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  getInitialLinking() {
    // console.log('getInitialLinking calld');
    Linking.getInitialURL().then((url) => {
      if (url) {
        setTimeout(() => {
          this.handleOpenURL({url});
        }, 3000);
      }
    });
  }

  addListener() {
    AppState.addEventListener('change', this._handleAppStateChange);
    Linking.addEventListener('url', this.handleOpenURL);
  }

  removeListeners() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    Linking.removeEventListener('url', this.handleOpenURL);
    this.backgroundNotificationListener;
    this.closedAppNotificationListener;
    this.onMessageListener;
    this.onTokenRefreshListener;
  }

  _handleAppStateChange = async (nextAppState) => {
    // console.log('nextAppState', nextAppState);
    const {appState} = this.state;
    this.setState({appState: nextAppState});
    if (nextAppState === 'inactive') {
      let fCount = store.getState().friendReducer.unreadFriendMsgsCounts;
      let gCount = store.getState().groupReducer.unreadGroupMsgsCounts;
      let cCount = store.getState().channelReducer.unreadChannelMsgsCounts;
      let frCount = store.getState().addFriendReducer.friendRequest.length;
      let totalCount = fCount + gCount + cCount + frCount;
        console.log('_handleAppStateChange', totalCount);
      PushNotificationIOS.setApplicationIconBadgeNumber(totalCount);
    }

    if (
      (appState.match(/background/) && nextAppState === 'active') ||
      (appState.match(/unknown/) && nextAppState === 'active')
    ) {
       console.log('From background to active or unknown to active');
      //this.clearBatchCount()

        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
            getMaintenance()
        }


      if (appState.match(/background/) && nextAppState === 'active') {
        this.getToken();
        // console.log('From background to active');
        this.SingleSocket = SingleSocket.getInstance();
        this.SingleSocket.checkSocketConnected();
        if (isEventIdExists()) {
          let idObj = getLastEventId();
          // console.log('getLastEventId', idObj);
          if (idObj.length > 0) {
            getMissedSocketEventsByIdFromApp(idObj[0].socket_event_id).then(
              (res) => {
                if (res && res.data && res.data.length > 0) {
                  res.data.map((item) => {
                    updateLastEventId(res.socket_event_id);
                    eventService.sendMessage({data: item});
                  });
                }
              },
            );
          }
        }
      }
    }
  };

  navigateToChannelInfo = async (data, url) => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      let route = NavigationService.getCurrentRoute();
      let routeName = route.routeName;
      if (
        routeName &&
        (routeName === 'ChannelInfo' || routeName === 'ChannelChats')
      ) {
        NavigationService.popToTop();
      }
      store.dispatch(setCurrentChannel(data));
      NavigationService.navigate('ChannelInfo');
    } else {
      await AsyncStorage.setItem('channelData', JSON.stringify(data));
      NavigationService.navigate('Login', {url: url});
    }
  };

  handleOpenURL = async (event) => {
    console.log('Deep linking Url', event.url);
    let url = event.url;

    if (url.indexOf(DEEPLINK.toLowerCase()) > -1) {
      let suffixUrlDeep =
        Platform.OS === 'ios'
          ? url.split('touku://')[1].trim()
          : url.split('touku://touku')[1].trim();
      if (suffixUrlDeep != '') {
        url = Environment + suffixUrlDeep;
        // console.log('suffixUrlDeep', url);
      }
    }

    let channelLoginUrl = url.substring(0, url.indexOf('?')) + '/';
    if (url.indexOf(loginUrl) > -1 || url.indexOf(registerUrl) > -1) {
      let isLoginUrl = url.indexOf(loginUrl) > -1
        let suffixUrl = url.split(isLoginUrl ? loginUrl : registerUrl)[1].trim();
        let invitationCode =
            suffixUrl.split('/').length > 0
                ? suffixUrl.split('/')[0].trim()
                : suffixUrl;
        await AsyncStorage.setItem('invitationCode', invitationCode);
        const userToken = await AsyncStorage.getItem('userToken');

        console.log('invitationCode received via link', invitationCode)
        if (userToken) {
            let route = NavigationService.getCurrentRoute();
            let routeName = route.routeName;
            if (routeName && (routeName === 'ChatTab')) {
                NavigationService.navigate('Home')
                NavigationService.navigate('Chat');
            }else{
                NavigationService.navigate('Chat');
            }
        }else{
          if(url.indexOf(registerUrl) > -1){
            NavigationService.navigateToScreen2Via1('LoginSignUp', 'Login');
          }else{
            NavigationService.navigate('LoginSignUp');
          }
        }
    } else if (loginUrl === channelLoginUrl) {
      console.log('loginUrl', loginUrl, channelLoginUrl);
      let splitUrl = url.split('&');
      let invitationCode, channelId;
      if (splitUrl.length >= 2) {
        let tmpInviteCode = splitUrl[1];
        let tmpChannelId = splitUrl[2];
        if (tmpInviteCode.split('=').length > 1) {
          invitationCode = tmpInviteCode.split('=')[1];
        }
        if (tmpChannelId.split('=').length > 1) {
          channelId = tmpChannelId.split('=')[1];
        }
        console.log('invitationCode', invitationCode);
        console.log('channelID', channelId);
      }
      if (channelId !== null || channelId !== undefined || channelId !== '') {
        let data = {
          id: channelId,
        };
        this.navigateToChannelInfo(data, url);
      }
    } else if (url.indexOf(channelUrl) > -1) {
      let suffixUrl = url.split(channelUrl)[1].trim();
      let channelId =
        suffixUrl.split('/').length > 0
          ? suffixUrl.split('/')[0].trim()
          : suffixUrl;
      if (channelId !== null || channelId !== undefined || channelId !== '') {
        let data = {
          id: channelId,
        };
        this.navigateToChannelInfo(data, url);
      }
    } else if (url.indexOf('invite') > -1) {
      let urlData = url.split('/');
      if (urlData.length > 4) {
        if (
          urlData[4] !== null ||
          urlData[4] !== undefined ||
          urlData[4] !== ''
        ) {
          let data = {
            id: urlData[4],
          };
          this.navigateToChannelInfo(data, url);
        }
      }
    } else if (url.indexOf('channel-detail') > -1) {
      let urlData = url.split('/');
      if (urlData.length > 4) {
        if (
          urlData[5] !== null ||
          urlData[5] !== undefined ||
          urlData[5] !== ''
        ) {
          let data = {
            id: urlData[5],
          };
          this.navigateToChannelInfo(data, url);
        }
      }
    } else if (url.indexOf('/timeline-post') > -1) {
      let post_id = url.substring(url.lastIndexOf('/') + 1);
      console.log('post_id', post_id);
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        store.dispatch(setActiveTab('following'));
        store.dispatch(setSpecificId(post_id));
        NavigationService.navigate('Timeline');
      }else{
        // NavigationService.navigateToScreen2Via1('LoginSignUp', 'Login');
        NavigationService.navigate('LoginSignUp');
      }
    } else if (url.indexOf('/#/groups/') > -1) {
      let split_url = url.split('/');
      let group_id = split_url[split_url.length - 2];
      console.log('group_id', group_id);
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        NavigationService.navigate('JoinGroup', {group_id: group_id});
      } else {
        NavigationService.navigateToScreen2Via1('LoginSignUp', 'Login');
      }
    }
  };

  clearBatchCount = async () => {
    const userAndFcmToken = await AsyncStorage.multiGet([
      'userToken',
      'fcmToken',
    ]);
    if (userAndFcmToken[0][1] && userAndFcmToken[1][1]) {
      let result = await fetch(
        'https://api.angelium.net/api/xchat/reset-badge-count/',
        {
          method: 'POST',
          headers: {
            'User-Agent': userAgent,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_id: userAndFcmToken[1][1],
          }),
        },
      );
      result = await result.json();
      // alert('data', result);
      // console.log('result of clear batch count', result, userAndFcmToken[1][1]);
    }
  };

  updateToken = async (token) => {
    const userAndSocialToken = await AsyncStorage.multiGet([
      'userToken',
      'socialToken',
    ]);
    let jwtToken = '';
    if (userAndSocialToken[1][1] && userAndSocialToken[1][1] != null) {
      jwtToken = `JWT ${userAndSocialToken[1][1]}`;
    } else if (userAndSocialToken[0][1] && userAndSocialToken[0][1] != null) {
      jwtToken = `JWT ${userAndSocialToken[0][1]}`;
    }
    if (userAndSocialToken[0][1] || userAndSocialToken[1][1]) {
      let formData = new FormData();
      formData.append('dev_id', token);
      let result = await fetch(
        'https://api-touku.angelium.net/api/xchat/add-device/',
        {
          method: 'POST',
          headers: {
            'User-Agent': userAgent,
            // Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: jwtToken,
            Origin: 'touku',
          },
          body: formData,
        },
      );
      result = await result.json();
      // console.log('result of Update token', result, token);
    }
  };

  //1
  async checkNotificationPermission() {
    const enabled = messaging().isDeviceRegisteredForRemoteMessages;
    if (enabled) {
      await this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let registeredFcmToken = await AsyncStorage.getItem('fcmToken');
    // console.log('saved dev_id token: ', registeredFcmToken);
    //this.updateToken(registeredFcmToken)
    let fcmToken = await messaging().getToken();
    // console.log('fcmToken dev_id token: ', fcmToken);
    if (fcmToken !== registeredFcmToken) {
      // console.log('fcm NEWWWWWWWW dev_id: ', fcmToken);
      await AsyncStorage.setItem('fcmToken', fcmToken);
      this.updateToken(registeredFcmToken);
    }
  }

  //2
  async requestPermission() {
    // console.log('requestPermission called');
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      // console.log('Authorization status:', authStatus);
      await this.getToken();
    }
  }

  notificationRedirection = (remoteMessage) => {
    let notificationData = remoteMessage.data;
    console.log('data notificationData', notificationData);
    if (notificationData.notification_type) {
      console.log(
        'notificationData and type',
        notificationData,
        notificationData.notification_type,
      );
      if (
        notificationData.notification_type ===
          NotificationType.FRIEND_REQUEST_ACCEPTED ||
        notificationData.notification_type ===
          NotificationType.SEND_FRIEND_REQUEST ||
        notificationData.notification_type ===
          NotificationType.NEW_FRIEND_REQUEST
      ) {
        // if (notificationData.notification_type === NotificationType.FRIEND_REQUEST_ACCEPTED){
        //     NavigationService.navigate('Home', { expandCollapse: 'friends' });
        // }else if (notificationData.notification_type === NotificationType.SEND_FRIEND_REQUEST){
        //     NavigationService.navigate('Home', { expandCollapse: 'friendReq' });
        // }
        NavigationService.navigate('Home');
      } else if (
        notificationData.notification_type ===
        NotificationType.MESSAGE_IN_FRIEND
      ) {
        //  NavigationService.navigate('Chat');
        let friendObj = getUserFriendByFriendId(notificationData.id);
        if (friendObj.length > 0) {
          let friend = JSON.parse(JSON.stringify(friendObj[0]));
          store.dispatch(setCurrentFriend(friend));
          NavigationService.navigate('FriendChats');
        }
      } else if (
        notificationData.notification_type ===
        NotificationType.MESSAGE_IN_CHANNEL
      ) {
        let channelObj = getChannelsById(notificationData.id);
        if (channelObj.length > 0) {
          store.dispatch(setCurrentChannel(channelObj[0]));
          NavigationService.navigate('ChannelChats');
        }
      } else if (
        notificationData.notification_type === NotificationType.MESSAGE_IN_GROUP
      ) {
        let groupObj = getGroupsById(notificationData.id);
        if (groupObj.length > 0) {
          store.dispatch(setCurrentGroup(groupObj[0]));
          NavigationService.navigate('GroupChats');
        }
      } else if (
        notificationData.notification_type ===
        NotificationType.MESSAGE_IN_THREAD
      ) {
        NavigationService.navigate('Chat');
      }
    }
  };

  async createNotificationListeners() {
    // When a user tap on a push notification and the app is in background
    this.backgroundNotificationListener = messaging().onNotificationOpenedApp(
      async (remoteMessage) => {
        console.log('remoteMessage background', remoteMessage);
        if (remoteMessage && remoteMessage.data) {
          this.notificationRedirection(remoteMessage);
        }
      },
    );

    // When a user tap on a push notification and the app is CLOSED
    this.closedAppNotificationListener = messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log('remoteMessage', remoteMessage);
        if (remoteMessage && remoteMessage.data) {
          console.log('remoteMessage background', remoteMessage);
          this.notificationRedirection(remoteMessage);
        }
      });

    // When a user receives a push notification and the app is in foreground
    this.onMessageListener = messaging().onMessage((remoteMessage) => {
      console.log('remoteMessage background', remoteMessage);
      this.onMessageReceived(remoteMessage);
      this.setState({notifData: remoteMessage});
    });

    this.notif = new NotifService(
      () => {},
      () => {
        if (this.state.notifData) {
          this.notificationRedirection(this.state.notifData);
        }
      },
    );
  }

  onMessageReceived(notification) {
    // console.log('onMessageReceived', notification);
    if (Platform.OS === 'ios') {
      PushNotificationIOS.presentLocalNotification({
        alertBody: notification?.notification?.body,
        alertTitle: notification?.notification?.title,
      });
    } else {
      this.notif.localNotif(
        notification?.notification?.title,
        notification?.notification?.body,
        'default',
      );
    }
  }

  // gets the current screen from navigation state
  getActiveRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getActiveRouteName(route);
    }
    return route.routeName;
  }

  render() {
    return (
      <Provider store={store}>
        <PaperProvider>
          <PersistGate loading={null} persistor={persistor}>
            <Root>
              <View style={{flex: 1}}>
                <StatusBar barStyle="light-content" translucent />
                {/* <InternetInfo /> */}
                <Routes
                  ref={(navigatorRef) => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                  }}
                  onNavigationStateChange={(
                    prevState,
                    currentState,
                    action,
                  ) => {
                    // console.log('store.getState()',store.getState());
                    const currentRouteName = this.getActiveRouteName(
                      currentState,
                    );
                    const previousRouteName = this.getActiveRouteName(
                      prevState,
                    );
                    // console.log('currentRouteName', currentRouteName);
                    store.dispatch(setCurrentRouteData(currentRouteName));
                  }}
                />
              </View>
            </Root>
          </PersistGate>
        </PaperProvider>
      </Provider>
    );
  }
}
