// js/config.js
// Configuración centralizada (DIP) para todo el deck.
// Las slides leen todo desde aquí → 100% SOLID

export const Config = {
  app: {
    title: 'MMA Sponsorship Deck',
  },

  // Rutas de recursos (assets centralizados)
  assets: {
    fotoEntrada:    './assets/foto_entrada.png',
    fotoIdentidad:  './assets/foto_identidad.png',
    valorPortrait:  './assets/mobile-sponsor.png',
  },

  // Tiempos y curvas de animación globales
  timings: {
    imgIn: 1100,
    txtStep: [200, 400, 600, 780],
    metrics: {
      barDuration: 1100,
      barStagger: 150,
      counterDuration: 1100,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },

  // Tabla de contenidos (orden de navegación)
  // → Usado por Slide de Índice automáticamente
  toc: [
    { label: 'Portada', target: 0 },
    { label: 'Quién Soy', target: 2 },
    { label: 'Trayectoria & Logros', target: 3 },
    { label: 'Valor para tu Marca', target: 4 },
    {label:  'Alcance por evento', target: 5 },
    { label: 'Propuesta de Colaboración', target: 6 },
    { label: '¡Hablemos!', target: 7 },
  ],

  // COPYS — Única fuente de textos y datos
  copy: {
    entrada: {
      firstname: 'Reda',
      lastname: 'Abdellaoui',
      slogan: 'Tu marca en cada asalto.',
      tag: 'SPONSORSHIP DECK',
    },

    identidad: {
      titleIdentidad: 'Quién Soy',
      storyIdentidad:
        'Desde pequeño, el deporte fue mi refugio y mi escuela de vida. ' +
        'Practiqué distintas disciplinas hasta que encontré en las artes marciales mixtas ' +
        'una pasión que me transformó por completo. Mi historia no ha sido fácil, ' +
        'pero aprendí que la disciplina y la superación constante pueden cambiar cualquier destino. ' +
        'Hoy, el MMA no es solo un deporte para mí, es un camino de crecimiento, mentalidad y propósito.',
      valores: ['Disciplina', 'Superación', 'Autenticidad'],
    },

    trayectoria: {
      fights:   { pro: 3, amateur: 24 },
      record:   { wins: 19, losses: 5, draws: 1, nc: 1 },
      finishes: { ko: 2, sub: 1 },
      streak:   { wins: 3 },
      accolades: [
        { year: 2023, title: 'Bicampeón de España MMA' },
        { year: 2024, title: 'Bicampeón de España MMA' },
      ],
    },

    // SLIDE: Valor para Marcas
    valorMarcas: {
      title: 'Valor para tu Marca',
      subtitle: 'Alcance, comunidad y crecimiento',

      alcanceMensual: 12894,
      engagement: 788,
      crecimientoMensual: 937,
      followers: 11000,
      reachMax: 20000,

      audiencia: {
        male: 86,
        female: 14,
        edadTop: '18-24',
        paisTop: 'España',
      },
      colors: {
        male: 'var(--color-male)',
        female: 'var(--color-female)'
      }
    },

    alcancePorEvento: {
    texts: {
      title: 'Alcance por Evento'
    },
    // si algún día quieres labels desde copy:
    labels: {
      braveLive: 'Streaming Live – BRAVE (YouTube)',
      braveVOD:  'Reproducciones – BRAVE (YouTube)',
      lfaLive:   'Streaming Live – LFA en UFC Fight Pass',
      lfaVOD:    'Reproducciones – LFA en UFC Fight Pass'
    },
    // valores por defecto (puedes moverlos aquí si no quieres hardcode en la slide)
    values: {
      braveLive: 12000,
      braveVOD:  250000,
      lfaLive:   10000,
      lfaVOD:    70000
    },

    arena: {
        name: 'Público en Arena',
        venue: 'Santiago Martin', // tal cual lo quieres escribir
        capacity: 5100
      },

    settings: {
      capFracs: { xlg: 0.70, 
        lg: 0.64, 
        md: 0.58, 
        sm: 1.00 },

      minFrac: 0.10,
      maxFrac: 0.84,
      weights: { braveLive: 1.12, 
        lfaLive: 1.10, 
        braveVOD: 1.00, 
        lfaVOD: 1.00 }
    },

  },

    // SLIDE: Propuesta de Colaboración
    propuesta: {
      title: 'Propuesta de Colaboración',
      paquetes: [
        {
          nivel: 'BRONCE',
          precio: '249€',
          mes: '/mes',
          alcance: '150.000 cuentas alcanzadas',
          beneficios: [
            '2 publicaciones/mes',
            'Mención en stories x2/semana',
            'Tag en 1 Reel de entreno/semana'
          ]
        },
        {
          nivel: 'PLATA',
          precio: '599€',
          mes: '/mes',
          alcance: '400.000 cuentas alcanzadas',
          beneficios: [
            'Todo BRONCE +',
            '1 Reel dedicado/mes',
            '1 Logo en ropa de combate',
            'Invitación a 1 evento'
          ],
          popular: true
        },
        {
          nivel: 'ORO',
          precio: '1.199€',
          mes: '/mes',
          alcance: '1M+ cuentas alcanzadas',
          beneficios: [
            'Todo PLATA +',
            'Logo en ropa de entrenamiento',
            'Contenido behind the scenes',
            'Invitación a 3 eventos'
          ]
        },
        {
          nivel: 'FLEXIBLE',
          precio: '',
          alcance: '',
          beneficios: [
            'Diseñamos el paquete juntos',
            'Según objetivos de marca',
            'Propuesta en 24h'
          ]
        }
      ]
    }
  },

  // Declaración de slides → Añadir una slide = añadir una línea
  slides: [
    { type: 'entrada' },

    // Índice usa Config.toc automáticamente → NO DUPLICAR
    { type: 'indice' },

    { type: 'identidad' },
    { type: 'trayectoria' },
    { type: 'valorMarcas' },
    { type: 'alcanceporevento' },
    { type: 'propuesta', props: 'propuesta' },  // ← Usa copy.propuesta
    { type: 'cierre' },
  ],

  // NUEVO: Configuración responsive global (usado por base.css)
  responsive: {
    breakpoints: {
      desktop: 1025,
      tablet: 481,
      mobile: 480
    },
    canvas: {
      mobileFull: true, // Activa fullscreen en móvil
      noRadiusMobile: true // Sin bordes en móvil
    }
}
};

