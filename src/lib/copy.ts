// All user-facing strings, single source of truth.
// Rules: no exclamation marks, no banned words (streak, overdue, you missed,
// keep it up, don't break the chain), wrong answers never "Incorrect".
export const copy = {
  app: {
    name: 'HR Quest',
    greeting: 'hi Pragna',
    takeABreak: 'Take a break',
    footnote: 'Everything stays on this laptop.',
    yoursOnly: 'all of this is yours only ↗',
  },
  breakScreen: {
    heading: 'Everything you did is saved. Close the tab whenever.',
    body: "There's no streak to break and nothing waiting to remind you tomorrow. Come back in an hour, or next week — the page will look exactly the same.",
    leftOff: 'Where you left off',
    note: 'rest counts as progress too ✿',
  },
  today: {
    heading: "Whenever you're ready, there's one thing waiting.",
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
