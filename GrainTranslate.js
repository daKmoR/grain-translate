if (!window.i18next) {
  console.error('You have to load globally <script src="./node_modules/i18next/i18next.min.js"></script>');
}
if (!window.i18nextXHRBackend) {
  console.error('You have to load globally <script src="./node_modules/i18next-xhr-backend/i18nextXHRBackend.min.js"></script>');
}
if (!window.i18nextBrowserLanguageDetector) {
  console.error('You have to load globally <script src="./node_modules/i18next-browser-languagedetector/i18nextBrowserLanguageDetector.min.js"></script>');
}

if (i18next && typeof i18next.isInitialized === 'undefined') {
  i18next
    .use(window.i18nextXHRBackend)
    .use(window.i18nextBrowserLanguageDetector)
    .init({
      fallbackLng: 'en',
      debug: false,
      ns: [],
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'htmlTag', 'navigator'],
      },
      backend: {
        loadPath: '../../{{ns}}/assets/translations/{{lng}}.json',
      }
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
    this.localI18next = i18next.cloneInstance();
    this.localI18next.on('languageChanged', (lng) => {
      this.update();
    });

    let defaults = this.constructor.translateDefaults;
    if (typeof defaults.defaultNS === 'undefined') {
      defaults.defaultNS = this.localName;
    }
    this.localI18next.init(defaults);
    this.localI18next.loadNamespaces(defaults.defaultNS);
  }

  connectedCallback() {
    this.manualFirstRender = true;
    super.connectedCallback();
  }

  t(key, options) {
    // prefix defaultNS manually because of bug
    // https://github.com/i18next/i18next/issues/979
    if (typeof this.constructor.translateDefaults.defaultNS !== 'undefined' && key.indexOf(':') === -1) {
      key = this.constructor.translateDefaults.defaultNS + ':' + key;
    }
    if (this.localI18next && typeof this.localI18next.isInitialized === 'undefined') {
      return new Promise((resolve, reject) => {
        this.localI18next.on('initialized', () => {
          resolve(this.localI18next.t(key, options));
        });
      });

    } else {
      return this.localI18next.t(key, options);
    }
  }
};

export default GrainTranslate;
