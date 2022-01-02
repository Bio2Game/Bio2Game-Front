<template>
  <label class="checkbox" :for="id">
    <input
      :id="id"
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      @change="$emit('input', !!$event.target.checked)"
    />
    <span v-html="label"></span>
  </label>
</template>

<script>
export default {
  name: 'CheckboxElement',
  props: {
    checked: {
      type: Boolean,
      required: true,
    },
    id: {
      type: [String, Number],
      default: () => Math.random().toString().substring(2),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss">
.checkbox {
  span {
    position: relative;
    display: inline-block;
    height: 24px;
    color: $green;
    font-size: 14px;
    line-height: 24px;
    cursor: pointer;
    padding-left: 35px;
    user-select: none;

    &::before {
      position: absolute;
      z-index: 1;
      top: 10px;
      box-sizing: border-box;
      width: 0;
      height: 0;
      border: 3px solid transparent;
      content: '';
      transition: border 0.25s, background-color 0.25s, width 0.2s 0.1s,
        height 0.2s 0.1s, top 0.2s 0.1s, left 0.2s 0.1s;
      left: 6px;
      transform: rotateZ(37deg);
      transform-origin: 100% 100%;
    }

    &::after {
      position: absolute;
      z-index: 1;
      top: 2px;
      box-sizing: border-box;
      width: 20px;
      height: 20px;
      border: 2px solid #999999;
      content: '';
      left: 0;
      transition: border 0.25s, background-color 0.25s, width 0.2s 0.1s,
        height 0.2s 0.1s, top 0.2s 0.1s, left 0.2s 0.1s;
      background-color: transparent;
      border-radius: 2px;
    }
  }

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;

    &:disabled + span {
      cursor: not-allowed;
      filter: grayscale(1);
    }

    &:checked + span {
      &::before {
        top: 4px;
        left: 1px;
        width: 8px;
        height: 13px;
        border-top: 2px solid transparent;
        border-left: 2px solid transparent;
        border-right: 2px solid #ffffff;
        border-bottom: 2px solid #ffffff;
        transform: rotateZ(37deg);
        transform-origin: 100% 100%;
      }

      &::after {
        z-index: 0;
        top: 2px;
        width: 20px;
        height: 20px;
        border: 2px solid $green;
        background-color: $green;
      }
    }
  }
}
</style>
