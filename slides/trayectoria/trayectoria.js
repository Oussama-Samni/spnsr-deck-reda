// js/slides/TrayectoriaSlide.js
// Slide 3 — Trayectoria & Logros (SOLID + DRY)
// - Textos/labels/badges animados con .anim-in (y anim-enter para compat).
// - Barras y contadores desacoplados (Counter).
// - Timings/ease leídos vía DIP desde Config.timings.metrics con fallbacks.

import { Counter, cubicBezier } from '../../js/Counter.js';

/* ===== Fallbacks locales (se overridean por this.#timings) ===== */
const FALLBACK = {
  AIR: 0.06,
  MIN_U: 6,
  MAX_U: 22,
  EASE: [0.22, 0.61, 0.36, 1],
  DUR_BAR: 1100,
  DUR_NUM: 1100,
  STAGGER: 150
};

/* Caps adaptativos por ancho del slide */
const capFracFor = (W) => {
  if (W >= 1600) return 0.70;
  if (W >= 1280) return 0.64;
  if (W >= 1024) return 0.58;
  if (W >= 768)  return 0.54;
  return 0.50;
};

/* Descriptores de barras */
const METRICS = [
  {
    key: 'fights',
    barSel: '.bar--fights',
    segments: [
      { seg: '.seg--pro',  val: '.seg__value',  number: (el)=> +el.getAttribute('data-count') || 0 },
      { seg: '.seg--am',   val: '.seg__value',  number: (el)=> +el.getAttribute('data-count') || 0, delay: true }
    ],
    fraction: (segEl, barEl)=>{
      const pro = +barEl.dataset.pro || 0;
      const am  = +barEl.dataset.am  || 0;
      const tot = Math.max(1, pro + am);
      return segEl.classList.contains('seg--pro') ? pro/tot : am/tot;
    }
  },
  {
    key: 'record',
    barSel: '.bar--record',
    segments: [
      { seg: '.seg--win',  val: '.seg__value', display:(v)=>`${Math.round(v*100)}%` },
      { seg: '.seg--loss', val: '.seg__value', display:(v)=>`${Math.round(v*100)}%`, delay:true }
    ],
    fraction: (segEl, barEl)=>{
      const w = +barEl.dataset.wins   || 0;
      const l = +barEl.dataset.losses || 0;
      const base = Math.max(1, w+l);
      return segEl.classList.contains('seg--win') ? (w/base) : (l/base);
    }
  }
];

/* Helpers */
const lin = (t)=>t;
const setVars = (el, obj)=>{ for (const k in obj) el.style.setProperty(k, obj[k]); };

export class TrayectoriaSlide {
  #copy; #timings; #index; #total;
  #counters = [];
  #ro = null;

  constructor({ copy, timings, index, total }){
    this.#copy    = copy?.trayectoria ?? {};
    this.#timings = timings?.metrics ?? {};
    this.#index   = index ?? 0;
    this.#total   = total ?? 1;
  }

  hasPrev(){ return this.#index > 0; }
  hasNext(){ return this.#index < this.#total - 1; }

  mount(host){
    const { fights = {}, record = {}, finishes = {}, streak = {}, honors = {}, promociones } = this.#copy;

    const pro = fights.pro ?? 0;
    const am  = fights.amateur ?? 0;
    const totFights = pro + am;

    const wins   = record.wins   ?? 0;
    const losses = record.losses ?? 0;
    const draws  = record.draws  ?? 0;
    const nc     = record.nc     ?? 0;

    const ko  = finishes.ko  ?? 0;
    const sub = finishes.sub ?? 0;

    const streakWins = streak.wins ?? 0;

    const champ  = honors?.champ  ?? '2023/24';
    const runner = honors?.runner ?? '2022';

    const promosText = promociones ?? 'BRAVE · LFA';

    host.innerHTML = `
      <section class="trayectoria" aria-label="Trayectoria y logros">
        <div class="trayectoria__bg bg--carbon"></div>

        <!-- IMAGEN LATERAL DERECHA -->
        <div class="trayectoria__side-image"></div>

        <div class="trayectoria__content">
          <header class="trayectoria__header">
            <h2 class="trayectoria__title anim-in anim-enter">Trayectoria & Logros</h2>

            <div class="trayectoria__badges">
              <div class="badge anim-in anim-enter" data-streak="${streakWins}">
                <span class="badge__label">Racha Activa</span>
                <span class="badge__value badge__value--num">0</span>
              </div>
              <div class="badge anim-in anim-enter">
                <span class="badge__label">Récord PRO</span>
                <span class="badge__value">3-0-0</span>
              </div>
              <div class="badge anim-in anim-enter">
                <span class="badge__label">Campeón España MMA</span>
                <span class="badge__value">${champ}</span>
              </div>
              <div class="badge badge--neutral anim-in anim-enter">
                <span class="badge__label">Subcampeón España</span>
                <span class="badge__value">${runner}</span>
              </div>
            </div>
          </header>

          <!-- Combates (Promotoras en línea con el label) -->
          <section class="metric metric--combates">
            <div class="metric__head anim-in anim-enter">
              <div class="metric__label" id="combates-label">Combates</div>
              <div class="promos-badge promos-badge--inline" aria-label="Promotoras">
                <span class="promos-badge__text">Promotoras — <strong>${promosText}</strong></span>
              </div>
            </div>

            <div class="bar bar--fights anim-in anim-enter" data-pro="${pro}" data-am="${am}">
              <span class="seg seg--pro"  data-count="${pro}"><em class="seg__value">0</em></span>
              <span class="seg seg--am"   data-count="${am}"><em class="seg__value">0</em></span>
            </div>

            <div class="legend legend--with-total anim-in anim-enter">
              <span class="legend__item"><span class="dot pro"></span> Pro <strong>${pro}</strong></span>
              <span class="legend__item"><span class="dot am"></span> Amateur <strong>${am}</strong></span>
              <span class="chip chip--total">Total: <strong>${totFights}</strong></span>
            </div>
          </section>

          <!-- Victorias -->
          <section class="metric metric--victorias">
            <div class="metric__label anim-in anim-enter">Victorias</div>

            <div class="bar bar--record anim-in anim-enter"
                 data-wins="${wins}" data-losses="${losses}" data-total="${Math.max(1, wins+losses)}">
              <span class="seg seg--win"><em class="seg__value">0%</em></span>
              <span class="seg seg--loss"><em class="seg__value">0%</em></span>
            </div>

            <!-- Chips: KO / SUB / NC / Draw en la MISMA fila -->
            <div class="legend legend--chips anim-in anim-enter" data-ko="${ko}" data-sub="${sub}">
              <span class="legend__item"><span class="dot win"></span> Win</span>
              <span class="legend__item"><span class="dot loss"></span> Loss</span>
              <span class="chip chip--finish" data-kind="ko">KO: <strong class="finish-num">0</strong></span>
              <span class="chip chip--finish" data-kind="sub">SUB: <strong class="finish-num">0</strong></span>
              <span class="chip">NC: <strong>${nc}</strong></span>
              <span class="chip">Draw: <strong>${draws}</strong></span>
            </div>
          </section>
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
    const root    = host.querySelector('.trayectoria');
    const content = host.querySelector('.trayectoria__content');

    // ==== Timings/ease por DIP (con fallbacks) ====
    const AIR     = this.#timings.AIR      ?? FALLBACK.AIR;
    const MIN_U   = this.#timings.MIN_U    ?? FALLBACK.MIN_U;
    const MAX_U   = this.#timings.MAX_U    ?? FALLBACK.MAX_U;
    const EASE    = this.#timings.ease     ?? FALLBACK.EASE;
    const DUR_BAR = this.#timings.barDuration ?? FALLBACK.DUR_BAR;
    const DUR_NUM = this.#timings.counterDuration ?? FALLBACK.DUR_NUM;
    const STAGGER = this.#timings.barStagger ?? FALLBACK.STAGGER;

    const easeBar = cubicBezier(...EASE);

    // 1) Tamaño proporcional + caps adaptativos
    const applySizes = ()=>{
      const H = root.clientHeight;
      const W = root.clientWidth;
      const targetH = H * (1 - AIR);

      let u = targetH / 90;
      u = Math.max(MIN_U, Math.min(MAX_U, u));

      setVars(root, {
        '--u':     `${u}px`,
        '--cap-f': `${W * capFracFor(W)}px`,
        '--cap-r': `${W * capFracFor(W)}px`
      });

      const innerH = content.scrollHeight;
      if (innerH < targetH){
        const finalU = Math.min(MAX_U, u * (targetH / Math.max(1, innerH)));
        setVars(root, { '--u': `${finalU}px` });
      }
    };

    applySizes();
    this.#ro?.disconnect();
    this.#ro = new ResizeObserver(applySizes);
    this.#ro.observe(root);

    // 2) Entrada animada: primero textos/labels/badges/leyendas (clase .anim-in)
    const enterables = host.querySelectorAll('.anim-in, .anim-enter');
    enterables.forEach((el,i)=> {
      el.classList.remove('is-in');
      setTimeout(()=> el.classList.add('is-in'), 80 * i);
    });

    // 3) Barras + números (desacoplados; pueden re-ejecutarse al volver a la slide)
    this.#counters.forEach(c=>c.cancel());
    this.#counters = [];

    setTimeout(()=>{
      METRICS.forEach(d=>{
        const barEl = host.querySelector(d.barSel);
        if (!barEl) return;

        const capVar = d.key === 'record' ? 'var(--cap-r)' : 'var(--cap-f)';
        barEl.style.setProperty('--cap', capVar);

        d.segments.forEach((s, i)=>{
          const seg   = barEl.querySelector(s.seg);
          const value = seg?.querySelector(s.val);
          if (!seg || !value) return;

          const frac = d.fraction(seg, barEl);
          seg.style.setProperty('--p', 0);
          seg.style.setProperty('--count', 1);

          const cA = new Counter();
          const cB = new Counter();
          const delay = (s.delay ? STAGGER : 0) * (i+1);

          setTimeout(()=>{
            cA.animateStyle(seg, '--p', '', frac, { duration: DUR_BAR, ease: easeBar });

            if (d.key === 'record'){
              cB.animateNumber(value, frac, {
                duration: DUR_NUM, ease: lin,
                formatter: s.display || (v=>`${Math.round(v*100)}%`)
              });
            } else {
              const n = s.number(seg) ?? 0;
              cB.animateNumber(value, n, {
                duration: DUR_NUM, ease: lin,
                formatter: v => `${Math.round(v)}`
              });
            }
          }, delay);

          this.#counters.push(cA, cB);
        });
      });

      // KO/SUB chips
      const legend = host.querySelector('.legend--chips');
      if (legend){
        const koVal = +legend.dataset.ko || 0;
        const sbVal = +legend.dataset.sub || 0;
        const chips = legend.querySelectorAll('.chip--finish .finish-num');
        if (chips[0]) {
          const ck = new Counter();
          ck.animateNumber(chips[0], koVal, { duration: 900, ease: lin, formatter: v => `${Math.round(v)}` });
          this.#counters.push(ck);
        }
        if (chips[1]) {
          const cs = new Counter();
          cs.animateNumber(chips[1], sbVal, { duration: 900, ease: lin, formatter: v => `${Math.round(v)}` });
          this.#counters.push(cs);
        }
      }

      // Racha Activa
      const badge = host.querySelector('.badge[data-streak]');
      const valueEl = badge?.querySelector('.badge__value--num');
      if (badge && valueEl){
        const to = +badge.dataset.streak || 0;
        const c  = new Counter();
        c.animateNumber(valueEl, to, { duration: 900, ease: lin, formatter: v => `${Math.round(v)}` });
        this.#counters.push(c);
      }
    }, 500);

    const nextBtn = host.querySelector('.nav-arrow.right');
    const prevBtn = host.querySelector('.nav-arrow.left');
    return { nextBtn, prevBtn };
  }

  exit(){
    this.#counters.forEach(c=>c.cancel());
    this.#counters = [];
    this.#ro?.disconnect();
    this.#ro = null;
  }
}
