# Resume JD Match Lint
Live page: https://aamirtechs.github.io/resume-jd-match-lint/

Paste a resume and a job description and see, locally and transparently, which required keywords and sections are missing. No subscription, no upload of personal data, and no single opaque score. Built for jobseekers, students and career changers.

## Features
- Paste text or upload PDF, DOCX or TXT parsed locally with pdf.js and mammoth
- Job description keyword extraction using frequency plus a built-in skills dictionary
- Found and missing keyword lists with normalisation for plurals and punctuation
- Parseability checks for sections, contact details, dates, quantified bullets and length
- Score breakdown by category with a downloadable Markdown report, never a single opaque number

## How it works
Paste resume and job description text, or upload a PDF, DOCX or TXT resume parsed locally, then run the lint to get found and missing keywords, parseability checks and a category score breakdown you can download as Markdown. It runs entirely in the browser.

## Privacy
Runs 100% in your browser. Your files never leave this device, nothing is uploaded, and there is no tracking.

## Development
Core logic lives in `src/logic.js` and is shared by the page and the tests. Run the tests with `npm test`.

## License
MIT, Copyright 2026 Amir Hussain.
