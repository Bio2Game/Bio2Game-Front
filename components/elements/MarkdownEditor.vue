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
      @input="$emit($event.target.value)"
    ></textarea>
  </div>
</template>

<script>
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
  },
  data() {
    return {
      simpleMde: null,
    }
  },
  mounted() {
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client) {
      window.SimpleMDE = require('simplemde')
    }
    /* eslint-disable no-undef */
    this.simpleMde = new SimpleMDE({
      element: this.$refs.editor,
      spellChecker: false,
      renderingConfig: {
        singleLineBreaks: false,
      },
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
        // {
        //   name: 'clean-block',
        //   action: SimpleMDE.cleanBlock,
        //   className: 'fa fa-eraser fa-clean-block',
        //   title: 'Suppprimer la mise en forme',
        // },
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
      ],
    })
  },
  methods: {
    handleFilesUpload() {
      const formData = new FormData()
      formData.append('image', this.$refs.files.files[0])
      return this.$axios
        .$post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((data) => {
          this.simpleMde.codemirror.replaceSelection(
            "![Nom de l'image Image](" + data + ')'
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
  width: 100%;
}
.CodeMirror-gutter-filler,
.CodeMirror-scrollbar-filler {
  background-color: #ffffff;
}
.CodeMirror-linenumber {
  padding: 0 3px 0 5px;
  min-width: 20px;
  text-align: right;
  color: #999999;
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
  right: 0;
  top: 0;
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
  left: 0;
  top: 0;
  min-height: 100%;
  z-index: 3;
  border-right: 1px solid #dddddd;
  background-color: #f7f7f7;
  white-space: nowrap;
}
.CodeMirror-gutter {
  white-space: normal;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  margin-bottom: -30px;
}
.CodeMirror-gutter-wrapper {
  position: absolute;
  z-index: 4;
  background: 0 0 !important;
  border: none !important;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
.CodeMirror-gutter-background {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 4;
}
.CodeMirror-gutter-elt {
  position: absolute;
  cursor: default;
  z-index: 4;
}
.CodeMirror-lines {
  padding: 4px 0;
  cursor: text;
  min-height: 1px;
}
.CodeMirror pre {
  padding: 0 4px;
  -moz-border-radius: 0;
  -webkit-border-radius: 0;
  border-radius: 0;
  border-width: 0;
  background: 0 0;
  font-family: inherit;
  font-size: 14px;
  margin: 0;
  white-space: pre;
  word-wrap: normal;
  line-height: inherit;
  color: inherit;
  z-index: 2;
  position: relative;
  overflow: visible;
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
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
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
  width: 100%;
  height: 0;
  overflow: hidden;
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
  height: auto;
  min-height: 160px;
  border: 1px solid #dddddd;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  padding: 10px;
  font: inherit;
  z-index: 1;
  position: relative;
  overflow: hidden;
  background: #ffffff;
  color: #000000;
}
.CodeMirror-scroll {
  overflow: scroll !important;
  margin-bottom: -30px;
  margin-right: -30px;
  padding-bottom: 30px;
  height: 100%;
  outline: 0;
  position: relative;
  min-height: 160px;
}
.CodeMirror-fullscreen {
  background: #ffffff;
  position: fixed !important;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  height: auto;
  z-index: 9;
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
  width: 100%;
  height: 50px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding-top: 10px;
  padding-bottom: 10px;
  box-sizing: border-box;
  background: #ffffff;
  border: 0;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 1;
  z-index: 9;
}
.editor-toolbar.fullscreen::before {
  width: 20px;
  height: 50px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 1) 0,
    rgba(255, 255, 255, 0) 100%
  );
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
}
.editor-toolbar.fullscreen::after {
  width: 20px;
  height: 50px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 1) 100%
  );
  position: fixed;
  top: 0;
  right: 0;
  margin: 0;
  padding: 0;
}
.editor-toolbar a {
  display: inline-block;
  text-align: center;
  text-decoration: none !important;
  color: #2c3e50 !important;
  width: 30px;
  height: 30px;
  margin: 0;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
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
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #ffffff;
  color: transparent;
  text-indent: -10px;
  margin: 0 6px;
}
.editor-toolbar a.fa-header-x::after {
  font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 65%;
  vertical-align: text-bottom;
  position: relative;
  top: 2px;
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
  padding: 8px 10px;
  font-size: 12px;
  color: #959694;
  text-align: right;
  margin-bottom: 11px;
}
.editor-statusbar:last-child {
  margin-bottom: 0;
}
.editor-preview,
.editor-preview-side {
  padding: 10px;
  background: #fafafa;
  overflow: auto;
  display: none;
  box-sizing: border-box;
}
.editor-statusbar .lines::before {
  content: 'lignes: ';
}
.editor-statusbar .words::before {
  content: 'mots: ';
}
.editor-statusbar .characters::before {
  content: 'caractères: ';
}
.editor-preview {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 7;
}
.editor-preview-side {
  position: fixed;
  bottom: 0;
  width: 50%;
  top: 50px;
  right: 0;
  z-index: 9;
  border: 1px solid #dddddd;
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
  border: 1px solid #dddddd;
  padding: 5px;
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
</style>