import SimpleMarkdown from 'simple-markdown'
import lodash from 'lodash'

// custom SimpleMDE configuration designed for Bio2Game
const rules = {
  heading: SimpleMarkdown.defaultRules.heading,
  nptable: SimpleMarkdown.defaultRules.nptable,
  hr: SimpleMarkdown.defaultRules.hr,
  strong: SimpleMarkdown.defaultRules.strong,
  em: SimpleMarkdown.defaultRules.em,
  blockQuote: SimpleMarkdown.defaultRules.blockQuote,
  list: SimpleMarkdown.defaultRules.list,
  table: SimpleMarkdown.defaultRules.table,
  tableSeparator: SimpleMarkdown.defaultRules.tableSeparator,
  newline: SimpleMarkdown.defaultRules.newline,
  paragraph: SimpleMarkdown.defaultRules.paragraph,
  escape: SimpleMarkdown.defaultRules.escape,
  autolink: SimpleMarkdown.defaultRules.autolink,
  url: SimpleMarkdown.defaultRules.url,
  link: SimpleMarkdown.defaultRules.link,
  image: SimpleMarkdown.defaultRules.image,
  u: SimpleMarkdown.defaultRules.u,
  br: SimpleMarkdown.defaultRules.br,
  text: SimpleMarkdown.defaultRules.text,
}

const parserFor = rules => {
  const parser = SimpleMarkdown.parserFor(rules)
  const htmlOutput = SimpleMarkdown.outputFor(rules, 'html')
  return function (input = '') {
    return htmlOutput(parser(input + '\n\n', { inline: false }))
  }
}

const formationRules = (quizzes, fake) =>
  lodash.extend({}, rules, {
    quiz: {
      order: SimpleMarkdown.defaultRules.text.order,
      match: SimpleMarkdown.inlineRegex(/^(@)?(\$)?{{\s*(\d+)?\s*}}/),
      parse(capture) {
        return {
          quiz: quizzes.find(q => q.id === Number(capture[3])) || 'deleted',
          exp: !capture[1],
          next: !!capture[2],
        }
      },
      html({ quiz, exp, next }) {
        if (quiz === 'deleted') {
          return '<p class="deleted-quiz">Quiz Supprimé</p>'
        }
        if (fake) {
          return `<div class="quiz-sample">${
            !next
              ? `Quiz intégré "${quiz.label}"`
              : `Quiz d'approfondissement "${quiz.label}"`
          }</div>`
        }
        return !next
          ? `<quiz-interface class="quiz-iframe" :id="${quiz.id}" :explications="${exp}"></quiz-interface><br/>`
          : `<quiz-next :id="${quiz.id}"></quiz-next>`
      },
    },
  })

// used in:
//  quizzes questions
//  quizzes explications
const parse = parserFor(rules)

// used in:
//  formations
const parseFormations = (quizzes, fake = false) =>
  parserFor(formationRules(quizzes, fake))

export { parse, parseFormations }
