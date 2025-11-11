// js/core/Counter.js
export class Counter {
  #rafId = null;

  animateNumber(el, to, { 
    duration = 1000, 
    ease = (t)=>t, 
    formatter = (v)=>`${Math.round(v)}`,
    onStart = null  // ← NUEVO
  } = {}){
    this.cancel();
    const from = 0;
    const start = performance.now();

    // Ejecutar onStart antes de empezar
    if (typeof onStart === 'function') onStart();

    const loop = (now)=>{
      const t = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * ease(t);
      el.textContent = formatter(v);
      if (t < 1) this.#rafId = requestAnimationFrame(loop);
    };
    this.#rafId = requestAnimationFrame(loop);
  }

  animateStyle(el, prop, unit, to, { duration = 1000, ease = (t)=>t } = {}){
    this.cancel();
    const from = 0;
    const start = performance.now();
    const loop = (now)=>{
      const t = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * ease(t);
      el.style.setProperty(prop, `${v}${unit}`);
      if (t < 1) this.#rafId = requestAnimationFrame(loop);
    };
    this.#rafId = requestAnimationFrame(loop);
  }

  cancel(){
    if (this.#rafId) { 
      cancelAnimationFrame(this.#rafId); 
      this.#rafId = null; 
    }
  }
}

export const cubicBezier = (p0, p1, p2, p3) => (t)=> 3*(1-t)*(1-t)*t*p1 + 3*(1-t)*t*t*p2 + t*t*t;