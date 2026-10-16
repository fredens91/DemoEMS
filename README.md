# DemoEMS

Copia statica del frontend di [fullStackEMS](https://github.com/fredens91/fullStackEMS):
stessa interfaccia, nessun backend. I dati sono uno snapshot del simulatore
salvato in `public/data/` e non cambiano.

- Login: utente `veil`, password `2013` (controllo solo lato browser, non è una protezione reale)
- `npm install && npm run build` → la cartella `docs/` (html/js/css + dati) è il sito da pubblicare
- `docs/` è già committata: si può pubblicare così com'è (GitHub Pages, Cloudflare Pages, Netlify, qualsiasi hosting statico)
- Anteprima locale: `npm run preview`
