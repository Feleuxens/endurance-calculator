# Special Endurance Calculator (KsA)

Estimate a runner's race times across neighbouring track distances from a single
known result, using special-endurance coefficients (*Koeffizient der speziellen
Ausdauer*) measured across elite athletes.

## 🏃 What it does

**Predict**: enter one time (e.g. 800&nbsp;m in 2:00.0) and get the estimated
  times for the adjacent distances, with a min–max band from the study's extremes.

All maths runs in pace per 100&nbsp;m, since that's the unit the coefficients act on.

## 📄 Source

The coefficients are taken from Tables 2 & 3 of the original study.

> **Original paper:** [https://mediatum.ub.tum.de/doc/1233679/1233679.pdf](https://mediatum.ub.tum.de/doc/1233679/1233679.pdf)

Values were transcribed and verified against the source. The min-max band is the
widest plausible spread from the reported extremes, not a statistical confidence
interval.

## 🚀 Project Structure

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── components
│   │   ├── Field.astro
│   │   ├── Calculator.tsx
│   │   └── PredictionChart.tsx
│   ├── layouts
│   │   └── Layout.astro
│   ├── lib
│   │   ├── coefficients.ts
│   │   ├── calc.ts
│   │   └── models.ts
│   ├── pages
│   │   └── index.astro
│   └── styles
│       └── global.css
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
