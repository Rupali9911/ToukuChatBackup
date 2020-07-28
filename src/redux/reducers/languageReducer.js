import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import { Icons } from '../../constants/index.js';
import { client } from '../../helpers/api.js';
import { translationGetters } from '../../screens/Authentication/index.js';
import { batch } from 'react-redux'
// const writeJsonFile = require('../../translations/en.json');

let languages = [
  'en.json?t=' + Date.now(),
  'ja.json?t=' + Date.now(),
  'ko.json?t=' + Date.now(),
  'zh-hans.json?t=' + Date.now(),
  'zh-hant.json?t=' + Date.now(),
];

let languageRequests = languages.map((name) =>
  fetch(`https://cdn.angelium.net/lang/touku/${name}`)
);

let languageRequestsBackend = languages.map((name) =>
  fetch(`https://cdn.angelium.net/lang/backendMessage/${name}`)
);

// export const translationGetters = {
//   en: () => require('../../translations/en.json'),
//   ja: () => require('../../translations/ja.json'),
//   ko: () => require('../../translations/ko.json'),
//   ch: () => require('../../translations/ch.json'),
//   tw: () => require('../../translations/tw.json'),
// };

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

export function setI18nConfig(tag) {
  const fallback = { languageTag: tag || 'en' };
  const { languageTag } =
    // RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  translate.cache.clear();

  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
}

export const GET_EN_LANGUAGE_REQUEST = 'GET_EN_LANGUAGE_REQUEST';
export const GET_EN_LANGUAGE_SUCCESS = 'GET_EN_LANGUAGE_SUCCESS';
export const GET_EN_LANGUAGE_FAIL = 'GET_EN_LANGUAGE_FAIL';

export const SET_LANGUAGE_SELECTED = 'SET_LANGUAGE_SELECTED';
export const SET_ENGLISH_LANGUAGE = 'SET_ENGLISH_LANGUAGE';
export const SET_JAPAN_LANGUAGE = 'SET_JAPAN_LANGUAGE';
export const SET_KOREA_LANGUAGE = 'SET_KOREA_LANGUAGE';
export const SET_CHINA_LANGUAGE = 'SET_CHINA_LANGUAGE';
export const SET_TAIWAN_LANGUAGE = 'SET_TAIWAN_LANGUAGE';

export const SET_ENGLISH_LANGUAGE_BACKEND = 'SET_ENGLISH_LANGUAGE_BACKEND';
export const SET_JAPAN_LANGUAGE_BACKEND = 'SET_JAPAN_LANGUAGE_BACKEND';
export const SET_KOREA_LANGUAGE_BACKEND = 'SET_KOREA_LANGUAGE_BACKEND';
export const SET_CHINA_LANGUAGE_BACKEND = 'SET_CHINA_LANGUAGE_BACKEND';
export const SET_TAIWAN_LANGUAGE_BACKEND = 'SET_TAIWAN_LANGUAGE_BACKEND';

const initialState = {
  loading: false,
  selectedLanguageItem: {
    language_id: 1,
    language_name: 'en',
    icon: Icons.icon_flag_america,
    selected: true,
  },
  en: require('../../translations/en.json'),
  ja: require('../../translations/ja.json'),
  ko: require('../../translations/ko.json'),
  ch: require('../../translations/ch.json'),
  tw: require('../../translations/tw.json'),
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

    case SET_JAPAN_LANGUAGE:
      return {
        ...state,
        ja: action.payload.data,
      };

    case SET_KOREA_LANGUAGE:
      return {
        ...state,
        ko: action.payload.data,
      };

    case SET_CHINA_LANGUAGE:
      return {
        ...state,
        ch: action.payload.data,
      };

    case SET_TAIWAN_LANGUAGE:
      return {
        ...state,
        tw: action.payload.data,
      };

      case SET_ENGLISH_LANGUAGE_BACKEND:
      return {
        ...state,
        en: {...state.en, "backend": action.payload.data},
      };

    case SET_JAPAN_LANGUAGE_BACKEND:
      return {
        ...state,
        ja: {...state.ja, "backend": action.payload.data},
      };

    case SET_KOREA_LANGUAGE_BACKEND:
      return {
        ...state,
        ko: {...state.ko, "backend": action.payload.data},
      };

    case SET_CHINA_LANGUAGE_BACKEND:
      return {
        ...state,
        ch: {...state.ch, "backend": action.payload.data},
      };

    case SET_TAIWAN_LANGUAGE_BACKEND:
      return {
        ...state,
        tw: {...state.tw, "backend": action.payload.data},
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
     // console.log('Languages',JSON.stringify(languages))
        batch(() => {
            dispatch(setEnglishLanguage(languages[0]));
            dispatch(setJapanLanguage(languages[1]));
            dispatch(setKoreaLanguage(languages[2]));
            dispatch(setChinaLanguage(languages[3]));
            dispatch(setTaiwanLanguage(languages[4]));
        })
    });

// export const getTranslator = () => (dispatch) =>
//     new Promise(function (resolve, reject) {
//         fetch(`https://cdn.angelium.net/lang/backendMessage/ja.json?t=1594981683875`).then((res) => {
//           console.log('translator response', res)
//                 resolve(res);
//             })
//             .catch((err) => {
//                 console.log('translator response', err)
//                 reject(err);
//             });
//     });

export const getAllLanguagesBackend = () => (dispatch) =>
Promise.all(languageRequestsBackend)
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
         // console.log('Languages',JSON.stringify(languages))
        batch(() => {
            dispatch(setEnglishLanguageBackend(languages[0]));
            dispatch(setJapanLanguageBackend(languages[1]));
            dispatch(setKoreaLanguageBackend(languages[2]));
            dispatch(setChinaLanguageBackend(languages[3]));
            dispatch(setTaiwanLanguageBackend(languages[4]));
        })
        // (async () => {
        //     await writeJsonFile('en.json', {foo: true});
        // })();
    });

export const userLanguage = () => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .get(`/languages/`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const translateMessage = (data) => (dispatch) =>
  new Promise(function (resolve, reject) {
    client
      .post(`/chatbot/translator/`, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

//Set Selected Language
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

const setJapanLanguage = (data) => ({
  type: SET_JAPAN_LANGUAGE,
  payload: {
    data: data,
  },
});

const setKoreaLanguage = (data) => ({
  type: SET_KOREA_LANGUAGE,
  payload: {
    data: data,
  },
});

const setChinaLanguage = (data) => ({
  type: SET_CHINA_LANGUAGE,
  payload: {
    data: data,
  },
});

const setTaiwanLanguage = (data) => ({
  type: SET_TAIWAN_LANGUAGE,
  payload: {
    data: data,
  },
});

const setEnglishLanguageBackend = (data) => ({
    type: SET_ENGLISH_LANGUAGE_BACKEND,
    payload: {
        data: data,
    },
});

const setJapanLanguageBackend = (data) => ({
    type: SET_JAPAN_LANGUAGE_BACKEND,
    payload: {
        data: data,
    },
});

const setKoreaLanguageBackend = (data) => ({
    type: SET_KOREA_LANGUAGE_BACKEND,
    payload: {
        data: data,
    },
});

const setChinaLanguageBackend = (data) => ({
    type: SET_CHINA_LANGUAGE_BACKEND,
    payload: {
        data: data,
    },
});

const setTaiwanLanguageBackend = (data) => ({
    type: SET_TAIWAN_LANGUAGE_BACKEND,
    payload: {
        data: data,
    },
});
