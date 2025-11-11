// js/slides/EntradaSlide.js
// Slide 1 — Entrada (lee copy.entrada) — SOLID: SRP + DIP

export class EntradaSlide {
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

  mount(host){
    const c = this.#copy.entrada || {};
    const firstname = c.firstname ?? 'Reda';
    const lastname  = c.lastname  ?? 'Abdellaoui';
    const slogan    = c.slogan    ?? 'Tu marca en cada asalto.';
    const tag       = c.tag       ?? 'SPONSORSHIP DECK';

    host.innerHTML = `
      <div class="entrada">
        <!-- 👇 Fondo reutilizable -->
        <div class="entrada__bg bg--carbon"></div>

        <div class="entrada__band" aria-hidden="true"></div>

        <div class="entrada__media" aria-label="Imagen del atleta en portada">
          <img src="${this.#assets.fotoEntrada}" alt="${firstname} ${lastname} en portada" decoding="async">
        </div>

        <div class="entrada__copy">
          <div class="entrada__name">
            <span class="firstname">${firstname}</span>
            <span class="lastname">${lastname}</span>
            <p class="entrada__slogan">${slogan}</p>
            <span class="entrada__tag">${tag}</span>
          </div>
        </div>

        <div class="nav-arrows">
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
    const img = host.querySelector('.entrada__media img');
    const fn  = host.querySelector('.firstname');
    const ln  = host.querySelector('.lastname');
    const sl  = host.querySelector('.entrada__slogan');
    const tg  = host.querySelector('.entrada__tag');

    requestAnimationFrame(()=>{
      setTimeout(()=>img.classList.add('is-in'), 50);
      setTimeout(()=>fn.classList.add('is-in'), 180);
      setTimeout(()=>ln.classList.add('is-in'), 320);
      setTimeout(()=>sl.classList.add('is-in'), 460);
      setTimeout(()=>tg.classList.add('is-in'), 600);
    });

    const nextBtn = host.querySelector('.nav-arrow.right');
    return { nextBtn, prevBtn: null };
  }

  exit(){ /* noop */ }
}
