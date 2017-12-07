import GrainTranslate from './GrainTranslate.js';

/* @polymerMixin */
// eslint-disable-next-line no-unused-vars
const GrainTranslateMixin = superclass => class extends superclass {
  static get translateDefaults() { return {}; }

  static overrideTranslateDefaults(properties) {
    this._overrideTranslateValues = properties;
  }

  set language(language) {
    this.grainTranslate.loadLanguages(language, () => {
      this._translate.language = language;
      this.t = this.grainTranslate.proxy.getFixedT(language, this._translate.namespace);
      this.update();
    });
  }

  get language() {
    return this._translate.language;
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
      loadNamespaces: [],
    }, this.supportOverrideTranslateDefaults(this.constructor.translateDefaults));

    if (!this._translate.loadNamespaces.includes(this._translate.namespace)) {
      this._translate.loadNamespaces.push(this._translate.namespace);
    }

    this.language = String(this.grainTranslate.language);

    // check if resource bundle exists, i.e every namespace has the language resource.
    // If yes, set the loaded to true
    if (this._translate.loadNamespaces.every(val =>
      this.grainTranslate.proxy.hasResourceBundle(this.grainTranslate.language, val))) {
      this._translate.loaded = true;
    }

    this.grainTranslate.loadNamespaces(this._translate.loadNamespaces);

    this.registerEvents();
  }

  registerEvents() {
    this.grainTranslate.proxy.on('languageChanged', (language) => {
      if (this._translate.loaded && (language !== this.language)) {
        this.language = language;
      }
    });

    this.grainTranslate.proxy.on('loaded', (loaded) => {
      if (this._translate.loaded === false) {
        const loadedNamespaces = loaded[this.grainTranslate.language];
        if (loadedNamespaces && this._translate.loadNamespaces.every(val =>
          loadedNamespaces.includes(val))) {
          this._translate.loaded = true;
          this.update();
        }
      }
    });
  }

  connectedUpdate() {
    if (this._translate.loaded === true) {
      super.connectedUpdate();
    }
  }
};

export default GrainTranslateMixin;
