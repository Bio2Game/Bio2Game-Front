<template>
  <div v-closable="{ handler: 'closeSelector' }" class="selector" :class="{ active }" @click="active = !active">
    <div class="select_element">
      {{ selected !== defaultValue ? getSelectedName : noSelect }}
      <svg class="down" width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.172823 0.796772C-0.16424 0.356727 0.00615209 0 0.558413 0H10.2474C10.7974 0 10.963 0.349113 10.6149 0.7827L5.89383 6.66255C5.54675 7.09483 4.99034 7.08615 4.65509 6.64848L0.172823 0.796772Z"
          fill="currentColor"
        />
      </svg>
    </div>
    <div class="select_elements">
      <div
        v-for="item in items"
        :key="item.ref"
        class="element"
        :class="{ active: selected === item.ref }"
        @click="select(item.ref, true)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectorElement',
  props: {
    noSelect: {
      type: String,
      required: true,
    },
    selected: {
      type: [String, Boolean, Number],
      default: null,
    },
    items: {
      type: Array,
      default: () => [],
    },
    toggle: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: [String, Boolean, Number],
      default: null,
    },
  },
  data() {
    return {
      active: false,
    }
  },
  computed: {
    getSelectedName() {
      return (
        [...this.items, { ref: this.defaultValue, name: this.noSelect }].find(item => item.ref === this.selected) || {}
      ).name
    },
  },
  watch: {
    selected(value) {
      this.select(value)
    },
  },
  methods: {
    select(itemRef, clicked = false) {
      if (!this.items.some(item => item.ref === itemRef)) {
        return this.$emit('input', this.defaultValue)
      }

      if (this.toggle && clicked && this.selected !== null && itemRef === this.selected) {
        return this.$emit('input', this.defaultValue)
      }

      if (clicked) {
        this.$emit('input', itemRef)
      }
    },
    closeSelector() {
      if (this.active) this.active = false
    },
  },
}
</script>

<style lang="scss">
.selector {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: transparent;
  border: 1px solid #cccccc;
  border-radius: 3px;
  color: #aaaaaa;
  font-size: 15px;
  font-weight: 400;
  padding: 7px 15px;
  height: 44px;
  outline: none;
  box-sizing: border-box;
  transition: border 250ms ease-out;
  margin: 8px 0 16px;
  user-select: none;
  .select_element {
    display: flex;
    align-items: center;
  }
  .down {
    position: absolute;
    right: 16px;
  }
  &.active .down {
    transform: rotate(180deg);
  }
  .select_elements {
    position: absolute;
    top: 43px;
    left: -1px;
    z-index: 1000;
    width: calc(100% + 2px);
    background-color: #f5f5f5;
    border-radius: 0 0 3px 3px;
    border: 1px solid #cccccc;
    box-sizing: border-box;
    visibility: hidden;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.25);
    &::-webkit-scrollbar {
      -webkit-appearance: none;
      background-color: rgb(238, 238, 238);
      border-radius: 5px;
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: $green;
      transition: background-color 0.1s ease;
    }
    .element {
      padding-left: 15px;
      cursor: pointer;
      min-height: 46px;
      display: flex;
      align-items: center;
      position: relative;
      &:hover {
        background-color: #e7e7e7;
      }
      &.active {
        background-color: #e7e7e7;
      }
    }
  }
  &.active .select_elements {
    visibility: visible;
  }
  &.select_elements::-webkit-scrollbar-thumb:hover {
    background-color: #a45b44;
  }
}
</style>
