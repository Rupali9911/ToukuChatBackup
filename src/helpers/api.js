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
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
client.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    // let basicAuth = store.getState().home.accessToken;
    // var basicAuth = await AsyncStorage.getItem('userToken');
    var basicAuth =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo5Nzk1LCJ1c2VybmFtZSI6Im5ldy5yZWdpc3RlciIsImV4cCI6MTU4OTExMDMzMiwiZW1haWwiOiJuZXcucmVnaXN0ZXJAYW5nZWxpdW0ubmV0In0.YkaHIGljyVV9fIqHtlKZ7FL1SvqrYM-Am_ctdlvEEVg';

    if (basicAuth && basicAuth != null) {
      config.headers.Authorization = `JWT ${basicAuth}`;
      //console.log("Token", config.headers.Authorization);
    } else {
      // NavigatorService.navigate("SignIn");
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
    if (response.data && response.data.status) return response.data;
    else {
      var message = 'We had trouble connecting to the server';
      if (response.data.message) message = response.data.message;

      return Promise.reject(response);
    }
  },
  function (error) {
    return Promise.reject(error);
  },
);
