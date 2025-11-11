// core/js/SlideManager.js
// SlideManager — Navegación declarativa SOLID (SRP + DIP)

export class SlideManager {
  #slides = [];
  #index = 0;
  #host;
  #animator;
  #handles = null;
  _goNext = null;
  _goPrev = null;
  _onKey  = null;

  constructor({ host, slides, animator }) {
    this.#host = host;
    this.#slides = Array.isArray(slides) ? slides : [];
    this.#animator = animator || null;
    this.#bindKeys();
  }

  async start() {
    await this.#mountCurrent();
  }

  has(index) {
    return index >= 0 && index < this.#slides.length;
  }

  async goTo(index) {
    if (!this.has(index) || index === this.#index) return;
    await this.#exitCurrent();
    this.#index = index;
    await this.#mountCurrent();
  }

  async next() {
    const slide = this.#slides[this.#index];
    const canNext = slide?.hasNext?.() === true;
    if (!canNext) return;
    await this.goTo(Math.min(this.#index + 1, this.#slides.length - 1));
  }

  async prev() {
    const slide = this.#slides[this.#index];
    const canPrev = slide?.hasPrev?.() === true;
    if (!canPrev) return;
    await this.goTo(Math.max(this.#index - 1, 0));
  }

  async #mountCurrent() {
    const slide = this.#slides[this.#index];
    // CARGAR CSS DE LA SLIDE
    const slideName = slide.constructor.name.replace('Slide', '').toLowerCase();
    const cssPath = `../slides/${slideName}/${slideName}.css`;

    if (!document.querySelector(`link[href="${cssPath}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath;
      document.head.appendChild(link);
  }
    slide?.mount(this.#host);

    // DEVOLVER BOTONES SIEMPRE
    const handles = slide?.enter?.(this.#host, this.#animator) || {};
    this.#handles = {
      prevBtn: handles.prevBtn || this.#host.querySelector('.nav-arrow.left'),
      nextBtn: handles.nextBtn || this.#host.querySelector('.nav-arrow.right'),
      cleanup: handles.cleanup
    };

    this.#wireArrows(slide, this.#handles);
  }

  async #exitCurrent() {
    const slide = this.#slides[this.#index];
    this.#unwireArrows(this.#handles);
    if (typeof this.#handles?.cleanup === 'function') {
      this.#handles.cleanup();
    }
    slide?.exit?.(this.#host, this.#animator);
    this.#handles = null;
  }

  // Helpers declarativos
  setVisible = (el, visible) => el?.classList.toggle('is-hidden', !visible);
  on  = (el, evt, fn) => el && el.addEventListener(evt, fn);
  off = (el, evt, fn) => el && el.removeEventListener(evt, fn);

  #wireArrows(slide, handles) {
    const { prevBtn, nextBtn } = handles || {};
    this.setVisible(prevBtn, slide?.hasPrev?.() === true);
    this.setVisible(nextBtn, slide?.hasNext?.() === true);

    this._goNext = () => this.next();
    this._goPrev = () => this.prev();

    this.on(nextBtn, 'click', this._goNext);
    this.on(prevBtn, 'click', this._goPrev);
  }

  #unwireArrows(handles) {
    const { nextBtn, prevBtn } = handles || {};
    this.off(nextBtn, 'click', this._goNext);
    this.off(prevBtn, 'click', this._goPrev);
    this._goNext = this._goPrev = null;
  }

  #bindKeys() {
    const actions = {
      ArrowRight: () => this.next(),
      ArrowLeft:  () => this.prev(),
    };
    this._onKey = (e) => actions[e.key]?.();
    document.addEventListener('keydown', this._onKey);
  }

  destroy() {
    document.removeEventListener('keydown', this._onKey);
    this.#unwireArrows(this.#handles);
  }
}