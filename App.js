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

import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import NotifService from './src/helpers/LocalNotification/NotifService';

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
          this.onRegister.bind(this),
          this.onNotif.bind(this),
      );
  }

  componentDidMount() {
      this.createNotificationListeners();
      this.addListener()
      this.checkNotificationPermission();

  }
    componentWillUnmount () {
        this.removeListeners()
    }

    addListener(){
        AppState.addEventListener('change', this._handleAppStateChange)
        Linking.addEventListener('url', this.handleOpenURL)
    }

    removeListeners(){
        AppState.removeEventListener('change', this._handleAppStateChange)
        Linking.removeEventListener('url', this.handleOpenURL);
        // this.closedAppNotificationListener.remove()
        // this.backgroundNotificationListener.remove()
        // this.onMessageListener.remove()
    }

    _handleAppStateChange = (nextAppState) => {
        console.log('nextAppState', nextAppState)
        if (this.state.appState.match(/background/) && nextAppState === 'active') {

        }else  if (nextAppState === 'inactive') {
            this.clearBatchCount()
        }
        if (nextAppState === 'active') {
            setTimeout(() => {
                this.clearBatchCount()
            }, 2000)
        }
        this.setState({appState: nextAppState})
    };

    handleOpenURL= async (event) => {
        console.log('Deep linking Url', event.url);

        // let url = event.url
        // if (url.indexOf(Constant.DEEPLINK.toLowerCase()) > -1) {
        //     let suffixUrl = Platform.OS === 'ios' ? url.split('touku://')[1].trim() : url.split('touku://touku')[1].trim()
        //     if( suffixUrl != ''){
        //         url = Environment + suffixUrl
        //         console.log('suffixUrl', url)
        //     }
        // }
    }

    clearBatchCount= async () =>{
        const userAndFcmToken = await AsyncStorage.multiGet(["userToken", "fcmToken"])
        if (userAndFcmToken[0][1]) {
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
            console.log('remoteMessage foreground', remoteMessage)
            this.onMessageReceived(remoteMessage)
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

    onRegister(token) {
        console.log('Token from local notification library', token)
        // this.setState({registerToken: token.token, fcmRegistered: true});
    }

    onNotif(notif) {
        console.log('Notification from local notification library', notif)
       // Alert.alert(notif.title, notif.message);
    }


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
