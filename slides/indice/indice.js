// js/slides/IndiceSlide.js — Índice SOLID (SRP: pintar lista + emitir navegación)
export class IndiceSlide {
  #items; #index; #total; #onNavigate;

  constructor({ items = [], index = 0, total = 1, onNavigate = () => {} }){
    this.#items = items;
    this.#index = index;
    this.#total = total;
    this.#onNavigate = onNavigate;
  }

  // Permite inyectar el callback cuando ya existe el manager
  setNavigate(fn){ if (typeof fn === 'function') this.#onNavigate = fn; }

  hasPrev(){ return this.#index > 0; }
  hasNext(){ return this.#index < this.#total - 1; }

  mount(host){
    host.innerHTML = `
      <div class="idx">
        <div class="idx__bg bg--carbon"></div>

        <div class="idx__content">
          <h2 class="idx__title anim-enter">Índice</h2>

          <ul class="idx__list">
            ${this.#items.map(it => `
              <li class="idx__item anim-enter">
                <button class="idx__link" data-target="${it.target}">
                  <span class="idx__dot" aria-hidden="true"></span>
                  <span class="idx__text">${it.label}</span>
                </button>
              </li>
            `).join('')}
          </ul>
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
    host.querySelectorAll('.anim-enter').forEach((el,i)=>{
      setTimeout(()=> el.classList.add('is-in'), 60*i);
    });

    host.querySelectorAll('.idx__link').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const to = parseInt(btn.dataset.target, 10);
        this.#onNavigate?.(to);
      });
    });

    const nextBtn = host.querySelector('.nav-arrow.right');
    const prevBtn = host.querySelector('.nav-arrow.left');
    return { nextBtn, prevBtn };
  }

  exit(){ /* noop */ }
}
