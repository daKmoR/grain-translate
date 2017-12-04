import i18next from '../i18next/dist/es/i18next.js';
import i18nextXHRBackend from '../i18next-xhr-backend/dist/es/index.js';
import i18nextBrowserLanguageDetector from '../i18next-browser-languagedetector/dist/es/index.js';

window.grainTranslate = null;

let IntlPostProcessor = {
  type: 'postProcessor',
  name: 'intl',
  process: function(value, key, options, translator) {
    if (value.indexOf('{') !== -1 && value.indexOf('{{') === -1) {
      let intlObject = new IntlMessageFormat(value, translator.language);
      return intlObject.format(options);
    }
    return value;
  }
};

/**
 * If you want to always support Intl Api you can do
 *
 * new GrainTranslate({
 *   postProcess: ['intl']
 * });
 *
 */
export default class GrainTranslate {

  constructor(options) {
    if (window.grainTranslate) {
      return window.grainTranslate;
    }

    this.proxyOptions = Object.assign({
      fallbackLng: 'en',
      debug: false,
      ns: [],
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'htmlTag', 'navigator'],
      },
      backend: {
        loadPath: function(lngs, namespaces) {
          for (let i=0; i < namespaces.length; i++) {
            if (namespaces[i] === 'translations' || namespaces[i].indexOf('local-') === 0) {
              return '/assets/{{ns}}/{{lng}}.json';
            }
          }
          return '/node_modules/{{ns}}/assets/translations/{{lng}}.json';
        }.bind(this)
      }
    }, options);

    this.proxy = i18next;
    this.proxy
      .use(i18nextXHRBackend)
      .use(i18nextBrowserLanguageDetector)
      .use(IntlPostProcessor)
      .init(this.proxyOptions);

    window.grainTranslate = this;
  }

  get language() {
    return this.proxy.language || this.proxyOptions.fallbackLng;
  }

  changeLanguage(lng) {
    this.proxy.changeLanguage(lng);
  }

  loadNamespaces(namespaces) {
    this.proxy.loadNamespaces(namespaces);
  }

}
