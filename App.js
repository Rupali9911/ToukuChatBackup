import React, {Component, useEffect} from 'react';
import {View, Text, StatusBar, AppState, Linking, Alert} from 'react-native';
import Routes from './src/navigation';
import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {PersistGate} from 'redux-persist/es/integration/react';
import {store, persistor} from './src/redux/store';
import Root from './src/screens/Root';
import InternetInfo from './src/components/InternetInfo';
import {CLEAR_BADGE_COUNT, socket, userAgent} from './src/helpers/api';
import NavigationService from './src/navigation/NavigationService';
import AsyncStorage from "@react-native-community/async-storage";
import {loginUrl, registerUrl, channelUrl, DEEPLINK, Environment} from './src/constants/index'

import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import NotifService from './src/helpers/LocalNotification/NotifService';
import {setCurrentChannel} from "./src/redux/reducers/channelReducer";

// function app() {
//     console.log('UserEffect Called')
//     useEffect(() => {
//         const unsubscribe = messaging().onMessage(async remoteMessage => {
//             Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
//         });
//
//         return unsubscribe;
//     }, []);
// }

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        appState: AppState.currentState,
    };
      this.notif = new NotifService(
          //this.onNotif.bind(this),
      );
  }

  componentDidMount() {
      this.createNotificationListeners();
      this.addListener()
      this.checkNotificationPermission();
      this.getInitialLinking()

  }
    componentWillUnmount () {
        this.removeListeners()
    }

    getInitialLinking(){
        console.log('getInitialLinking calld')
        Linking.getInitialURL().then((url) => {
            if (url) {
                setTimeout(() => {
                    this.handleOpenURL({url})
                }, 3000)
            }
        })
    }

    addListener(){
        AppState.addEventListener('change', this._handleAppStateChange)
        Linking.addEventListener('url', this.handleOpenURL)
    }

    removeListeners(){
        AppState.removeEventListener('change', this._handleAppStateChange)
        Linking.removeEventListener('url', this.handleOpenURL);
        this.backgroundNotificationListener
        this.closedAppNotificationListener
        this.onMessageListener
    }

    _handleAppStateChange = (nextAppState) => {
        console.log('nextAppState', nextAppState)
        if (nextAppState === 'inactive'){
            let fCount = store.getState().friendReducer.unreadFriendMsgsCounts
            let gCount = store.getState().groupReducer.unreadGroupMsgsCounts
            let cCount = store.getState().channelReducer.unreadChannelMsgsCounts
            let totalCount = fCount + gCount + cCount
            console.log('_handleAppStateChange', totalCount)
            PushNotificationIOS.setApplicationIconBadgeNumber(totalCount)
        }
        // if (this.state.appState.match(/background/) && nextAppState === 'active') {
        //     console.log('From background to active')
        //     setTimeout(() => {
        //         this.clearBatchCount()
        //     }, 2000)
        // }

        if (this.state.appState.match(/background/) && nextAppState === 'active' || this.state.appState.match(/unknown/) && nextAppState === 'active') {
            console.log('From background to active or unknown to active')
            this.clearBatchCount()
        }
        // else  if (nextAppState === 'inactive') {
        //     this.clearBatchCount()
        // }
        // if (nextAppState === 'active') {
        //     setTimeout(() => {
        //         this.clearBatchCount()
        //     }, 2000)
        // }
        this.setState({appState: nextAppState})
    };

    handleOpenURL= async (event) => {
        console.log('Deep linking Url', event.url);
        let url = event.url

        if (url.indexOf(DEEPLINK.toLowerCase()) > -1) {
            let suffixUrlDeep = Platform.OS === 'ios' ? url.split('touku://')[1].trim() : url.split('touku://touku')[1].trim()
            if( suffixUrlDeep != ''){
                url = Environment + suffixUrlDeep
                console.log('suffixUrlDeep', url)
            }
        }

        if (url.indexOf(loginUrl) > -1) {
            setTimeout(() => {
                NavigationService.navigate('Login', { url: event.url });
            }, 1000 );
        }else if (url.indexOf(registerUrl) > -1) {
            let suffixUrl = event.url.split(registerUrl)[1].trim()
            let invitationCode = suffixUrl.split('/').length > 0 ? suffixUrl.split('/')[0].trim() : suffixUrl
            await AsyncStorage.setItem('invitationCode', invitationCode);
            setTimeout(() => {
                NavigationService.navigate('SignUp', { pageNumber: 0,
                    isSocial: false, invitationCode: invitationCode });
            }, 1000 );
        }else if (url.indexOf(channelUrl) > -1){
            let suffixUrl = url.split(channelUrl)[1].trim()
            console.log('suffixUrl', suffixUrl)
            let channelId = suffixUrl.split('/').length > 0 ? suffixUrl.split('/')[0].trim() : suffixUrl
            console.log('channelId', channelId)
            //await AsyncStorage.setItem('invitationCode', invitationCode);
            const userToken = await AsyncStorage.getItem('userToken');
            let data = {
                'id' : channelId
            }
            if (userToken){
                store.dispatch(setCurrentChannel(data))
                setTimeout(() => {
                    NavigationService.navigate('ChannelInfo');
                }, 1000 );
            } else{
                await AsyncStorage.setItem('channelData', JSON.stringify(data));
                setTimeout(() => {
                    NavigationService.navigate('Login', { url: event.url });
                }, 1000 );
            }
        }
    }

    clearBatchCount= async () =>{
        const userAndFcmToken = await AsyncStorage.multiGet(["userToken", "fcmToken"])
        if (userAndFcmToken[0][1] && userAndFcmToken[1][1]) {
            let result = await fetch('https://api.angelium.net/api/xchat/reset-badge-count/',
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
            console.log('result of clear batch count', result, userAndFcmToken[1][1])
        }
    }

    //1
    async checkNotificationPermission() {
        const enabled = messaging().isDeviceRegisteredForRemoteMessages
        if (enabled) {
            await this.getToken();
        } else {
            this.requestPermission();
        }
    }

    //3
    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
            fcmToken = await messaging().getToken()
            if (fcmToken) {
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
        console.log('getToken() fcm token: ', fcmToken);
    }

    //2
    async requestPermission() {
        console.log('requestPermission called')
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            console.log('Authorization status:', authStatus);
            await this.getToken();
        }
    }

    async createNotificationListeners() {
        // When a user tap on a push notification and the app is in background
        this.backgroundNotificationListener = messaging().onNotificationOpenedApp(async (remoteMessage) => {
            console.log('remoteMessage background', remoteMessage)
        });

        // When a user tap on a push notification and the app is CLOSED
        this.closedAppNotificationListener = messaging().getInitialNotification().then((remoteMessage) => {
            if (remoteMessage) {
                console.log('Closed app Push Notification opened', remoteMessage)
            }
        });

        // When a user receives a push notification and the app is in foreground
        this.onMessageListener = messaging().onMessage(async remoteMessage => {
           // this.onMessageReceived(remoteMessage)
        });
    }

    onMessageReceived(notification){
        console.log('onMessageReceived', notification)
        if (Platform.OS === 'ios') {
            PushNotificationIOS.presentLocalNotification({
                alertBody: notification?.notification?.body,
                alertTitle: notification?.notification?.title
            })
        }else{
            this.notif.localNotif(notification?.notification?.title, notification?.notification?.body, 'default')
        }
    }

    // onRegister(tokenObj) {
    //     console.log('tokenObj from local notification library', tokenObj)
    //     // this.setState({registerToken: token.token, fcmRegistered: true});
    // }

    // onNotif(notif) {
    //     console.log('Notification from local notification library', notif)
    //    // Alert.alert(notif.title, notif.message);
    // }


  render() {
    return (
      <Provider store={store}>
        <PaperProvider>
          <PersistGate loading={null} persistor={persistor}>
            <Root>
              <View style={{flex: 1}}>
                <StatusBar barStyle="light-content" translucent />
                <InternetInfo />
                <Routes
                  ref={(navigatorRef) => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
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
