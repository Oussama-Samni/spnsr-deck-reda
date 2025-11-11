// js/core/BaseSlide.js — clase base opcional para slides (helpers comunes)
export class BaseSlide {
  constructor(meta = {}) {
    this.meta = meta; // { key, label } opcional
  }

  mount(/* host */) { /* to be implemented by subclass */ }
  enter(/* host, animator */) { /* to be implemented by subclass */ }
  exit(/* host, animator */) { /* optional */ }

  hasPrev(){ return this.meta?.index > 0; }
  hasNext(){ return this.meta?.index < (this.meta?.total ?? 1) - 1; }

  // Helpers utilitarios no intrusivos
  qs(root, sel){ return root?.querySelector(sel) || null; }
  qsa(root, sel){ return root?.querySelectorAll(sel) || []; }
  addIn(el, delay=0){ if(!el) return; setTimeout(()=> el.classList.add('is-in'), delay); }
}
