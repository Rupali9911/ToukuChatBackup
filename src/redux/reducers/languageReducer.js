// import {client} from '../../helpers/api';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import {Icons} from '../../constants/index.js';

export const translationGetters = {
  en: () => require('../../translations/en.json'),
  ja: () => require('../../translations/ja.json'),
  ko: () => require('../../translations/ko.json'),
  ch: () => require('../../translations/ch.json'),
  tw: () => require('../../translations/tw.json'),
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
  selectedLanguageItem: {
    language_id: 1,
    language_name: 'en',
    icon: Icons.icon_flag_america,
    selected: true,
  },
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
        selectedLanguageItem: action.payload.data,
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
export const setAppLanguage = (data) => (dispatch) =>
  dispatch(setSelectedLanguage(data));

const setSelectedLanguage = (data) => ({
  type: SET_LANGUAGE_SELECTED,
  payload: {
    data: data,
  },
});
