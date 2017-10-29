import GrainLitElement, { html } from '../../grain-lit-element/GrainLitElement.js';
import GrainTranslate from '../GrainTranslate.js';

export default class GrainTranslateExample extends GrainTranslate(GrainLitElement(HTMLElement)) {

  static get translateDefaults() {
    return {
      defaultNS: ['grain-translate']
    }
  }

  render() {
    return html`
      <h3>${this.t('greeting')}</h3>
    `;
  }
}

customElements.define('grain-translate-example', GrainTranslateExample);
