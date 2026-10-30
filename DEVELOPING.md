# Developing stay add.

Notes for working on the site: the folder layout, what every page needs, how to add lessons
and subjects, the lesson form and the design system. For an overview, see [README.md](README.md).

Plain HTML / CSS / JS, no build step: open `index.html`, or serve the folder:

```
python3 -m http.server 5174
```

URL options on any page: `?theme=dark` / `?theme=light` forces a theme; `?still` renders
figures without animation (handy for screenshots).

## Folders

```
stay add./
├── index.html               STEM home: Fig. 0 instrument, subject cards (from the catalog), how a topic works
├── assets/                  shared by every page of every subject
│   ├── css/
│   │   ├── base.css         design tokens (light + dark), colour roles for every subject,
│   │   │                    nav, buttons, status, sliders, figures, quiz, footer
│   │   ├── menu.css         the slide-in menu (Home row + subjects)
│   │   ├── lesson.css       the standard lesson form, for any subject
│   │   └── landing.css      the STEM home only
│   └── js/
│       ├── catalog.js       subjects → topics → lessons, plus each subject's home and nav links
│       ├── core.js          header (adapts to the subject), footer, theme, search across subjects,
│       │                    subject cards, topic lists, progress, reveals, quizzes
│       ├── menu.js          slide-in menu (GSAP) — Home row, then the subjects
│       ├── fx.js            eased wheel scrolling (every page) and lab sounds
│       ├── lesson.js        the standard lesson form: one topic at a time, step rail, chains
│       └── landing.js       the STEM home only: facts, subject cards, Fig. 0
├── chemistry/
│   ├── index.html           Chemistry home: hero instrument, powers-of-ten, topics, syllabus map
│   ├── lessons/
│   │   ├── electrolysis.html      standard form: molten · solutions · copper & plating
│   │   ├── naming-organic.html    standard form: main chain · side chains · practice · esters
│   │   └── collision-theory.html  older lab-first lesson
│   ├── css/  home.css · lab.css (collision lab)
│   └── js/   home.js · electrolysis.js · naming-organic.js · collision-theory.js
├── physics/
│   ├── index.html           Physics home: projectile instrument, scenes, topics, command words, daily six
│   ├── labs/refraction.html
│   ├── css/  home.css · lab.css
│   └── js/   home.js · projectile.js · field.js · refraction.js · quiz-data.js
└── biology/
    ├── index.html           Biology home: Fig. 1 enzyme activity, 21 topics in five strands, method
    ├── lessons/
    │   ├── enzymes.html       lock and key · temperature · pH
    │   ├── reproduction.html  16.1–16.6: asexual · sexual · plants · humans · sex hormones · STIs
    │   └── inheritance.html   17.1–17.4: genes · mitosis · meiosis · monohybrid crosses
    ├── css/  home.css · lab.css (all Biology figures, shared by home and lessons)
    └── js/   enzyme.js (the model, shared) · home.js · enzymes.js · reproduction.js · inheritance.js
```

Rule of thumb: anything two subjects use goes in `assets/`; anything only one subject uses
stays in that subject's `css/` and `js/`. One CSS and one JS file per kind of page, not per widget.

## Every page

```html
<body data-root="../../" data-subject="chemistry" data-page="lesson" data-lesson="electrolysis">
  <header data-site-header></header>   <!-- filled by core.js -->
  …
  <footer data-site-footer></footer>
```

- `data-root` — the path back to the site root (`""`, `"../"` or `"../../"`).
- `data-subject` — which subject’s nav and logo to show; leave it off on the STEM home.
- `data-lesson` — marks the lesson as opened (progress) and highlights its nav link.
- Load, in order: GSAP (CDN), `assets/js/catalog.js`, `menu.js`, `core.js`, `fx.js`, then the page’s own script.
- Theme: one saved choice for the whole site (`localStorage["stayadd-theme"]`), applied by a
  one-line script in each page’s `<head>`.

## Adding things

**A lesson.** Add it to the right topic in `assets/js/catalog.js` with `status: "live"` and an
`href` from the root. It then appears in search, the subject menu’s feature card, the STEM home
card and the subject’s topic list.

**A subject** (e.g. Mathematics). Add an entry to `catalog.subjects` (`id`, `name`, `syllabus`, `home`,
`hint`, `nav`, `topics`), then a folder `maths/` with `index.html`, `css/` and `js/`. It shows up
in the Menu and on the STEM home by itself. Put any new colour roles in `assets/css/base.css`.

## The standard lesson form

New lessons follow the simple IGCSE Econ Lab form, in any subject. Copy
`chemistry/lessons/naming-organic.html`, link `assets/css/lesson.css`, and load your lab script
followed by `assets/js/lesson.js`. Each `.lab[data-lab]` should define `lab.applyState(state)` so the
Interpret chains can drive it. The parts:

- a short topic list on the left (`.tabs a[href="#key"]`); one `<section class="topic" data-key>`
  per topic, shown one at a time, with Previous / Next filled in automatically;
- each topic: a header band (`.t-head`: eyebrow, serif title with one italic word, lede, a small
  `svg.t-art` drawing), then three steps on one rail —
  **1 Understand** (`.notes` with two `.note` columns and a `.formula` line),
  **2 Experiment** (one `.lab`: figure, Controls / Results in the dock, “What just happened”),
  **3 Interpret** (`.chain` buttons with `data-set` that load the lab, and one `.tip`).
- not every topic needs a lab: step 2 can be **Look closely**, one `figure.plate` (a drawing, optionally
  a `.plate-table`), and the chains then become plain `<p class="chain">` lines to remember.
- long subtopics (Biology 16–17): a `.toc` of `data-goto` buttons in the header band; Understand holds
  numbered `.sec` sections (the sections, then summary and key terms, with `.sec-table`,
  `.practical`, `.punnett`, `dl.terms`); Interpret ends with a `.checklist[data-check]` remembered on the device.

## Design system

Editorial layout × scientific instrument, shared by every subject.

- **Type:** Newsreader for headlines (one italic accent word), Inter for interface text,
  IBM Plex Mono for every number, axis and label.
- **Colour:** charcoal and warm off-white carry the page. Accents are roles in `base.css`:
  chemistry `--c-a`, `--c-b`, `--c-energy`, `--c-cation`, `--c-anion`, `--c-electron`, the four
  factors; physics `--c-mech`, `--c-ray`, `--c-waves`, `--c-vx`, `--c-vy`, the six topics; biology `--c-bio`,
  `--c-enzyme`, `--c-substrate`, `--c-product`, `--c-denat`, `--c-ph`.
- **Figures:** SVGs take the class `fig` and the shared parts `ax`, `tk`, `gl`, `guide`, `ser`.
  Canvas drawings use flat shapes in the role colours — no gradients, glow or glass.
- **Motion** stays inside framed figures and carries information. Wheel scrolling eases 10% of
  the remaining distance per frame and lands when within half a pixel
  (`StayAdd.smoothScroll.to(y)` / `.jump(y)`).
