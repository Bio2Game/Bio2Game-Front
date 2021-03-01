import SimpleMarkdown from 'simple-markdown'

// designed for Bio2Game custom SimpleMDE configuration
const rules = {
  heading: SimpleMarkdown.defaultRules.heading,
  hr: SimpleMarkdown.defaultRules.hr,
  strong: SimpleMarkdown.defaultRules.strong,
  em: SimpleMarkdown.defaultRules.em,
  blockQuote: SimpleMarkdown.defaultRules.blockQuote,
  list: SimpleMarkdown.defaultRules.list,
  table: SimpleMarkdown.defaultRules.table,
  newline: SimpleMarkdown.defaultRules.newline,
  paragraph: SimpleMarkdown.defaultRules.paragraph,
  escape: SimpleMarkdown.defaultRules.escape,
  autolink: SimpleMarkdown.defaultRules.autolink,
  url: SimpleMarkdown.defaultRules.url,
  link: SimpleMarkdown.defaultRules.link,
  image: SimpleMarkdown.defaultRules.image,
  br: SimpleMarkdown.defaultRules.br,
  text: SimpleMarkdown.defaultRules.text,
}

const parserFor = rules => {
  const parser = SimpleMarkdown.parserFor(rules)
  const renderer = SimpleMarkdown.htmlFor(
    SimpleMarkdown.ruleOutput(rules, 'html'),
  )
  return function (input = '') {
    return renderer(parser(input, { inline: true }))
  }
}

const formationRules = quizzes => ({
  ...rules,
  quiz: {
    order: SimpleMarkdown.defaultRules.text.order,
    match: SimpleMarkdown.inlineRegex(/^(@)?(\$)?{{\s*(\d+)?\s*}}/),
    parse(capture) {
      return {
        content: quizzes.find(q => q.id === Number(capture[3])) || 'deleted',
        exp: !!capture[1],
        next: !!capture[2],
      }
    },
    html(node) {
      if (node.content === 'deleted') {
        return '<p class="deleted-quiz">Quiz Supprimé</p>'
      }
      return !node.next
        ? `<iframe class="quiz-iframe" src="/iframe/quiz/${node.content.id}${
            node.exp ? '?no-explication' : ''
          }"></iframe><br/>`
        : `<div class="quiz-next">
        <div class="left-part">
          <div class="icon">
            <img src="icon" src="" />
          </div>
        </div>
        <div class="right-part">
          <div class="text">
            <h6 class="title">${node.content.label}</h6>
            <p>${node.content.description}</p>
          </div>
          <div class="buttons">
            <a href="/quiz/${node.content.id}-${node.content.url}" class="jouer">Jouer</a>
          </div>
        </div>
      </div>`
    },
  },
})

// used in:
//  quizzes questions
//  quizzes explications
const parse = parserFor(rules)

// used in:
//  formations
const parseFormations = quizzes => parserFor(formationRules(quizzes))

export { parse, parseFormations }
