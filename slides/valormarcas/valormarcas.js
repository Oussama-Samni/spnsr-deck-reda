// js/slides/ValorMarcasSlide.js
// Valor para tu Marca — imagen a la derecha + blur en móvil pequeño

import { Counter, cubicBezier } from '../../js/Counter.js';

const EASE = [0.22, 0.61, 0.36, 1];
const ease = cubicBezier(...EASE);

const AIR = 0.06;
const MIN_U = 6;
const MAX_U = 22;

export class ValorMarcasSlide {
  #assets; #copy; #index; #total;
  #ro = null;
  #counters = [];

  constructor({ assets, copy, index, total }){
    this.#assets = assets || {};
    this.#copy   = (copy && copy.valorMarcas) || {};
    this.#index  = index ?? 0;
    this.#total  = total ?? 1;
  }

  hasPrev(){ return this.#index > 0; }
  hasNext(){ return this.#index < this.#total - 1; }

  mount(host){
    const {
      title = 'Valor para tu Marca',
      subtitle = 'Alcance, comunidad y Crecimiento',
      alcanceMensual = 0,
      engagement = 0,
      crecimientoMensual = 0,
      followers = 11000,
      audiencia = {}
    } = this.#copy;

    const male        = audiencia.male   ?? 0;
    const female      = audiencia.female ?? 0;
    const edad        = audiencia.edadTop ?? '18–24';
    const pais        = audiencia.paisTop ?? 'España';
    const maleColor   = audiencia?.colors?.male   || 'var(--color-male, #0066ff)';
    const femaleColor = audiencia?.colors?.female || 'var(--color-female, #ff4d4d)';

    const growthPct = followers > 0 ? (crecimientoMensual / followers) * 100 : 0;

    host.innerHTML = `
      <div class="valorm">
        <div class="bg--carbon"></div>

        <div class="valorm__media">
          <img src="${this.#assets.valorPortrait}" alt="Móvil para marcas" decoding="async" class="anim-enter" />
        </div>

        <div class="valorm__content scroll-reserved">
          <header class="valorm__header">
            <h2 class="valorm__title anim-enter">${title}</h2>
            <p class="valorm__subtitle anim-enter">${subtitle}</p>
          </header>

          <div class="valorm__body">
            <section class="metrics-left">
              <!-- Alcance mensual -->
              <article class="vmetric anim-enter">
                <div class="vmetric__label">Alcance mensual RRSS</div>
                <div class="vbar vbar--abs" data-value="${alcanceMensual}">
                  <div class="vbar__fill" style="--p:0"><em class="vbar__num">0</em></div>
                </div>
              </article>

              <!-- Engagement -->
              <article class="vmetric anim-enter">
                <div class="vmetric__label">Interacciones / mes</div>
                <div class="vbar vbar--abs" data-value="${engagement}">
                  <div class="vbar__fill" style="--p:0"><em class="vbar__num">0</em></div>
                </div>
              </article>

              <!-- Audiencia por género -->
              <article class="vmetric anim-enter">
                <div class="vmetric__label">Audiencia por género en IG</div>
                <div class="vbar-split" data-m="${male}" data-f="${female}">
                  <div class="vbar-split__seg vbar-split__seg--m" style="--p:0; --seg-color:${maleColor}">
                    <em class="vbar__num">0%</em>
                  </div>
                  <div class="vbar-split__seg vbar-split__seg--f" style="--p:0; --seg-color:${femaleColor}">
                    <em class="vbar__num">0%</em>
                  </div>
                </div>
                <div class="vlegend">
                  <span class="vlegend__item"><i class="vlegend__dot" style="--dot-color:${maleColor}"></i>Hombres</span>
                  <span class="vlegend__item"><i class="vlegend__dot" style="--dot-color:${femaleColor}"></i>Mujeres</span>
                </div>

                <div class="valorm__chips">
                  <span class="vchip">Crecimiento: <strong data-growth="${growthPct.toFixed(1)}">${growthPct.toFixed(1)}%</strong></span>
                  <span class="vchip">Edad: <strong>${edad}</strong></span>
                  <span class="vchip">País: <strong>${pais}</strong></span>
                </div>
              </article>
            </section>
          </div>
        </div>

        <!-- FLECHAS FUERA DEL CONTENEDOR -->
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
    const root = host.querySelector('.valorm');

    const applySizes = () => {
      const H = root.clientHeight;
      const W = root.clientWidth;

      const targetH = H * (1 - AIR);
      let u = targetH / 92;
      u = Math.max(MIN_U, Math.min(MAX_U, u));
      root.style.setProperty('--u', `${u}px`);

      let capPct;
      if (W >= 1920)      capPct = 0.54;
      else if (W >= 1366) capPct = 0.48;
      else if (W >= 960)  capPct = 0.44;
      else                capPct = 1.00;

      root.style.setProperty('--cap', `${Math.round(W * capPct)}px`);
    };

    applySizes();
    this.#ro?.disconnect();
    this.#ro = new ResizeObserver(applySizes);
    this.#ro.observe(root);

    host.querySelectorAll('.anim-enter').forEach((el, i) => {
      el.classList.remove('is-in');
      setTimeout(() => el.classList.add('is-in'), 90 * i);
    });

    const mediaImg = host.querySelector('.valorm__media img');
    if (mediaImg) {
      setTimeout(() => mediaImg.classList.add('is-in'), 160);
    }

    this.#counters.forEach(c => c.cancel());
    this.#counters = [];

    const fmtInt = (v) => Math.round(v).toLocaleString('es-ES');
    const fmtPct = (v) => {
      const n = typeof v === 'number' ? v : +v || 0;
      return n.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
    };

    // BARRAS ABSOLUTAS
    host.querySelectorAll('.vbar--abs').forEach((bar, idx) => {
      const val = +bar.dataset.value || 0;
      const fill = bar.querySelector('.vbar__fill');
      const num = bar.querySelector('.vbar__num');
      if (!fill || !num) return;

      const cw = new Counter();
      cw.animateStyle(fill, '--p', '', 1, { duration: 1400 + idx * 180, ease });
      this.#counters.push(cw);

      const cn = new Counter();
      cn.animateNumber(num, val, { 
        duration: 1600 + idx * 180, 
        ease, 
        formatter: fmtInt,
        onStart: () => num.classList.add('is-in')
      });
      this.#counters.push(cn);
    });

    // BARRA SPLIT
    const split = host.querySelector('.vbar-split');
    if (split) {
      const m = +split.dataset.m || 0;
      const f = +split.dataset.f || 0;
      const tot = Math.max(1, m + f);
      const pm = m / tot, pf = f / tot;

      const segM = split.querySelector('.vbar-split__seg--m');
      const segF = split.querySelector('.vbar-split__seg--f');
      const numM = segM?.querySelector('.vbar__num');
      const numF = segF?.querySelector('.vbar__num');

      if (segM && segF && numM && numF) {
        const cm = new Counter();
        cm.animateStyle(segM, '--p', '', pm, { duration: 1400, ease });
        this.#counters.push(cm);

        const cf = new Counter();
        setTimeout(() => cf.animateStyle(segF, '--p', '', pf, { duration: 1400, ease }), 200);
        this.#counters.push(cf);

        const cnM = new Counter();
        cnM.animateNumber(numM, m, { 
          duration: 1600, 
          ease, 
          formatter: fmtPct,
          onStart: () => numM.classList.add('is-in')
        });
        this.#counters.push(cnM);

        const cnF = new Counter();
        cnF.animateNumber(numF, f, { 
          duration: 1600, 
          ease, 
          formatter: fmtPct,
          onStart: () => numF.classList.add('is-in')
        });
        this.#counters.push(cnF);
      }
    }

    // FLECHAS: DEVOLVER CORRECTAMENTE
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