// import {client} from '../../helpers/api';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

export const translationGetters = {
  en: () => require('../../translations/en.json'),
  ja: () => require('../../translations/ja.json'),
};

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export function setI18nConfig(tag) {
  const fallback = {languageTag: tag || 'en'};
  const {languageTag} =
    // RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  translate.cache.clear();

  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
}

export const GET_EN_LANGUAGE_REQUEST = 'GET_EN_LANGUAGE_REQUEST';
export const GET_EN_LANGUAGE_SUCCESS = 'GET_EN_LANGUAGE_SUCCESS';
export const GET_EN_LANGUAGE_FAIL = 'GET_EN_LANGUAGE_FAIL';

export const SET_LANGUAGE_SELECTED = 'SET_LANGUAGE_SELECTED';

const initialState = {
  loading: false,
  selectedLanguage: 'ja',
  en: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_EN_LANGUAGE_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_EN_LANGUAGE_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_EN_LANGUAGE_FAIL:
      return {
        ...state,
        loading: false,
      };

    case SET_LANGUAGE_SELECTED:
      return {
        ...state,
        selectedLanguage: action.payload,
      };

    default:
      return state;
  }
}

const getLanguagesRequest = () => ({
  type: GET_EN_LANGUAGE_REQUEST,
});

const getLanguagesSuccess = (data) => ({
  type: GET_EN_LANGUAGE_SUCCESS,
  payload: {
    en: data,
  },
});

const getLanguagesFailure = () => ({
  type: GET_EN_LANGUAGE_FAIL,
});

//Set Selevted Language
export const setAppLanguage = (language) => (dispatch) =>
  dispatch(setSelectedLanguage(language));

const setSelectedLanguage = (language) => ({
  type: SET_LANGUAGE_SELECTED,
  payload: language,
});
