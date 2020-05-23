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

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

const allReducers = combineReducers({
  userReducer: userReducer,
  loginReducer: loginReducer,
  signupReducer: signupReducer,
  languageReducer: languageReducer,
  forgotPassReducer: forgotPassReducer,
  channelReducer: channelReducer,
  groupReducer: groupReducer,
  friendReducer: friendReducer,
});

export const logout = (user) => (dispatch, getState) =>
  new Promise(function (resolve, reject) {
    dispatch({
      type: LOGOUT_SUCCESS,
    });
    resolve(true);
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
