// Alcance por Evento — lee TODO desde Config.copy.alcancePorEvento
// Duraciones, stagger y ease se leen de Config.timings.metrics (global)

import { Counter, cubicBezier } from '../../js/Counter.js';

export class AlcancePorEventoSlide {
  #copy; #timings; #index; #total;
  #ro = null; #counters = [];

  constructor({ copy, timings, index, total }){
    // COPY específico de la slide (una sola fuente de verdad)
    this.#copy    = copy?.alcancePorEvento ?? {};
    // TIMINGS: solo global (sin overrides)
    this.#timings = timings?.metrics ?? {};
    this.#index   = index ?? 0;
    this.#total   = total ?? 1;
  }

  hasPrev(){ return this.#index > 0; }
  hasNext(){ return this.#index < this.#total - 1; }

  mount(host){
    const texts  = this.#copy.texts  ?? {};
    const labels = this.#copy.labels ?? {};
    const values = this.#copy.values ?? {};

    // Datos del tag del Arena (fallbacks si no están en copy)
    const arena = this.#copy.arena ?? {
      name: 'Arena',
      venue: 'Santiago Martin',
      capacity: 5100
    };

    const title = texts.title ?? 'Alcance por Evento';

    const data = [
      { key: 'braveLive', label: labels.braveLive ?? 'Streaming Live – BRAVE (YouTube)',          value: values.braveLive ?? 12000 },
      { key: 'braveVOD',  label: labels.braveVOD  ?? 'Streaming VOD 30 d – BRAVE (YouTube)',      value: values.braveVOD  ?? 250000 },
      { key: 'lfaLive',   label: labels.lfaLive   ?? 'Streaming Live – LFA (UFC Fight Pass)',     value: values.lfaLive   ?? 10000 },
      { key: 'lfaVOD',    label: labels.lfaVOD    ?? 'Streaming VOD 30 d – LFA (UFC Fight Pass)', value: values.lfaVOD    ?? 70000 }
    ];

    host.innerHTML = `
      <section class="alcanceporevento" aria-label="Alcance por Evento">
        <div class="bg--carbon"></div>

        <div class="alcanceporevento__media">
          <img src="./assets/arena.jpg" alt="Arena" loading="lazy" decoding="async" class="anim-enter" />
        </div>

        <div class="alcanceporevento__content">
          <header class="alcanceporevento__header">
            <h2 class="alcanceporevento__title anim-enter">${title}</h2>
          </header>

          <div class="alcanceporevento__body">
            <section class="metrics">
              ${data.map(d => `
                <article class="metric anim-enter">
                  ${
                    d.key === 'braveLive'
                      ? `
                      <div class="metric__head">
                        <div class="metric__label">${d.label}</div>
                        <span class="metric__tag" aria-label="${arena.name} ${arena.venue} ${arena.capacity}">
                          <span class="metric__tag-title-main">${arena.name}</span>
                          <span class="metric__tag-sub">${arena.venue}</span>
                          <span class="metric__tag-value">${arena.capacity.toLocaleString('es-ES')}</span>
                        </span>
                      </div>
                      `
                      : `<div class="metric__label">${d.label}</div>`
                  }
                  <div class="vbar vbar--abs" data-key="${d.key}" data-value="${d.value}">
                    <div class="vbar__fill" style="--p:0"><em class="vbar__num">0</em></div>
                  </div>
                </article>
              `).join('')}
            </section>
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
      </section>
    `;
  }

  enter(host){
    const root = host.querySelector('.alcanceporevento');
    const content = host.querySelector('.alcanceporevento__content');

    // === parámetros de copy.settings (por-slide, SOLID sin overrides) ===
    const settings = this.#copy.settings ?? {};
    const capFracs = settings.capFracs ?? { xlg: 0.62, lg: 0.56, md: 0.50, sm: 1.00 };
    const minFrac  = settings.minFrac  ?? 0.10;
    const maxFrac  = settings.maxFrac  ?? 0.84;
    // alargar "Live" suavemente
    const weights  = settings.weights  ?? { braveLive: 1.12, lfaLive: 1.10, braveVOD: 1.00, lfaVOD: 1.00 };

    // === timings globales ===
    const E = this.#timings.ease ?? [0.22, 0.61, 0.36, 1];
    const ease = cubicBezier(...E);
    const DUR_BAR = this.#timings.barDuration ?? 1100;
    const DUR_NUM = this.#timings.counterDuration ?? 1100;
    const STAGGER = this.#timings.barStagger ?? 150;

    // sizing calc (idéntico patrón que valor-marcas)
    const AIR = 0.06, MIN_U = 6, MAX_U = 22;
    const applySizes = () => {
      const H = root.clientHeight, W = root.clientWidth;
      const targetH = H * (1 - AIR);
      let u = targetH / 92; u = Math.max(MIN_U, Math.min(MAX_U, u));
      root.style.setProperty('--u', `${u}px`);

      let capPct;
      if (W >= 1920)      capPct = capFracs.xlg;
      else if (W >= 1366) capPct = capFracs.lg;
      else if (W >= 960)  capPct = capFracs.md;
      else                capPct = capFracs.sm;

      root.style.setProperty('--cap', `${Math.round(W * capPct)}px`);
    };

    applySizes();
    this.#ro?.disconnect();
    this.#ro = new ResizeObserver(applySizes);
    this.#ro.observe(root);

    // anim enter
    host.querySelectorAll('.anim-enter').forEach((el, i) => {
      el.classList.remove('is-in');
      setTimeout(() => el.classList.add('is-in'), 90 * i);
    });

    const mediaImg = host.querySelector('.alcanceporevento__media img');
    if (mediaImg) setTimeout(() => mediaImg.classList.add('is-in'), 120);

    // counters cleanup
    this.#counters.forEach(c => c.cancel());
    this.#counters = [];

    // preparar barras
    const bars  = Array.from(host.querySelectorAll('.vbar--abs'));
    const vals  = bars.map(b => +b.dataset.value || 0);
    const maxV  = Math.max(0, ...vals);

    const fmtInt = (v) => Math.round(v).toLocaleString('es-ES');

    const toFrac = (value, maxValue) => {
      if (maxValue <= 0) return minFrac;
      const r = Math.max(0, value / maxValue);
      return Math.min(maxFrac, Math.max(minFrac, minFrac + r * (maxFrac - minFrac)));
    };

    bars.forEach((bar, idx) => {
      const val   = +bar.dataset.value || 0;
      const key   = bar.dataset.key || '';
      const fill  = bar.querySelector('.vbar__fill');
      const num   = bar.querySelector('.vbar__num');
      if (!fill || !num) return;

      const base  = toFrac(val, maxV);
      const w     = (key && weights[key] != null) ? Number(weights[key]) : 1.0;
      const frac  = Math.min(maxFrac, Math.max(minFrac, base * w));

      const cFill = new Counter();
      cFill.animateStyle(fill, '--p', '', frac, {
        duration: DUR_BAR + idx * STAGGER,
        ease
      });
      this.#counters.push(cFill);

      const cNum = new Counter();
      cNum.animateNumber(num, val, {
        duration: DUR_NUM + idx * STAGGER,
        ease,
        formatter: fmtInt,
        onStart: () => num.classList.add('is-in')
      });
      this.#counters.push(cNum);
    });

    const nextBtn = host.querySelector('.nav-arrow.right');
    const prevBtn = host.querySelector('.nav-arrow.left');
    return { nextBtn, prevBtn };
  }

  exit(){
    this.#counters.forEach(c => c.cancel());
    this.#counters = [];
    this.#ro?.disconnect();
    this.#ro = null;
  }
}
