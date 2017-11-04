import GrainTranslate from './GrainTranslate.js';

/* @polymerMixin */
const GrainTranslateMixin = superclass => class extends superclass {
  static get translateDefaults() { return {
      'manualInit': false
    };
  }

  constructor() {
    super();
    this.grainTranslate = new GrainTranslate();

    const defaults = this.constructor.translateDefaults;
    defaults.defaultNS = typeof defaults.defaultNS === 'undefined' ? this.localName : defaults.defaultNS;

    this.grainTranslate.proxy.on('languageChanged', () => {
      this.update();
    });
    this.grainTranslate.proxy.loadNamespaces(defaults.defaultNS);

    this.t = this.grainTranslate.proxy.getFixedT(null, defaults.defaultNS);
  }

  // connectedCallback() {
  //   // if (this.grainTranslate.proxy && typeof this.grainTranslate.proxy.isInitialized === 'undefined') {
  //     // this.manualFirstRender = true;
  //   // }
  //   // this.manualFirstRender = true;
  //   super.connectedCallback();
  // }

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
