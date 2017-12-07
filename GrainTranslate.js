import i18next from '../i18next/dist/es/i18next.js';
import i18nextXHRBackend from '../i18next-xhr-backend/dist/es/index.js';
import i18nextBrowserLanguageDetector from '../i18next-browser-languagedetector/dist/es/index.js';

window.Grain = window.Grain || {};
window.Grain.translate = null;

/* global IntlMessageFormat */
const IntlPostProcessor = {
  type: 'postProcessor',
  name: 'intl',
  process: (value, key, options, translator) => {
    if (value.indexOf('{') !== -1 && value.indexOf('{{') === -1) {
      const intlObject = new IntlMessageFormat(value, translator.language);
      return intlObject.format(options);
    }
    return value;
  },
};

/**
 * If you want to always support Intl Api you can do
 *
 * new GrainTranslate({
 *   postProcess: ['intl']
 * });
 *
 */ // eslint-disable-next-line no-unused-vars
class GrainTranslate {
  constructor(options) {
    if (window.Grain.translate) {
      return window.Grain.translate;
    }

    this.proxyOptions = Object.assign({
      fallbackLng: 'en',
      debug: false,
      ns: [],
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'htmlTag', 'navigator'],
      },
      backend: {
        loadPath: (languages, namespaces) => {
          for (let i = 0; i < namespaces.length; i += 1) {
            if (namespaces[i] === 'translations' || namespaces[i].indexOf('local-') === 0) {
              return '/assets/{{ns}}/{{lng}}.json';
            }
          }
          return '/node_modules/{{ns}}/assets/translations/{{lng}}.json';
        },
      },
    }, options);

    this.proxy = i18next;
    this.proxy
      .use(i18nextXHRBackend)
      .use(i18nextBrowserLanguageDetector)
      .use(IntlPostProcessor)
      .init(this.proxyOptions);

    window.Grain.translate = this;
  }

  get language() {
    return this.proxy.language || this.proxyOptions.fallbackLng;
  }

  set language(language) {
    this.proxy.changeLanguage(language);
  }

  loadLanguages(languages, callback) {
    this.proxy.loadLanguages(languages, callback);
  }

  loadNamespaces(namespaces, callback) {
    this.proxy.loadNamespaces(namespaces, callback);
  }
}
