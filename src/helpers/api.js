import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

/* switch this for testing on staging or production */
export const staging = true;

// export const apiRootStaging = 'https://touku.angelium.net/api';
// export const apiRootStaging = 'https://wallet.angelium.net';
export const apiRootStaging = 'https://api-touku.angelium.net/api';

export const apiRoot = apiRootStaging;

export const client = axios.create({
  baseURL: apiRoot,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent':
      'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
  },
});

// Add a request interceptor
client.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    // let basicAuth = store.getState().home.accessToken;
    var basicAuth = await AsyncStorage.getItem('userToken');
    if (basicAuth && basicAuth != null) {
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
    if (response.data) {
      return response.data;
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
