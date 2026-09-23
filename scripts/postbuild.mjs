import { copyFileSync } from 'node:fs';
// ponytail: sync copy, parallel not needed for 7 small files; add async if page count grows large.
for (const f of ['404', 'about', 'call-for-papers', 'committee', 'contact', 'important-dates', 'registration'])
  copyFileSync('dist/index.html', `dist/${f}.html`);
