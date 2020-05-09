import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import {Icons} from '../../constants/index.js';
import {client} from '../../helpers/api.js';

let languages = [
  'en.json?t=1588152637880',
  'ja.json?t=1588841551420',
  'ko.json?t=1588841533708',
];

let languageRequests = languages.map((name) =>
  fetch(`https://wallet.angelium.net/languages/touku/${name}`),
);

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
export const SET_ENGLISH_LANGUAGE = 'SET_ENGLISH_LANGUAGE';

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

    case SET_ENGLISH_LANGUAGE:
      return {
        ...state,
        en: action.payload.data,
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

export const getAllLanguages = () => (dispatch) =>
  Promise.all(languageRequests)
    .then((responses) => {
      return responses;
    })
    .then((responses) => Promise.all(responses.map((r) => r.json())))
    .then((languages) => {
      if (languages && languages.length > 0) {
        languages = languages.map(function (el) {
          var o = Object.assign(el);
          // o.selected = false;
          return o;
        });
      }
      dispatch(setEnglishLanguage(languages[0]));
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

const setEnglishLanguage = (data) => ({
  type: SET_ENGLISH_LANGUAGE,
  payload: {
    data: data,
  },
});
