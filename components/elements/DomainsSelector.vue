<template>
  <div
    v-closable="{ handler: 'closeDomainsSelector' }"
    class="domains-selector-container"
    :class="{ active, 'has-error': !!error }"
    @click="active = !active"
  >
    <label v-if="getSelected" class="placeholder">{{ placeholder }}</label>
    <div class="select_element">
      {{ getSelected ? getSelected.label : placeholder }}
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
          fill="currentColor"
        />
      </svg>
    </div>
    <div class="select_elements">
      <div
        v-for="domain in domains"
        :key="domain.id"
        class="element"
        :class="{ active: selected === domain.id }"
        @click="select(domain.id, true)"
      >
        <img
          class="domain-icon"
          :src="'/images/icons/' + domain.icon.reference"
          :alt="domain.label"
        />
        <span>
          {{ domain.label }}
        </span>
      </div>
    </div>
    <div v-if="error" class="error">{{ error.message }}</div>
  </div>
</template>

<script>
export default {
  name: 'DomainsSelector',
  props: {
    selected: {
      type: Number,
      default: null,
    },
    placeholder: {
      type: String,
      default: '',
    },
    error: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      active: false,
    }
  },
  computed: {
    getSelected() {
      return this.domains.find(domain => domain.id === this.selected)
    },
    domains() {
      return this.$store.state.admin.domains
    },
  },
  watch: {
    selected(value) {
      this.select(value)
    },
  },
  async mounted() {
    await this.$store.dispatch('admin/fetchDomains')
  },
  methods: {
    select(id, clicked = false) {
      if (!this.domains.some(domain => domain.id === id)) {
        return this.$emit('input', null)
      }

      if (clicked) {
        this.$emit('input', id)
      }
    },
    closeDomainsSelector() {
      if (this.active) this.active = false
    },
  },
}
</script>

<style lang="scss">
.domains-selector-container {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  padding: 7px 15px;
  border: 1px solid #cccccc;
  margin: 8px 0 16px;
  color: #aaaaaa;
  font-size: 15px;
  font-weight: 400;
  background-color: white;
  border-radius: 3px;
  outline: none;
  transition: border 250ms ease-out;
  user-select: none;
  &.has-error {
    border: 1px solid #c90a0a;
    margin-bottom: 32px;
  }
  .error {
    position: absolute;
    top: calc(100% + 6px);
    right: 1em;
    color: #c90a0a;
    font-size: 12px;
  }
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
  .placeholder {
    position: absolute;
    z-index: 2;
    top: -16px;
    left: 0;
    overflow: hidden;
    transition: 0.3s;
    letter-spacing: 0.5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: calc(100% - 12px);
    color: $green;
    font-size: 12px;
  }
  &.white_label .placeholder {
    color: #ffffff !important;
  }
  .select_elements {
    position: absolute;
    z-index: 1000;
    top: 43px;
    box-sizing: border-box;
    width: calc(100% + 2px);
    border: 1px solid #cccccc;
    left: -1px;
    background-color: #ffffff;
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
      .domain-icon {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
      &:hover {
        background-color: #f5f5f5;
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
