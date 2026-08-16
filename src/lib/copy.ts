// All user-facing strings, single source of truth.
// Rules: no exclamation marks, no banned words (streak, overdue, you missed,
// keep it up, don't break the chain), wrong answers never "Incorrect".
export const copy = {
  app: {
    name: 'HR Quest',
    greeting: 'hi Prajna',
    footnote: 'Everything stays on this laptop.',
    yoursOnly: 'all of this is yours only ↗',
    backToSkills: '← Back to skills',
    backToCourse: '← Back to the course',
    backToLesson: '← Back to the lesson',
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
    spaces: 'Three small spaces',
    thingsDone: 'Things you have done',
    privateLabel: 'Private',
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
  course: {
    shape: {
      title: 'What a lesson looks like',
      steps: [
        { t: 'Watch on Coursera', d: 'The videos live there; the questions here come from their transcripts.' },
        { t: 'A few recall questions', d: 'One on screen at a time, no timer, answers changeable.' },
        { t: 'One interview scenario', d: 'A short written answer nobody marks but you.' },
        { t: 'Flashcards, whenever', d: 'Eight cards from the same lesson, in any order.' },
      ],
    },
    nothingExpires: 'nothing here expires ✓',
    notWritten: 'Not written up yet',
  },
  skills: {
    builtThis: 'I built this',
    howYouKnow: "How you'll know it works",
    spineTitle: 'Every track, the same three steps',
    spineNote: 'Predictable on purpose — you always know what the next screen asks of you.',
    stepNotes: [
      'A roster, a prompt, a payslip — something that exists when you’re done.',
      'About the thing you just built, so the answers are already yours.',
      'The version of it an actual HR team would hand you.',
    ],
    closingLine: 'Start with whichever one sounds least boring.',
  },
  jobs: {
    notForMe: 'Not for me',
    putItBack: 'Put it back',
    roughSort: 'a rough sort, not a verdict',
    allSeven: 'All seven',
    sortingTitle: 'How the sorting works',
    sortingNote:
      'Strong, Good and Worth a look are rough groupings from the words in the posting — location, fresher wording, pay. The percentage under it is only there if you want it. "Not for me" moves a role to its own list; nothing is ever deleted.',
    followUp: (days: number) => `It's been ${days} days — a short follow-up is normal.`,
  },
  undo: 'Undo',
};
