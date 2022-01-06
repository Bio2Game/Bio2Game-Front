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
        @click="toggle(item.id)"
      >
        {{ item.name || item.username }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnimatorSelectorElement',
  data() {
    return {
      active: false,
      search: '',
      animators: [],
      selectedAnimators: [],
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
        return 'Enseignants à suivre'
      }
      return `${this.selectedAnimators.length} ${
        this.selectedAnimators.length > 1
          ? 'enseignants selectionnés'
          : 'enseignant selectionné'
      }`
    },
  },
  async mounted() {
    const data = await this.$axios.$get('/api/user/animators')
    this.animators = data.all_animators.sort((a, b) =>
      (a.name || a.username).localeCompare(b.name || b.username)
    )
    this.selectedAnimators = data.current_animators_ids
  },
  methods: {
    toggle(animatorId) {
      const index = this.selectedAnimators.indexOf(animatorId)
      if (index === -1) {
        this.selectedAnimators.push(animatorId)
      } else {
        this.selectedAnimators.splice(index, 1)
      }
      this.$emit('input', this.selectedAnimators)
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
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  border: 1px solid #cccccc;
  margin: 8px 0 16px;
  background: transparent;
  color: #aaaaaa;
  font-size: 15px;
  font-weight: 400;
  border-radius: 3px;
  outline: none;
  transition: border 250ms ease-out;
  user-select: none;

  .select_element {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 46px;
    border-radius: 3px;
    padding-left: 15px;
    transition: border 0.25s ease-out;
    user-select: none;

    input {
      width: 100%;
      height: 100%;
      border: 0;
      color: #aaaaaa;
      font-size: 15px;
      font-weight: 400;
      background-color: transparent;
      outline: 0;

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
    z-index: 1000;
    top: 43px;
    box-sizing: border-box;
    width: calc(100% + 2px);
    border: 1px solid #cccccc;
    left: -1px;
    background-color: #f5f5f5;
    border-radius: 0 0 3px 3px;
    visibility: hidden;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.25);

    &::-webkit-scrollbar {
      width: 10px;
      -webkit-appearance: none;
      background-color: rgb(238, 238, 238);
      border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: $green;
      transition: background-color 0.1s ease;
    }

    .element {
      position: relative;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding-left: 15px;
      min-height: 46px;

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
