import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

export const translationGetters = {
  en: () => require('../translations/en.json'),
  ja: () => require('../translations/ja.json'),
};

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export function setI18nConfig(tag) {
  const fallback = {languageTag: tag || 'ja'};
  const {languageTag} =
    // RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  translate.cache.clear();

  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
}
