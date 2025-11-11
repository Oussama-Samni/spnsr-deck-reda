// slides/cierre/cierre.js — Cierre: grid 4 → 3+1 → 2+2 → 1+1+1+1 (data-driven)

export class CierreSlide {
  #index; #total; #cleanup = null; #copy;

  constructor({ index, total, copy }) {
    this.#index = index ?? 0;
    this.#total = total ?? 1;
    this.#copy  = copy?.cierre || null;
  }

  hasPrev(){ return this.#index > 0; }
  hasNext(){ return false; }

  mount(host) {
    // Botones por datos; marca uno con { wide:true } para que sea el que ocupa todo el ancho en 3 cols.
    const buttons = this.#copy?.buttons ?? [
      { label: 'WhatsApp',  href: 'https://wa.me/34662478298', kind: 'link' },
      { label: 'Email',     href: 'mailto:reda.sponsorship@gmail.com', kind: 'link' },
      { label: 'Instagram', href: 'https://www.instagram.com/reda_the_lynx/', kind: 'link' },
      { label: 'Galería',   kind: 'button', action: 'gallery', wide: true } // ← “ancha” en 3 cols
    ];

    const btnHTML = buttons.map((b, i) => {
      const wideCls = b.wide ? 'cierre__btn--wide' : '';
      const baseCls = `cierre__btn ${wideCls}`;
      if (b.kind === 'button') {
        return `<button type="button" class="${baseCls}" data-action="${b.action||''}" style="--i:${i}">${b.label}</button>`;
      }
      const target = b.href?.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${b.href}" class="${baseCls}"${target} style="--i:${i}">${b.label}</a>`;
    }).join('');

    host.innerHTML = `
      <div class="cierre">
        <div class="cierre__bg bg--carbon"></div>

        <section class="cierre__content">
          <header class="cierre__header">
            <h2 class="cierre__title anim-enter">${this.#copy?.title || '¡HABLEMOS!'}</h2>
          </header>

          <div class="cierre__main">
            <div class="cierre__btns anim-enter">
              ${btnHTML}
            </div>
          </div>

          <p class="cierre__legal anim-enter">
            ${this.#copy?.legal || '© 2025 All Rights Reserved – Reda Abdellaoui'}
          </p>
        </section>

        <!-- Popup galería -->
        <div class="galeria-popup" id="galeria" role="dialog" aria-modal="true" aria-hidden="true">
          <button class="galeria-close" aria-label="Cerrar">×</button>

          <!-- VISOR FULLSCREEN DENTRO DEL POPUP -->
          <div class="galeria-viewer" aria-hidden="true">
            <button class="gv-btn gv-prev" aria-label="Anterior">‹</button>
            <img class="galeria-viewer__img" alt="Vista ampliada" />
            <button class="gv-btn gv-next" aria-label="Siguiente">›</button>
          </div>

          <div class="galeria-grid" role="region" aria-label="Galería"></div>
        </div>

        <!-- Flecha atrás (SlideManager la cablea) -->
        <div class="nav-arrows">
          <button type="button" class="nav-arrow left" aria-label="Slide anterior">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  enter(host){
    // Animaciones
    host.querySelectorAll('.anim-enter').forEach((el, i) =>
      setTimeout(() => el.classList.add('is-in'), 120 * (i + 1))
    );

    // Galería (data-driven: copy.cierre.gallery.images o fallback ./assets/galeria/1.jpg..N.jpg)
    const popup    = host.querySelector('#galeria');
    const grid     = host.querySelector('.galeria-grid');
    const openBtn  = host.querySelector('[data-action="gallery"]');
    const closeBtn = host.querySelector('.galeria-close');

    // Visor fullscreen
    const viewer   = host.querySelector('.galeria-viewer');
    const vImg     = host.querySelector('.galeria-viewer__img');
    const vPrev    = host.querySelector('.gv-btn.gv-prev');
    const vNext    = host.querySelector('.gv-btn.gv-next');

    let sources = [];
    let idxCurrent = -1;

    if (grid) {
      grid.innerHTML = '';
      const imgs = this.#copy?.gallery?.images
        ?? Array.from({length:12}, (_,k)=>`./assets/galeria/${k+1}.jpg`);
      sources = imgs.slice();

      imgs.forEach((src, idx) => {
        const img = new Image();
        img.loading = 'lazy';
        img.src = src;
        img.alt = `Imagen ${idx+1}`;
        img.onload = () => img.classList.add('loaded');
        img.addEventListener('click', () => openViewer(idx));
        grid.appendChild(img);
      });
    }

    // Popup open/close
    const openPopup = () => {
      popup?.classList.add('open');
      popup?.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    };
    const closePopup = () => {
      closeViewer();
      popup?.classList.remove('open');
      popup?.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    };

    // Handlers nombrados para limpiar correctamente
    const backdropClick = (e) => {
      if (e.target === popup) closePopup();
    };
    const keyHandler = (e) => {
      if (e.key === 'Escape') {
        if (viewer?.classList.contains('is-open')) closeViewer();
        else closePopup();
      } else if (e.key === 'ArrowRight' && viewer?.classList.contains('is-open')) {
        next();
      } else if (e.key === 'ArrowLeft' && viewer?.classList.contains('is-open')) {
        prev();
      }
    };

    openBtn?.addEventListener('click', openPopup);
    closeBtn?.addEventListener('click', closePopup);
    popup?.addEventListener('click', backdropClick);
    document.addEventListener('keydown', keyHandler);

    // Viewer logic
    const renderViewer = () => {
      if (idxCurrent < 0 || idxCurrent >= sources.length) return;
      vImg.src = sources[idxCurrent];
    };
    const openViewer = (index) => {
      idxCurrent = index;
      renderViewer();
      viewer?.classList.add('is-open');
      popup?.classList.add('viewer-open');
      viewer?.setAttribute('aria-hidden','false');
    };
    const closeViewer = () => {
      viewer?.classList.remove('is-open');
      popup?.classList.remove('viewer-open');
      viewer?.setAttribute('aria-hidden','true');
      idxCurrent = -1;
    };
    const next = () => {
      if (!sources.length) return;
      idxCurrent = (idxCurrent + 1) % sources.length;
      renderViewer();
    };
    const prev = () => {
      if (!sources.length) return;
      idxCurrent = (idxCurrent - 1 + sources.length) % sources.length;
      renderViewer();
    };

    const viewerClick = (e) => {
      if (e.target === viewer) closeViewer(); // click en fondo del viewer
    };
    const onPrev = (e) => { e.stopPropagation(); prev(); };
    const onNext = (e) => { e.stopPropagation(); next(); };

    viewer?.addEventListener('click', viewerClick);
    vPrev?.addEventListener('click', onPrev);
    vNext?.addEventListener('click', onNext);

    // Cleanup TOTAL de listeners y estado
    this.#cleanup = () => {
      document.removeEventListener('keydown', keyHandler);
      document.body.style.overflow = '';
      openBtn?.removeEventListener('click', openPopup);
      closeBtn?.removeEventListener('click', closePopup);
      popup?.removeEventListener('click', backdropClick);
      viewer?.removeEventListener('click', viewerClick);
      vPrev?.removeEventListener('click', onPrev);
      vNext?.removeEventListener('click', onNext);
    };

    const prevBtn = host.querySelector('.nav-arrow.left');
    return { prevBtn, cleanup: this.#cleanup };
  }

  exit(){
    this.#cleanup?.();
    this.#cleanup = null;
  }
}
