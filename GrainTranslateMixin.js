import GrainTranslate from './GrainTranslate.js';

/* @polymerMixin */
const GrainTranslateMixin = superclass => class extends superclass {
  static get translateDefaults() { return {}; }

  static overrideTranslateDefaults(properties) {
    this._overrideTranslateValues = properties;
  }

  supportOverrideTranslateDefaults(properties) {
    const result = properties;
    if (typeof this.constructor._overrideTranslateValues === 'object') {
      Object.keys(this.constructor._overrideTranslateValues).forEach((property) => {
        result[property] = this.constructor._overrideTranslateValues[property];
      });
    }
    return result;
  }

  constructor() {
    super();
    this.grainTranslate = new GrainTranslate();

    this._translate = Object.assign({
      namespace: this.localName,
      loaded: false,
      loadNamespaces: []
    }, this.supportOverrideTranslateDefaults(this.constructor.translateDefaults));

    if (!this._translate.loadNamespaces.includes(this._translate.namespace)) {
      this._translate.loadNamespaces.push(this._translate.namespace);
    }

    this._translate.language = String(this.grainTranslate.language);

    this.grainTranslate.proxy.on('languageChanged', (lng) => {
      if (this._translate.loaded && lng !== this._translate.language) {
        this._translate.language = lng;
        this.update();
      }
    });

    this.grainTranslate.proxy.on('loaded', (loaded) => {
      if (this._translate.loaded === false) {
        let loadedNamespaces = loaded[this.grainTranslate.language];
        if (loadedNamespaces && this._translate.loadNamespaces.every((val) => loadedNamespaces.includes(val))) {
          this._translate.loaded = true;
          this.update();
        }
      }
    });

    if (this._translate.loadNamespaces.every((val) => this.grainTranslate.proxy.hasResourceBundle(this.grainTranslate.language, val))) {
      this._translate.loaded = true;
    }

    this.grainTranslate.loadNamespaces(this._translate.loadNamespaces);

    this.t = this.grainTranslate.proxy.getFixedT(null, this._translate.namespace);
  }

  forceLanguage(lng) {
    this.t = this.grainTranslate.proxy.getFixedT(lng, this._translate.namespace);
    this.update();
  }

  connectedCallback() {
    if (this._translate.loaded === false) {
      this.manualFirstRender = true;
    }
    super.connectedCallback();
  }

  // t(key, options) {
  //   if (this.grainTranslate.proxy && typeof this.grainTranslate.proxy.isInitialized === 'undefined') {
  //     return new Promise((resolve) => {
  //       this.grainTranslate.proxy.on('initialized', () => {
  //         resolve(this.grainTranslate.proxy.t(key, options));
  //       });
  //     });
  //   }
  //   return this.grainTranslate.proxy.t(key, options);
  // }
};

export default GrainTranslateMixin;
