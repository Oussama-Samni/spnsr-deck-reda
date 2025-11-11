// js/slides/PropuestaSlide.js
// Slide 6 — Propuesta de Colaboración (centrado vertical *solo* del bloque de cajas)

import { Counter, cubicBezier } from '../../js/Counter.js';

const EASE = [0.22, 0.61, 0.36, 1];
const ease = cubicBezier(...EASE);

export class PropuestaSlide {
  #copy; #index; #total;
  #counters = [];
  #ro = null;

  constructor({ copy, index, total }){
    this.#copy  = copy?.propuesta || {};
    this.#index = index ?? 0;
    this.#total = total ?? 1;
  }

  hasPrev(){ return this.#index > 0; }
  hasNext(){ return this.#index < this.#total - 1; }

  mount(host){
    const {
      title = 'Propuesta de Colaboración',
      paquetes = []
    } = this.#copy;

    host.innerHTML = `
      <div class="propuesta">
        <div class="propuesta__bg bg--carbon"></div>

        <div class="propuesta__content">
          <header class="propuesta__header">
            <h2 class="propuesta__title anim-enter">${title}</h2>
          </header>

          <div class="propuesta__spacer" aria-hidden="true"></div> <!-- spacer dinámico -->

          <div class="propuesta__paquetes">
            ${paquetes.map((p, i) => `
              <article class="paquete anim-enter ${p.popular ? 'popular' : ''} ${p.nivel?.toLowerCase?.() || ''}" style="--delay:${i * 120}ms">
                ${p.popular ? '<span class="popular-tag">POPULAR</span>' : ''}
                <div class="paquete__body">
                  <h3 class="paquete__nivel">${p.nivel || ''}</h3>
                  <ul class="paquete__beneficios">
                    ${(p.beneficios || []).map(b => `<li>${b}</li>`).join('')}
                  </ul>
                  <div class="paquete__footer">
                    ${p.alcance ? `<p class="paquete__alcance">${p.alcance}</p>` : ''}
                    ${p.precio ? `<p class="paquete__precio">${p.precio}<span class="paquete__mes">${p.mes || ''}</span></p>` : ''}
                  </div>
                </div>
              </article>
            `).join('')}
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
    const root = host.querySelector('.propuesta');

    // Asegurar scroll arriba al entrar en la slide
    root.scrollTop = 0;

    // Ajuste responsivo de --u según alto disponible
    const applySizes = () => {
      const H = root.clientHeight;
      const u = Math.max(6, Math.min(22, (H * 0.06) / 10)); // 0.6vh aprox
      root.style.setProperty('--u', `${u}px`);
    };
    applySizes();
    this.#ro = new ResizeObserver(applySizes);
    this.#ro.observe(root);

    // Animaciones de entrada escalonadas
    host.querySelectorAll('.anim-enter').forEach((el) => {
      const delay = parseInt(el.style.getPropertyValue('--delay') || '0', 10);
      setTimeout(() => el.classList.add('is-in'), delay);
    });

    // Centrado vertical PERFECTO del bloque de cajas (solo desktop)
    const recalc = () => centerPaquetes(root);
    recalc();
    window.addEventListener('resize', recalc);

    // Recalcular por si cambian alturas (fuentes, imágenes, responsive)
    const paquetes = root.querySelector('.propuesta__paquetes');
    const ro2 = new ResizeObserver(recalc);
    if (paquetes) ro2.observe(paquetes);
    setTimeout(recalc, 80);
    setTimeout(recalc, 260);

    // Limpieza de contadores por si existieran
    this.#counters.forEach(c => c.cancel?.());
    this.#counters = [];

    // Flechas de navegación (si usas SlideManager)
    const nextBtn = host.querySelector('.nav-arrow.right');
    const prevBtn = host.querySelector('.nav-arrow.left');

    return { 
      nextBtn, prevBtn,
      cleanup: () => {
        window.removeEventListener('resize', recalc);
        this.#ro?.disconnect();
        ro2.disconnect?.();
      }
    };
  }

  exit(){
    this.#counters.forEach(c => c.cancel?.());
    this.#counters = [];
    this.#ro?.disconnect();
  }
}

/* ===== helpers ===== */

/**
 * Centra el bloque .propuesta__paquetes para que su punto medio
 * coincida con la línea horizontal del 50% del contenedor visible.
 * En móvil (<800px) se desactiva (flujo natural).
 */
function centerPaquetes(root){
  const content  = root.querySelector('.propuesta__content');
  const header   = root.querySelector('.propuesta__header');
  const spacer   = root.querySelector('.propuesta__spacer');
  const paquetes = root.querySelector('.propuesta__paquetes');
  if (!content || !header || !spacer || !paquetes) return;

  // Desactivar en móvil
  const isMobile = window.matchMedia('(max-width: 800px)').matches;
  if (isMobile){
    spacer.style.height = '0px';
    return;
  }

  // Métricas internas del grid visible
  const contentH  = content.clientHeight;
  const headerH   = header.offsetHeight;
  const paquetesH = paquetes.offsetHeight;

  // Gap entre filas del grid
  const styles = getComputedStyle(content);
  const rowGap = parseFloat(styles.rowGap || '0');

  // Queremos: headerH + rowGap + spacerH + (paquetesH/2) = contentH/2
  let spacerH = (contentH / 2) - (headerH + rowGap + paquetesH / 2);

  // Topes: que no empuje las cajas fuera de la pantalla
  const maxSpacer = Math.max(0, contentH - (headerH + rowGap + paquetesH));
  spacerH = Math.max(0, Math.min(spacerH, maxSpacer));

  spacer.style.height = `${spacerH}px`;
}