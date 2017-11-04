import i18next from '../i18next/dist/es/i18next.js';
import i18nextXHRBackend from '../i18next-xhr-backend/dist/es/index.js';
import i18nextBrowserLanguageDetector from '../i18next-browser-languageDetector/dist/es/index.js';

window.grainTranslate = null;

export default class GrainTranslate {

  constructor() {
    if (window.grainTranslate) {
      return window.grainTranslate;
    }
    
    this.proxy = i18next;
    this.proxy
      .use(i18nextXHRBackend)
      .use(i18nextBrowserLanguageDetector)
      .init({
        fallbackLng: 'en',
        debug: true,
        ns: [],
        detection: {
          order: ['querystring', 'cookie', 'localStorage', 'htmlTag', 'navigator'],
        },
        backend: {
          loadPath: function(lngs, namespaces) {
            for (let i=0; i<namespaces.length; i++) {
              if (namespaces[i] === 'translations' || namespaces[i].indexOf('local-') === 0) {
                return './assets/{{ns}}/{{lng}}.json';
              }
            }
            return '/node_modules/{{ns}}/assets/translations/{{lng}}.json';
          }.bind(this)
        }
      });

    window.grainTranslate = this;
  }

  changeLanguage(lng) {
    this.proxy.changeLanguage(lng);
  }
}