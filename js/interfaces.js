/**
 * Contrato de una Slide (documentado vía JSDoc)
 * mount(host: HTMLElement): void
 * enter(host: HTMLElement, animator: IAnimator): SlideHandles
 * exit(host: HTMLElement, animator: IAnimator): void
 * destroy?(host: HTMLElement): void
 */

/**
 * @typedef {Object} SlideHandles
 * @property {HTMLElement=} nextBtn
 * @property {HTMLElement=} prevBtn
 */

/** @interface */
export class IAnimator {
  /** @param {Function[]} steps */
  sequence(steps=[]) { throw new Error('Not implemented'); }
  /** @param {number} ms */
  delay(ms) { throw new Error('Not implemented'); }
}


/**
 * @interface
 * @description Describe la navegación disponible en una slide.
 */
export class INavigable {
  /** @returns {boolean} si la slide tiene flecha para ir atrás */
  hasPrev() { throw new Error('Not implemented'); }

  /** @returns {boolean} si la slide tiene flecha para ir adelante */
  hasNext() { throw new Error('Not implemented'); }
}
