import {combineReducers} from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import {GoogleSignin} from '@react-native-community/google-signin';

import userReducer from './userReducer';
import loginReducer from './loginReducer';
import signupReducer from './signupReducer';
import languageReducer from './languageReducer';
import forgotPassReducer from './forgotPassReducer';
import channelReducer from './channelReducer';
import groupReducer from './groupReducer';
import friendReducer from './friendReducer';
import configurationReducer from './configurationReducer';
import addFriendReducer from './addFriendReducer';
import timelineReducer from './timelineReducer';
import commonReducer from './commonReducer';
import chatReducer from './chatReducer';
import {client} from '../../helpers/api';

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

const allReducers = combineReducers({
  userReducer,
  loginReducer,
  signupReducer,
  languageReducer,
  forgotPassReducer,
  channelReducer,
  groupReducer,
  friendReducer,
  configurationReducer,
  addFriendReducer,
  timelineReducer,
  commonReducer,
  chatReducer,
});

export const logout = (data) => (dispatch) =>
  new Promise(function (resolve) {
    client
      .post('/xchat/logout/', data)
      .then((res) => {
        dispatch({
          type: LOGOUT_SUCCESS,
        });
        resolve(true);
      })
      .catch((err) => {
        console.error('logout::err', err);
        dispatch({
          type: LOGOUT_SUCCESS,
        });
        resolve(true);
        // reject(err);
      });
  });

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_SUCCESS) {
    Object.keys(state).forEach((key) => {
      AsyncStorage.removeItem(`persist:${key}`);
    });
    AsyncStorage.removeItem('userToken');
    const isSignedIn = GoogleSignin.isSignedIn();
    if (isSignedIn) {
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();
    }
    state = undefined;
  }
  return allReducers(state, action);
};

export default rootReducer;
