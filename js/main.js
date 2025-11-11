// core/js/main.js — Orquestador SOLID (DIP + SRP) con registro declarativo

// ---------------------------------------------------------------------
// 1. IMPORTAR DEPENDENCIAS GLOBALES
// ---------------------------------------------------------------------
import { Config } from './config.js';
import { SimpleAnimator } from './Animator.js';
import { SlideManager } from './SlideManager.js';

// ---------------------------------------------------------------------
// 2. IMPORTAR SLIDES DESDE SU CARPETA
// ---------------------------------------------------------------------
import { EntradaSlide }      from '../slides/entrada/entrada.js';
import { IndiceSlide }       from '../slides/indice/indice.js';
import { IdentidadSlide }    from '../slides/identidad/identidad.js';
import { TrayectoriaSlide }  from '../slides/trayectoria/trayectoria.js';
import { ValorMarcasSlide }  from '../slides/valormarcas/valormarcas.js';
import { AlcancePorEventoSlide } from '../slides/alcanceporevento/alcanceporevento.js';
import { PropuestaSlide }    from '../slides/propuesta/propuesta.js';
import { CierreSlide }       from '../slides/cierre/cierre.js';

// ---------------------------------------------------------------------
// 3. HOST + ANIMATOR
// ---------------------------------------------------------------------
const host = document.getElementById('slide-root');
const animator = new SimpleAnimator();

// ---------------------------------------------------------------------
// 4. REGISTRO DE SLIDES
// ---------------------------------------------------------------------
const slideRegistry = {
  entrada:      EntradaSlide,
  indice:       IndiceSlide,
  identidad:    IdentidadSlide,
  trayectoria:  TrayectoriaSlide,
  valorMarcas:  ValorMarcasSlide,
  alcanceporevento: AlcancePorEventoSlide,
  propuesta:    PropuestaSlide,
  cierre:       CierreSlide,
};

// ---------------------------------------------------------------------
// 5. CONSTRUCCIÓN DE INSTANCIAS
// ---------------------------------------------------------------------
const total = Config.slides.length;
const commonDI = { assets: Config.assets, timings: Config.timings, copy: Config.copy };

const instances = Config.slides.map((def, index) => {
  const Cls = slideRegistry[def.type];
  if (!Cls) throw new Error(`Tipo de slide desconocido: "${def.type}"`);

  const extra = def.props || {};

  if (def.type === 'indice' && !extra.items) {
    extra.items = (Config.toc || []).filter(item => 
      item.label.toLowerCase() !== 'índice'
    );
  }

  return new Cls({ ...commonDI, ...extra, index, total });
});

// ---------------------------------------------------------------------
// 6. MANAGER + NAVEGACIÓN
// ---------------------------------------------------------------------
const manager = new SlideManager({ host, slides: instances, animator });

instances.forEach(slide => {
  if (typeof slide.setNavigate === 'function') {
    slide.setNavigate((to) => manager.goTo(to));
  }
});

if (Config?.app?.title) {
  document.title = Config.app.title;
}

manager.start();