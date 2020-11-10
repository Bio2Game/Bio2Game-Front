<template>
  <div
    class="chips-input-container"
    :class="{
      'has-error': error,
      'has-content': current_keyword !== '' || keyswords.length,
    }"
  >
    <div v-for="(keyword, index) of keyswords" :key="keyword" class="chip">
      {{ keyword }}
      <CloseIcon @click="removeKeyword(index)" />
    </div>
    <input
      v-model="current_keyword"
      class="input"
      :max="max"
      placeholder="Ajouter un mot clé"
      @keypress="keyPress"
    />
    <label class="placeholder">{{ placeholder }}</label>
    <span class="focus-bg" :class="{ 'has-content': keyswords.length }"></span>
    <label v-if="counter" :for="id" class="counter">
      <span>{{ caracters }}</span>
      /{{ max }}
    </label>
    <div v-if="error" class="error">{{ error.message }}</div>
  </div>
</template>

<script>
import CloseIcon from '@/assets/icons/close.svg?inline'

export default {
  components: {
    CloseIcon,
  },
  props: {
    value: {
      type: String,
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
    counter: {
      type: Boolean,
      default: false,
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
  data() {
    return {
      current_keyword: '',
      keyswords: [],
    }
  },
  computed: {
    caracters() {
      return this.current_keyword ? this.current_keyword.length : 0
    },
    check() {
      return this.isValid()
    },
  },
  watch: {
    value(value) {
      if (value) {
        this.keyswords = value.split(',')
      }
    },
  },
  mounted() {
    if (this.value) {
      this.keyswords = this.value.split(',')
    }
  },
  methods: {
    update(event) {
      if (this.max && this.caracters >= this.max) {
        event.target.value = event.target.value.slice(0, this.max)
      }

      this.$emit('input', event.target.value || this.default)
    },
    keyPress(event) {
      if (
        this.max &&
        this.current_keyword.length >= this.max &&
        ![
          'Backspace',
          'Delete',
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
        ].includes(event.key) &&
        (!event.ctrlKey || (event.ctrlKey && event.code === 'KeyV'))
      ) {
        return
      }

      if ([',', 'Enter'].includes(event.key)) {
        event.preventDefault()
        if (this.current_keyword) {
          this.addKeyword()
        }
      }
    },
    addKeyword() {
      this.keyswords.push(this.current_keyword.trim())
      this.current_keyword = ''
      this.$emit('input', this.keyswords.join(','))
    },
    async removeKeyword(index) {
      this.keyswords.splice(index, 1)
      await this.$nextTick()
      this.$emit('input', this.keyswords.join(','))
    },
  },
}
</script>

<style lang="scss">
.chips-input-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  margin: 8px 0 16px;
  border-radius: 4px;
  background-color: white;
  padding-left: 8px;
  border: 1px solid #cccccc;

  &:last-child {
    margin-bottom: 8px;
  }
  .error {
    position: absolute;
    color: #c90a0a;
    font-size: 12px;
    top: calc(100% + 6px);
    right: 1em;
  }
  .chip {
    display: flex;
    align-items: center;
    padding: 0 12px;
    background-color: $green;
    color: white;
    border-radius: 14px;
    z-index: 4;
    margin: 7px 8px 7px 0;
    height: 28px;
    font-size: 14px;
    user-select: none;
    &:last-of-type {
      margin-right: 4px;
    }
    svg {
      margin-left: 8px;
      width: 12px;
      height: 12px;
      cursor: pointer;
      path {
        fill: white;
      }
    }
  }
  input {
    color: #333333;
    flex: 1;
    box-sizing: border-box;
    letter-spacing: 1px;
    padding: 7px 16px 7px 8px;
    background: transparent;
    outline: none;
    line-height: 28px;
    font-size: 15px;
    z-index: 3;
    border-radius: 4px;
    border: 0;
    opacity: 0;
    transition: 0.3s opacity ease;
  }
  &.has-content input,
  input:focus {
    opacity: 1;
  }
  .focus-bg {
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
  .placeholder {
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
  &.has-content .placeholder,
  input:focus ~ .placeholder {
    top: -16px;
    left: 0;
    font-size: 12px;
    color: $green;
    transition: 0.3s;
    width: calc(100% - 12px);
  }
  &.has-content .focus-bg {
    transition: 0.4s;
    width: 100%;
    background-color: #ededed;
  }
  &.has-error {
    margin-bottom: 32px;
    input {
      border: 1px solid #c90a0a;
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
