// A tiny DOM CustomEvent bridge so distant components (Hero's "View Resume"
// button) can open the resume-preview modal that lives in the Resume
// section, without introducing a global state library for one interaction.
export const OPEN_RESUME_VIEWER_EVENT = 'open-resume-viewer'

// The resume preview is a real <iframe> (the PDF renders in the browser's
// own viewer, a separate document the page's cursor-hiding trick can never
// reach). Rather than show a mismatched custom cursor floating near/over a
// native one, Resume.tsx broadcasts open/close here so CustomCursor can
// just step aside while it's up.
export const RESUME_VIEWER_STATE_EVENT = 'resume-viewer-state'
