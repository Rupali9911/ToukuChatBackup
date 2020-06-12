import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import NavigationService from '../navigation/NavigationService';
import Toast from '../components/Toast';

/* switch this for testing on staging or production */
export const staging = true;

//Staging Socket URL
const socketStaging = io.connect('wss://touku.angelium.net/ws/v1', {
  reconnection: false,
  reconnectionDelay: 500,
  jsonp: false,
  reconnectionAttempts: Infinity,
  transports: ['websocket'],
  forceNew: true,
});
//Live Socket URL
const socketLive = io.connect('wss://api-touku.angelium.net/ws/v1', {
  reconnection: false,
  reconnectionDelay: 500,
  jsonp: false,
  reconnectionAttempts: Infinity,
  transports: ['websocket'],
  forceNew: true,
});

export const socket = staging ? socketStaging : socketLive;
export const websocket = new WebSocket('wss://touku.angelium.net/ws/v1');

//Staging API URL
export const apiRootStaging = 'https://touku.angelium.net/api';
//Live API URL
export const apiRootLive = 'https://api-touku.angelium.net/api';

export const apiRoot = staging ? apiRootStaging : apiRootLive;
export const userAgent =
  'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1';


export const GET_USER_CONFIG = apiRoot + '/xchat/configuration/'
export const UPDATE_CHANNEL_MODE = apiRoot + '/xchat/update-channel-mode/'


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
    } else if (basicAuth && basicAuth != null) {
      config.headers.Authorization = `JWT ${basicAuth}`;
      //console.log("Token", config.headers.Authorization);
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
