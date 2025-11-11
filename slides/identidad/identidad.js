// js/slides/IdentidadSlide.js
// Slide 2 — Identidad (lee copy.identidad) — SOLID
// Scroll: solo en el panel de texto/valores cuando sea necesario (imagen fija)

export class IdentidadSlide {
  #assets; #timings; #copy; #index; #total;

  constructor({ assets, timings, copy, index, total }) {
    this.#assets = assets || {};
    this.#timings = timings || {};
    this.#copy = copy || {};
    this.#index = index ?? 0;
    this.#total = total ?? 1;
  }

  hasPrev(){ return this.#index > 0; }
  hasNext(){ return this.#index < this.#total - 1; }

  mount(host) {
    const c = this.#copy.identidad || {};
    const title = c.titleIdentidad ?? 'Quién Soy';
    const story = c.storyIdentidad ?? '';
    const valores = Array.isArray(c.valores) ? c.valores : ['Disciplina','Superación','Autenticidad'];

    host.innerHTML = `
      <div class="identidad">
        <div class="identidad__bg bg--carbon"></div>

        <div class="identidad__media">
          <img src="${this.#assets.fotoIdentidad}" alt="Retrato" decoding="async">
        </div>

        <div class="identidad__copy">
          <h2 class="identidad__title anim-in">${title}</h2>

          <!-- Panel scrolleable SOLO si hace falta -->
          <div class="identidad__panel">
            <p class="identidad__text anim-in">${story}</p>

            <div class="identidad__values">
              ${valores.map(v => `<div class="value-card anim-in"><span>${v}</span></div>`).join('')}
            </div>
          </div>
        </div>

        <div class="nav-arrows">
          <button class="nav-arrow left" aria-label="Anterior">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="nav-arrow right" aria-label="Siguiente">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  enter(host){
    const img   = host.querySelector('.identidad__media img');
    const title = host.querySelector('.identidad__title');
    const text  = host.querySelector('.identidad__text');
    const cards = host.querySelectorAll('.value-card');

    // Animaciones de entrada (imagen fija, copy con blur-down)
    requestAnimationFrame(()=>{
      setTimeout(()=>img?.classList.add('is-in'),   60);
      setTimeout(()=>title?.classList.add('is-in'), 180);
      setTimeout(()=>text?.classList.add('is-in'),  320);
      cards.forEach((c,i)=> setTimeout(()=>c.classList.add('is-in'), 480 + i*140));
    });

    const nextBtn = host.querySelector('.nav-arrow.right');
    const prevBtn = host.querySelector('.nav-arrow.left');
    return { nextBtn, prevBtn };
  }

  exit(){ /* noop */ }
}
