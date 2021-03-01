<template>
  <div class="file-input-container" :class="{ 'has-error': error }">
    <div class="button md green">
      {{ placeholder }}
      <input
        :class="{ 'has-content': hasContent }"
        type="file"
        class="input-file"
        @change="update"
      />
    </div>
    <div class="file-path">
      <input
        class="file-name"
        type="text"
        :value="preview || 'Aucun fichier choisi'"
      />
      <span class="focus-bg" :class="{ 'has-content': hasContent }" />
    </div>
    <div v-if="error" class="error">{{ error.message }}</div>
  </div>
</template>

<script>
export default {
  props: {
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
    error: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      preview: '',
    }
  },
  computed: {
    hasContent() {
      return this.preview !== ''
    },
  },
  methods: {
    update(event) {
      const file = event.target.files[0]
      this.preview = file ? file.name : ''

      this.$emit('input', file)
    },
  },
}
</script>

<style lang="scss">
.file-input-container {
  position: relative;
  display: flex;
  margin: 8px 0 16px;

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
  .button {
    margin-right: 16px;
    .input-file {
      position: absolute;
      z-index: 4;
      top: 0;
      right: 0;
      width: 100%;
      padding: 0;
      margin: 0;
      font-size: 20px;
      cursor: pointer;
      left: 0;
      bottom: 0;
      opacity: 0;
    }
  }
  .file-path {
    position: relative;
    width: 100%;
    .file-name {
      position: relative;
      z-index: 3;
      box-sizing: border-box;
      width: 100%;
      padding: 7px 15px;
      border: 1px solid #cccccc;
      background: transparent;
      color: #aaaaaa;
      font-size: 15px;
      line-height: 28px;
      letter-spacing: 1px;
      outline: none;
      border-radius: 4px;
      & ~ .focus-bg {
        position: absolute;
        z-index: 1;
        top: 0;
        width: 0;
        height: 100%;
        left: 0;
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
    input:focus ~ .focus-bg,
    .focus-bg.has-content {
      width: 100%;
      transition: 0.4s;
      background-color: #ededed;
      &.disabled {
        background-color: #e2e2e2;
      }
    }
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
