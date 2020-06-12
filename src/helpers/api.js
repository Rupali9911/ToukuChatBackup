import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import NavigationService from '../navigation/NavigationService';
import Toast from '../components/Toast';
import SingleSocket from './SingleSocket';

/* switch this for testing on staging or production */
export const staging = true;
export const websocket = new WebSocket(
  'wss://touku.angelium.net/ws/v1/single-socket/9795?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo5Nzk1LCJ1c2VybmFtZSI6Im5ldy5yZWdpc3RlciIsImV4cCI6MTU5MTMzNDIzNSwiZW1haWwiOiJuZXcucmVnaXN0ZXJAYW5nZWxpdW0ubmV0In0.LUr-PtbJGyUISMG7_pYd6sWGoRA4UBTibj1uBeR0gZM',
);

//Staging API URL
export const apiRootStaging = 'https://touku.angelium.net/api';
//Live API URL
export const apiRootLive = 'https://api-touku.angelium.net/api';

//Staging Socket URL
const socketURLStaging = 'wss://touku.angelium.net/ws/v1';
const socketURLLive = 'wss://api-touku.angelium.net/ws/v1';

export const apiRoot = staging ? apiRootStaging : apiRootLive;
export const socketUrl = staging ? socketURLStaging : socketURLLive;
export const userAgent =
  'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1';

export const GET_USER_CONFIG = apiRoot + '/xchat/configuration/';
export const UPDATE_CHANNEL_MODE = apiRoot + '/xchat/update-channel-mode/';

export const client = axios.create({
  baseURL: apiRoot,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': userAgent,
  },
});

// Add a request interceptor
client.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    var basicAuth = await AsyncStorage.getItem('userToken');
    var socialAuth = await AsyncStorage.getItem('socialToken');
    if (socialAuth && socialAuth != null) {
      config.headers.Authorization = `JWT ${socialAuth}`;
      //console.log("Token", config.headers.Authorization);
      // SingleSocket.create({
      //   user_id: 9795,
      //   token: socialAuth,
      // });
    } else if (basicAuth && basicAuth != null) {
      config.headers.Authorization = `JWT ${basicAuth}`;
      //console.log("Token", config.headers.Authorization);
      // SingleSocket.create({
      //   user_id: 9795,
      //   token: basicAuth,
      // });
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
client.interceptors.response.use(
  function (response) {
    //alert(JSON.stringify(response));
    if (response.data) {
      return response.data;
    } else if (response.status === 401) {
      AsyncStorage.clear();
      NavigationService.navigate('Auth');
      Toast.show({
        title: 'Touku',
        text: 'Session Expired',
        type: 'primary',
      });
    } else {
      var message = 'We had trouble connecting to the server';
      if (response.data.message) message = response.data.message;

      return Promise.reject(response);
    }
    // if (response.data && response.data.status) return response.data;
    // else {
    //   var message = 'We had trouble connecting to the server';
    //   if (response.data.message) message = response.data.message;

    //   return Promise.reject(response);
    // }
  },
  function (error) {
    return Promise.reject(error);
  },
);
