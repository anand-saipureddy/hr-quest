// All user-facing strings, single source of truth.
// Rules: no exclamation marks, no banned words (streak, overdue, you missed,
// keep it up, don't break the chain), wrong answers never "Incorrect".
export const copy = {
  app: {
    name: 'HR Quest',
    greeting: 'hi Prajna',
    footnote: 'Everything stays on this laptop.',
    yoursOnly: 'all of this is yours only ↗',
  },
  nav: {
    today: (n: number) => `${n} waiting`,
    course: (n: number) => `${n} ${n === 1 ? 'lesson' : 'lessons'}`,
    skills: (n: number) => `${n} tracks`,
    jobs: (n: number) => `${n} new`,
  },
  today: {
    heading: "Whenever you're ready, there's one thing waiting.",
    purpose: "Three small spaces: learn a little, build a skill, and keep an eye on Chennai HR openings. One thing at a time — nothing here rushes you.",
    howItWorks: 'How this works',
    howCourse: 'Course — watch a short video, then a few questions about it. Stop any time.',
    howSkills: 'Skills — build the real thing first, then answer questions about what you built.',
    howJobs: 'Jobs — fresh Chennai fresher roles. Save, apply, or set one aside.',
    pickedForToday: 'Picked for today',
    openLesson: 'Open the lesson',
    somethingElse: 'Something else instead',
    freshInstall: 'Start anywhere — the course is a good door.',
    allCaughtUp: 'Nothing needs you today. Everything you did is saved.',
    storageBlocked:
      'This browser will not let the page remember anything, so what you do here disappears when you close the tab. Everything still works.',
  },
  lesson: {
    changeMyAnswer: 'Change my answer',
    notQuite: 'Not quite —',
    thatsIt: "That's it.",
    nextQuestion: 'Next question',
  },
  skills: {
    builtThis: 'I built this',
    howYouKnow: "How you'll know it works",
  },
  jobs: {
    notForMe: 'Not for me',
    putItBack: 'Put it back',
    followUp: (days: number) => `It's been ${days} days — a short follow-up is normal.`,
  },
  undo: 'Undo',
};
