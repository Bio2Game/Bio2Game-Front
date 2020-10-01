<template>
  <div
    v-closable="{ handler: 'closeAnimatorSelector' }"
    class="animator_selector_element"
    :class="{ active }"
  >
    <div class="select_element">
      <input
        v-model="search"
        type="text"
        :placeholder="placeholder"
        @focus="active = true"
      />
      <svg
        class="down"
        width="11"
        height="7"
        viewBox="0 0 11 7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.172823 0.796772C-0.16424 0.356727 0.00615209 0 0.558413 0H10.2474C10.7974 0 10.963 0.349113 10.6149 0.7827L5.89383 6.66255C5.54675 7.09483 4.99034 7.08615 4.65509 6.64848L0.172823 0.796772Z"
          fill="#aaaaaa"
        />
      </svg>
    </div>
    <div class="select_elements">
      <div
        v-for="item in elements"
        :key="item.id"
        class="element"
        :class="{ active: item.selected }"
        @click="toggle(item.id, true)"
      >
        {{ item.name || item.username }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnimatorSelectorElement',
  props: {
    selectedAnimators: {
      type: Array,
      default: () => [],
    },
    animators: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      active: false,
      search: '',
    }
  },
  computed: {
    elements() {
      return this.animators
        .map((item) => ({
          ...item,
          selected: this.selectedAnimators.includes(item.id),
        }))
        .filter(
          (animator) =>
            this.searchElement(animator.name) ||
            this.searchElement(animator.username)
        )
    },
    placeholder() {
      if (!this.selectedAnimators.length) {
        return 'Animateurs à suivre'
      }
      return `${this.selectedAnimators.length} animateurs selectionnés`
    },
  },
  methods: {
    toggle(animatorId) {
      const index = this.selectedAnimators.indexOf(animatorId)
      this.$emit(
        'input',
        index === -1
          ? [...this.selectedAnimators, animatorId]
          : this.selectedAnimators.filter((a) => a !== animatorId)
      )
    },
    closeAnimatorSelector() {
      if (this.active) this.active = false
    },
    searchElement(element) {
      return element
        ? element.toLowerCase().includes(this.search.toLowerCase())
        : null
    },
  },
}
</script>

<style lang="scss">
.animator_selector_element {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: transparent;
  border: 1px solid #cccccc;
  border-radius: 3px;
  font-size: 15px;
  font-weight: 400;
  height: 44px;
  outline: none;
  color: #aaaaaa;
  box-sizing: border-box;
  transition: border 250ms ease-out;
  margin: 8px 0 16px;
  user-select: none;
  .select_element {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    border-radius: 3px;
    padding-left: 15px;
    height: 46px;
    transition: border 0.25s ease-out;
    user-select: none;
    input {
      background-color: transparent;
      color: #aaaaaa;
      font-weight: 400;
      border: 0;
      outline: 0;
      height: 100%;
      width: 100%;
      font-size: 15px;
      &::placeholder {
        color: #aaaaaa;
      }
      &:focus::placeholder {
        color: #c7c7c7;
      }
    }
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
        background-color: #dbdbdb;
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
