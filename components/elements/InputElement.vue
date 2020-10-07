<template>
  <div class="input-container" :class="{ 'has-error': error }">
    <input
      :class="{
        false: !check,
        'has-content': hasContent,
        date: type === 'date',
      }"
      :type="type"
      class="input"
      :value="value"
      min="0"
      :max="max"
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
  props: {
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
.input-container {
  position: relative;
  margin: 8px 0 16px;
  border-radius: 4px;
  background-color: white;

  &:last-child {
    margin-bottom: 8px;
  }
  .error {
    position: absolute;
    color: #c90a0a;
    font-size: 12px;
    top: calc(100% + 6px);
    right: 0;
  }
  input {
    color: #333333;
    width: 100%;
    box-sizing: border-box;
    letter-spacing: 1px;
    padding: 7px 15px;
    border: 1px solid #cccccc;
    position: relative;
    background: transparent;
    outline: none;
    line-height: 28px;
    font-size: 15px;
    z-index: 3;
    border-radius: 4px;
    &.date {
      padding: 6px 15px;
    }
    & ~ .focus-bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 0;
      height: 100%;
      background-color: transparent;
      transition: 0.4s;
      z-index: 1;
      border-radius: 4px;
    }
    & ~ .placeholder {
      position: absolute;
      left: 14px;
      top: 15px;
      color: #aaaaaa;
      transition: 0.3s;
      z-index: 2;
      letter-spacing: 0.5px;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: calc(100% - 24px);
    }
    &:focus ~ .placeholder,
    &.has-content ~ .placeholder,
    &.date ~ .placeholder {
      top: -16px;
      left: 0;
      font-size: 12px;
      color: $green;
      transition: 0.3s;
      width: calc(100% - 12px);
    }
    &:disabled {
      cursor: not-allowed;
    }
  }
  input:focus ~ .focus-bg,
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

//   .counter {
//     user-select: none;
//     cursor: text;
//     position: absolute;
//     bottom: 24px;
//     right: 9px;
//     font-size: 13px;
//     color: #4e4e4e;
//     span {
//       margin-right: 2px;
//       color: #cd6e57;
//     }
//   }
//   .input {
//     & + .counter {
//       bottom: 16px;
//     }
//   }
// }
</style>
