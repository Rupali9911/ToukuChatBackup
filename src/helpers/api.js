import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import NavigationService from '../navigation/NavigationService';
import Toast from '../components/Toast';
import SingleSocket from './SingleSocket';
import {resetData} from '../storage/Service';
import {translate} from '../redux/reducers/languageReducer';
import NetInfo from '@react-native-community/netinfo';

/* switch this for testing on staging or production */
export const staging = false ;

//Staging API URL
export const apiRootStaging = 'https://touku.angelium.net/api';

//Live API URL
export const apiRootLive = 'https://api-touku.angelium.net/api';

//Staging Socket URL
const socketURLStaging = 'wss://touku.angelium.net/ws/v1';
const socketURLLive = 'wss://api-touku.angelium.net/ws/v1';

// Staging url
const urlStaging = 'https://touku.angelium.net';

// Live url
const urlLive = 'https://touku.net';

export const inviteUrlRoot = staging ? urlStaging : urlLive;

export const apiRoot = staging ? apiRootStaging : apiRootLive;
export const socketUrl = staging ? socketURLStaging : socketURLLive;
export const userAgent =
  'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1';

export const KAKAO_API_KEY = '7608d108073fe9a65906c012b5c3f489';
export const GET_USER_CONFIG = apiRoot + '/xchat/configuration/';
export const UPDATE_CHANNEL_MODE = apiRoot + '/xchat/update-channel-mode/';
export const GET_TOUKU_POINTS = apiRoot + '/xchat/get-total-tp/';
export const GET_SEARCHED_FRIEND = apiRoot + '/xchat/search-contacts/';
export const SEND_FRIEND_REQUEST = apiRoot + '/xchat/send-friend-request/';
export const CANCEL_FRIEND_REQUEST = apiRoot + '/xchat/cancel-sent-request/';
export const CLEAR_BADGE_COUNT =
  'https://api-angelium.net/api/xchat/reset-badge-count/';

export const client = axios.create({
  baseURL: apiRoot,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': userAgent,
    Origin: 'touku.net',
  },
});

// Add a request interceptor
client.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    return NetInfo.fetch().then(async (state) => {
      console.log('Is connected?', state.isConnected);
      if (state.isConnected) {
        var basicAuth = await AsyncStorage.getItem('userToken');
        var socialAuth = await AsyncStorage.getItem('socialToken');
        if (socialAuth && socialAuth != null) {
          config.headers.Authorization = `JWT ${socialAuth}`;
        } else if (basicAuth && basicAuth != null) {
          config.headers.Authorization = `JWT ${basicAuth}`;
        }
        config.headers.Origin = 'touku';
        return config;
      } else {
        Toast.show({
          title: 'Touku',
          text: translate(`common.networkError`),
          type: 'primary',
        });
        return;
      }
    });
  },
  function (error) {
    console.log('error', error);
    return Promise.reject(error);
  },
);

// Add a response interceptor
client.interceptors.response.use(
  function (response) {
    // console.log(JSON.stringify(response));
    if (response.data) {
      return response.data;
    } else if (response.status === 401) {
      AsyncStorage.clear();
      NavigationService.navigate('Auth');
      let singleSocket = SingleSocket.getInstance();
      singleSocket && singleSocket.closeSocket();
      resetData();
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
    console.log('response_console_from_interceptor_error', error.response.data);
    if (error.toString() === 'Error: Network Error') {
      Toast.show({
        title: 'Touku',
        text: translate(`common.networkError`),
        type: 'primary',
      });
    }
    return Promise.reject(error);
  },
);
