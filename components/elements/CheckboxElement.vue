<template>
  <label class="checkbox" :for="id">
    <input
      :id="id"
      type="checkbox"
      :checked="checked"
      @change="$emit('input', $event.target.checked)"
    />
    <span v-html="label"></span>
  </label>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      required: true,
    },
    id: {
      type: [String, Number],
      default: () => Math.random().toString().substring(2),
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
    padding-left: 35px;
    cursor: pointer;
    display: inline-block;
    height: 25px;
    line-height: 25px;
    font-size: 14px;
    user-select: none;
    color: $green;
    &::before {
      content: '';
      position: absolute;
      transition: border 0.25s, background-color 0.25s, width 0.2s 0.1s,
        height 0.2s 0.1s, top 0.2s 0.1s, left 0.2s 0.1s;
      z-index: 1;
      width: 0;
      height: 0;
      border: 3px solid transparent;
      left: 6px;
      top: 10px;
      transform: rotateZ(37deg);
      transform-origin: 100% 100%;
      box-sizing: border-box;
    }
    &::after {
      content: '';
      left: 0;
      position: absolute;
      transition: border 0.25s, background-color 0.25s, width 0.2s 0.1s,
        height 0.2s 0.1s, top 0.2s 0.1s, left 0.2s 0.1s;
      z-index: 1;
      height: 20px;
      width: 20px;
      background-color: transparent;
      border: 2px solid #999999;
      top: 2px;
      border-radius: 2px;
      box-sizing: border-box;
    }
  }
  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
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
        top: 2px;
        width: 20px;
        height: 20px;
        border: 2px solid $green;
        background-color: $green;
        z-index: 0;
      }
    }
  }
}
</style>
