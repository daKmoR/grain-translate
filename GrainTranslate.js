import i18next from '../i18next/dist/es/i18next.js';
import i18nextXHRBackend from '../i18next-xhr-backend/dist/es/index.js';
import i18nextBrowserLanguageDetector from '../i18next-browser-languageDetector/dist/es/index.js';

if (i18next && typeof i18next.isInitialized === 'undefined') {
  i18next
    .use(i18nextXHRBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
      fallbackLng: 'en',
      debug: false,
      ns: [],
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'htmlTag', 'navigator'],
      },
      backend: {
        loadPath: '../../{{ns}}/assets/translations/{{lng}}.json',
      },
    });
}

/* @polymerMixin */
const GrainTranslate = superclass => class extends superclass {
  static get translateDefaults() { return {}; }

  constructor() {
    super();
    i18next.on('languageChanged', (lng) => {
      this.localI18next.changeLanguage(lng);
    });

    const defaults = this.constructor.translateDefaults;
    defaults.defaultNS = typeof defaults.defaultNS === 'undefined' ? this.localName : defaults.defaultNS;
    defaults.ns = typeof defaults.ns === 'undefined' ? defaults.defaultNS : defaults.ns;
    this.localI18next = i18next.cloneInstance(defaults);
    this.localI18next.on('languageChanged', () => {
      this.update();
    });
  }

  connectedCallback() {
    this.manualFirstRender = true;
    super.connectedCallback();
  }

  t(key, options) {
    if (this.localI18next && typeof this.localI18next.isInitialized === 'undefined') {
      return new Promise((resolve) => {
        this.localI18next.on('initialized', () => {
          resolve(this.localI18next.t(key, options));
        });
      });
    }
    return this.localI18next.t(key, options);
  }
};

export default GrainTranslate;
