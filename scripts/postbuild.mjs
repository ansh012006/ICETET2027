import { readFileSync, writeFileSync } from 'node:fs';
// ponytail: sync copy, parallel not needed for 7 small files; add async if page count grows large.
const base = readFileSync('dist/index.html', 'utf8');
// ponytail: distinct titles + descriptions so Google treats pages as distinct.
const TITLES = {
  about: 'About ICETET-2027 | Conference, SRMS CET and Departments',
  'call-for-papers': 'Call for Papers | ICETET-2027',
  'important-dates': 'Important Dates | ICETET-2027',
  committee: 'Committee | ICETET-2027',
  registration: 'Registration | ICETET-2027',
  contact: 'Contact ICETET-2027 | Venue, Email and Enquiries',
};
const DESCRIPTIONS = {
  about: 'About ICETET-2027 at SRMS CET Bareilly: international conference on emerging engineering and technology, organizers and venue.',
  'call-for-papers': 'ICETET-2027 call for papers: submit original engineering research, tracks, guidelines and deadlines.',
  'important-dates': 'ICETET-2027 dates: paper deadline 15 Dec 2026, acceptance 1 Jan 2027, conference 2-3 Apr 2027 at SRMS CET.',
  committee: 'ICETET-2027 committee: patrons, chairs and organizers from SRMS CET Bareilly, HBTU Kanpur and Jamia Millia Islamia.',
  registration: 'ICETET-2027 registration: fees and deadlines for 2-3 Apr 2027 at SRMS CET Bareilly.',
  contact: 'Contact ICETET-2027: SRMS CET Bareilly venue, email and enquiry details.',
};
const BASE_DESC =
  'ICETET-2027 brings together researchers, engineers, educators, students, and technology leaders to explore emerging engineering and technology.';
for (const f of ['404', 'about', 'call-for-papers', 'committee', 'contact', 'important-dates', 'registration']) {
  const url = `https://www.icetet2027.in/${f === '404' ? '404' : f}`;
  let html = base.replaceAll('https://www.icetet2027.in/"', `${url}"`);
  if (TITLES[f]) html = html.replace(/<title>.*?<\/title>/, `<title>${TITLES[f]}</title>`);
  if (DESCRIPTIONS[f]) html = html.replaceAll(BASE_DESC, DESCRIPTIONS[f]);
  if (f === '404') html = html.replace('index, follow', 'noindex, follow');
  writeFileSync(`dist/${f}.html`, html);
}
