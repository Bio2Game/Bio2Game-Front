<template>
  <div class="textarea-container" :class="{ 'has-error': error }">
    <textarea
      :class="{
        false: !check,
        'has-content': hasContent,
        date: type === 'date',
      }"
      :type="type"
      class="input"
      :value="value"
      min="0"
      :maxlength="max"
      :disabled="disabled"
      @input="update"
      @keypress="checkMax"
    />
    <label class="placeholder">{{ placeholder }}</label>
    <span
      class="focus-bg"
      :class="{ 'has-content': hasContent || disabled, disabled }"
    ></span>
    <label v-if="counter" :for="id" class="counter">
      <span>{{ caracters }}</span>
      /{{ max }}
    </label>
    <div v-if="error" class="error">{{ error.message }}</div>
  </div>
</template>

<script>
export default {
  name: 'TextareaElement',
  props: {
    id: {
      type: String,
      default: 'id',
    },
    type: {
      type: String,
      default: 'text',
    },
    value: {
      type: [Number, String],
      default: '',
    },
    placeholder: {
      type: String,
      required: true,
    },
    default: {
      type: [Number, String],
      default: '',
    },
    validate: {
      type: RegExp,
      default: null,
    },
    counter: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: [Number, String],
      default: '',
    },
    error: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    hasContent() {
      return this.value !== ''
    },
    caracters() {
      return this.value ? this.value.length : 0
    },
    check() {
      return this.isValid()
    },
  },
  methods: {
    isValid() {
      if (!this.validate || !this.value) return true
      return !!this.value.match(this.validate)
    },
    update(event) {
      if (this.max && this.caracters >= this.max) {
        event.target.value = event.target.value.slice(0, this.max)
      }

      this.$emit('input', event.target.value || this.default)
    },
    checkMax(event) {
      return !(
        this.max &&
        this.value.length >= this.max &&
        ![
          'Backspace',
          'Delete',
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
        ].includes(event.key) &&
        (!event.ctrlKey || (event.ctrlKey && event.code === 'KeyV'))
      )
    },
  },
}
</script>

<style lang="scss">
.textarea-container {
  position: relative;
  margin: 8px 0 16px;
  border-radius: 4px;
  background-color: white;

  &:last-child {
    margin-bottom: 8px;
  }
  .error {
    position: absolute;
    top: calc(100% + 6px);
    right: 1em;
    color: #c90a0a;
    font-size: 12px;
  }
  textarea {
    position: relative;
    z-index: 3;
    box-sizing: border-box;
    width: 100%;
    height: 112px;
    padding: 7px 15px;
    border: 1px solid #cccccc;
    background: transparent;
    color: #333333;
    font-size: 15px;
    line-height: 28px;
    letter-spacing: 1px;
    outline: none;
    border-radius: 4px;
    resize: none;
    &.date {
      padding: 6px 15px;
    }
    & ~ .focus-bg {
      position: absolute;
      z-index: 1;
      top: 0;
      width: 0;
      left: 0;
      bottom: 4px;
      background-color: transparent;
      transition: 0.4s;
      border-radius: 4px;
    }
    & ~ .placeholder {
      position: absolute;
      z-index: 2;
      top: 15px;
      overflow: hidden;
      width: calc(100% - 24px);
      color: #aaaaaa;
      font-size: 14px;
      left: 14px;
      transition: 0.3s;
      letter-spacing: 0.5px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &:focus ~ .placeholder,
    &.has-content ~ .placeholder,
    &.date ~ .placeholder {
      top: -16px;
      width: calc(100% - 12px);
      color: $green;
      font-size: 12px;
      left: 0;
      transition: 0.3s;
    }
    &:disabled {
      cursor: not-allowed;
    }
  }
  textarea:focus ~ .focus-bg,
  .focus-bg.has-content {
    transition: 0.4s;
    width: 100%;
    background-color: #ededed;
    &.disabled {
      background-color: #e2e2e2;
    }
  }
  &.has-error {
    margin-bottom: 32px;
    input {
      border: 1px solid #c90a0a;
    }
  }
  &.white_label input:focus ~ .placeholder,
  &.white_label input.has-content ~ .placeholder,
  &.white_label input.date ~ .placeholder {
    color: #ffffff !important;
  }
  .counter {
    position: absolute;
    z-index: 2;
    right: 9px;
    color: #4e4e4e;
    font-size: 13px;
    cursor: text;
    user-select: none;
    bottom: 12px;
    span {
      color: $green;
      margin-right: 2px;
    }
  }
}

// .inputContainer {
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   margin-bottom: 16px;
//   .input,
//   .textarea {
//     width: 100%;
//     background: #2b2f33;
//     border: 1px solid #1a1a1a;
//     border-radius: 3px;
//     padding: 12px 16px;
//     color: #ffffff;
//     font-size: 15px;
//     font-weight: 400;
//     outline: none;
//     box-sizing: border-box;
//     height: 46px;
//     transition: border 250ms ease-out;
//     &:hover {
//       border: 1px solid #000000;
//     }
//     &:focus {
//       border-color: #cd6e57;
//     }
//     &.false {
//       border-color: red;
//     }
//   }
//   .textarea {
//     height: 150px;
//     resize: none;
//   }
//   .input {
//     & + .counter {
//       bottom: 16px;
//     }
//   }
// }
</style>
