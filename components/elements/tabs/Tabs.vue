<template>
  <div class="tabs">
    <ul class="tabs-flags">
      <li
        v-for="tab in tabs"
        v-show="!tab.hidden"
        :key="tab.id"
        :class="{ active: tab.active }"
        class="tab-name"
        @click="$emit('input', tab.id)"
      >
        {{ tab.name }}
      </li>
    </ul>
    <div class="tabs-contents">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, null],
      default: '',
    },
  },
  data() {
    return {
      lastActiveTab: '',
      tabs: [],
    }
  },
  watch: {
    value(value, oldValue) {
      if (value !== oldValue) {
        this.selectTab(value, oldValue)
      }
    },
  },
  created() {
    this.tabs = this.$children
  },
  mounted() {
    this.selectTab(this.value, null)
  },
  methods: {
    selectTab(selectedTabId, oldValue) {
      const selectedTab = this.tabs.find(tab => tab.id === selectedTabId)
      if (!selectedTab) {
        const validtabs = this.tabs.filter(tab => !tab.hidden)
        if (!validtabs.length) return
        return this.selectTab(validtabs[0].id)
      }
      this.tabs.forEach(tab => {
        tab.active = tab.id === selectedTab.id
      })
      this.lastActiveTab = oldValue
    },
  },
}
</script>

<style lang="scss">
.tabs {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  .tabs-flags {
    display: flex;
    .tab-name {
      border-radius: 8px;
      transition: 0.2s background-color ease-in-out;
      cursor: pointer;
      user-select: none;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
      padding: 16px 24px;
      color: white;
      margin: 0 24px 24px 0;
      background-color: $green;
      &.active {
        background-color: $green-light;
      }
    }
  }
  .tabs-contents {
    background-color: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
  }
}
</style>
