// core/js/registry.js — Registro completo (Factory + OCP)

/**
 * Registro de slides: tipo → factory
 * OCP: añadir slide = 1 línea
 * DIP: recibe dependencias
 * Rutas desde core/js/ → ../slides/tipo/tipo.js
 */

import { EntradaSlide }   from '../slides/entrada/entrada.js';
import { IndiceSlide }    from '../slides/indice/indice.js';
import { IdentidadSlide } from '../slides/identidad/identidad.js';
import { TrayectoriaSlide } from '../slides/trayectoria/trayectoria.js';
import { ValorMarcasSlide } from '../slides/valormarcas/valormarcas.js';
import { AlcancePorEventoSlide } from '../slides/alcanceporevento/alcanceporevento.js';
import { PropuestaSlide } from '../slides/propuesta/propuesta.js';
import { CierreSlide } from '../slides/cierre/cierre.js';

// Factory pattern: cada tipo recibe deps y devuelve instancia
export const slideRegistry = {
  entrada:     (deps) => new EntradaSlide(deps),
  indice:      (deps) => new IndiceSlide(deps),
  identidad:   (deps) => new IdentidadSlide(deps),
  trayectoria: (deps) => new TrayectoriaSlide(deps),
  valorMarcas: (deps) => new ValorMarcasSlide(deps),
  alcanceporevento: (deps) => new AlcancePorEventoSlide(deps),
  propuesta:   (deps) => new PropuestaSlide(deps),
  cierre:      (deps) => new CierreSlide(deps),
};