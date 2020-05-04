import {combineReducers} from 'redux';
import AsyncStorage from '@react-native-community/async-storage';

import userReducer from './userReducer';
import languageReducer from './languageReducer';

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

const allReducers = combineReducers({
  userReducer: userReducer,
  languageReducer: languageReducer,
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
    state = undefined;
  }
  return allReducers(state, action);
};

export default rootReducer;
