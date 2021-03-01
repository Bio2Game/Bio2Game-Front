<template>
  <div class="markdown-editor">
    <input
      ref="files"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFilesUpload()"
    />
    <textarea
      ref="editor"
      :value="value"
      :placeholder="placeholder"
      @input="handleInput($event.target.value)"
    />
    <div v-if="error" class="error">{{ error.message }}</div>
    <ModalElement :open="quizzesSelector === 1" @close="quizzesSelector = 0">
      <div class="block modal-block">
        <div class="head">
          <h5>Sélection du quiz à incruster</h5>
        </div>
        <div class="content">
          <SelectorElement
            class="select-quiz"
            :selected="quizId"
            :items="quizzes"
            noSelect="Selectionner le quiz"
            displayKey="label"
            refKey="id"
            @input="quizId = $event"
          />
          <CheckboxElement
            id="explication"
            style="margin-bottom: 14px"
            :checked="quizExplication"
            label="Afficher les explications"
            @input="quizExplication = $event"
          />
          <div class="button md green" @click="waiter()">Sélectionner</div>
        </div>
      </div>
    </ModalElement>
    <ModalElement :open="quizzesSelector === 2" @close="quizzesSelector = 0">
      <div class="block modal-block">
        <div class="head">
          <h5>Sélection du quiz d'approfondissement à incruster</h5>
        </div>
        <div class="content">
          <SelectorElement
            class="select-quiz"
            :selected="quizId"
            :items="quizzes"
            noSelect="Selectionner le quiz"
            displayKey="label"
            refKey="id"
            @input="quizId = $event"
          />
          <div class="button md green" @click="waiter()">Sélectionner</div>
        </div>
      </div>
    </ModalElement>
  </div>
</template>

<script>
import { parseFormations } from '@/utils/markdown'

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    max: {
      type: Number,
      default: 0,
    },
    error: {
      type: Object,
      default: () => null,
    },
    quizzes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      simplemde: null,
      isValueUpdateFromInner: false,
      quizzesSelector: 0,
      quizId: null,
      quizExplication: true,
      waiter: null,
    }
  },
  computed: {
    displayError() {
      return this.error ? this.error.message : ''
    },
  },
  watch: {
    value(val) {
      if (this.isValueUpdateFromInner) {
        this.isValueUpdateFromInner = false
      } else {
        this.simplemde.value(val)
      }
    },
  },
  mounted() {
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client) {
      window.SimpleMDE = require('simplemde')
    }
    const self = this
    /* eslint-disable no-undef */
    this.simplemde = new SimpleMDE({
      element: this.$refs.editor,
      spellChecker: false,
      renderingConfig: {
        singleLineBreaks: false,
      },
      status: [
        'lines',
        'words',
        'cursor',
        {
          className: 'characters',
          defaultValue(el) {
            el.innerHTML = '0'
          },
          onUpdate: el => {
            el.innerHTML = `${this.simplemde.codemirror.getValue().length}${
              self.max ? ` /${self.max}` : ''
            }`
          },
        },
      ],
      previewRender: parseFormations(this.quizzes),
      toolbar: [
        {
          name: 'undo',
          action: SimpleMDE.undo,
          className: 'fa fa-undo no-disable',
          title: 'Annuler',
        },
        {
          name: 'redo',
          action: SimpleMDE.redo,
          className: 'fa fa-repeat no-disable',
          title: 'Rétablir',
        },
        '|',
        {
          name: 'bold',
          action: SimpleMDE.toggleBold,
          className: 'fa fa-bold',
          title: 'Gras',
        },
        {
          name: 'italic',
          action: SimpleMDE.toggleItalic,
          className: 'fa fa-italic',
          title: 'Italique',
        },
        {
          name: 'heading',
          action: SimpleMDE.toggleHeadingSmaller,
          className: 'fa fa-header',
          title: 'Titre',
        },
        '|',
        {
          name: 'quote',
          action: SimpleMDE.toggleBlockquote,
          className: 'fa fa-quote-left',
          title: 'Citation',
        },
        {
          name: 'unordered-list',
          action: SimpleMDE.toggleUnorderedList,
          className: 'fa fa-list-ul',
          title: 'Liste à puces',
        },
        {
          name: 'ordered-list',
          action: SimpleMDE.toggleOrderedList,
          className: 'fa fa-list-ol',
          title: 'Liste à numéroté',
        },
        '|',
        {
          name: 'link',
          action: SimpleMDE.drawLink,
          className: 'fa fa-link',
          title: 'Créer un lien',
        },
        {
          name: 'image',
          action: () => {
            this.$refs.files.click()
          },
          className: 'fa fa-picture-o',
          title: 'Insérer une image',
        },
        {
          name: 'table',
          action: SimpleMDE.drawTable,
          className: 'fa fa-table',
          title: 'Insérer un tableau',
        },
        {
          name: 'horizontal-rule',
          action: SimpleMDE.drawHorizontalRule,
          className: 'fa fa-minus',
          title: 'Insérer un séparateur',
        },
        '|',
        {
          name: 'preview',
          action: SimpleMDE.togglePreview,
          className: 'fa fa-eye no-disable',
          title: 'Prévisualisation',
        },
        {
          name: 'side-by-side',
          action: SimpleMDE.toggleSideBySide,
          className: 'fa fa-columns no-disable no-mobile',
          title: 'Affichage coupé',
        },
        {
          name: 'fullscreen',
          action: SimpleMDE.toggleFullScreen,
          className: 'fa fa-arrows-alt no-disable no-mobile',
          title: 'Plein écran',
        },
        '|',
        {
          name: 'guide',
          action: 'https://SimpleMDE.com/markdown-guide',
          className: 'fa fa-question-circle',
          title: 'Guide Markdown',
        },
        '|',
        {
          name: 'quiz',
          action: async editor => {
            const cm = editor.codemirror

            self.quizId = cm.getSelection() || null
            self.quizzesSelector = 1

            await new Promise(resolve => {
              self.waiter = resolve
            })
            self.quizzesSelector = 0
            self.waiter = null

            const start = self.quizExplication ? '{{' : '@{{'
            const end = '}}'
            const startPoint = cm.getCursor('start')
            const endPoint = cm.getCursor('end')
            if (!self.quizId || isNaN(self.quizId)) {
              return
            }
            cm.replaceSelection(start + self.quizId + end)

            startPoint.ch += start.length
            if (startPoint !== endPoint) {
              endPoint.ch += start.length
            }
            cm.setSelection(startPoint, endPoint)
            cm.focus()
          },
          className: 'fa fa-list-alt',
          title: 'Insérer un quiz',
        },
        {
          name: 'quiz-next',
          action: async editor => {
            const cm = editor.codemirror

            self.quizId = cm.getSelection() || null
            self.quizzesSelector = 2

            await new Promise(resolve => {
              self.waiter = resolve
            })
            self.quizzesSelector = 0
            self.waiter = null

            const start = '${{'
            const end = '}}'
            const startPoint = cm.getCursor('start')
            const endPoint = cm.getCursor('end')
            if (!self.quizId || isNaN(self.quizId)) {
              return
            }
            cm.replaceSelection(start + self.quizId + end)

            startPoint.ch += start.length
            if (startPoint !== endPoint) {
              endPoint.ch += start.length
            }
            cm.setSelection(startPoint, endPoint)
            cm.focus()
          },
          className: 'fa fa-window-maximize',
          title: "Insérer un quiz d'approfondissement",
        },
      ],
    })

    this.simplemde.codemirror.on('change', (instance, changeObj) => {
      if (changeObj.origin === 'setValue') {
        return
      }
      const val = this.simplemde.value()
      this.handleInput(val)
    })
    this.simplemde.codemirror.on('beforeChange', (instance, changes) => {
      if (
        this.max &&
        this.simplemde.value().length > this.max - 1 &&
        changes.origin !== '+delete'
      ) {
        changes.cancel()
      }
    })
    /* eslint-enable no-undef */
  },
  destroyed() {
    this.simplemde = null
  },
  methods: {
    handleInput(val) {
      this.isValueUpdateFromInner = true
      this.$emit('input', val)
    },
    handleFilesUpload() {
      const formData = new FormData()
      formData.append('image', this.$refs.files.files[0])
      return this.$axios
        .$post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(data => {
          this.simplemde.codemirror.replaceSelection(
            "![Nom de l'image Image](" + data + ')',
          )
        })
        .catch(function (error) {
          console.log(error)
        })
    },
  },
}
</script>

<style lang="css">
.markdown-editor {
  position: relative;
  width: 100%;
}
.CodeMirror-gutter-filler,
.CodeMirror-scrollbar-filler {
  background-color: #ffffff;
}
.CodeMirror-linenumber {
  padding: 0 3px 0 5px;
  color: #999999;
  text-align: right;
  min-width: 20px;
  white-space: nowrap;
}
.CodeMirror-guttermarker {
  color: #000000;
}
.CodeMirror-guttermarker-subtle {
  color: #999999;
}
.CodeMirror-cursor {
  position: absolute;
  border-left: 1px solid #000000;
  border-right: none;
  width: 0;
}
.CodeMirror div.CodeMirror-secondarycursor {
  border-left: 1px solid silver;
}
.editor-statusbar span {
  display: inline-block;
  min-width: 4em;
  margin-left: 1em;
}
.cm-fat-cursor .CodeMirror-cursor {
  width: auto;
  border: 0 !important;
  background: #77ee77;
}
.cm-fat-cursor div.CodeMirror-cursors {
  z-index: 1;
}
.cm-animate-fat-cursor {
  width: auto;
  border: 0;
  -webkit-animation: blink 1.06s steps(1) infinite;
  -moz-animation: blink 1.06s steps(1) infinite;
  animation: blink 1.06s steps(1) infinite;
  background-color: #77ee77;
}
@-moz-keyframes blink {
  50% {
    background-color: transparent;
  }
}
@-webkit-keyframes blink {
  50% {
    background-color: transparent;
  }
}
@keyframes blink {
  50% {
    background-color: transparent;
  }
}
.cm-tab {
  display: inline-block;
  text-decoration: inherit;
}
.CodeMirror-ruler {
  border-left: 1px solid #cccccc;
  position: absolute;
}
.cm-header,
.cm-strong {
  font-weight: 700;
}
.cm-s-default .cm-header {
  color: #0000ff;
}
.cm-s-default .cm-quote {
  color: #009900;
}
.cm-negative {
  color: #dd4444;
}
.cm-positive {
  color: #229922;
}
.cm-em {
  font-style: italic;
}
.cm-link {
  text-decoration: underline;
}
.cm-strikethrough {
  text-decoration: line-through;
}
.cm-s-default .cm-keyword {
  color: #770088;
}
.cm-s-default .cm-atom {
  color: #221199;
}
.cm-s-default .cm-number {
  color: #116644;
}
.cm-s-default .cm-def {
  color: #0000ff;
}
.cm-s-default .cm-variable-2 {
  color: #0055aa;
}
.cm-s-default .cm-variable-3 {
  color: #008855;
}
.cm-s-default .cm-comment {
  color: #aa5500;
}
.cm-s-default .cm-string {
  color: #aa1111;
}
.cm-s-default .cm-string-2 {
  color: #ff5500;
}
.cm-s-default .cm-meta,
.cm-s-default .cm-qualifier {
  color: #555555;
}
.cm-s-default .cm-builtin {
  color: #3300aa;
}
.cm-s-default .cm-bracket {
  color: #999977;
}
.cm-s-default .cm-tag {
  color: #117700;
}
.cm-s-default .cm-attribute {
  color: #0000cc;
}
.cm-s-default .cm-hr {
  color: #999999;
}
.cm-s-default .cm-link {
  color: #0000cc;
}
.cm-invalidchar,
.cm-s-default .cm-error {
  color: red;
}
.CodeMirror-composing {
  border-bottom: 2px solid;
}
div.CodeMirror span.CodeMirror-matchingbracket {
  color: #00ff00;
}
div.CodeMirror span.CodeMirror-nonmatchingbracket {
  color: #ff2222;
}
.CodeMirror-matchingtag {
  background: rgba(255, 150, 0, 0.3);
}
.CodeMirror-activeline-background {
  background: #e8f2ff;
}
.CodeMirror-sizer {
  position: relative;
  border-right: 30px solid transparent;
}
.CodeMirror-gutter-filler,
.CodeMirror-hscrollbar,
.CodeMirror-scrollbar-filler,
.CodeMirror-vscrollbar {
  position: absolute;
  z-index: 6;
  display: none;
}
.CodeMirror-vscrollbar {
  top: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: scroll;
}
.CodeMirror-hscrollbar {
  bottom: 0;
  left: 0;
  overflow-y: hidden;
  overflow-x: scroll;
}
.CodeMirror-scrollbar-filler {
  right: 0;
  bottom: 0;
}
.CodeMirror-gutter-filler {
  left: 0;
  bottom: 0;
}
.CodeMirror-gutters {
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  min-height: 100%;
  border-right: 1px solid #dddddd;
  background-color: #f7f7f7;
  white-space: nowrap;
}
.CodeMirror-gutter {
  display: inline-block;
  height: 100%;
  white-space: normal;
  vertical-align: top;
  margin-bottom: -30px;
}
.CodeMirror-gutter-wrapper {
  position: absolute;
  z-index: 4;
  border: none !important;
  background: 0 0 !important;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
.CodeMirror-gutter-background {
  position: absolute;
  z-index: 4;
  top: 0;
  bottom: 0;
}
.CodeMirror-gutter-elt {
  position: absolute;
  z-index: 4;
  cursor: default;
}
.CodeMirror-lines {
  padding: 4px 0;
  cursor: text;
  min-height: 1px;
}
.CodeMirror pre {
  position: relative;
  z-index: 2;
  overflow: visible;
  padding: 0 4px;
  margin: 0;
  background: 0 0;
  color: inherit;
  font-family: inherit;
  font-size: 14px;
  line-height: inherit;
  -moz-border-radius: 0;
  -webkit-border-radius: 0;
  border-radius: 0;
  border-width: 0;
  white-space: pre;
  word-wrap: normal;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
}
.CodeMirror-wrap pre {
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: normal;
}
.CodeMirror-linebackground {
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.CodeMirror-linewidget {
  position: relative;
  z-index: 2;
  overflow: auto;
}
.CodeMirror-code {
  outline: 0;
}
.CodeMirror-gutter,
.CodeMirror-gutters,
.CodeMirror-linenumber,
.CodeMirror-scroll,
.CodeMirror-sizer {
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}
.CodeMirror-measure {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 0;
  visibility: hidden;
}
.CodeMirror-measure pre {
  position: static;
}
.CodeMirror-cursors {
  visibility: hidden;
  position: relative;
  z-index: 3;
}
.CodeMirror-focused .CodeMirror-cursors,
div.CodeMirror-dragcursors {
  visibility: visible;
}
.CodeMirror-selected {
  background: #d9d9d9;
}
.CodeMirror-focused .CodeMirror-selected,
.CodeMirror-line::selection,
.CodeMirror-line > span::selection,
.CodeMirror-line > span > span::selection {
  background: #d7d4f0;
}
.CodeMirror-crosshair {
  cursor: crosshair;
}
.CodeMirror-line::-moz-selection,
.CodeMirror-line > span::-moz-selection,
.CodeMirror-line > span > span::-moz-selection {
  background: #d7d4f0;
}
.cm-searching {
  background: #ffffaa;
  background: rgba(255, 255, 0, 0.4);
}
.cm-force-border {
  padding-right: 0.1px;
}
@media print {
  .CodeMirror div.CodeMirror-cursors {
    visibility: hidden;
  }
}
.cm-tab-wrap-hack::after {
  content: '';
}
span.CodeMirror-selectedtext {
  background: 0 0;
}
.CodeMirror {
  position: relative;
  z-index: 1;
  overflow: hidden;
  height: auto;
  padding: 10px;
  border: 1px solid #dddddd;
  background: #ffffff;
  color: #000000;
  min-height: 160px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  font: inherit;
}
.CodeMirror-scroll {
  position: relative;
  overflow: scroll !important;
  height: 100%;
  margin-bottom: -30px;
  margin-right: -30px;
  padding-bottom: 30px;
  outline: 0;
  min-height: 160px;
}
.CodeMirror-fullscreen {
  position: fixed !important;
  z-index: 9;
  top: 50px;
  right: 0;
  height: auto;
  background: #ffffff;
  left: 0;
  bottom: 0;
}
.CodeMirror-sided {
  width: 50% !important;
}
.editor-toolbar {
  position: relative;
  opacity: 0.8;
  user-select: none;
  padding: 0 10px;
  border-top: 1px solid #bbbbbb;
  border-left: 1px solid #bbbbbb;
  border-right: 1px solid #bbbbbb;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  margin-top: 8px;
}
.editor-toolbar::after,
.editor-toolbar::before {
  display: block;
  content: ' ';
  height: 1px;
}
.editor-toolbar::before {
  margin-bottom: 5px;
}
.editor-toolbar::after {
  margin-top: 5px;
}
.editor-toolbar.fullscreen {
  position: fixed;
  z-index: 9;
  top: 0;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  border: 0;
  background: #ffffff;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding-top: 10px;
  padding-bottom: 10px;
  left: 0;
  opacity: 1;
}
.editor-toolbar.fullscreen::before {
  position: fixed;
  top: 0;
  width: 20px;
  height: 50px;
  padding: 0;
  margin: 0;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 1) 0,
    rgba(255, 255, 255, 0) 100%
  );
  left: 0;
}
.editor-toolbar.fullscreen::after {
  position: fixed;
  top: 0;
  right: 0;
  width: 20px;
  height: 50px;
  padding: 0;
  margin: 0;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 1) 100%
  );
}
.editor-toolbar a {
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 1px solid transparent;
  margin: 0;
  color: #2c3e50 !important;
  text-align: center;
  cursor: pointer;
  text-decoration: none !important;
  border-radius: 3px;
  outline: none;
}
.editor-toolbar a.active,
.editor-toolbar a:hover {
  background: #fcfcfc;
  border-color: #95a5a6;
}
.editor-toolbar a::before {
  line-height: 30px;
}
.editor-toolbar i.separator {
  display: inline-block;
  width: 0;
  margin: 0 6px;
  color: transparent;
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #ffffff;
  text-indent: -10px;
}
.editor-toolbar a.fa-header-x::after {
  position: relative;
  top: 2px;
  font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 65%;
  vertical-align: text-bottom;
}
.editor-toolbar a.fa-header-1::after {
  content: '1';
}
.editor-toolbar a.fa-header-2::after {
  content: '2';
}
.editor-toolbar a.fa-header-3::after {
  content: '3';
}
.editor-toolbar a.fa-header-bigger::after {
  content: '▲';
}
.editor-toolbar a.fa-header-smaller::after {
  content: '▼';
}
.editor-toolbar.disabled-for-preview a:not(.no-disable) {
  pointer-events: none;
  background: #ffffff;
  border-color: transparent;
  text-shadow: inherit;
}
@media only screen and (max-width: 700px) {
  .editor-toolbar a.no-mobile {
    display: none;
  }
}
.editor-statusbar {
  position: relative;
  padding: 8px 10px;
  color: #959694;
  font-size: 12px;
  text-align: right;
  margin-bottom: 11px;
}
.editor-statusbar:last-child {
  margin-bottom: 0;
}
.editor-preview,
.editor-preview-side {
  display: none;
  overflow: auto;
  box-sizing: border-box;
  padding: 10px;
  background: #fafafa;
}
.editor-statusbar .lines::before {
  content: 'lignes: ';
}
.editor-statusbar .words::before {
  content: 'mots: ';
}
.editor-statusbar + .error {
  position: absolute;
  color: #c90a0a;
  font-size: 12px;
  text-align: left;
  bottom: 18px;
  left: 1em;
}
.editor-preview {
  position: absolute;
  z-index: 7;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
}
.editor-preview-side {
  position: fixed;
  z-index: 9;
  top: 50px;
  right: 0;
  width: 50%;
  border: 1px solid #dddddd;
  bottom: 0;
}
.editor-preview-active,
.editor-preview-active-side {
  display: block;
}
.editor-preview-side > p,
.editor-preview > p {
  margin-top: 0;
}
.editor-preview pre,
.editor-preview-side pre {
  background: #eeeeee;
  margin-bottom: 10px;
}
.editor-preview table td,
.editor-preview table th,
.editor-preview-side table td,
.editor-preview-side table th {
  padding: 5px;
  border: 1px solid #dddddd;
}
.CodeMirror .CodeMirror-code .cm-tag {
  color: #63a35c;
}
.CodeMirror .CodeMirror-code .cm-attribute {
  color: #795da3;
}
.CodeMirror .CodeMirror-code .cm-string {
  color: #183691;
}
.CodeMirror .CodeMirror-selected {
  background: #d9d9d9;
}
.CodeMirror .CodeMirror-code .cm-header-1 {
  font-size: 200%;
  line-height: 200%;
}
.CodeMirror .CodeMirror-code .cm-header-2 {
  font-size: 160%;
  line-height: 160%;
}
.CodeMirror .CodeMirror-code .cm-header-3 {
  font-size: 125%;
  line-height: 125%;
}
.CodeMirror .CodeMirror-code .cm-header-4 {
  font-size: 110%;
  line-height: 110%;
}
.CodeMirror .CodeMirror-code .cm-comment {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}
.CodeMirror .CodeMirror-code .cm-link {
  color: #7f8c8d;
}
.CodeMirror .CodeMirror-code .cm-url {
  color: #aab2b3;
}
.CodeMirror .CodeMirror-code .cm-strikethrough {
  text-decoration: line-through;
}
.CodeMirror .CodeMirror-placeholder {
  opacity: 0.5;
}
.CodeMirror
  .cm-spell-error:not(.cm-url):not(.cm-comment):not(.cm-tag):not(.cm-word) {
  background: rgba(255, 0, 0, 0.15);
}
.modal-block {
  width: 300px;
}
.modal-block .head {
  height: auto;
}
</style>
