MMA Sponsorship Deck — Reda Abdellaoui

Interactive, data-driven sponsorship deck for MMA athlete Reda Abdellaoui.
Built with vanilla JS + CSS following SOLID principles: modular slides, animated counters/bars, reusable carbon background, and a fullscreen gallery. Fully responsive and deployable on GitHub Pages (with custom domain).

✨ Features

Modular slides (Entrada · Índice · Identidad · Trayectoria & Logros · Valor para tu Marca · Alcance por Evento · Propuesta · Cierre)

Data-driven metrics (counters, absolute/split bars) using a tiny Counter animator

Single source of truth via js/config.js (copy, timings, assets, slide order)

Reusable background theme (.bg--carbon) from css/utils.css

Media overlays per slide (e.g., arena image on “Alcance por Evento”)

Fullscreen Gallery modal with keyboard/ESC support

Responsive without layout shift; careful scroll handling

Zero framework: Plain HTML/CSS/JS, lightweight, fast

🗂 Project Structure
.
├── assets/
│   ├── arena.jpg
│   ├── side_barre.png
│   ├── galeria/                # gallery images (1.jpg, 2.jpg, …)
│   └── ...                     # other images (logos, portraits…)
├── css/
│   ├── base.css
│   ├── theme.css
│   ├── utils.css               # global reusable components (bg--carbon, etc.)
│   └── slides/                 # per-slide CSS (e.g., slide-trayectoria.css)
├── js/
│   ├── Animator.js             # (if used) generic animator tokens/hooks
│   ├── Counter.js              # number & style animator (ease, duration)
│   ├── BaseSlide.js
│   ├── SlideManager.js
│   ├── registry.js
│   ├── main.js
│   └── config.js               # ← single source of truth (copy/timings/assets/slides)
└── slides/
    ├── entrada/
    ├── indice/
    ├── identidad/
    ├── trayectoria/
    ├── valorMarcas/
    ├── alcanceporevento/
    ├── propuesta/
    └── cierre/



🧩 Key Components

Counter.js
Animates numbers and CSS custom properties. Used for growing bars (--p) and counting integers/percents.

Reusable background (.bg--carbon)
Defined in css/utils.css, applied in slides via:

<div class="bg--carbon"></div>


Gallery (Cierre slide)

Grid thumbnails from assets/galeria/.

Fullscreen viewer with click, ESC, and ←/→ keys.

Images are fully data-driven via Config.copy.cierre.gallery.images.

📱 Mobile & Accessibility

Slides handle scrollbar-gutter and avoid layout jumps.

“Trayectoria & Logros”: On narrow screens (e.g., iPhone 14 Pro Max), the side image moves behind the text with a black overlay for readability.

Buttons are large, with contrast and focusable elements.

Gallery modal uses role="dialog", aria-modal, and closes on ESC.

🚀 Deploy
GitHub Pages

Push to main.

Settings → Pages

Source: Deploy from a branch

Branch: main / root

Your site will be live at:
https://<user>.github.io/<repo>/

Custom Domain

In Settings → Pages, add your domain (e.g., example.com).

Create a CNAME DNS record pointing to youruser.github.io.

(Optional) Add a CNAME file at repo root with your domain:

example.com


Enable Enforce HTTPS.

🧪 Troubleshooting

Gallery button doesn’t open
Ensure the button exists in Config.copy.cierre.buttons with { kind:'button', action:'gallery' }. Confirm images exist in assets/galeria/ and paths match.

Numbers don’t animate
Check that the DOM contains .seg__value / .vbar__num and the slide’s JS calls Counter.animateNumber with a visible element.

Bars look too short on desktop
Adjust capFracs in copy.alcancePorEvento.settings (e.g., increase xlg, lg) or bump maxFrac.

Image overlapping text on mobile
Verify the mobile media queries in the slide CSS (e.g., @media (max-width: 430px) in trayectoria) and ensure the image’s z-index is below content with a dark overlay.

🛣 Roadmap

Keyboard navigation for entire deck

PDF/PNG export per slide

Analytics (per button/slide views)

Light theme token set

📄 License

Copyright © 2025 Reda Abdellaoui
Code is provided for demo and portfolio purposes. Contact for commercial licensing or brand-specific adaptations.

🙌 Credits

Design & development by Oussama / Reda.
No frameworks were harmed in the making of this deck.